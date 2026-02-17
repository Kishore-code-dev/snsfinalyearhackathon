"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Database, Activity, ShieldCheck, Cpu } from "lucide-react";

export default function FeatureDeepDive() {
    return (
        <section className="bg-black relative z-10 overflow-hidden font-[family-name:var(--font-outfit)]">

            {/* Feature 1: CrewAI Integration */}
            <div className="py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="order-2 lg:order-1 px-8 py-12 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group">
                    {/* Visual: Agent Card Stack */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent opacity-50" />

                    <div className="relative z-10 flex flex-col gap-4 perspective-1000">
                        {/* Agent 1 */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-3/4 self-center shadow-2xl translate-z-10"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-mono text-cyan-400">INVOICE_READER_AGENT</span>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded mb-2" />
                            <div className="text-[10px] text-gray-400 font-mono">Found: PO-9942 ($12,500)</div>
                        </motion.div>

                        {/* Agent 2 */}
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: -10, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-black/90 backdrop-blur-xl border border-purple-500/50 rounded-xl p-4 w-3/4 self-center shadow-2xl shadow-purple-900/20 translate-z-20 z-10"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-mono text-purple-400">PO_MATCHER_AGENT</span>
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            </div>
                            <div className="text-sm text-white font-medium mb-1">Variance Detected: $500</div>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] rounded border border-purple-500/30">CHECKING TOLERANCE...</span>
                            </div>
                        </motion.div>

                        {/* Agent 3 */}
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: -20, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-3/4 self-center shadow-2xl translate-z-30 opacity-60 scale-95"
                        >
                            <div className="h-2 w-3/4 bg-white/10 rounded mb-2" />
                            <div className="text-[10px] text-gray-500 font-mono">Updating Oracle ERP...</div>
                        </motion.div>
                    </div>
                </div>

                <div className="order-1 lg:order-2 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">
                        <Zap className="w-3 h-3" />
                        Powered by CrewAI
                    </div>
                    <h3 className="text-5xl font-bold text-white leading-tight">
                        Multi-Agent <br /> <span className="text-cyan-200">Reconciliation Swarms</span>
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                        We deploy specialized <strong>AI Agents</strong> (Reader, Matcher, Compliance) that work in sequence. They handle the messy middle—matching line items, flagging variances, and updating ERPs instantly.
                    </p>
                    <ul className="space-y-4 pt-4">
                        {[
                            'Role-Based Agents (e.g., "Compliance Officer")',
                            'Sequential Task Execution',
                            'Self-Reflecting Error Correction'
                        ].map(item => (
                            <li key={item} className="flex items-center gap-3 text-gray-300">
                                <div className="bg-cyan-500/20 p-1.5 rounded-full border border-cyan-500/30"><Check className="w-3 h-3 text-cyan-400" /></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Feature 2: AutoGen Negotiation */}
            <div className="py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center border-t border-white/5">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-2">
                        <Database className="w-3 h-3" />
                        Powered by AutoGen
                    </div>
                    <h3 className="text-5xl font-bold text-white leading-tight">
                        Autonomous <br /> <span className="text-purple-300">Variance Negotiation</span>
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                        When a variance is found, an AutoGen agent acts as the "Buyer" and negotiates with the "Supplier" agent (simulating the vendor) to resolve price discrepancies without human email ping-pong.
                    </p>
                    <div className="pt-8">
                        <button className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors text-sm font-medium group uppercase tracking-widest">
                            See the Python Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="px-8 py-12 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group">
                    {/* Visual for Negotiation */}
                    <div className="space-y-4 font-mono text-xs">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">B</div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-gray-300 max-w-xs">
                                Invoice #9942 is $500 over PO. Explain.
                            </div>
                        </div>
                        <div className="flex gap-4 flex-row-reverse">
                            <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">S</div>
                            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20 text-blue-200 max-w-xs text-right">
                                Expedited shipping was requested on Tue 12th.
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">B</div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-gray-300 max-w-xs">
                                Checking emails... Confirmed. Approving variance.
                            </div>
                        </div>
                        <div className="text-center text-green-500 animate-pulse pt-2">
                            &gt;&gt; VARIANCE RESOLVED: APPROVED &lt;&lt;
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
