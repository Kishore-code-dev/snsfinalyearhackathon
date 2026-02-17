"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Simulated AutoGen Terminal
function AgentTerminal() {
    const defaultLogs = [
        { agent: "SYSTEM", message: "Initializing Multi-Agent Framework...", time: 0 },
        { agent: "InvoiceReader_Agent", message: "Connecting to IMAP Server via OAuth2...", time: 500 },
        { agent: "InvoiceReader_Agent", message: "Found 3 new attachments from 'supplier@acmecorp.com'", time: 1200 },
        { agent: "OCR_Vision_LLM", message: "Scanning Invoice INV-9902... Confidence: 99.8%", time: 2000 },
        { agent: "PO_Matcher_Agent", message: "Looking up PO-7782 in Oracle ERP...", time: 2800 },
        { agent: "PO_Matcher_Agent", message: "⚠️ Variance Detected: Price Mismatch ($12.50 vs $12.00)", time: 3500 },
        { agent: "Compliance_Agent", message: "Checking Tolerance Policy (3%)...", time: 4200 },
        { agent: "Compliance_Agent", message: "✅ Variance within Tolerance. Auto-Approval Granted.", time: 5000 },
        { agent: "SYSTEM", message: "Transaction Posted to ERP. Cycle Time: 4.2s", time: 5800 },
    ];

    const [logs, setLogs] = useState<typeof defaultLogs>([]);

    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];
        defaultLogs.forEach((log) => {
            const t = setTimeout(() => {
                setLogs(prev => [...prev, log]);
            }, log.time);
            timeouts.push(t);
        });
        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="w-full max-w-lg aspect-square md:aspect-video bg-[#0A0A0A] rounded-xl border border-white/10 overflow-hidden flex flex-col font-mono text-xs shadow-2xl relative group">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="text-gray-600">AutoGen Session: #8821-X</div>
            </div>
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {logs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2"
                    >
                        <span className={`
                            ${log.agent === 'SYSTEM' ? 'text-gray-500' : ''}
                            ${log.agent.includes('Reader') ? 'text-blue-400' : ''}
                            ${log.agent.includes('Matcher') ? 'text-purple-400' : ''}
                            ${log.agent.includes('Compliance') ? 'text-green-400' : ''}
                            ${log.agent.includes('OCR') ? 'text-yellow-400' : ''}
                        `}>[{log.agent}]</span>
                        <span className="text-gray-300">{log.message}</span>
                    </motion.div>
                ))}
                <div className="animate-pulse text-cyan-500">_</div>
            </div>

            {/* Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        </div>
    )
}


export default function GenesisHero() {
    return (
        <section className="relative min-h-[90vh] w-full flex flex-col items-center bg-black overflow-hidden font-[family-name:var(--font-outfit)]">
            <Navbar />

            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-neutral-900 blur-[150px] opacity-40 rounded-full mix-blend-screen" />
            </div>

            <div className="z-10 w-full max-w-7xl mx-auto px-6 pt-32 md:pt-48 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Column: Text */}
                <div className="text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm self-start"
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
                        className="text-xl text-gray-400 max-w-lg leading-relaxed font-light"
                    >
                        We build autonomous <strong>CrewAI</strong> swarms that act as your procurement team. They read emails, match invoices, and reconcile ERPs — so you don't have to.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-4 pt-4"
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
                        className="pt-12 text-xs text-gray-600 font-mono flex gap-8"
                    >
                        <span>BACKEND: PYTHON / FASTAPI</span>
                        <span>AGENTS: CREWAI / AUTOGEN</span>
                        <span>MODEL: GPT-4o / LLAMA-3</span>
                    </motion.div>
                </div>

                {/* Right Column: Terminal Visualization */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="flex items-center justify-center relative"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl opacity-30 rounded-full" />
                    <AgentTerminal />
                </motion.div>

            </div>
        </section>
    );
}
