from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

# --- DATABASE SCHEMA (In-Memory Persistence for MVP) ---
# A real product needs to store data. If we don't have a live DB connection,
# we use a robust JSON store.

import sqlite3
import json
import os

# --- DATABASE SCHEMA (SQLite Persistence for MVP) ---
# This is a REAL local database. Data survives backend restarts.
# Perfect bridge between "In-Memory" and "Cloud SQL".

class SQLiteDB:
    def __init__(self, db_path="invoices.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Create tables if they don't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Decisions Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS decisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id TEXT NOT NULL,
                decision TEXT NOT NULL,
                confidence REAL,
                payload TEXT,  -- Full JSON dump
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def save_decision(self, invoice_id: str, payload: dict):
        """
        Persist decision to SQLite database.
        """
        timestamp = datetime.now().isoformat()
        
        # Add timestamp to payload before saving
        full_record = {
            "invoice_id": invoice_id,
            "timestamp": timestamp,
            **payload
        }
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO decisions (invoice_id, decision, confidence, payload, timestamp)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                invoice_id, 
                payload.get('decision', 'UNKNOWN'),
                payload.get('confidence_score', 0.0),
                json.dumps(full_record),
                timestamp
            ))
            conn.commit()
        except Exception as e:
            print(f"Database Error: {e}")
        finally:
            conn.close()
            
        return full_record

    def get_logs(self):
        """
        Retrieve all logs, newest first.
        """
        conn = sqlite3.connect(self.db_path)
        # Return results as dictionaries
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        logs = []
        try:
            cursor.execute('SELECT payload FROM decisions ORDER BY timestamp DESC LIMIT 50')
            rows = cursor.fetchall()
            for row in rows:
                if row['payload']:
                    logs.append(json.loads(row['payload']))
        except Exception as e:
            print(f"Database Fetch Error: {e}")
        finally:
            conn.close()
            
        return logs

# Singleton instance for the app
db = SQLiteDB()

class InvoiceAnalysisRequest(BaseModel):
    raw_text: str

class FraudFlag(BaseModel):
    code: str
    description: str
    severity: str  # HIGH | MEDIUM | LOW

class Suggestion(BaseModel):
    icon: str        # emoji icon
    title: str       # short action title
    detail: str      # full explanation
    priority: str    # URGENT | HIGH | MEDIUM | INFO

class AIAnalysisResult(BaseModel):
    processed_invoice: dict  # Extracted data: vendor, amount, etc.
    fraud_flags: List[FraudFlag]
    confidence_score: float
    decision: str  # APPROVED | REJECTED | NEEDS_REVIEW
    reasoning: str
    recommendation: str       # Primary actionable next step
    suggestions: List[Suggestion] = []  # Rich AI suggestions list
