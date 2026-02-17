"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, FileText, CheckCircle, AlertTriangle, Zap, Search } from "lucide-react";
import { AIService } from "@/services/ai";
import { Invoice, PurchaseOrder } from "@/models/types"; // Import types correctly

export default function DashboardLayout() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [pos, setPos] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSignals = async () => {
            try {
                const [invData, poData] = await Promise.all([
                    AIService.getInvoices(),
                    AIService.getPOs()
                ]);
                setInvoices(invData);
                setPos(poData);
            } catch (error) {
                console.error("Failed to load neural signals", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSignals();
    }, []);

    // Placeholder until loading logic handles it (or better, use Suspense later, but this works for now)
    if (loading) {
        return (
            <div className="min-h-screen bg-[#020005] flex items-center justify-center font-mono text-cyan-500 text-sm tracking-widest relative">
                <div className="absolute inset-0 bg-blue-900/5 animate-pulse" />
                <div className="flex flex-col items-center gap-4 z-10">
                    <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <span className="animate-pulse">ESTABLISHING NEURAL UPLINK...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020005] text-white p-6 overflow-hidden relative font-[family-name:var(--font-outfit)]">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020005] to-[#020005] z-0 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center mb-10 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-wider text-cyan-400">XYLO <span className="text-white/50 text-sm font-normal">| Neural Supply Chain</span></h1>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2 text-sm text-gray-400 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        System Online
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">JD</div>
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">

                {/* Left Column: Invoices (Signals) */}
                <section className="flex flex-col gap-4 h-full">
                    <div className="flex items-center justify-between text-cyan-300 uppercase text-xs tracking-widest font-semibold mb-2 pl-1">
                        <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Incoming Signals (Invoices)</span>
                        <span className="bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded text-cyan-400 animate-pulse">Live</span>
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar pb-20">
                        {invoices.map((inv, idx) => (
                            <motion.div
                                key={inv.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                onClick={() => router.push(`/cellular/${inv.id}`)}
                                className={`
                  p-5 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer group hover:scale-[1.02] relative overflow-hidden
                  ${inv.status === 'exception' ? 'bg-red-500/5 border-red-500/30 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]' :
                                        inv.status === 'matched' ? 'bg-green-500/5 border-green-500/30 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.2)]' :
                                            'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)]'
                                    }
                `}
                            >
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <span className="text-xs text-white/40 font-mono tracking-wider">{inv.id}</span>
                                    {inv.status === 'exception' && (
                                        <div className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-red-500/20">
                                            <AlertTriangle className="w-3 h-3" /> Variance
                                        </div>
                                    )}
                                    {inv.status === 'matched' && (
                                        <div className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-green-500/20 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Synced
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-end relative z-10">
                                    <div>
                                        <div className="text-xs text-white/30 mb-0.5">Supplier</div>
                                        <div className="font-medium text-white group-hover:text-cyan-200 transition-colors text-lg">{inv.supplier}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-white/30 mb-0.5">Amount</div>
                                        <div className="font-mono text-xl tracking-tight">${inv.amount.toLocaleString()}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Center Column: The Nexus (AI Processor) */}
                <section className="flex flex-col items-center justify-center relative h-full">
                    {/* Central AI Visualization */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-80 h-80 rounded-full bg-cyan-500/5 blur-[100px] animate-pulse" />
                        <div className="w-64 h-64 rounded-full border border-cyan-500/10 animate-[spin_20s_linear_infinite]" />
                        <div className="w-48 h-48 rounded-full border border-purple-500/20 animate-[spin_30s_linear_infinite_reverse]" />

                        {/* Connecting Lines (Simulated) */}
                        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                            <line x1="0" y1="50%" x2="50%" y2="50%" stroke="url(#line-gradient-left)" strokeWidth="1" />
                            <defs>
                                <linearGradient id="line-gradient-left" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="100%" stopColor="#22d3ee" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="z-10 bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl shadow-cyan-900/20 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.4)] relative z-10">
                            <Zap className="w-8 h-8 text-white animate-[pulse_3s_infinite]" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Neural Core</h2>
                        <p className="text-white/50 text-sm mb-8 relative z-10 leading-relaxed">
                            Analyzing signal patterns and reconciling variances across <span className="text-cyan-400">3-way vectors</span>.
                        </p>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between text-xs text-white/60 font-mono uppercase tracking-wider">
                                <span>Active Agents</span>
                                <span className="text-cyan-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-blink" /> 4 Online
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 w-[70%] animate-[pulse_2s_infinite]" />
                                </div>
                                <div className="flex justify-between text-[10px] text-white/30 pt-1 font-mono">
                                    <span>Processing...</span>
                                    <span>68% Load</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Column: POs (Equilibrium) */}
                <section className="flex flex-col gap-4 h-full">
                    <div className="flex items-center justify-between text-purple-300 uppercase text-xs tracking-widest font-semibold mb-2 pr-1">
                        <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Purchase Orders (Receptors)</span>
                        <span className="bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded text-purple-400">Synced</span>
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-auto pl-2 custom-scrollbar pb-20">
                        {pos.map((po, idx) => (
                            <motion.div
                                key={po.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                className={`
                  p-5 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer group hover:scale-[1.02] relative
                  ${po.status === 'match_found' ? 'bg-purple-500/5 border-purple-500/30 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/10 hover:border-purple-500/30'}
                `}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs text-white/40 font-mono tracking-wider">{po.id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${po.status === 'open' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border border-white/10'}`}>
                                        {po.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs text-white/30 mb-0.5">Supplier</div>
                                        <div className="font-medium text-white group-hover:text-purple-200 transition-colors text-lg">{po.supplier}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-white/30 mb-0.5">Amount</div>
                                        <div className="font-mono text-xl tracking-tight">${po.amount.toLocaleString()}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
