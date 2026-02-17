import { AIOperationResult, Invoice } from "@/models/types";

/**
 * Validates AI output to prevent hallucinations and unsafe responses.
 * Rule 7 & 9 compliant.
 */

export function validateHealingAction(
    invoice: Invoice | undefined,
    threshold: number = 0.05 // 5% tolerance
): { isValid: boolean; reason?: string } {

    if (!invoice) return { isValid: false, reason: "Invoice data missing." };
    if (invoice.status !== 'exception') return { isValid: false, reason: "Invoice is not an exception." };
    if (!invoice.variance) return { isValid: false, reason: "No variance calculated." };

    const variancePercent = invoice.variance / invoice.amount;

    // Safety Check: If variance > threshold, AI cannot auto-approve.
    if (variancePercent > threshold) {
        return {
            isValid: false,
            reason: `Variance (${(variancePercent * 100).toFixed(2)}%) exceeds safety threshold (${(threshold * 100)}%). Manual override required.`
        };
    }

    return { isValid: true };
}

export function sanitizeAIResponse(response: string): string {
    // Basic sanitization to prevent prompt injection echo or unsafe rendering
    return response.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").trim();
}
