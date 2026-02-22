from typing import List, Optional
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json
import os

# --- AUTOGEN CONFIGURATION ---
# This simulates a collaborative chat where agents discuss an issue
# instead of a linear workflow (like CrewAI).

config_list = [
    {
        'model': 'gpt-4o',
        'api_key': os.environ.get("OPENAI_API_KEY")
    }
]

# 1. The Supplier Agent (Simulates the external vendor)
supplier_agent = AssistantAgent(
    name="Supplier_Rep",
    llm_config={"config_list": config_list},
    system_message="""You represent Acme Corp. You submitted Invoice #9942 for $12,500.
    The original PO was $12,000. Explain that the extra $500 is for expedited shipping requested by the Buyer."""
)

# 2. The Internal Buyer Agent (Simulates the procurement manager)
buyer_agent = AssistantAgent(
    name="Buyer_Manager",
    llm_config={"config_list": config_list},
    system_message="""You represent the internal team. You review variance requests.
    You remember approving the expedited shipping last Tuesday via email."""
)

# 3. The Proxy (Orchestrator)
user_proxy = UserProxyAgent(
    name="VERTIXA_Orchestrator",
    human_input_mode="NEVER", # Autonomous mode
    max_consecutive_auto_reply=2,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "coding", "use_docker": False}, 
    llm_config={"config_list": config_list},
    system_message="""Oversee the negotiation. If the Buyer agrees to the extra charge, 
    update the PO and mark the invoice as MATCHED. Then say TERMINATE."""
)

# --- CHAT INITIATION ---

if __name__ == "__main__":
    print("## STARTING AUTOGEN NEGOTIATION ##")
    
    # Start the conversation
    user_proxy.initiate_chat(
        supplier_agent,
        message="""
        Invoice #9942 has a $500 variance. PO amount: $12,000. Invoice amount: $12,500.
        Please explain this discrepancy.
        """
    )
