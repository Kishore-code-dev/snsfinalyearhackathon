"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle, FileSpreadsheet, Network } from "lucide-react";

export default function ComparisonSection() {
    return (
        <section className="py-24 bg-[#020005] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.05)_0%,_transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Evolution of the Supply Chain
                    </h2>
                    <p className="text-white/50 text-xl max-w-2xl mx-auto">
                        Stop managing dead data. Start orchestrating living outcomes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                    {/* OLD WAY */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm relative group overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900" />

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                                <FileSpreadsheet className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-300">The Spreadsheet Era</h3>
                                <p className="text-xs text-red-400 font-mono uppercase tracking-wider">Static & Fragile</p>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {[
                                "Manual data entry & copy-pasting",
                                "Siloed information in emails",
                                "Reactive firefighting (too late)",
                                "Opacity on effective lead times"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-500 group-hover:text-gray-400 transition-colors">
                                    <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Visual aesthetic of "dead" data */}
                        <div className="mt-8 h-32 bg-gray-900/50 rounded-lg border border-white/5 p-4 font-mono text-xs text-gray-600 overflow-hidden relative opacity-50 grayscale">
                            <div className="grid grid-cols-4 gap-4 mb-2 border-b border-gray-700 pb-2">
                                <span>Date</span><span>PO#</span><span>Status</span><span>Var</span>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-4 gap-4"><span>Oct 12</span><span>PO-992</span><span>ERR</span><span>+5%</span></div>
                                <div className="grid grid-cols-4 gap-4 text-red-900"><span>Oct 14</span><span>PO-993</span><span>MISS</span><span>---</span></div>
                                <div className="grid grid-cols-4 gap-4"><span>Oct 15</span><span>PO-994</span><span>PEND</span><span>+2%</span></div>
                            </div>
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    </motion.div>

                    {/* NEW WAY */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/10 to-blue-950/10 p-8 backdrop-blur-md relative group overflow-hidden shadow-[0_0_50px_-20px_rgba(34,211,238,0.2)]"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_#22d3ee40]">
                                <Network className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">The XYLO Neural Network</h3>
                                <p className="text-xs text-cyan-400 font-mono uppercase tracking-wider animate-pulse">Live & Autonomous</p>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {[
                                "AI Agents parse & key data instantly",
                                "Unified Ontology across all ERPs",
                                "Proactive Variance Resolution",
                                "Predictive delay warnings"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Visual aesthetic of "living" data */}
                        <div className="mt-8 h-32 bg-cyan-950/20 rounded-lg border border-cyan-500/20 p-4 font-mono text-xs text-cyan-100 overflow-hidden relative">
                            {/* Moving particle/beam effect */}
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/20">
                                <div className="absolute top-0 left-0 h-full w-20 bg-cyan-400 blur-sm animate-[moveRight_2s_linear_infinite]" />
                            </div>

                            <div className="flex justify-between items-center h-full relative z-10">
                                <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center bg-black/40">
                                    <span className="text-[10px] text-cyan-400">SIGNAL</span>
                                </div>
                                <div className="px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/50 text-[10px] text-cyan-300 animate-pulse">
                                    MATCHING...
                                </div>
                                <div className="w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center bg-black/40">
                                    <span className="text-[10px] text-purple-400">CORE</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
