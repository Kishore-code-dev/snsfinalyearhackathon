from typing import List, Dict, Any
from backend.app.schemas.ai import AIAnalysisResult, FraudFlag
from backend.app.core.config import settings

class DecisionAgent:
    """
    Core Logic Engine:
    - Synthesizes findings from Extractor & Security
    - Calculates Confidence Score (0.00-1.00)
    - Makes Final Decision: APPROVED, REJECTED, NEEDS_REVIEW
    """

    def evaluate(self, extraction: Dict, security_check: Dict) -> AIAnalysisResult:
        flags: List[FraudFlag] = []
        confidence = 1.0  # Start optimistic

        # --- RULE 1: Vendor Trust Check ---
        vendor_status = security_check.get('vendor_status')
        vendor_score = security_check.get('vendor_score', 0)

        if vendor_status == 'FLAGGED':
            flags.append(FraudFlag(code="HIGH_RISK_VENDOR", description="Vendor flagged by security system", severity="HIGH"))
            confidence -= 0.6  # Severe Penalty
        elif vendor_status == 'NEW':
            flags.append(FraudFlag(code="NEW_VENDOR_ENTITY", description="First time vendor (verification required)", severity="MEDIUM"))
            confidence -= 0.15 # Slight caution

        # --- RULE 2: Duplicate Check ---
        if security_check.get('is_duplicate', False):
             flags.append(FraudFlag(code="DUPLICATE_INVOICE_FINGERPRINT", description=f"Identical invoice {extraction.get('invoice_number')} already processed.", severity="HIGH"))
             confidence = 0.0  # Immediate Reject
             
        # --- RULE 3: Amount Validation ---
        amount = extraction.get('amount', 0)
        
        # Anomaly Detection (Mock: Any invoice > $10k needs review if not trusted)
        if amount > 10000 and vendor_status != 'TRUSTED':
             flags.append(FraudFlag(code="AMOUNT_SPIKE_DETECTED", description=f"Amount ${amount} exceeds automated threshold for new vendor.", severity="MEDIUM"))
             confidence -= 0.3

        if amount <= 0:
             flags.append(FraudFlag(code="ZERO_VALUE_INVOICE", description="Invoice amount is zero or negative.", severity="HIGH"))
             confidence = 0.0

        # --- FINAL DECISION MAPPING ---
        confidence = max(0.0, min(1.0, confidence))  # Clamp between 0-1
        
        decision = "NEEDS_REVIEW"
        reason = "Confidence within review range."

        if confidence >= settings.CONFIDENCE_THRESHOLD_APPROVED:
            decision = "APPROVED"
            reason = "High confidence. Trust established, no critical flags."
        elif confidence < settings.CONFIDENCE_THRESHOLD_REVIEW or any(f.severity == 'HIGH' for f in flags):
            # Override to REJECT if critical flags exist (like Duplicate) even if score was okayish
            decision = "REJECTED"
            reason = f"Critical Risk Detected: {[f.code for f in flags if f.severity=='HIGH']}"
            if not flags and confidence < 0.5:
                reason = "Low confidence score (unverified entity)."
        
        return AIAnalysisResult(
            processed_invoice=extraction,
            fraud_flags=flags,
            confidence_score=round(confidence, 2),
            decision=decision,
            reasoning=reason
        )
