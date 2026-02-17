export interface Invoice {
    id: string;
    supplier: string;
    amount: number;
    status: 'pending' | 'exception' | 'matched';
    variance?: number; // Only for exceptions
    date: string;
}

export interface PurchaseOrder {
    id: string;
    supplier: string;
    amount: number;
    status: 'open' | 'closed' | 'match_found';
    items: string[];
}

export interface AIOperationResult {
    success: boolean;
    message: string;
    confidenceScore?: number;
    actionTaken?: string;
}
