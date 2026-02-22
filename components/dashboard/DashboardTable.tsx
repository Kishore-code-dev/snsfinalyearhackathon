"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface DecisionLog {
    invoice: string;
    vendor: string;
    amount: string;
    po_number: string;
    status: string;
    confidence: string;
    fraud: string;
    date: string;
}

export function DashboardTable() {
    const [decisions, setDecisions] = useState<DecisionLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecisions = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${API_URL}/v1/decision-logs`);
                if (!res.ok) throw new Error("Failed to fetch logs");

                const data = await res.json();

                // Transform backend data to UI format
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formatted = data.map((log: any) => ({
                    invoice: log.processed_invoice.invoice_number || "UNK",
                    vendor: log.processed_invoice.vendor_name || "Unknown",
                    amount: new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: log.processed_invoice.currency || 'USD'
                    }).format(log.processed_invoice.amount),
                    po_number: log.processed_invoice.po_number || "None",
                    status: log.decision === "APPROVED" ? "Approved" :
                        log.decision === "REJECTED" ? "Blocked" : "Review",
                    confidence: `${Math.round(log.confidence_score * 100)}%`,
                    fraud: log.fraud_flags.length > 0 ? log.fraud_flags[0].code : "None",
                    date: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));

                setDecisions(formatted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDecisions();
        // Poll every 3 seconds for real-time feel
        const interval = setInterval(fetchDecisions, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <h3 className="text-lg font-semibold text-foreground">Recent AI Decisions</h3>
                <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="rounded-md border bg-card text-card-foreground shadow-sm min-h-[200px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Decision</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Fraud Flag</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && decisions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Connecting to Neural Engine...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : decisions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    No invoices processed yet. Upload one above!
                                </TableCell>
                            </TableRow>
                        ) : (
                            decisions.map((decision, idx) => (
                                <TableRow key={`${decision.invoice}-${idx}`}>
                                    <TableCell className="font-medium text-foreground">{decision.invoice}</TableCell>
                                    <TableCell className="text-muted-foreground">{decision.vendor}</TableCell>
                                    <TableCell className="text-muted-foreground">{decision.amount}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                decision.status === "Approved" ? "success" :
                                                    decision.status === "Blocked" ? "destructive" :
                                                        "warning"
                                            }
                                            className="font-normal"
                                        >
                                            {decision.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full",
                                                        parseInt(decision.confidence) > 90 ? "bg-green-500" :
                                                            parseInt(decision.confidence) > 70 ? "bg-yellow-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: decision.confidence }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{decision.confidence}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className={cn("text-xs font-medium", decision.fraud !== "None" ? "text-destructive" : "text-muted-foreground")}>
                                        {decision.fraud}
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">{decision.date}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
