from pydantic import BaseModel
from typing import List, Optional

class InvoiceData(BaseModel):
    vendor_name: str
    invoice_number: str
    amount: float
    raw_text: str = None
    file_url: Optional[str] = None

class ConfidenceScore(BaseModel):
    score: float
    flags: List[str]

class AIDecision(BaseModel):
    decision: str  # APPROVED | REJECTED | NEEDS_REVIEW
    confidence: float
    reason: str 
    metadata: Optional[dict] = {}

class Vendor(BaseModel):
    company_name: str
    email_contact: Optional[str]
    trust_score: int
    status: str
