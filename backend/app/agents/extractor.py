import re
from typing import Dict, Any

class InvoiceParserAgent:
    """
    Enhanced AI extraction logic for real-world invoices.
    Uses multiple regex patterns and fallback strategies.
    """

    def extract(self, text: str) -> Dict[str, Any]:
        """
        Extract invoice data with robust pattern matching.
        """
        result: Dict[str, Any] = {
            "vendor_name":    "Unknown Vendor",
            "invoice_number": "UNK-000",
            "amount":         0.0,
            "currency":       "USD",
            "date":           None,
            "po_number":      None,
            "gstin":          None,
            "iban":           None,
            "ifsc":           None,
            "account_number": None,
        }

        # Normalize whitespace
        text_norm = re.sub(r'[ \t]+', ' ', text)

        # ── 1. VENDOR EXTRACTION ─────────────────────────────────────────────
        vendor_match = re.search(
            r"(?:From|Vendor|Bill\s*From|Seller|Company|Billed\s*By)[:\s]+([A-Za-z0-9\s\.,&'\-]+?)(?:\n|$|,|\|)",
            text, re.IGNORECASE | re.MULTILINE
        )
        if vendor_match:
            result['vendor_name'] = vendor_match.group(1).strip()[:60]
        else:
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            for line in lines[:5]:
                if len(line) > 3 and not re.match(r'^(invoice|bill|receipt|tax|gst)', line, re.IGNORECASE):
                    result['vendor_name'] = line[:60]
                    break

        # ── 2. CURRENCY DETECTION ────────────────────────────────────────────
        if re.search(r'(?:INR|Rs\.?\s|₹|Rupee)', text, re.IGNORECASE):
            result['currency'] = "INR"
        elif re.search(r'(?:EUR|€|Euro)', text, re.IGNORECASE):
            result['currency'] = "EUR"
        elif re.search(r'(?:GBP|£|Pound)', text, re.IGNORECASE):
            result['currency'] = "GBP"
        else:
            result['currency'] = "USD"

        # ── 3. AMOUNT EXTRACTION ─────────────────────────────────────────────
        # Strategy: find the LARGEST numeric value near total/amount keywords.
        # This handles: "Total: ₹1,23,456.00", "$12,345.67", "Amount Due 9999"
        
        amount_candidates = []

        # Pattern A: keyword + optional currency + number
        pat_a = re.findall(
            r"(?:Total|Amount\s*Due|Balance\s*Due|Grand\s*Total|Invoice\s*Total|Net\s*Amount|Sub\s*Total|Due\s*Amount)"
            r"[\s:₹$€£Rs.]*"
            r"([\d,]+(?:\.\d{1,2})?)",
            text_norm, re.IGNORECASE
        )
        for v in pat_a:
            try:
                amount_candidates.append(float(v.replace(',', '')))
            except ValueError:
                pass

        # Pattern B: currency symbol immediately before number (₹1,23,456.00)
        pat_b = re.findall(
            r"(?:₹|Rs\.?\s*|\$|€|£)\s*([\d,]+(?:\.\d{1,2})?)",
            text_norm, re.IGNORECASE
        )
        for v in pat_b:
            try:
                amount_candidates.append(float(v.replace(',', '')))
            except ValueError:
                pass

        # Pattern C: number followed by currency keyword
        pat_c = re.findall(
            r"([\d,]+(?:\.\d{1,2})?)\s*(?:INR|USD|EUR|GBP|Rs\.?)\b",
            text_norm, re.IGNORECASE
        )
        for v in pat_c:
            try:
                amount_candidates.append(float(v.replace(',', '')))
            except ValueError:
                pass

        # Pattern D: any decimal number >= 10 (last resort fallback)
        if not amount_candidates:
            pat_d = re.findall(r'\b(\d{2,}(?:,\d{2,3})*(?:\.\d{1,2})?)\b', text_norm)
            for v in pat_d:
                try:
                    amount_candidates.append(float(v.replace(',', '')))
                except ValueError:
                    pass

        if amount_candidates:
            # Prefer the largest value found near a "total" keyword (pat_a),
            # otherwise take the largest overall.
            if pat_a:
                result['amount'] = max(float(v.replace(',', '')) for v in pat_a)
            else:
                result['amount'] = max(amount_candidates)

        # ── 4. INVOICE NUMBER ────────────────────────────────────────────
        # Must contain at least one digit and be >= 4 chars to avoid matching words
        inv_patterns = [
            r"(?:Invoice|Inv|Bill|Receipt)\s*(?:No\.?|Number|#|:)?\s*[:\-#]?\s*([A-Z0-9][A-Z0-9\-/]{3,})",
            r"#\s*([A-Z0-9\-]{4,})",
            r"(?:Invoice|Bill)\s+(?:No|Number)[:\s.]+([A-Z0-9\-]{3,})",
        ]
        for pat in inv_patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                candidate = m.group(1).strip()
                # Must contain at least one digit to be a real invoice number
                if re.search(r'\d', candidate):
                    result['invoice_number'] = candidate
                    break

        # ── 5. DATE ──────────────────────────────────────────────────────────
        date_patterns = [
            r"(?:Invoice\s*Date|Bill\s*Date|Date\s*of\s*Issue|Date)[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})",
            r"(\d{4}-\d{2}-\d{2})",
            r"(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})",
        ]
        for pat in date_patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                result['date'] = m.group(1).strip()
                break

        # ── 6. PURCHASE ORDER ────────────────────────────────────────────
        # PO must contain a digit and be a real reference, not a generic word
        po_patterns = [
            r"(?:PO|P\.O\.|Purchase\s*Order\s*(?:No\.?|Number|#)?)[:\s#\-]+([A-Z0-9][A-Z0-9\-]{2,})",
            r"PO\s*(?:No\.?|Number)[:\s]+([A-Z0-9\-]{3,})",
        ]
        for pat in po_patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                candidate = m.group(1).strip()
                # Must contain a digit and not be a generic word
                if re.search(r'\d', candidate) and not re.match(r'^(number|no|date|ref|order)$', candidate, re.IGNORECASE):
                    result['po_number'] = candidate
                    break

        # ── 7. GSTIN ─────────────────────────────────────────────────────────
        gst_match = re.search(r'\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]', text)
        if gst_match:
            result['gstin'] = gst_match.group(0)

        # ── 8. BANK DETAILS ──────────────────────────────────────────────────
        # IBAN — strict: 2-letter country code + 2 digits + 11-30 alphanumeric, total 15-34 chars
        # Flipkart order IDs like OD436621289408659100 start with letters but are NOT IBANs
        iban_match = re.search(
            r'\b([A-Z]{2}\d{2}[A-Z0-9]{11,30})\b',
            text
        )
        if iban_match:
            candidate = iban_match.group(1)
            # Valid IBAN country codes are real ISO 3166-1 alpha-2 codes (not OD, XX etc.)
            country = candidate[:2]
            valid_countries = {
                'GB','DE','FR','IN','US','AE','SA','QA','KW','BH','OM','JO','LB',
                'CH','AT','BE','NL','ES','IT','PT','SE','NO','DK','FI','PL','CZ',
                'HU','RO','BG','HR','SI','SK','LT','LV','EE','MT','CY','LU','IE',
                'GR','TR','IL','EG','ZA','NG','KE','GH','TZ','UG','RW','ET','SN',
                'CI','CM','MG','MZ','AO','ZM','ZW','MU','SC','MV','LK','BD','PK',
                'NP','AF','MM','TH','VN','PH','ID','MY','SG','HK','TW','KR','JP',
                'CN','MN','KZ','UZ','TM','AZ','GE','AM','MD','UA','BY','RS','BA',
                'MK','AL','ME','XK','IS','LI','MC','SM','VA','AD','GL','FO',
            }
            if country in valid_countries and 15 <= len(candidate) <= 34:
                result['iban'] = candidate

        # IFSC (India)
        ifsc_match = re.search(r'\b([A-Z]{4}0[A-Z0-9]{6})\b', text)
        if ifsc_match:
            result['ifsc'] = ifsc_match.group(1)

        # Account Number
        acc_match = re.search(
            r'(?:Account\s*No\.?|Acc\.?\s*No\.?|A/c\s*No\.?)[:\s]*([\d\-]{9,18})',
            text, re.IGNORECASE
        )
        if acc_match:
            result['account_number'] = acc_match.group(1).replace('-', '').strip()

        return result
