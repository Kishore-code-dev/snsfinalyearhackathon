"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RiskAwarenessBanner() {
    return (
        <div className="w-full bg-[#05070a] border-b border-white/5 py-3 relative z-[60]">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    <p className="text-[11px] md:text-xs font-semibold tracking-wide text-white flex items-center gap-2">
                        <span className="text-red-500 uppercase tracking-widest font-bold">Live Financial Risk Insight</span>
                        <span className="text-white/40 hidden md:inline">|</span>
                        <span className="text-white/70 font-medium italic">“Invoice manipulation is a growing financial risk for local B2B businesses.”</span>
                    </p>
                </div>

                <Link
                    href="/risk-overview"
                    className="text-[10px] md:text-xs font-bold text-white/80 hover:text-white flex items-center gap-2 group transition-colors uppercase tracking-widest"
                >
                    View Risk Overview
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

export function MarketUrgency() {
    const metrics = [
        { label: "Manual Invoice Verification", value: "< 35% structured checks" },
        { label: "Fraud Detection Timing", value: "Often after payment" },
        { label: "Primary Attack Vector", value: "Bank detail alteration" }
    ];

    return (
        <section className="py-24 bg-[#0B0F14] relative overflow-hidden">
            {/* Subtle Blue Glow Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1F6BFF]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-white mb-16 tracking-tight max-w-4xl mx-auto leading-tight"
                >
                    Financial Operations Are Increasingly Targeted <br /> Through Invoice Manipulation.
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {metrics.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="p-8 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#1F6BFF]/30 transition-all group relative"
                        >
                            {/* Blue glow on hover */}
                            <div className="absolute inset-0 bg-[#1F6BFF]/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-xl" />

                            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">{m.label}</p>
                            <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{m.value}</span>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-xl md:text-2xl font-bold text-white uppercase tracking-tighter italic opacity-80"
                >
                    “Most local businesses lack a structured invoice verification system.”
                </motion.p>
            </div>
        </section>
    );
}

export function SystemFailure() {
    const leftSide = [
        "Manual checks",
        "ERP not built for fraud detection",
        "No AI anomaly detection",
        "No real-time risk scoring"
    ];

    const rightSide = [
        "No vendor trust database",
        "No bank detail comparison",
        "No behavioral intelligence",
        "No automated payment blocking"
    ];

    return (
        <section className="py-32 bg-[#05070a] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mb-4">Architecture Analysis</h3>
                    <h2 className="text-4xl font-bold text-white tracking-tight">Why Traditional Systems Fail</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative group">
                    {/* Vertical Glowing Divider */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#1F6BFF]/50 to-transparent shadow-[0_0_15px_rgba(31,107,255,0.5)] z-20" />

                    {/* Left Column */}
                    <div className="p-12 md:pr-24 space-y-6 transition-all duration-500 group-hover:opacity-30 hover:!opacity-100">
                        {leftSide.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                <span className="text-xl text-white/60 font-medium tracking-tight hover:text-white transition-colors cursor-default">{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="p-12 md:pl-24 space-y-6 transition-all duration-500 group-hover:opacity-30 hover:!opacity-100 relative">
                        {/* Subtle Blue Glow Overlay on hover side */}
                        <div className="absolute inset-0 bg-[#1F6BFF]/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

                        {rightSide.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 relative z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1F6BFF] shadow-[0_0_8px_rgba(31,107,255,0.5)]" />
                                <span className="text-xl text-white/60 font-medium tracking-tight hover:text-white transition-colors cursor-default">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
