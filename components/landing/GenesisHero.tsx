"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight } from "lucide-react";
import { Shield, BrainCircuit, Globe, Fingerprint } from "lucide-react";
import Link from "next/link";

export default function GenesisHero() {
    return (
        <section className="relative min-h-[95vh] w-full flex flex-col items-center justify-center bg-[#0B0F14] overflow-hidden font-[family-name:var(--font-outfit)]">
            {/* Premium Texture & Scanners */}
            <div className="absolute inset-0 noise opacity-20 pointer-events-none z-10" />
            <div className="absolute inset-0 scanning-line w-full h-1 z-10 pointer-events-none" />

            {/* Minimal Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-50" />

            {/* Subtle Blue Glow Core */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#1F6BFF]/10 blur-[160px] rounded-full pointer-events-none animate-pulse duration-[10s]" />

            {/* Content Container */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                {/* Branding Badge - Ultra Tracking */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.02] border border-white/10 shadow-[0_0_40px_-10px_rgba(31,107,255,0.3)]"
                >
                    <Fingerprint className="w-3 h-3 text-[#1F6BFF]" />
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/50 font-bold">
                        Institutional Grade Verification Suite
                    </span>
                </motion.div>

                {/* Main Heading - Kinetic Reveal */}
                <div className="max-w-5xl space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-[7.5rem] font-bold tracking-tight text-white leading-[0.85] antialiased"
                    >
                        AI-Powered <br />
                        <span className="text-[#1F6BFF] text-glow-blue">Authenticity</span> <br />
                        <span className="text-white/20 italic font-light">&</span> Detection.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-medium mt-12 px-4"
                    >
                        Securing the financial infrastructure of B2B operations with automated neural validation & forensic bank-detail cross-referencing.
                    </motion.p>
                </div>

                {/* Primary Actions - Magnetic Feel */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap justify-center gap-6 mt-20"
                >
                    <Link href="/dashboard" className="group relative px-12 py-6 bg-[#1F6BFF] text-white font-bold rounded-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(31,107,255,0.4)] flex items-center gap-4">
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative">Secure Your Operations</span>
                        <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button className="px-12 py-6 bg-white/[0.02] border border-white/10 text-white font-bold rounded-lg hover:bg-white/[0.08] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-4">
                        Request Risk Report
                    </button>
                </motion.div>
            </div>

            {/* Forensic Scan Visualizer (Bottom) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 text-white/10 font-mono text-[8px] tracking-[0.5em] uppercase pointer-events-none overflow-hidden whitespace-nowrap opacity-50">
                <span>Data Integrity Check</span>
                <span className="text-[#1F6BFF]/30">●</span>
                <span>Neural Extraction active</span>
                <span className="text-[#1F6BFF]/30">●</span>
                <span>Fraud Anomaly Scanner on</span>
                <span className="text-[#1F6BFF]/30">●</span>
                <span>ERP Connector Linked</span>
            </div>
        </section>
    );
}
