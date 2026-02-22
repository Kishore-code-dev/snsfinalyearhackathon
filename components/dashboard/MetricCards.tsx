"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CheckCircle2, AlertTriangle, ShieldAlert, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Counter } from "@/components/ui/counter";
import { useState } from "react";
import { cn } from "@/lib/utils";

const metrics = [
    {
        title: "Total Invoices",
        value: 0,
        prefix: "",
        suffix: "",
        change: "No data",
        icon: Activity,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Auto Approved",
        value: 0,
        prefix: "",
        suffix: "",
        description: "0% Approval Rate",
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        title: "Flagged for Review",
        value: 0,
        prefix: "",
        suffix: "",
        description: "0% Review Rate",
        icon: AlertTriangle,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
    },
    {
        title: "Fraud Detected",
        value: 0,
        prefix: "",
        suffix: "",
        description: "No threats detected",
        icon: ShieldAlert,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-200 bg-red-50/30"
    },
    {
        title: "Avg. Confidence",
        value: 0,
        prefix: "",
        suffix: "%",
        description: "Waiting for data...",
        icon: ArrowUpRight,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

const container = {
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export function MetricCards() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
            initial="hidden"
            animate="visible"
            variants={container}
        >
            {metrics.map((metric, index) => (
                <motion.div
                    key={index}
                    variants={item}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative group"
                >
                    <div className={cn(
                        "absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100",
                        "bg-gradient-to-br from-primary/5 to-transparent blur-xl scale-95 group-hover:scale-105"
                    )} />

                    <Card className={cn(
                        "relative h-full transition-all duration-300 border shadow-sm group-hover:shadow-md group-hover:-translate-y-1 bg-card/50 backdrop-blur-sm",
                        metric.border || "border-border"
                    )}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                {metric.title}
                            </CardTitle>
                            <div className={cn("p-2 rounded-lg transition-colors group-hover:bg-primary/10", metric.bg)}>
                                <metric.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", metric.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight">
                                {metric.prefix}
                                <Counter value={metric.value} />
                                {metric.suffix}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                {metric.change || metric.description}
                            </p>

                            {/* Micro-interaction: Progress bar on hover */}
                            <div className="h-1 w-0 group-hover:w-full bg-primary/20 mt-3 rounded-full transition-all duration-500 overflow-hidden">
                                <div className="h-full bg-primary w-1/2 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
