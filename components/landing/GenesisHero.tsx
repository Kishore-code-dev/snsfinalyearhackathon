"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GenesisHero() {
    return (
        <section className="relative min-h-[90vh] w-full flex flex-col items-center bg-black overflow-hidden font-[family-name:var(--font-outfit)]">
            <Navbar />

            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-neutral-900 blur-[150px] opacity-40 rounded-full mix-blend-screen" />
            </div>

            <div className="z-10 w-full max-w-7xl mx-auto px-6 pt-32 md:pt-48 flex flex-col items-center text-center">

                {/* Main Content */}
                <div className="space-y-8 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
                        <span className="text-xs uppercase tracking-widest text-cyan-100 font-medium">Powered by CrewAI & AutoGen</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-medium tracking-tighter text-white leading-[0.9]"
                    >
                        Agents for the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">Supply Chain.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 mx-auto leading-relaxed font-light mt-4"
                    >
                        We build autonomous <strong>CrewAI</strong> swarms that act as your procurement team. They read emails, match invoices, and reconcile ERPs — so you don't have to.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4 pt-4"
                    >
                        <Link href="/dashboard" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2">
                            Deploy Agents <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button className="px-8 py-4 border border-white/10 text-white font-medium rounded-full hover:bg-white/5 transition-colors">
                            View Architecture
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-12 text-xs text-gray-600 font-mono flex justify-center gap-8"
                    >
                        <span>BACKEND: PYTHON / FASTAPI</span>
                        <span>AGENTS: CREWAI / AUTOGEN</span>
                        <span>MODEL: GPT-4o / LLAMA-3</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
