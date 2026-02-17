"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, AlertTriangle, X, Zap } from "lucide-react"; // Import X and Zap
import { useState, useEffect } from "react";
import { AIService } from "@/services/ai"; // Import service
import { Invoice, PurchaseOrder } from "@/models/types"; // Import types

export default function CellularView({ id }: { id: string }) {
    const [healed, setHealed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ invoice: Invoice | undefined, po: PurchaseOrder | undefined } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await AIService.getExceptionDetail(id);
            setData(result);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handleHeal = async () => {
        setLoading(true); // Re-use loading state for healing process visualization
        const result = await AIService.healConnection(id, 'approve');
        if (result.success) {
            setHealed(true);
        } else {
            // In a real app, use a toast. For MVP, alert is acceptable but let's try to be cleaner if possible
            // We'll just log it for now as the mock data always succeeds.
            console.warn(result.message);
            alert(result.message);
        }
        setLoading(false);
    };

    if (loading && !data) {
        return (
            <div className="min-h-screen bg-[#020005] flex items-center justify-center font-mono text-cyan-500 text-sm tracking-widest">
                <span className="animate-pulse">ANALYZING CELLULAR STRUCTURE...</span>
            </div>
        )
    }

    if (!data?.invoice) {
        return (
            <div className="min-h-screen bg-[#020005] flex items-center justify-center text-white">
                Error: Signal Lost. Invoice not found.
            </div>
        )
    }

    const { invoice, po } = data;

    return (
        <div className="min-h-screen bg-[#020005] text-white flex flex-col items-center justify-center relative overflow-hidden font-[family-name:var(--font-outfit)]">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="absolute top-8 left-8 z-50">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Synapse
                </Link>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-5xl">
                <div className="text-center space-y-2">
                    <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercase mb-2">
                        Active Exception
                    </div>
                    <h1 className="text-4xl font-light tracking-wide text-white">
                        Signal Variance Detected: <span className="font-mono text-cyan-400 font-bold">{id}</span>
                    </h1>
                </div>

                <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
                    {/* Connection Line */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: healed ? "100px" : "300px", opacity: 0.2 }}
                        className="absolute h-[1px] bg-red-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                        style={{ backgroundColor: healed ? '#22c55e' : '#ef4444' }}
                    />

                    {/* Invoice Cell */}
                    <motion.div
                        initial={{ x: -150, opacity: 0, scale: 0.8 }}
                        animate={{ x: healed ? -60 : -150, opacity: 1, scale: healed ? 0.9 : 1 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/50 backdrop-blur-xl flex flex-col items-center justify-center z-10 shadow-[0_0_50px_-10px_rgba(34,211,238,0.2)] group hover:shadow-[0_0_80px_-10px_rgba(34,211,238,0.4)] transition-shadow duration-500"
                    >
                        <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-[spin_10s_linear_infinite]" />
                        <div className="text-center p-6 relative z-10">
                            <div className="text-xs text-cyan-200 uppercase tracking-widest mb-2 font-semibold">Incoming Signal</div>
                            <div className="text-4xl font-bold text-white mb-1 font-mono tracking-tight">${invoice.amount.toLocaleString()}</div>
                            <div className="text-sm text-cyan-100/50">{invoice.supplier}</div>
                            <div className="mt-4 px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/40 font-mono">
                                {new Date(invoice.date).toLocaleDateString()}
                            </div>
                        </div>
                    </motion.div>

                    {/* PO Cell */}
                    <motion.div
                        initial={{ x: 150, opacity: 0, scale: 0.8 }}
                        animate={{ x: healed ? 60 : 150, opacity: 1, scale: healed ? 0.9 : 1 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="absolute w-72 h-72 rounded-full bg-gradient-to-bl from-purple-500/10 to-pink-600/10 border border-purple-500/50 backdrop-blur-xl flex flex-col items-center justify-center z-10 mix-blend-screen shadow-[0_0_50px_-10px_rgba(168,85,247,0.2)] group hover:shadow-[0_0_80px_-10px_rgba(168,85,247,0.4)] transition-shadow duration-500"
                    >
                        <div className="absolute inset-0 rounded-full border border-purple-500/10 animate-[spin_15s_linear_infinite_reverse]" />
                        <div className="text-center p-6 relative z-10">
                            <div className="text-xs text-purple-200 uppercase tracking-widest mb-2 font-semibold">Receptor Limit</div>
                            <div className="text-4xl font-bold text-white mb-1 font-mono tracking-tight">${po ? po.amount.toLocaleString() : '---'}</div>
                            <div className="text-sm text-purple-100/50">{po?.id || "No Match"}</div>
                            {po && (
                                <div className="mt-4 px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/40 font-mono max-w-[150px] truncate">
                                    {po.items.join(', ')}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Variance Intersection */}
                    {!healed && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute z-20 flex flex-col items-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-red-500/20 animate-pulse blur-2xl absolute" />
                            <div className="relative z-30 bg-black border border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] p-4 rounded-xl flex flex-col items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" />
                                <div className="text-red-500 font-bold font-mono text-xl">
                                    ${invoice.variance?.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-red-400 uppercase tracking-wider font-bold">Variance High</div>
                            </div>
                        </motion.div>
                    )}

                    {healed && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute z-20 flex flex-col items-center"
                        >
                            <div className="w-32 h-32 rounded-full bg-green-500/20 animate-pulse blur-2xl absolute" />
                            <div className="relative z-30 bg-black border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] p-4 rounded-full flex items-center justify-center">
                                <Check className="w-8 h-8 text-green-400" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Action Panel */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-lg backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    {/* Panel light leak */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    {!healed ? (
                        <>
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                                <span className="tracking-wide">AI Recommendation Engine</span>
                            </h3>
                            <div className="bg-white/5 rounded-lg p-4 mb-6 border-l-2 border-cyan-500">
                                <p className="text-cyan-100/80 text-sm leading-relaxed">
                                    The invoice amount exceeds the PO by <span className="text-white font-bold decoration-red-500 underline decoration-wavy">${invoice.variance}</span>.
                                    However, historical data suggests this is within the negotiated tolerance (3%) for <span className="text-white font-medium">{invoice.supplier}</span>.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleHeal}
                                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-900/20 hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-4 h-4" />
                                    Approve Tolerance (Heal)
                                </button>
                                <button className="px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2 font-medium">
                                    <X className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400 mb-4 ring-1 ring-green-500/50">
                                <Check className="w-6 h-6" />
                            </div>
                            <p className="text-green-400 font-medium text-lg mb-2">Neural Connection Restored.</p>
                            <p className="text-white/40 text-sm">Transaction has been queued for payment processing.</p>
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="mt-6 text-sm text-white/60 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
