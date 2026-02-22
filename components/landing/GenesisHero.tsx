"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Scene3D from "@/components/landing/Scene3D";
import { Shield, Sparkles, Zap, BrainCircuit, Globe } from "lucide-react";

const metrics = [
    { label: "Accuracy", value: "99.9%", icon: Shield },
    { label: "Processing", value: "< 2s", icon: Zap },
    { label: "Cost Saving", value: "85%", icon: Sparkles }
];

export default function GenesisHero() {
    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden font-[family-name:var(--font-outfit)]">
            <Navbar />

            {/* 3D Visualizer Layer */}
            <Scene3D />

            {/* Noise & Grain Overlay */}
            <div className="absolute inset-0 noise z-20" />

            {/* Content Container */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 shadow-2xl"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold">
                        Now Live: XYLO v1.2 Enterprise
                    </span>
                </motion.div>

                {/* Main Heading with Cinematic Effect */}
                <div className="max-w-4xl space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-9xl font-bold tracking-tight text-white leading-[0.85]"
                    >
                        THE FUTURE OF <br />
                        <span className="text-gradient drop-shadow-2xl">FINANCIAL AGENTS.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Autonomous <strong>AI Swarms</strong> that orchestrate procurement, extraction, and ERP reconciliation with cinematic precision.
                    </motion.p>
                </div>

                {/* Primary Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6 mt-12"
                >
                    <Link href="/dashboard" className="group relative px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                        Deploy Suite <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button className="px-10 py-5 glass-dark border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                        <Globe className="w-5 h-5 text-purple-400" /> View Live Demo
                    </button>
                </motion.div>

                {/* Metrics Marquee/Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-24 w-full grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12"
                >
                    {metrics.map((m, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 group">
                            <div className="p-3 rounded-2xl glass border border-white/5 group-hover:border-purple-500/30 transition-colors shadow-2xl">
                                <m.icon className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold font-mono text-white mb-1">{m.value}</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{m.label}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[30vh] bg-purple-900/10 blur-[150px] opacity-60 rounded-full" />
        </section>
    );
}
