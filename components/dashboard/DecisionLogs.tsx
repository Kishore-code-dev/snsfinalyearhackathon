"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, History, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming modern UI toolkit

interface LogEntry {
    invoice_id: string;
    timestamp: string;
    decision: string;
    confidence_score: number;
    reasoning: string;
}

export default function DecisionLogs() {
    const [filter, setFilter] = useState("All");
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // FETCH REAL LOGS FROM BACKEND
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/v1/decision-logs`);
            if (!res.ok) throw new Error("Backend unavailable");
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
            // Don't alert aggressively, just stay empty or show toast
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // Poll every 10s for updates (Real-time feel)
        const interval = setInterval(fetchLogs, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredLogs = filter === "All" ? logs : logs.filter(l => l.decision === filter);

    return (
        <div className="space-y-6">

            <Card className="shadow-sm border-border/60">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 bg-muted/20">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        AI Decision Audit Log (Live)
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </CardHeader>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                        <div className="relative w-full sm:w-72 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <input
                                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background shadow-sm"
                                placeholder="Search by Invoice ID..."
                            />
                        </div>

                        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
                            {['All', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === f ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {f.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-[120px]">Invoice ID</TableHead>
                                    <TableHead className="w-[140px]">AI Decision</TableHead>
                                    <TableHead className="w-[180px]">Confidence</TableHead>
                                    <TableHead>Reasoning</TableHead>
                                    <TableHead className="text-right w-[160px]">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Loading audit trail from secure ledger...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No decisions recorded yet. Process an invoice first.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log, i) => (
                                        <TableRow key={i} className="hover:bg-muted/30 transition-colors group">
                                            <TableCell className="font-mono text-sm font-semibold text-primary">{log.invoice_id}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    log.decision === "APPROVED" ? "success" :
                                                        log.decision === "REJECTED" ? "destructive" :
                                                            "warning"
                                                }>
                                                    {log.decision}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${log.confidence_score > 0.8 ? 'bg-green-500' : log.confidence_score > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                            style={{ width: `${log.confidence_score * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium tabular-nums">{Math.round(log.confidence_score * 100)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-sm truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-popover group-hover:absolute group-hover:z-10 group-hover:shadow-lg group-hover:p-2 group-hover:rounded border border-transparent group-hover:border-border">
                                                {log.reasoning}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground font-mono">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>
        </div>
    );
}
