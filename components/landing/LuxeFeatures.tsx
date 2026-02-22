"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ShieldCheck, Zap, Database, Globe, Lock } from "lucide-react";

const features = [
    {
        title: "Neural Extraction",
        description: "Deep-learning agents that pull data from unstructured invoices with human-level understanding.",
        icon: BrainCircuit,
        color: "text-purple-400"
    },
    {
        title: "Autonomous Governance",
        description: "Zero-touch approval workflows using cryptographic duplicate detection and fraud scanning.",
        icon: ShieldCheck,
        color: "text-blue-400"
    },
    {
        title: "Sub-Second Latency",
        description: "High-performance FastAPI backbone ensuring your financial data is processed in real-time.",
        icon: Zap,
        color: "text-amber-400"
    },
    {
        title: "Enterprise ERP Sync",
        description: "Seamless bi-directional synchronization with SAP, Oracle, and Microsoft Dynamics.",
        icon: Database,
        color: "text-emerald-400"
    },
    {
        title: "Global Compliance",
        description: "Automated GSTIN, IBAN, and VAT verification across 150+ international jurisdictions.",
        icon: Globe,
        color: "text-cyan-400"
    },
    {
        title: "Encrypted Audit",
        description: "Every single decision is immutably logged with an end-to-end audit trail for CFOs.",
        icon: Lock,
        color: "text-rose-400"
    }
];

export default function LuxeFeatures() {
    return (
        <section id="product" className="relative py-32 bg-[#020005] overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                    >
                        Built for the <span className="text-gradient">Agentic Era.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 text-lg max-w-2xl mx-auto"
                    >
                        VERTIXA combines the power of large language models with production-grade engineering to automate your entire back-office.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-3xl glass-dark border border-white/5 hover:border-white/10 transition-all hover:-translate-y-2"
                        >
                            <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 ${f.color} group-hover:scale-110 transition-transform`}>
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed font-light">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
