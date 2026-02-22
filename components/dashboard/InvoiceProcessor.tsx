"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Upload, FileText, CheckCircle2, ShieldAlert, Loader2, Play, X,
    Building2, Hash, IndianRupee, Calendar, ShoppingCart, CreditCard,
    Landmark, Fingerprint, Shield, AlertTriangle, Info, ChevronDown, ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExtractedInvoice {
    vendor_name: string;
    invoice_number: string;
    amount: number;
    currency?: string;
    date?: string;
    po_number?: string;
    gstin?: string;
    iban?: string;
    ifsc?: string;
    account_number?: string;
}

interface FraudFlag {
    code: string;
    description: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
}

interface Suggestion {
    icon: string;
    title: string;
    detail: string;
    priority: "URGENT" | "HIGH" | "MEDIUM" | "INFO";
}

interface AIAnalysisResult {
    processed_invoice: ExtractedInvoice;
    fraud_flags: FraudFlag[];
    confidence_score: number;
    decision: "APPROVED" | "REJECTED" | "NEEDS_REVIEW";
    reasoning: string;
    recommendation: string;
    suggestions: Suggestion[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(amount: number, currency = "USD") {
    try {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
    } catch {
        return `${currency} ${amount.toLocaleString("en-IN")}`;
    }
}

function FieldRow({
    icon: Icon,
    label,
    value,
    missing = false,
    mono = false,
    highlight = false,
}: {
    icon: any; label: string; value?: string | number | null;
    missing?: boolean; mono?: boolean; highlight?: boolean;
}) {
    const isEmpty = value === null || value === undefined || value === "" || value === 0;
    return (
        <div className={`flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0 ${highlight ? "bg-amber-50/50 -mx-3 px-3 rounded" : ""}`}>
            <Icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground w-36 shrink-0">{label}</span>
            <span className={`text-sm font-medium flex-1 text-right ${mono ? "font-mono" : ""} ${isEmpty ? "text-red-400 italic" : "text-foreground"}`}>
                {isEmpty ? (missing ? "⚠ MISSING" : "—") : String(value)}
            </span>
        </div>
    );
}

function SecurityRow({ label, flagged, critical = false }: { label: string; flagged: boolean; critical?: boolean }) {
    return (
        <div className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${flagged
            ? critical ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"
            : "border-green-200 bg-green-50/50"
            }`}>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${flagged
                    ? critical ? "bg-red-500 animate-pulse" : "bg-orange-400"
                    : "bg-green-500"
                    }`} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            {flagged
                ? <Badge variant={critical ? "destructive" : "outline"} className={critical ? "" : "text-orange-600 border-orange-300 bg-orange-50"}>
                    {critical ? "CRITICAL" : "Flagged"}
                </Badge>
                : <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">✓ Clear</Badge>
            }
        </div>
    );
}

const PRIORITY_STYLES: Record<string, { border: string; bg: string; badge: string; badgeText: string }> = {
    URGENT: { border: "border-red-300", bg: "bg-red-50", badge: "bg-red-500 text-white", badgeText: "🚨 URGENT" },
    HIGH: { border: "border-orange-300", bg: "bg-orange-50", badge: "bg-orange-500 text-white", badgeText: "⚠ HIGH" },
    MEDIUM: { border: "border-yellow-300", bg: "bg-yellow-50", badge: "bg-yellow-500 text-white", badgeText: "📌 MEDIUM" },
    INFO: { border: "border-green-200", bg: "bg-green-50", badge: "bg-green-500 text-white", badgeText: "✓ INFO" },
};

function SuggestionCard({ s }: { s: Suggestion }) {
    const style = PRIORITY_STYLES[s.priority] ?? PRIORITY_STYLES.INFO;
    return (
        <div className={`flex gap-3 p-3 rounded-xl border ${style.border} ${style.bg} transition-all`}>
            <span className="text-2xl shrink-0 leading-none mt-0.5">{s.icon}</span>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-foreground">{s.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{style.badgeText}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function InvoiceProcessor() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AIAnalysisResult | null>(null);
    const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
    const [rawText, setRawText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [showRaw, setShowRaw] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
    };

    const callAPI = async (url: string, init: RequestInit) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}${url}`, init);
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(err.detail || "Request failed");
        }
        return res.json() as Promise<AIAnalysisResult>;
    };

    const handleAnalyze = async () => {
        setLoading(true); setResult(null);
        try {
            let data: AIAnalysisResult;
            if (inputMethod === "text") {
                if (!rawText.trim()) { alert("Please enter invoice text."); return; }
                data = await callAPI("/v1/process-invoice", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ raw_text: rawText }),
                });
            } else {
                if (!selectedFile) { alert("Please select a file."); return; }
                const fd = new FormData();
                fd.append("file", selectedFile);
                data = await callAPI("/v1/process-invoice-file", { method: "POST", body: fd });
            }
            setResult(data);
        } catch (e: any) {
            alert(`⚠️ Processing Error:\n\n${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const inv = result?.processed_invoice;
    const flags = result?.fraud_flags ?? [];
    const hasBankFlag = flags.some(f => f.code.includes("BANK"));
    const hasVendorFlag = flags.some(f => f.code.includes("VENDOR") || f.code.includes("HIGH_RISK"));
    const hasPOFlag = flags.some(f => f.code.includes("PO") || f.code.includes("ERP"));
    const hasForensics = flags.some(f => f.code.includes("DIGITAL") || f.code.includes("GST") || f.code.includes("FORGERY"));
    const hasDuplicate = flags.some(f => f.code.includes("DUPLICATE"));

    const decisionColor = result?.decision === "APPROVED" ? "green" : result?.decision === "REJECTED" ? "red" : "yellow";

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* ── INPUT CARD ─────────────────────────────────────────────── */}
            <Card className="border-2 border-dashed border-border shadow-sm">
                <CardHeader>
                    <CardTitle>AI Invoice Processing</CardTitle>
                    <CardDescription>Upload a PDF or paste invoice text. AI agents will extract every field and run fraud checks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Tab switcher */}
                    <div className="flex justify-center">
                        <div className="bg-secondary p-1 rounded-lg inline-flex">
                            {(["text", "file"] as const).map(m => (
                                <button key={m}
                                    onClick={() => { setInputMethod(m); if (m === "text") setSelectedFile(null); else setRawText(""); }}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMethod === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    {m === "text" ? <><FileText className="w-4 h-4 inline mr-2" />Paste Text</> : <><Upload className="w-4 h-4 inline mr-2" />Upload PDF</>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {inputMethod === "file" ? (
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.docx,.csv,.txt"
                                onChange={e => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                                className="hidden"
                            />
                            <div
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer group ${dragActive ? "border-primary bg-primary/5 scale-105" : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-primary/50"}`}
                            >
                                <div className="p-4 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className={`w-8 h-8 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
                                </div>
                                {selectedFile ? (
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg mb-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium text-primary">{selectedFile.name}</span>
                                            <button onClick={e => { e.stopPropagation(); setSelectedFile(null); }} className="ml-2 hover:bg-destructive/10 rounded-full p-1">
                                                <X className="w-3 h-3 text-destructive" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB • Click to change</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm font-medium">{dragActive ? "Drop file here" : "Click or drag invoice to upload"}</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, Image, Excel, Word, CSV • Max 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <textarea
                                value={rawText} onChange={e => setRawText(e.target.value)}
                                className="w-full min-h-[220px] p-4 rounded-lg border border-input bg-background/50 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                                placeholder={`Paste your full invoice text here...\n\nExample:\nVendor: Acme Corp\nInvoice No: INV-2024-001\nDate: 15/01/2024\nPO Number: PO-1001\nTotal: ₹1,23,456.00\nGSTIN: 29ABCDE1234F1Z5\nAccount No: 1234567890\nIFSC: HDFC0001234`}
                            />
                            <button
                                onClick={() => setRawText(`Vendor: Acme Corp\nInvoice No: INV-2024-001\nDate: 15/01/2024\nPO Number: PO-1001\nTotal: ₹1,23,456.00\nGSTIN: 29ABCDE1234F1Z5\nAccount No: 1234567890\nIFSC: HDFC0001234`)}
                                className="absolute top-2 right-2 px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors text-muted-foreground hover:text-foreground font-medium"
                            >
                                Use Sample
                            </button>
                        </div>
                    )}

                    <Button
                        onClick={handleAnalyze}
                        disabled={loading || (inputMethod === "text" && !rawText) || (inputMethod === "file" && !selectedFile)}
                        className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{inputMethod === "file" ? "Extracting PDF…" : "AI agents analyzing…"}</>
                        ) : (
                            <><Play className="mr-2 h-5 w-5 fill-current" />Run AI Verification</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* ── RESULTS PANEL ──────────────────────────────────────────── */}
            {result && inv && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Decision Banner */}
                    <Card className={`border-l-4 ${decisionColor === "green" ? "border-l-green-500" : decisionColor === "red" ? "border-l-red-500" : "border-l-yellow-500"} shadow-lg`}>
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    {result.decision === "APPROVED"
                                        ? <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        : result.decision === "REJECTED"
                                            ? <ShieldAlert className="w-8 h-8 text-red-500" />
                                            : <AlertTriangle className="w-8 h-8 text-yellow-500" />
                                    }
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">AI Decision</p>
                                        <p className={`text-2xl font-bold ${decisionColor === "green" ? "text-green-600" : decisionColor === "red" ? "text-red-600" : "text-yellow-600"}`}>
                                            {result.decision.replace("_", " ")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Confidence</p>
                                        <p className="text-2xl font-bold">{Math.round(result.confidence_score * 100)}%</p>
                                    </div>
                                    <div className="w-16 h-16 relative">
                                        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                            <circle cx="18" cy="18" r="15.9" fill="none"
                                                stroke={decisionColor === "green" ? "#22c55e" : decisionColor === "red" ? "#ef4444" : "#eab308"}
                                                strokeWidth="3"
                                                strokeDasharray={`${result.confidence_score * 100} 100`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className={`mt-4 flex items-start gap-2 p-3 rounded-lg text-sm ${decisionColor === "green" ? "bg-green-50 text-green-800" : decisionColor === "red" ? "bg-red-50 text-red-800" : "bg-yellow-50 text-yellow-800"}`}>
                                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                <p className="font-medium">{result.recommendation}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* ── EXTRACTED INVOICE DATA ── */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Extracted Invoice Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-0">
                                    <FieldRow icon={Building2} label="Vendor" value={inv.vendor_name} />
                                    <FieldRow icon={Hash} label="Invoice No." value={inv.invoice_number} mono />
                                    <FieldRow icon={Calendar} label="Date" value={inv.date} />
                                    <FieldRow icon={IndianRupee} label="Amount" value={formatCurrency(inv.amount, inv.currency)} highlight={inv.amount > 0} />
                                    <FieldRow icon={ShoppingCart} label="PO Number" value={inv.po_number} missing={!inv.po_number} mono />
                                </div>

                                <div className="mt-4 pt-4 border-t border-border/40">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Landmark className="w-3 h-3" /> Bank & Tax Details
                                    </p>
                                    <div className="space-y-0">
                                        <FieldRow icon={Fingerprint} label="GSTIN" value={inv.gstin} mono />
                                        <FieldRow icon={CreditCard} label="Account No." value={inv.account_number} mono />
                                        <FieldRow icon={Landmark} label="IFSC" value={inv.ifsc} mono />
                                        <FieldRow icon={CreditCard} label="IBAN" value={inv.iban} mono />
                                    </div>
                                </div>

                                {/* AI Reasoning */}
                                <div className="mt-4 pt-4 border-t border-border/40">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">AI Reasoning</p>
                                    <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg border-l-2 border-primary leading-relaxed">
                                        {result.reasoning}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── SECURITY & 3-WAY MATCH ── */}
                        <div className="space-y-4">
                            <Card className="shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-primary" />
                                        3-Way Match & Security
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <SecurityRow label="Vendor Identity" flagged={hasVendorFlag} />
                                    <SecurityRow label="Purchase Order (ERP)" flagged={hasPOFlag} />
                                    <SecurityRow label="Bank Account / IBAN" flagged={hasBankFlag} critical />
                                    <SecurityRow label="Digital Forensics" flagged={hasForensics} critical />
                                    <SecurityRow label="Duplicate Check" flagged={hasDuplicate} critical />
                                </CardContent>
                            </Card>

                            {/* Active Alerts */}
                            {flags.length > 0 && (
                                <Card className="shadow-sm border-destructive/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2 text-destructive">
                                            <ShieldAlert className="w-4 h-4" />
                                            Active Alerts ({flags.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {flags.map((flag, i) => (
                                            <div key={i} className={`flex items-start gap-2 text-sm p-2.5 rounded-lg border ${flag.severity === "HIGH"
                                                ? "bg-red-50 border-red-200 text-red-800"
                                                : flag.severity === "MEDIUM"
                                                    ? "bg-orange-50 border-orange-200 text-orange-800"
                                                    : "bg-yellow-50 border-yellow-200 text-yellow-800"
                                                }`}>
                                                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                                                <div>
                                                    <div className="font-bold text-xs uppercase tracking-wide">{flag.code}</div>
                                                    <div className="text-xs mt-0.5 opacity-90">{flag.description}</div>
                                                </div>
                                                <Badge className="ml-auto shrink-0 text-[10px]" variant={flag.severity === "HIGH" ? "destructive" : "outline"}>
                                                    {flag.severity}
                                                </Badge>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Raw JSON toggle */}
                            <button
                                onClick={() => setShowRaw(v => !v)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors font-mono"
                            >
                                <span>Raw JSON Response</span>
                                {showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            {showRaw && (
                                <pre className="text-[11px] font-mono bg-muted p-4 rounded-lg overflow-auto max-h-64 border border-border text-muted-foreground">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>

                    {/* ── AI SUGGESTIONS PANEL ── */}
                    {result.suggestions && result.suggestions.length > 0 && (
                        <Card className="shadow-sm border-primary/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <span className="text-lg">🤖</span>
                                    AI Suggestions
                                    <Badge variant="outline" className="ml-auto text-xs font-normal">
                                        {result.suggestions.length} actions
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Contextual recommendations based on full invoice analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Sort: URGENT → HIGH → MEDIUM → INFO */}
                                    {[...result.suggestions]
                                        .sort((a, b) => {
                                            const order = { URGENT: 0, HIGH: 1, MEDIUM: 2, INFO: 3 };
                                            return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
                                        })
                                        .map((s, i) => <SuggestionCard key={i} s={s} />)
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
