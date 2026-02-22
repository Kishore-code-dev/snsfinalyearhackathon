from datetime import datetime, timedelta
import random
import json
from backend.app.schemas.ai import db

# Realistic "Big Four" style vendor data
vendors = [
    "Amazon Web Services", "Microsoft Azure", "Google Cloud", 
    "Tata Consultancy Services", "Infosys Ltd", "Wipro Limited",
    "Salesforce Inc", "Oracle Corp", "SAP SE", "Adobe Systems",
    "Slack Technologies", "Zoom Video Communications", "Dell Technologies"
]

currencies = ["USD", "INR", "EUR", "GBP"]
reasons = [
    "Automated Approval: All 3-way matching criteria met.",
    "Confidence score requires human validation.",
    "Critical Risk: Duplicate Fingerprint Detected.",
    "Compliance Warning: High value invoice missing PO number.",
    "Rate variance exceeds 5% threshold."
]

def generate_seed_data():
    print("🌱 Seeding database with realistic B2B invoice history...")
    
    for i in range(50):
        # Generate random historical date
        days_ago = random.randint(0, 60)
        timestamp = (datetime.now() - timedelta(days=days_ago)).isoformat()
        
        vendor = random.choice(vendors)
        curr = random.choice(currencies)
        amount = round(random.uniform(500, 150000), 2)
        
        # Determine status slightly weighted towards approval
        rand_val = random.random()
        if rand_val > 0.3:
            decision = "APPROVED"
            reason = reasons[0]
            conf = round(random.uniform(0.90, 0.99), 2)
        elif rand_val > 0.1:
            decision = "NEEDS_REVIEW"
            reason = reasons[1]
            conf = round(random.uniform(0.60, 0.85), 2)
        else:
            decision = "REJECTED"
            reason = reasons[2]
            conf = round(random.uniform(0.10, 0.40), 2)

        # Create realistic payload matching our schema
        payload = {
            "processed_invoice": {
                "vendor_name": vendor,
                "invoice_number": f"INV-{2024}-{random.randint(1000, 9999)}",
                "amount": amount,
                "currency": curr,
                "po_number": f"PO-{random.randint(100, 999)}" if random.random() > 0.2 else None
            },
            "fraud_flags": [],
            "confidence_score": conf,
            "decision": decision,
            "reasoning": reason,
            "recommendation": "Archived record."
        }
        
        # Save directly using the DB class
        # We manually override timestamp to make it historical
        full_record = db.save_decision(
            invoice_id=payload['processed_invoice']['invoice_number'], 
            payload=payload
        )
        
        # Hacky update to timestamp because save_decision uses current time
        # This is fine for a seeder script
        import sqlite3
        conn = sqlite3.connect("invoices.db")
        cursor = conn.cursor()
        cursor.execute("UPDATE decisions SET timestamp = ? WHERE id = (SELECT seq FROM sqlite_sequence WHERE name='decisions')", (timestamp,))
        conn.commit()
        conn.close()
        
    print(f"✅ Generated {50} historical invoice records.")

if __name__ == "__main__":
    generate_seed_data()
