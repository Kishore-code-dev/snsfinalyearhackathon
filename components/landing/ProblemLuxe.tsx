"use client";

import { motion } from "framer-motion";
import { AlertCircle, UserX, Clock, Database } from "lucide-react";

const painPoints = [
    {
        title: "People as Middleware",
        description: "Your team spends 40% of their day manually typing data from emails into ERPs. Knowledge is trapped in heads, not code.",
        icon: UserX,
        color: "text-red-400"
    },
    {
        title: "Fragile Latency",
        description: "A missed email stops a production line. Surprises shouldn't be your primary communication method.",
        icon: Clock,
        color: "text-orange-400"
    },
    {
        title: "Spreadsheet Governance",
        description: "Static rows don't update themselves. Global enterprises shouldn't run on legacy .xlsx files.",
        icon: Database,
        color: "text-yellow-400"
    }
];

export default function ProblemLuxe() {
    return (
        <section className="relative py-32 bg-black border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter"
                        >
                            The Gap in the <br /> <span className="text-white/30">Modern Back-Office.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white/50 text-xl leading-relaxed max-w-lg mb-12"
                        >
                            Global transactions occur in milliseconds, but verification checks are still manual, leaving local businesses exposed to sophisticated invoice manipulation.
                        </motion.p>

                        <div className="flex items-center gap-4 p-4 rounded-2xl glass border border-red-500/20 max-w-sm">
                            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                            <p className="text-xs text-red-100/70 font-mono italic">
                                Enterprise inefficiency cost reached $4.2 Trillion in 2024.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {painPoints.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 rounded-2xl glass-dark border border-white/5 flex gap-6 items-center hover:bg-white/[0.03] transition-colors"
                            >
                                <div className={`p-4 rounded-xl bg-white/5 ${p.color}`}>
                                    <p.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{p.title}</h3>
                                    <p className="text-sm text-white/30 font-light">{p.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
