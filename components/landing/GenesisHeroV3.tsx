"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Activity, ArrowRight, Fingerprint, Database, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative group p-6 ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F6BFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {children}
    </motion.div>
);

export default function GenesisHeroV3() {
    return (
        <section className="relative min-h-screen w-full bg-[#0B0F14] text-white pt-24 pb-20 px-6 overflow-hidden">
            {/* Massive Background Grid */}
            <div className="absolute inset-0 forensic-grid opacity-20" />

            <div className="max-w-7xl mx-auto relative z-20">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6BFF]/10 border border-[#1F6BFF]/20 text-[#1F6BFF] text-[10px] uppercase tracking-widest font-bold mb-6"
                    >
                        <Shield className="w-3 h-3" />
                        Next-Gen B2B Authentication
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
                    >
                        THE INFRASTRUCTURE <br />
                        <span className="text-[#1F6BFF] text-glow-blue">OF TRUST.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
                    >
                        Vertixa provides the institutional layer for local business authenticity,
                        eliminating invoice fraud through automated forensic verification.
                    </motion.p>
                </div>

                {/* Tactical Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[120px]">
                    {/* Main CTA Card */}
                    <BentoCard className="md:col-span-2 md:row-span-3 flex flex-col justify-between bg-gradient-to-br from-[#1F6BFF]/10 to-transparent border-[#1F6BFF]/20" delay={0.3}>
                        <div>
                            <Lock className="w-10 h-10 text-[#1F6BFF] mb-6" />
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Secure Your Entire <br /> Financial Back-Office.</h2>
                            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                                Deploy autonomous verification agents that cross-reference every bank detail and vendor signature.
                            </p>
                        </div>
                        <Link href="/dashboard" className="w-full py-4 bg-[#1F6BFF] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#1F6BFF]/90 transition-all group overflow-hidden relative">
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            Deploy Security Suite <ArrowRight className="w-4 h-4" />
                        </Link>
                    </BentoCard>

                    {/* Stats HUD Card */}
                    <BentoCard className="md:col-span-2 md:row-span-2 flex flex-col justify-center" delay={0.4}>
                        <div className="flex justify-between items-end">
                            <div>
                                <Activity className="w-6 h-6 text-[#FF3B3B] mb-4" />
                                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Live Threat Deflection</h3>
                                <p className="text-4xl font-bold tracking-tighter">$14.2M <span className="text-sm text-green-500 font-mono tracking-normal">+8% WoW</span></p>
                            </div>
                            <div className="h-20 w-32 flex items-end gap-1">
                                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                                        className="w-full bg-[#1F6BFF]/20 rounded-t-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    </BentoCard>

                    {/* Feature: Neural Extraction */}
                    <BentoCard className="flex flex-col justify-between border-l-[#1F6BFF]/30 border-l-2" delay={0.5}>
                        <Fingerprint className="w-5 h-5 text-[#1F6BFF]" />
                        <span className="text-xs font-bold tracking-tight">Neural Extraction</span>
                    </BentoCard>

                    {/* Feature: ERP Sync */}
                    <BentoCard className="flex flex-col justify-between" delay={0.6}>
                        <Database className="w-5 h-5 text-white/40" />
                        <span className="text-xs font-bold tracking-tight">Oracle/SAP Link</span>
                    </BentoCard>

                    {/* Feature: Sub-second Latency */}
                    <BentoCard className="flex flex-col justify-between" delay={0.7}>
                        <Zap className="w-5 h-5 text-[#FF3B3B]" />
                        <span className="text-xs font-bold tracking-tight">14ms Detection</span>
                    </BentoCard>

                    {/* Feature: Anomaly Detection */}
                    <BentoCard className="flex flex-col justify-between" delay={0.8}>
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-bold tracking-tight">Forensic Matching</span>
                    </BentoCard>
                </div>
            </div>

            {/* Scrolling Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/40 border-t border-white/5 flex items-center overflow-hidden whitespace-nowrap text-[9px] font-mono text-white/20 uppercase tracking-[0.5em] z-30">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="flex gap-20"
                >
                    <span>System Status: Optimal</span>
                    <span>Database: Linked</span>
                    <span>Neural_Grid: Active</span>
                    <span>Verification_Nodes: 42/42</span>
                    <span>Last_Scan: 0.04s ago</span>
                    <span>System Status: Optimal</span>
                    <span>Database: Linked</span>
                    <span>Neural_Grid: Active</span>
                    <span>Verification_Nodes: 42/42</span>
                    <span>Last_Scan: 0.04s ago</span>
                </motion.div>
            </div>
        </section>
    );
}
