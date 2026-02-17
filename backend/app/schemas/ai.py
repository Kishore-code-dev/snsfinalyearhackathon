from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

# --- DATABASE SCHEMA (In-Memory Persistence for MVP) ---
# A real product needs to store data. If we don't have a live DB connection,
# we use a robust JSON store.

class InMemoryDB:
    def __init__(self):
        # Stores decisions: id -> decision object
        self.decisions_store: Dict[str, Any] = {}
        # Stores logs for dashboard
        self.logs_store: List[Dict[str, Any]] = []

    def save_decision(self, invoice_id: str, payload: dict):
        """
        Persist a decision even if backend restarts (would need file I/O for 100% persistence,
        but runtime persistence is step 1 for 'Real Product' demo feel).
        """
        timestamp = datetime.now().isoformat()
        record = {
            "invoice_id": invoice_id,
            "timestamp": timestamp,
            **payload
        }
        self.decisions_store[invoice_id] = record
        self.logs_store.append(record)
        return record

    def get_logs(self):
        # Return recent logs first
        return sorted(self.logs_store, key=lambda x: x['timestamp'], reverse=True)

# Singleton instance for the app
db = InMemoryDB()

class InvoiceAnalysisRequest(BaseModel):
    raw_text: str

class FraudFlag(BaseModel):
    code: str
    description: str
    severity: str  # HIGH | MEDIUM | LOW

class AIAnalysisResult(BaseModel):
    processed_invoice: dict  # Extracted data: vendor, amount, etc.
    fraud_flags: List[FraudFlag]
    confidence_score: float
    decision: str  # APPROVED | REJECTED | NEEDS_REVIEW
    reasoning: str
