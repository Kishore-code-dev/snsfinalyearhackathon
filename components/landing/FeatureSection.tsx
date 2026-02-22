"use client";

import { motion } from "framer-motion";
import { Database, Zap, ArrowRight, ShieldCheck, Activity, Cpu } from "lucide-react";

const features = [
    {
        title: "Autonomous 3-Way Match",
        description: "Invoices, POs, and Receipts aren't just compared; they're biologically healed. Variances are negotiated automatically within tolerance.",
        icon: <Zap className="w-6 h-6 text-cyan-400" />,
        gradient: "from-cyan-500/10 to-blue-500/10",
        border: "group-hover:border-cyan-500/50"
    },
    {
        title: "Ontology-First ERP",
        description: "We don't just store data rows. We map the relationships between suppliers, parts, and prices as a living knowledge graph.",
        icon: <Database className="w-6 h-6 text-purple-400" />,
        gradient: "from-purple-500/10 to-pink-500/10",
        border: "group-hover:border-purple-500/50"
    },
    {
        title: "Predictive Lead Times",
        description: "The neural network learns from historical shipping data to predict delays weeks before they stall your production line.",
        icon: <Activity className="w-6 h-6 text-green-400" />,
        gradient: "from-green-500/10 to-emerald-500/10",
        border: "group-hover:border-green-500/50"
    },
    {
        title: "Enterprise Grade Security",
        description: "SOC2 Compliance, Role-Based Access Control, and AI Guardrails ensuring every autonomous action is safe and audit-logged.",
        icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
        gradient: "from-blue-500/10 to-indigo-500/10",
        border: "group-hover:border-blue-500/50"
    },
    {
        title: "Unified Vendor Portal",
        description: "Suppliers interact with a single, beautiful interface. Changes they make propagate instantly to your ERP and planning tools.",
        icon: <Cpu className="w-6 h-6 text-orange-400" />,
        gradient: "from-orange-500/10 to-red-500/10",
        border: "group-hover:border-orange-500/50"
    }
];

export default function FeatureSection() {
    return (
        <section className="py-24 bg-[#020005] relative z-10">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-sm font-semibold tracking-[0.2em] text-[#1F6BFF] uppercase mb-4">The VERTIXA Infrastructure</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Cognitive Supply Chain</span>
                    </h3>
                    <p className="text-gray-400 text-lg">
                        Move beyond static systems of record. Upgrade to a system of intelligence that thinks, acts, and evolves.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`
                        group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden
                        hover:bg-white/[0.05] transition-all duration-500
                        ${idx === 0 || idx === 1 ? 'lg:col-span-2' : ''} 
                    `}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                            <div className={`absolute inset-0 border border-transparent ${feature.border} rounded-2xl transition-colors duration-500 pointer-events-none`} />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-2xl font-semibold text-white mb-3">{feature.title}</h4>
                                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">{feature.description}</p>
                                </div>

                                <div className="mt-8 flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors cursor-pointer group/link">
                                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
