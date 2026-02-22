/**
 * Mock Data Service for VERTIXA
 * This simulates the backend connection to an institutional fraud authentication layer.
 */

import { Invoice, PurchaseOrder, AIOperationResult } from '@/models/types';
import { validateHealingAction, sanitizeAIResponse } from '@/utils/ai-guardrails';

const MOCK_INVOICES: Invoice[] = [
    { id: "INV-001", supplier: "Acme Corp", amount: 12500, status: "pending", date: "2024-02-17T09:00:00Z" },
    { id: "INV-002", supplier: "CyberDyne", amount: 8200, status: "exception", variance: 200, date: "2024-02-17T09:15:00Z" },
    { id: "INV-003", supplier: "Globex", amount: 15000, status: "matched", date: "2024-02-16T14:30:00Z" },
    { id: "INV-004", supplier: "Stark Ind", amount: 54000, status: "pending", date: "2024-02-17T10:00:00Z" },
];

const MOCK_POS: PurchaseOrder[] = [
    { id: "PO-7782", supplier: "Acme Corp", amount: 12500, status: "open", items: ["Industrial Servos"] },
    { id: "PO-8821", supplier: "CyberDyne", amount: 8000, status: "open", items: ["Neural Chips"] },
    { id: "PO-9923", supplier: "Globex", amount: 15000, status: "match_found", items: ["Shipping Containers"] },
];

// Service Layer
export const AIService = {
    // Simulate fetching invoices (signals)
    getInvoices: async (): Promise<Invoice[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_INVOICES;
    },

    // Simulate fetching POs (receptors)
    getPOs: async (): Promise<PurchaseOrder[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_POS;
    },

    // Simulate getting a single exception detail
    getExceptionDetail: async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const invoice = MOCK_INVOICES.find(i => i.id === id);
        // Basic heuristic for finding related PO
        const relatedPO = MOCK_POS.find(p => p.supplier === invoice?.supplier);

        return {
            invoice,
            po: relatedPO
        };
    },

    // Simulate AI Healing Action with Guardrails
    healConnection: async (invoiceId: string, action: 'approve' | 'reject'): Promise<AIOperationResult> => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Processing time

        const invoice = MOCK_INVOICES.find(i => i.id === invoiceId);

        // Security Check: Rule 7 - Prevent Hallucinations and Unsafe Responses
        const safeCheck = validateHealingAction(invoice, 0.03); // Use stricter tolerance (3%)

        if (!safeCheck.isValid && action === 'approve') {
            return {
                success: false,
                message: sanitizeAIResponse(`AI Safety Protocol Blocked: ${safeCheck.reason}`),
                confidenceScore: 0.1
            };
        }

        return {
            success: true,
            message: sanitizeAIResponse(action === 'approve' ? "Variance approved within tolerance limits." : "Invoice rejected and returned to supplier."),
            confidenceScore: 0.98,
            actionTaken: action
        };
    }
};

export type { Invoice, PurchaseOrder };
