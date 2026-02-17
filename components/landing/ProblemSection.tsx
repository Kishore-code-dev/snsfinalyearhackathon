"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileSpreadsheet, Network, Users } from "lucide-react";

const problems = [
    {
        title: "Fragile Systems",
        description: "One person quits, half your supply chain disappears overnight. Knowledge is trapped in heads, not code.",
        icon: <Network className="w-8 h-8 text-red-400" />
    },
    {
        title: "People as Middleware",
        description: "Your team is the glue between disconnected ERPs. They spend 40% of their day data-entering, not strategizing.",
        icon: <Users className="w-8 h-8 text-orange-400" />
    },
    {
        title: "Last-Minute Surprises",
        description: "A $0.50 part stops your line. You found out late because the email was buried in an inbox.",
        icon: <AlertCircle className="w-8 h-8 text-yellow-400" />
    },
    {
        title: "Spreadsheet Hell",
        description: "Static rows don't update themselves. One version control error ripples into millions in lost revenue.",
        icon: <FileSpreadsheet className="w-8 h-8 text-gray-400" />
    }
];

export default function ProblemSection() {
    return (
        <section className="py-24 bg-[#050505] relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Your Supply Chains Shouldn't <br /> Be This Hard.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Spreadsheets break. Emails get lost. One delay spirals into a week of firefighting. There has to be a better way.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((prob, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group"
                        >
                            <div className="mb-6 p-3 rounded-lg bg-white/5 w-fit group-hover:scale-110 transition-transform">
                                {prob.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{prob.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {prob.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
