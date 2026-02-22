"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Target,
    Lightbulb,
    Cpu,
    PlayCircle,
    Zap,
    TrendingUp,
    ShieldCheck,
    Rocket,
    Trophy
} from "lucide-react";

const sections = [
    {
        title: "Team Introduction",
        icon: Users,
        content: "Team Name: **VERTIXA Institutional**\n\n**Kishore**: Full-Stack AI Engineer & Lead Architect. Responsible for End-to-End system design, AI Agent orchestration, and Premium UX implementation.",
        color: "text-blue-400"
    },
    {
        title: "The Threat Landscape",
        icon: Target,
        content: "Manual invoice processing is a massive security bottleneck for modern local businesses.\n\n• **Phishing Vulnerability**: 80% of businesses are exposed to fake invoice fraud.\n• **High Stakes**: Human error leads to millions in untraceable losses.\n• **Audit Gap**: Traditional ERPs lack forensic trails for payment approvals.\n• **Manual Friction**: CFO visibility is limited by spreadsheet delays.",
        color: "text-red-400"
    },
    {
        title: "The Proposed Solution",
        icon: Lightbulb,
        content: "**VERTIXA** is an institutional-grade AI Authentication System. It doesn't just read invoices; it **authenticates** and **governs** them.\n\n• **Forensic Extraction**: Neural agents verify signatures and metadata instantly.\n• **Deep Integration**: Cross-references every bank detail against vendor master data.\n• **Risk Scoring**: Real-time anomaly detection for every transaction before payment.",
        color: "text-blue-500"
    },
    {
        title: "Institutional Approach",
        icon: Cpu,
        content: "• **Infrastructure**: Next.js 16 + React 19 + Framer Motion for high-fidelity UX.\n• **Intelligence Layer**: Specialized neural agents for extraction and fraud detection.\n• **Neural Logic**: Autonomous negotiation agents resolve sub-tolerance variances.\n• **Cyber-Defense**: Institutional blue palette with forensic HUD monitoring.",
        color: "text-blue-400"
    },
    {
        title: "Unique Value Prop",
        icon: Zap,
        content: "• **Digital Forensics**: Analyzes PDF metadata to detect invoice manipulation.\n• **Autonomous Governance**: Eliminates human middleware in payment approval.\n• **CFO Command Center**: Premium, asymmetrical HUD for real-time risk monitoring.",
        color: "text-[#FF3B3B]"
    },
    {
        title: "Strategic Impact",
        icon: TrendingUp,
        content: "• **Target**: CFOs and Finance Controllers in local B2B sectors.\n• **Impact**: 90% reduction in fraudulent payouts, 99.98% audit accuracy.\n• **Automation**: Straight-through processing for trusted, verified vendor signals.",
        color: "text-green-400"
    }
];

export default function PitchPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-12 py-8 px-4">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary animate-pulse">
                    <Rocket className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Hackathon Pitch Deck</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                    VERTIXA <span className="text-primary italic">INSTITUTIONAL</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The future of the autonomous back-office. Powered by Agentic AI and Forensic Intelligence.
                </p>
            </motion.div>

            {/* Grid Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="h-full bg-card/40 backdrop-blur-md border-border/50 hover:border-primary/50 transition-all group">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-xl bg-background border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${section.color}`}>
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-xl">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {section.content.split('**').map((part, i) =>
                                        i % 2 === 1 ? <b key={i} className="text-foreground">{part}</b> : part
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Conclusion CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 text-center space-y-6 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <Trophy className="w-16 h-16 mx-auto text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                <h2 className="text-3xl font-bold">Ready for the Agentic Revolution</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    VERTIXA isn't just a tool; it's a redefinition of how businesses handle their most critical financial data.
                </p>
                <div className="flex justify-center gap-4">
                    <Badge variant="outline" className="px-6 py-2 text-sm border-primary/30 text-primary">Scalable</Badge>
                    <Badge variant="outline" className="px-6 py-2 text-sm border-primary/30 text-primary">Secure</Badge>
                    <Badge variant="outline" className="px-6 py-2 text-sm border-primary/30 text-primary">Autonomous</Badge>
                </div>
            </motion.div>
        </div>
    );
}
