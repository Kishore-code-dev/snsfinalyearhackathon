"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        q: "How does VERTIXA integrate with SAP or NetSuite?",
        a: "VERTIXA uses a non-intrusive API layer that sits on top of your existing ERP. We don't replace your system of record; we make it intelligent by reading/writing data via secure connectors."
    },
    {
        q: "Is my data secure?",
        a: "Yes. We are SOC2 Type II compliant. All institutional data is encrypted with AES-256 at rest and in transit. We use role-based access control (RBAC) specifically tailored for CFO oversight."
    },
    {
        q: "How does the Neural Matching work?",
        a: "Our neural agents analyze semantic structures in documents, not just text. We achieve 99.98% accuracy on fraud detection, flagging even subtly altered bank details for human review."
    },
    {
        q: "Can I customize the risk tolerance?",
        a: "Absolutely. You can set specific algorithmic tolerance levels (e.g., $10 or 3%) per vendor profile. The system autonomously negotiates or blocks payments based on these guardrails."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-32 bg-black relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-900/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Technical <span className="text-white/30 italic">Insights.</span></h2>
                    <p className="text-white/40">Everything you need to know about the VERTIXA Intelligence Layer.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="glass-dark border border-white/5 rounded-2xl overflow-hidden px-6">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex justify-between items-center py-6 text-left group"
                            >
                                <span className="text-lg text-white font-medium group-hover:text-purple-400 transition-colors tracking-tight">{faq.q}</span>
                                <Plus className={`w-5 h-5 text-white/20 transition-transform duration-500 ${openIndex === idx ? 'rotate-45 text-purple-400' : ''}`} />
                            </button>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: openIndex === idx ? 'auto' : 0, opacity: openIndex === idx ? 1 : 0 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="overflow-hidden"
                            >
                                <p className="text-white/40 pb-6 leading-relaxed font-light text-base max-w-2xl">
                                    {faq.a}
                                </p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    );
}
