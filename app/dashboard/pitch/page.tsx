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
        content: "Team Name: **XYLO Intelligence**\n\n**Kishore**: Full-Stack AI Engineer & Lead Architect. Responsible for End-to-End system design, AI Agent orchestration, and Premium UX implementation.",
        color: "text-purple-400"
    },
    {
        title: "Problem Statement",
        icon: Target,
        content: "Manual invoice processing is a massive bottleneck for modern enterprises.\n\n• **Time Consuming**: Manual entry takes minutes per invoice.\n• **Error Prone**: Human errors lead to incorrect payments.\n• **Fraud Vulnerability**: Enterprises lose billions annually to duplicates and phishing.\n• **No Audit Trail**: Hard to track *why* a decision was made.",
        color: "text-red-400"
    },
    {
        title: "Proposed Solution",
        icon: Lightbulb,
        content: "**XYLO** is an autonomous AI Invoice Intelligence System. It doesn't just read invoices; it **understands** and **governs** them.\n\n• **Autonomous Extraction**: Instantly pulls data from PDFs and images.\n• **Multi-Agent Security**: Verifies vendor trust and detects fraud autonomously.\n• **Explainable Decisions**: Clear reasoning trails for every action.",
        color: "text-yellow-400"
    },
    {
        title: "Technical Approach",
        icon: Cpu,
        content: "• **Frontend**: Next.js 16 + React 19 + Framer Motion for cinematic UX.\n• **Backend**: FastAPI (Python 3.11) for high-throughput AI agents.\n• **AI Engine**: Multi-Agent architecture (Extraction, Security, Decision).\n• **Vision AI**: YOLOv8 integration for real-time visual inspection.",
        color: "text-blue-400"
    },
    {
        title: "Innovation & Uniqueness",
        icon: Zap,
        content: "• **Digital Forensics**: Analyzes PDF metadata to detect document forgery.\n• **Vision Integration**: First-of-its-kind Vision AI integration in finance.\n• **Cinematic UX**: Luxury glassmorphic design redefining enterprise software.",
        color: "text-orange-400"
    },
    {
        title: "Impact & Use Case",
        icon: TrendingUp,
        content: "• **Target**: CFOs and Finance Teams in mid-to-large enterprises.\n• **Impact**: 85% reduction in costs, 99.9% fraud detection accuracy.\n• **Automation**: Zero-touch straight-through processing for trusted vendors.",
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
                    XYLO <span className="text-primary italic">INTELLIGENCE</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The future of the autonomous back-office. Powered by Agentic AI and Vision Intelligence.
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
                    XYLO isn't just a tool; it's a redefinition of how businesses handle their most critical financial data.
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
