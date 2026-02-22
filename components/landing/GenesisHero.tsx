"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight } from "lucide-react";
import { Shield, BrainCircuit, Globe, Fingerprint, Activity, Crosshair, Lock } from "lucide-react";
import Link from "next/link";

export default function GenesisHero() {
    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F14] overflow-hidden font-[family-name:var(--font-outfit)] pt-20">
            {/* Base Forensic Texture */}
            <div className="absolute inset-0 forensic-grid opacity-30 pointer-events-none" />
            <div className="absolute inset-0 noise opacity-10 pointer-events-none" />

            {/* HUD Corner Elements */}
            <div className="absolute top-24 left-10 text-[8px] font-mono text-white/20 tracking-[0.4em] uppercase hidden lg:block">
                SEC_ZONE_04 // 40.7128° N, 74.0060° W
            </div>
            <div className="absolute bottom-10 right-10 text-[8px] font-mono text-white/20 tracking-[0.4em] uppercase hidden lg:block text-right">
                VIRTUAL_CORE_V1.4 <br />
                <span className="text-[#1F6BFF]/40">ENCRYPTION: AES-256-GCM</span>
            </div>

            {/* Kinetic Background Light */}
            <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-[#1F6BFF]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-30 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left: Strategic Content */}
                <div className="lg:col-span-7 flex flex-col items-start text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="mb-8 flex items-center gap-3 px-4 py-1.5 rounded-sm bg-white/5 border-l-2 border-[#1F6BFF]"
                    >
                        <Lock className="w-3 h-3 text-[#1F6BFF]" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">
                            Advanced Fraud Countermeasures
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.98, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-8xl font-bold tracking-tight text-white leading-[0.9] antialiased"
                    >
                        Securing the <br />
                        <span className="text-[#1F6BFF] text-glow-blue">B2B Core.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-xl text-white/40 max-w-xl leading-relaxed font-medium mt-10"
                    >
                        The institutional layer for local business authenticity. Vertixa deploys neural agents to neutralize invoice manipulation and payment fraud in real-time.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap gap-6 mt-16"
                    >
                        <Link href="/dashboard" className="group relative px-10 py-5 bg-[#1F6BFF] text-white font-bold rounded-sm overflow-hidden transition-all hover:translate-y-[-2px] shadow-[0_15px_30px_-5px_rgba(31,107,255,0.3)] flex items-center gap-4">
                            <span className="relative">Start Security Audit</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <button className="px-10 py-5 bg-transparent border border-white/10 text-white font-bold rounded-sm hover:bg-white/5 transition-all flex items-center gap-4 group">
                            <Activity className="w-4 h-4 text-[#FF3B3B] group-hover:animate-pulse" />
                            Live Threat Intel
                        </button>
                    </motion.div>
                </div>

                {/* Right: Forensic HUD Visualizer */}
                <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[600px]">
                    {/* Rotating Geometric HUD */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="relative w-full aspect-square max-w-[450px]"
                    >
                        {/* Outer Ring */}
                        <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
                        <div className="absolute inset-4 border border-dashed border-[#1F6BFF]/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

                        {/* Scanning HUD Core */}
                        <div className="absolute inset-[15%] hud-border bg-white/[0.01] rounded-2xl flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 beam-sweep pointer-events-none" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(31,107,255,0.05)_0%,transparent_70%)]" />

                            {/* Forensic Symbols */}
                            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                                <Fingerprint className="w-16 h-16 text-[#1F6BFF] animate-pulse" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Analyzing_Payload...</p>
                                    <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="h-full w-1/3 bg-[#1F6BFF]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orbiting Data Points */}
                        {[0, 90, 180, 270].map((deg, i) => (
                            <motion.div
                                key={i}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20 + i * 5, ease: "linear" }}
                                className="absolute inset-[-40px] pointer-events-none"
                            >
                                <div
                                    className="absolute w-2 h-2 rounded-full bg-[#1F6BFF] blur-[2px] shadow-[0_0_10px_#1F6BFF]"
                                    style={{
                                        top: '50%',
                                        left: '100%',
                                        transform: `rotate(${deg}deg) translate(-50%, -50%)`
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Stats HUD Overlays */}
                    <div className="absolute -bottom-10 left-0 space-y-2 font-mono text-[9px] text-[#1F6BFF]/60 uppercase tracking-widest bg-black/40 backdrop-blur-md p-4 border border-white/5 rounded-sm">
                        <div className="flex justify-between gap-12"><span>Accuracy_Index</span> <span>99.982%</span></div>
                        <div className="flex justify-between gap-12"><span>Fraud_Variance</span> <span className="text-[#FF3B3B]">0.003%</span></div>
                        <div className="flex justify-between gap-12"><span>Latency_MS</span> <span className="text-green-500">14MS</span></div>
                    </div>
                </div>
            </div>

            {/* Bottom Glow Scrutiny */}
            <div className="absolute bottom-0 left-0 right-0 h-[15vh] bg-gradient-to-t from-[#0B0F14] to-transparent z-40" />
        </section>
    );
}
