"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        q: "How does XYLO integrate with SAP or NetSuite?",
        a: "XYLO uses a non-intrusive API layer that sits on top of your existing ERP. We don't replace your system of record; we make it intelligent by reading/writing data via secure connectors."
    },
    {
        "q": "Is my data secure?",
        "a": "Yes. We are SOC2 Type II compliant. All data is encrypted at rest and in transit. We use role-based access control (RBAC) to ensure only authorized personnel can view sensitive pricing."
    },
    {
        "q": "How accurate is the AI matching?",
        "a": "Our models are trained on millions of procurement documents. We typically achieve 98%+ accuracy on standard invoices. For ambiguous cases, the system flags a 'Variance' for human review."
    },
    {
        "q": "Can I customize the variance tolerance?",
        "a": "Absolutely. You can set specific tolerance levels (e.g., $10 or 3%) per supplier, category, or project. The AI respects these rules automatically."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-[#020005]">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-white/10 pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex justify-between items-center py-4 text-left group"
                            >
                                <span className="text-lg text-white font-medium group-hover:text-cyan-400 transition-colors">{faq.q}</span>
                                <Plus className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-45 text-cyan-400' : ''}`} />
                            </button>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: openIndex === idx ? 'auto' : 0, opacity: openIndex === idx ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <p className="text-gray-400 pb-4 leading-relaxed">
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
