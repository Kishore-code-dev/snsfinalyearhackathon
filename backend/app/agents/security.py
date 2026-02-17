from typing import List, Dict, Any
from backend.app.schemas.ai import FraudFlag

class SecurityAgent:
    """
    Security & Verification Tool:
    - Fingerprints invoices (Duplicate Check)
    - Verifies Vendor Trust (Allowlist/Blocklist)
    """

    def __init__(self, db_session = None):
        self.db = db_session  # Mock for now

    def fingerprint(self, vendor: str, inv_id: str, amount: float) -> str:
        """
        Create deterministic hash (SHA-256) to detect duplicates.
        Logic: f"{vendor.lower()}-{inv_id.strip()}-{amount}"
        """
        import hashlib
        raw = f"{vendor.lower().strip()}-{inv_id.strip()}-{amount}"
        return hashlib.sha256(raw.encode()).hexdigest()

    def check_duplicate(self, fingerprint: str) -> bool:
        # Mock DB Lookup: In real app, query `invoices` table
        # SELECT EXISTS(SELECT 1 FROM invoices WHERE invoice_hash = :fingerprint)
        
        # Simulating that "INV-8842" (from dashboard) is a duplicate
        if "8842" in fingerprint: 
            return True
        return False

    def verify_vendor(self, vendor_name: str) -> Dict[str, Any]:
        """
        Check if vendor is Trusted, New, or Flagged.
        Result: { status: 'TRUSTED' | 'NEW' | 'FLAGGED', score: 0-100 }
        """
        vendor_clean = vendor_name.lower()
        if "acme" in vendor_clean: return {"status": "TRUSTED", "score": 95}
        if "unknown" in vendor_clean: return {"status": "NEW", "score": 40}
        if "suspicious" in vendor_clean: return {"status": "FLAGGED", "score": 10}
        
        return {"status": "NEW", "score": 50}  # Default for unseen vendors
