"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GenesisHero() {
    return (
        <section className="relative min-h-[90vh] w-full flex flex-col items-center justify-center bg-[#0B0F14] overflow-hidden font-[family-name:var(--font-outfit)]">
            <Navbar />

            {/* Minimal Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Subtle Blue Glow Header */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[300px] bg-[#1F6BFF]/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                {/* Branding Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 shadow-2xl"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#1F6BFF] font-bold">
                        Enterprise Grade Security
                    </span>
                </motion.div>

                {/* Main Heading */}
                <div className="max-w-5xl space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-8xl font-bold tracking-tight text-white leading-[0.95]"
                    >
                        AI-Powered Local B2B <br />
                        <span className="text-[#1F6BFF]">Invoice Authenticity</span> <br />
                        <span className="text-white/40 italic">&</span> Fraud Detection.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed font-medium mt-8"
                    >
                        Securing the financial back-office of local businesses through automated neural invoice verification and bank detail validation.
                    </motion.p>
                </div>

                {/* Primary Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6 mt-16"
                >
                    <Link href="/dashboard" className="px-10 py-5 bg-[#1F6BFF] text-white font-bold rounded-md hover:bg-[#1F6BFF]/90 transition-all shadow-[0_0_20px_rgba(31,107,255,0.2)] flex items-center gap-3">
                        Secure Your Operations <ArrowRight className="w-5 h-5" />
                    </Link>

                    <button className="px-10 py-5 bg-white/[0.02] border border-white/10 text-white font-bold rounded-md hover:bg-white/[0.05] transition-all flex items-center gap-3">
                        Request Audit Risk Report
                    </button>
                </motion.div>
            </div>

            {/* Institutional Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[20vh] bg-[#1F6BFF]/5 blur-[150px] opacity-40 rounded-full" />
        </section>
    );
}
