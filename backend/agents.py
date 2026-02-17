from crewai import Agent, Task, Crew, Process
from langchain.chat_models import ChatOpenAI
from langchain.agents import load_tools

# --- CONFIGURATION (Mock) ---
# In a real deployed app, these would come from env vars
OPENAI_API_KEY = "sk-..." 

# --- AGENT DEFINITIONS ---

# 1. The Invoice Reader (Vision / PDF Specialist)
invoice_reader = Agent(
    role='Expert Invoice Analyst',
    goal='Extract critical data (Line Items, Total, Date, PO Number) from PDF invoices with 100% accuracy.',
    backstory="""You are a meticulous AI trained on thousands of procurement documents. 
    You never guess. If data is ambiguous, you flag it.""",
    verbose=True,
    allow_delegation=False,
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0)
)

# 2. The PO Matcher (ERP Specialist)
po_matcher = Agent(
    role='ERP Reconciliation Officer',
    goal='Cross-reference extracted invoice data against the Oracle ERP Purchase Order database.',
    backstory="""You are the gatekeeper of the company's ledger. You ensure every penny billed matches what was ordered.
    You have direct SQL access to the PO tables.""",
    verbose=True,
    allow_delegation=False,
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0)
)

# 3. The Compliance Officer (Decision Maker)
compliance_officer = Agent(
    role='Financial Compliance Manager',
    goal='Decide whether to approve a variance or reject an invoice based on company policy.',
    backstory="""You enforce the '3% Tolerance Rule'. If a price variance is under 3% and < $50, you auto-approve.
    Otherwise, you escalate to a human.""",
    verbose=True,
    allow_delegation=True,
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0.2)
)

# --- TASK DEFINITIONS ---

task1_extract = Task(
    description="""
    1. Read the invoice 'INV-2024-001.pdf'.
    2. Extract: Supplier Name, PO Number, Line Items (Qty, Unit Price), Total Amount.
    3. Output as JSON.
    """,
    agent=invoice_reader
)

task2_match = Task(
    description="""
    1. Take the JSON from Task 1.
    2. Query the ERP for the PO Number found.
    3. Compare Line Item prices and quantities.
    4. Calculate the Variance ($ and %).
    """,
    agent=po_matcher
)

task3_decide = Task(
    description="""
    1. Review the Variance calculated in Task 2.
    2. If Variance == 0, OUTPUT: 'MATCHED'.
    3. If Variance > 0 but < 3%, OUTPUT: 'AUTO-HEALED'.
    4. If Variance > 3%, OUTPUT: 'EXCEPTION_RAISED'.
    """,
    agent=compliance_officer
)

# --- CREW ORCHESTRATION ---

xylo_crew = Crew(
    agents=[invoice_reader, po_matcher, compliance_officer],
    tasks=[task1_extract, task2_match, task3_decide],
    process=Process.sequential,  # Agents work in a chain
    verbose=2
)

# --- EXECUTION ---
if __name__ == "__main__":
    print("## STARTING XYLO CREW AI SWARM ##")
    result = xylo_crew.kickoff()
    print("#################################")
    print(result)
