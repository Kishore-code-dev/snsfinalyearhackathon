from typing import List, Dict, Any
from backend.app.schemas.ai import AIAnalysisResult, FraudFlag, Suggestion
from backend.app.core.config import settings

class DecisionAgent:
    """
    Core Logic Engine:
    - Synthesizes findings from Extractor & Security
    - Calculates Confidence Score (0.00-1.00)
    - Makes Final Decision: APPROVED, REJECTED, NEEDS_REVIEW
    - Generates rich AI suggestions for every invoice
    """

    def evaluate(self, extraction: Dict, security_check: Dict) -> AIAnalysisResult:
        flags: List[FraudFlag] = []
        suggestions: List[Suggestion] = []
        confidence = 1.0

        vendor_status = security_check.get('vendor_status')
        vendor_score  = security_check.get('vendor_score', 0)
        amount        = extraction.get('amount', 0)
        currency      = extraction.get('currency', 'INR')
        vendor_name   = extraction.get('vendor_name', 'Unknown')
        invoice_no    = extraction.get('invoice_number', 'N/A')
        po_number     = extraction.get('po_number')
        gstin         = extraction.get('gstin')
        date          = extraction.get('date')

        # ── RULE 1: Vendor Trust ─────────────────────────────────────────────
        if vendor_status == 'FLAGGED':
            flags.append(FraudFlag(
                code="HIGH_RISK_VENDOR",
                description=f"Vendor '{vendor_name}' is flagged as high-risk in the security system.",
                severity="HIGH"
            ))
            confidence -= 0.6
            suggestions.append(Suggestion(
                icon="🚫",
                title="Block Vendor Payment",
                detail=f"'{vendor_name}' is on the high-risk vendor list. Freeze all payments immediately and escalate to the Compliance team for investigation. Do not contact the vendor until cleared.",
                priority="URGENT"
            ))

        elif vendor_status == 'NEW':
            flags.append(FraudFlag(
                code="NEW_VENDOR_ENTITY",
                description=f"'{vendor_name}' is a first-time vendor not yet in Master Data.",
                severity="MEDIUM"
            ))
            confidence -= 0.15
            suggestions.append(Suggestion(
                icon="📋",
                title="Complete Vendor Onboarding",
                detail=f"'{vendor_name}' is not in your Vendor Master Data. Initiate the vendor onboarding process: collect GST certificate, bank verification letter, and PAN card. Add to ERP before processing payment.",
                priority="HIGH"
            ))

        elif vendor_status == 'TRUSTED':
            suggestions.append(Suggestion(
                icon="✅",
                title="Vendor Verified in Master Data",
                detail=f"'{vendor_name}' is a trusted vendor with a risk score of {vendor_score}. No additional vendor verification needed.",
                priority="INFO"
            ))

        # ── RULE 2: Duplicate Check ──────────────────────────────────────────
        if security_check.get('is_duplicate', False):
            flags.append(FraudFlag(
                code="DUPLICATE_INVOICE_FINGERPRINT",
                description=f"Invoice {invoice_no} has already been processed. Exact duplicate detected.",
                severity="HIGH"
            ))
            confidence = 0.0
            suggestions.append(Suggestion(
                icon="⛔",
                title="Duplicate Invoice — Do Not Pay",
                detail=f"Invoice #{invoice_no} from '{vendor_name}' is an exact duplicate of a previously processed invoice. Archive this record, notify the vendor, and investigate whether this is a billing error or attempted double-billing fraud.",
                priority="URGENT"
            ))

        # ── RULE 3: Amount Analysis ──────────────────────────────────────────
        if amount == 0:
            suggestions.append(Suggestion(
                icon="⚠️",
                title="Amount Could Not Be Extracted",
                detail="The AI could not detect a clear invoice amount. This may be a scanned/image PDF or an unusual format. Use the 'Paste Text' tab and manually enter the invoice text, or check if the PDF is text-based.",
                priority="HIGH"
            ))
        elif amount > 100000:
            suggestions.append(Suggestion(
                icon="💰",
                title="High-Value Invoice — Senior Approval Required",
                detail=f"This invoice is for {currency} {amount:,.2f}, which exceeds the standard auto-approval limit. Route to Finance Manager or CFO for sign-off before releasing payment.",
                priority="HIGH"
            ))
            if vendor_status != 'TRUSTED':
                flags.append(FraudFlag(
                    code="AMOUNT_SPIKE_DETECTED",
                    description=f"High-value invoice ({currency} {amount:,.2f}) from unverified vendor.",
                    severity="HIGH"
                ))
                confidence -= 0.35
            else:
                confidence -= 0.05  # Minor caution even for trusted vendors
        elif amount > 10000 and vendor_status != 'TRUSTED':
            flags.append(FraudFlag(
                code="AMOUNT_SPIKE_DETECTED",
                description=f"Amount {currency} {amount:,.2f} exceeds auto-approval threshold for unverified vendor.",
                severity="MEDIUM"
            ))
            confidence -= 0.25
            suggestions.append(Suggestion(
                icon="🔍",
                title="Verify Amount Against Purchase Order",
                detail=f"The invoice amount of {currency} {amount:,.2f} exceeds the automated approval threshold for a new/unverified vendor. Cross-check this amount against the original purchase order and goods receipt note (GRN) before approving.",
                priority="HIGH"
            ))
        else:
            suggestions.append(Suggestion(
                icon="💵",
                title="Amount Within Normal Range",
                detail=f"Invoice amount of {currency} {amount:,.2f} is within the standard processing threshold.",
                priority="INFO"
            ))

        # ── RULE 4: PO Verification ──────────────────────────────────────────
        erp_result = security_check.get('erp_validation', {})
        if po_number:
            if not erp_result.get('valid'):
                flags.append(FraudFlag(
                    code="ERP_MISMATCH",
                    description=f"PO '{po_number}' not found or invalid in ERP: {erp_result.get('message', 'Unknown error')}",
                    severity="HIGH"
                ))
                confidence -= 0.5
                suggestions.append(Suggestion(
                    icon="📦",
                    title="PO Mismatch — Verify with Procurement",
                    detail=f"PO number '{po_number}' on this invoice does not match any open purchase order in the ERP system. Contact the Procurement team to verify if this PO exists. If not, reject the invoice and ask the vendor to resubmit with a valid PO.",
                    priority="URGENT"
                ))
            else:
                po_details = erp_result.get('details', {})
                budget = po_details.get('budget', 0)
                if budget > 0 and amount > budget:
                    suggestions.append(Suggestion(
                        icon="📊",
                        title="Invoice Exceeds PO Budget",
                        detail=f"PO '{po_number}' has a budget of {currency} {budget:,.2f} but this invoice is for {currency} {amount:,.2f}. The overage of {currency} {amount - budget:,.2f} needs a budget amendment before payment.",
                        priority="HIGH"
                    ))
                    confidence -= 0.15
                else:
                    suggestions.append(Suggestion(
                        icon="✅",
                        title="PO Matched Successfully",
                        detail=f"Purchase Order '{po_number}' is open and valid in ERP. Invoice amount is within the approved budget.",
                        priority="INFO"
                    ))
        else:
            if amount > 10000:
                flags.append(FraudFlag(
                    code="MISSING_PURCHASE_ORDER",
                    description="High-value invoice has no PO number — manual approval required.",
                    severity="MEDIUM"
                ))
                confidence -= 0.1
                suggestions.append(Suggestion(
                    icon="📝",
                    title="Request PO or Non-PO Approval",
                    detail=f"This invoice for {currency} {amount:,.2f} has no Purchase Order number. Either locate the original PO and ask the vendor to resubmit, or initiate a Non-PO Invoice approval workflow with your Finance Manager.",
                    priority="HIGH"
                ))
            else:
                suggestions.append(Suggestion(
                    icon="📝",
                    title="No PO — Low Value Invoice",
                    detail="No PO number found, but the invoice amount is below the threshold. You may process this as a petty cash or direct expense invoice.",
                    priority="MEDIUM"
                ))

        # ── RULE 5: GST Verification ─────────────────────────────────────────
        gst_result = security_check.get('gst_validation', {})
        if gstin:
            if gst_result and not gst_result.get('valid', True):
                flags.append(FraudFlag(
                    code="INVALID_GSTIN",
                    description=f"GSTIN '{gstin}' failed validation: {gst_result.get('message')}",
                    severity="HIGH"
                ))
                confidence -= 0.4
                suggestions.append(Suggestion(
                    icon="🏛️",
                    title="Invalid GSTIN — Tax Compliance Risk",
                    detail=f"The GSTIN '{gstin}' on this invoice failed format/checksum validation. You cannot claim GST Input Tax Credit (ITC) on this invoice. Ask the vendor to correct their GSTIN and reissue the invoice before payment.",
                    priority="URGENT"
                ))
            else:
                suggestions.append(Suggestion(
                    icon="🏛️",
                    title="GSTIN Valid — ITC Claimable",
                    detail=f"GSTIN '{gstin}' passed validation. You are eligible to claim GST Input Tax Credit on this invoice. Ensure it is filed in GSTR-2B.",
                    priority="INFO"
                ))
        else:
            suggestions.append(Suggestion(
                icon="🏛️",
                title="No GSTIN Found",
                detail="No GSTIN was detected on this invoice. If this is a B2B transaction above ₹20,000, a GSTIN is mandatory. Request a revised invoice with the vendor's GSTIN.",
                priority="MEDIUM"
            ))

        # ── RULE 6: Digital Forensics ────────────────────────────────────────
        forensics = security_check.get('digital_forensics', {})
        if forensics.get('is_suspicious'):
            for flag_desc in forensics.get('flags', []):
                flags.append(FraudFlag(
                    code="DIGITAL_FORGERY_RISK",
                    description=flag_desc,
                    severity="HIGH"
                ))
            confidence -= 0.5
            suggestions.append(Suggestion(
                icon="🔬",
                title="PDF Forgery Suspected — Forensic Review",
                detail=f"Digital forensics detected suspicious metadata: {'; '.join(forensics.get('flags', []))}. This PDF may have been created or altered using image editing software. Do not pay. Request the original invoice directly from the vendor via a verified communication channel.",
                priority="URGENT"
            ))
        else:
            suggestions.append(Suggestion(
                icon="🔬",
                title="PDF Forensics: Authentic",
                detail="No signs of digital tampering detected in the PDF metadata. The document appears to have been generated by standard accounting software.",
                priority="INFO"
            ))

        # ── RULE 7: Bank Account Verification ───────────────────────────────
        bank_result = security_check.get('bank_validation', {})
        if not bank_result.get('match', True):
            flags.append(FraudFlag(
                code="BANK_ACCOUNT_MISMATCH",
                description=f"Bank account on invoice does not match ERP Master Data: {bank_result.get('reason')}",
                severity="HIGH"
            ))
            confidence -= 0.6
            suggestions.append(Suggestion(
                icon="🏦",
                title="CRITICAL: Bank Account Changed — Potential Fraud",
                detail=f"The bank account on this invoice differs from the verified account in your ERP. This is the #1 sign of Business Email Compromise (BEC) fraud. DO NOT transfer funds. Call the vendor's finance team on a phone number from your records (not from this invoice) to verify the change.",
                priority="URGENT"
            ))
        else:
            if bank_result.get('reason') != 'Vendor not found in Master Data':
                suggestions.append(Suggestion(
                    icon="🏦",
                    title="Bank Account Verified",
                    detail="The bank account on this invoice matches the verified account in your ERP Vendor Master Data. Safe to proceed with payment to this account.",
                    priority="INFO"
                ))

        # ── Date Check ───────────────────────────────────────────────────────
        if not date:
            suggestions.append(Suggestion(
                icon="📅",
                title="Invoice Date Missing",
                detail="No invoice date was detected. An invoice date is required for accounting entries and GST filing. Request a revised invoice with the correct date.",
                priority="MEDIUM"
            ))

        # ── FINAL DECISION ───────────────────────────────────────────────────
        confidence = max(0.0, min(1.0, confidence))

        high_flags = [f for f in flags if f.severity == 'HIGH']
        decision = "NEEDS_REVIEW"
        reason = "One or more fields require human validation before processing."

        if confidence >= settings.CONFIDENCE_THRESHOLD_APPROVED and not high_flags:
            decision = "APPROVED"
            reason = f"Automated Approval: All checks passed for '{vendor_name}'. Vendor verified, amount within threshold, no fraud signals detected."
            suggestions.insert(0, Suggestion(
                icon="🚀",
                title="Ready for Payment Processing",
                detail=f"This invoice from '{vendor_name}' for {currency} {amount:,.2f} has passed all automated checks. Queue for payment as per agreed payment terms.",
                priority="INFO"
            ))
        elif confidence < settings.CONFIDENCE_THRESHOLD_REVIEW or high_flags:
            decision = "REJECTED"
            codes = [f.code for f in high_flags]
            reason = f"Blocked by policy: {codes}. Confidence: {round(confidence * 100)}%."

        # ── PRIMARY RECOMMENDATION ───────────────────────────────────────────
        urgent = [s for s in suggestions if s.priority == 'URGENT']
        if urgent:
            recommendation = urgent[0].detail
        elif decision == 'APPROVED':
            recommendation = f"Invoice approved. Queue for payment to '{vendor_name}' as per payment terms."
        elif decision == 'REJECTED':
            recommendation = "Invoice blocked. Review all URGENT alerts above before taking any action."
        else:
            recommendation = "Invoice needs manual review. Address all HIGH priority suggestions before approving payment."

        return AIAnalysisResult(
            processed_invoice=extraction,
            fraud_flags=flags,
            confidence_score=round(confidence, 2),
            decision=decision,
            reasoning=reason,
            recommendation=recommendation,
            suggestions=suggestions,
        )
