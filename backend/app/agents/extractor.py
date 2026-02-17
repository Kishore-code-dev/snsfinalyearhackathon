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
        result = {
            "vendor_name": "Unknown Vendor",
            "invoice_number": "UNK-000",
            "amount": 0.0,
            "date": None
        }
        
        # Normalize text (handle extra whitespace, newlines)
        text_normalized = re.sub(r'\s+', ' ', text)
        
        # --- 1. VENDOR EXTRACTION (Multiple Patterns) ---
        # Try pattern 1: "From: Vendor Name" or "Vendor: Vendor Name"
        vendor_match = re.search(r"(?:From|Vendor|Bill From|Seller|Company):\s*([A-Za-z0-9\s\.,&-]+?)(?:\n|$|,)", text, re.IGNORECASE | re.MULTILINE)
        if vendor_match:
            result['vendor_name'] = vendor_match.group(1).strip()
        else:
            # Try pattern 2: First line often contains vendor name
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            if lines:
                # First substantial line (more than 3 chars)
                for line in lines[:5]:  # Check first 5 lines
                    if len(line) > 3 and not re.match(r'^(invoice|bill|receipt)', line, re.IGNORECASE):
                        result['vendor_name'] = line[:50]  # Limit length
                        break
        
        # --- 2. AMOUNT EXTRACTION (Multiple Currency Patterns) ---
        # Pattern 1: Total: $X,XXX.XX or Total: XXX.XX
        amount_patterns = [
            r"(?:Total|Amount Due|Balance|Grand Total|Invoice Total|Due)[\s:]*(?:\$|USD|EUR|GBP)?\s*([\d,]+\.?\d{0,2})",
            r"(?:\$|USD)\s*([\d,]+\.\d{2})",  # Standalone currency
            r"\b([\d,]+\.\d{2})\s*(?:USD|EUR|GBP)\b",  # Amount before currency
        ]
        
        for pattern in amount_patterns:
            amount_match = re.search(pattern, text, re.IGNORECASE)
            if amount_match:
                clean_amount = amount_match.group(1).replace(',', '')
                try:
                    result['amount'] = float(clean_amount)
                    break  # Stop on first match
                except:
                    continue

        # --- 3. INVOICE NUMBER EXTRACTION (Multiple Patterns) ---
        invoice_patterns = [
            r"(?:Invoice|Inv|Bill|Receipt)[\s#:\-]*([A-Z0-9\-]+)",  # Standard
            r"#\s*([A-Z0-9\-]{3,})",  # Hashtag format
            r"(?:No|Number)[\s:.]*([A-Z0-9\-]+)",  # Number: format
        ]
        
        for pattern in invoice_patterns:
            inv_match = re.search(pattern, text, re.IGNORECASE)
            if inv_match:
                result['invoice_number'] = inv_match.group(1).strip()
                break

        # --- 4. DATE EXTRACTION (Optional but useful) ---
        date_patterns = [
            r"(?:Date|Invoice Date|Bill Date)[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"(\d{4}-\d{2}-\d{2})",  # ISO format
        ]
        
        for pattern in date_patterns:
            date_match = re.search(pattern, text, re.IGNORECASE)
            if date_match:
                result['date'] = date_match.group(1).strip()
                break

        return result
