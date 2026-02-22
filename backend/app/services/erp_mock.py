from typing import Dict, Optional, Any

class EnterpriseResourcePlanner:
    """
    Simulates a connection to an external ERP system (SAP, Oracle, NetSuite).
    In a real production environment, this would use REST/SOAP APIs.
    """
    
    def __init__(self):
        # Mock Database of valid Purchase Orders
        self.po_database = {
            "PO-1001": {"vendor": "Acme Corp",    "budget": 15000.00, "status": "OPEN",   "created_date": "2024-01-15"},
            "PO-9942": {"vendor": "Globex Inc",   "budget": 50000.00, "status": "OPEN",   "created_date": "2024-02-10"},
            "PO-3321": {"vendor": "Soylent Corp", "budget": 2500.00,  "status": "CLOSED", "created_date": "2023-11-20"},
            "PO-FK01": {"vendor": "Flipkart",     "budget": 25000.00, "status": "OPEN",   "created_date": "2025-12-01"},
            "PO-AMZ1": {"vendor": "Amazon",       "budget": 30000.00, "status": "OPEN",   "created_date": "2025-11-15"},
        }
        
        # Mock Vendor Master Data
        self.vendor_master = {
            "Acme Corp":                   {"id": "V-101", "payment_terms": "Net 30",    "risk_score": 0,  "bank_account": "1234567890",  "ifsc": "ACME0001234", "email": "accounts@acme.corp"},
            "Globex Inc":                  {"id": "V-102", "payment_terms": "Net 45",    "risk_score": 5,  "bank_account": "9876543210",  "ifsc": "HDFC0001234", "email": "billing@globex.com"},
            "CyberDyne Systems":           {"id": "V-666", "payment_terms": "Immediate",  "risk_score": 90, "bank_account": "666666666",   "ifsc": "SKYNET0123",  "email": "finance@cyberdyne.ai"},
            "Flipkart India Private Limited": {"id": "V-201", "payment_terms": "Net 15", "risk_score": 2,  "bank_account": "50200012345678", "ifsc": "HDFC0001234", "email": "seller-support@flipkart.com"},
            "Amazon Seller Services":      {"id": "V-202", "payment_terms": "Net 15",    "risk_score": 2,  "bank_account": "50200087654321", "ifsc": "ICIC0001234", "email": "payments@amazon.in"},
            "Zomato Limited":              {"id": "V-203", "payment_terms": "Net 7",     "risk_score": 5,  "bank_account": "50200011223344", "ifsc": "KOTAK0001234","email": "finance@zomato.com"},
            "Swiggy":                      {"id": "V-204", "payment_terms": "Net 7",     "risk_score": 5,  "bank_account": "50200055667788", "ifsc": "AXIS00012345", "email": "finance@swiggy.com"},
            "Unknown Vendor":              {"id": "V-999", "payment_terms": "Prepaid",   "risk_score": 50, "bank_account": "0000000000",   "ifsc": "UNKN0001234",  "email": "unknown@gmail.com"},
        }

    def check_po(self, po_number: str) -> Dict[str, Any]:
        """
        Validates if a PO exists and is open.
        """
        if not po_number:
            return {"valid": False, "message": "No PO Number provided"}
            
        po_data = self.po_database.get(po_number.upper())
        
        if not po_data:
            return {"valid": False, "message": f"PO {po_number} not found in ERP."}
            
        if po_data['status'] != 'OPEN':
            return {"valid": False, "message": f"PO {po_number} is {po_data['status']} (cannot accept invoices)."}
            
        return {
            "valid": True, 
            "message": "PO Validated successfully.",
            "details": po_data
        }

    def validate_vendor(self, vendor_name: str) -> Dict[str, Any]:
        """
        Checks if vendor exists in Master Data.
        Uses word-level fuzzy matching so 'Flipkart India Private Limited'
        matches 'Flipkart India Private Limited' in the master.
        """
        if not vendor_name:
            return {"exists": False, "message": "No vendor name provided."}
        
        v_lower = vendor_name.lower().strip()
        
        # 1. Exact match first
        if vendor_name in self.vendor_master:
            return {"exists": True, "data": self.vendor_master[vendor_name], "name": vendor_name}
        
        # 2. Case-insensitive exact
        for v_name, v_data in self.vendor_master.items():
            if v_lower == v_name.lower():
                return {"exists": True, "data": v_data, "name": v_name}
        
        # 3. Substring match (either direction)
        for v_name, v_data in self.vendor_master.items():
            if v_lower in v_name.lower() or v_name.lower() in v_lower:
                return {"exists": True, "data": v_data, "name": v_name}
        
        # 4. Word-level match — any significant word (>3 chars) matches
        v_words = set(w for w in v_lower.split() if len(w) > 3)
        for v_name, v_data in self.vendor_master.items():
            master_words = set(w for w in v_name.lower().split() if len(w) > 3)
            if v_words & master_words:  # intersection
                return {"exists": True, "data": v_data, "name": v_name}
                
        return {"exists": False, "message": f"Vendor '{vendor_name}' not found in ERP Master Data."}

# Singleton
erp_system = EnterpriseResourcePlanner()
