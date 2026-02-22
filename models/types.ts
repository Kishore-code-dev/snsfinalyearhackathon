export interface Invoice {
    id: string;
    supplier: string;
    amount: number;
    status: 'pending' | 'exception' | 'matched' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
    variance?: number;
    date: string;
}

export interface FraudFlag {
    code: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AIAnalysisResult {
    processed_invoice: {
        vendor_name: string;
        invoice_number: string;
        amount: number;
        currency: string;
        date?: string;
        po_number?: string;
        gstin?: string;
    };
    fraud_flags: FraudFlag[];
    confidence_score: number;
    decision: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
    reasoning: string;
    fingerprint?: string;
}

export interface PurchaseOrder {
    id: string;
    supplier: string;
    amount: number;
    status: 'open' | 'closed' | 'match_found';
    items: string[];
}

