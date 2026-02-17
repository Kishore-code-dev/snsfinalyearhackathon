"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, ShieldAlert, Loader2, Play, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIAnalysisResult {
    processed_invoice: {
        vendor_name: string;
        invoice_number: string;
        amount: number;
    };
    fraud_flags: {
        code: string;
        description: string;
        severity: "HIGH" | "MEDIUM" | "LOW";
    }[];
    confidence_score: number;
    decision: "APPROVED" | "REJECTED" | "NEEDS_REVIEW";
    reasoning: string;
}

export default function InvoiceProcessor() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AIAnalysisResult | null>(null);
    const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');
    const [rawText, setRawText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAnalyzeText = async () => {
        if (!rawText.trim()) {
            alert("Please enter invoice text first.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/v1/process-invoice`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ raw_text: rawText }),
            });

            if (!response.ok) throw new Error("Backend connection failed.");

            const data: AIAnalysisResult = await response.json();
            setResult(data);
        } catch (error) {
            console.error("AI Analysis Failed:", error);
            alert("Failed to connect to AI backend. Is Python server running on port 8000?");
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeFile = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/v1/process-invoice-file`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = errorData.detail || "File upload failed";

                // Show user-friendly error with troubleshooting
                let userMessage = `⚠️ Processing Error:\n\n${errorMsg}\n\n`;

                if (errorMsg.includes("scanned") || errorMsg.includes("image-based") || errorMsg.includes("No text")) {
                    userMessage += "📋 Next Steps:\n• This PDF contains images, not text\n• Try using the 'Paste Text' tab instead\n• Or use a different invoice (text-based PDF)\n• OCR support coming soon!";
                } else if (errorMsg.includes("corrupted") || errorMsg.includes("PDF reading failed")) {
                    userMessage += "💡 Possible Solutions:\n• Try re-downloading the PDF\n• Check if the file opens normally\n• Ensure the PDF is not password-protected";
                }

                throw new Error(userMessage);
            }

            const data: AIAnalysisResult = await response.json();
            setResult(data);
        } catch (error: any) {
            console.error("File Analysis Failed:", error);
            alert(error.message || "Failed to process file. Make sure it's a valid PDF.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = () => {
        if (inputMethod === 'text') {
            handleAnalyzeText();
        } else {
            handleAnalyzeFile();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Input Section */}
            <Card className="border-2 border-dashed border-border shadow-sm">
                <CardHeader>
                    <CardTitle>AI Invoice Processing (Live PDF Upload)</CardTitle>
                    <CardDescription>Upload a PDF invoice or paste text. Real AI agents will extract & verify data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Visual Tab Switcher */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-secondary p-1 rounded-lg inline-flex">
                            <button
                                onClick={() => { setInputMethod('text'); setSelectedFile(null); }}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMethod === 'text' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <FileText className="w-4 h-4 inline-block mr-2" />
                                Paste Text
                            </button>
                            <button
                                onClick={() => { setInputMethod('file'); setRawText(""); }}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMethod === 'file' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Upload className="w-4 h-4 inline-block mr-2" />
                                Upload PDF
                            </button>
                        </div>
                    </div>

                    {inputMethod === 'file' ? (
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer group ${dragActive
                                    ? 'border-primary bg-primary/5 scale-105'
                                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-primary/50'
                                    }`}
                            >
                                <div className="p-4 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className={`w-8 h-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>

                                {selectedFile ? (
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg mb-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium text-primary">{selectedFile.name}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                                className="ml-2 hover:bg-destructive/10 rounded-full p-1"
                                            >
                                                <X className="w-3 h-3 text-destructive" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {(selectedFile.size / 1024).toFixed(1)} KB • Click to change
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-foreground">
                                            {dragActive ? "Drop PDF here" : "Click or drag PDF to upload"}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF only • Max 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <textarea
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                                className="w-full min-h-[200px] p-4 rounded-lg border border-input bg-background/50 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                                placeholder={`Example Invoice:
VENDOR: Acme Corp
INVOICE #9942
DATE: 2024-10-24
TOTAL: $12,500.00
...`}
                            />
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={() => setRawText("VENDOR: Acme Corp\nINVOICE #9942-REAL\nTOTAL: $12,500.00")}
                                    className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors text-muted-foreground hover:text-foreground font-medium"
                                >
                                    Use Sample
                                </button>
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={handleAnalyze}
                        disabled={loading || (inputMethod === 'text' && !rawText) || (inputMethod === 'file' && !selectedFile)}
                        className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {inputMethod === 'file' ? 'Extracting PDF text...' : 'AI agents analyzing...'}
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                Run AI Verification
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Result Panel (Same as before) */}
            {result && (
                <Card className={`border-l-4 ${result.decision === 'APPROVED' ? 'border-l-green-500' : result.decision === 'REJECTED' ? 'border-l-red-500' : 'border-l-yellow-500'} shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                {result.decision === 'APPROVED' ? (
                                    <>
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        Analysis Complete: Approved
                                    </>
                                ) : result.decision === 'REJECTED' ? (
                                    <>
                                        <ShieldAlert className="w-6 h-6 text-red-500" />
                                        Analysis Complete: Blocked
                                    </>
                                ) : (
                                    <>
                                        <ShieldAlert className="w-6 h-6 text-yellow-500" />
                                        Needs Human Review
                                    </>
                                )}
                            </CardTitle>
                            <Badge
                                className={`text-sm px-3 py-1 ${result.decision === 'APPROVED' ? 'bg-green-500 hover:bg-green-600' :
                                    result.decision === 'REJECTED' ? 'bg-red-500 hover:bg-red-600' :
                                        'bg-yellow-500 hover:bg-yellow-600'
                                    } text-white`}
                            >
                                {Math.round(result.confidence_score * 100)}% Confidence
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Extraction Results</h4>
                                    <div className="bg-secondary/50 p-3 rounded-md text-sm font-mono space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Vendor:</span>
                                            <span className="font-semibold">{result.processed_invoice.vendor_name || "Unknown"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Invoice #:</span>
                                            <span className="font-semibold">{result.processed_invoice.invoice_number || "Unknown"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Amount:</span>
                                            <span className="font-semibold">${result.processed_invoice.amount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">AI Reasoning</h4>
                                    <p className="text-sm text-foreground bg-muted p-3 rounded border-l-2 border-primary">
                                        {result.reasoning}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Security Flags</h4>
                                {result.fraud_flags.length === 0 ? (
                                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-100">
                                        <CheckCircle2 className="w-4 h-4" />
                                        No fraud indicators detected.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {result.fraud_flags.map((flag, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-2 rounded border border-red-100">
                                                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                                                <div>
                                                    <div className="font-semibold">{flag.code}</div>
                                                    <div className="text-xs opacity-90">{flag.description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4">
                                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden mb-1">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${result.confidence_score > 0.8 ? 'bg-green-500' : result.confidence_score > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${result.confidence_score * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Risk Level</span>
                                        <span>Safe</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
