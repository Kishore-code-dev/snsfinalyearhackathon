"use client";

import { motion } from "framer-motion";
import { Copy, FileText, CheckCircle, AlertTriangle, Zap } from "lucide-react";

export default function LoadingDashboard() {
    return (
        <div className="min-h-screen bg-[#020005] text-white p-6 overflow-hidden relative font-[family-name:var(--font-outfit)] flex flex-col">
            {/* Header Skeleton */}
            <div className="border-b border-white/10 pb-4 mb-10 flex justify-between">
                <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
                <div className="h-8 w-32 bg-white/5 rounded-full animate-pulse" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full flex-1">
                {/* Left Column Skeleton */}
                <div className="space-y-4">
                    <div className="h-4 w-32 bg-white/5 rounded animate-pulse mb-4" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 w-full bg-white/5 rounded-xl animate-pulse delay-[100ms]" />
                    ))}
                </div>

                {/* Center Column - Initializing AI */}
                <div className="flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin mb-6" />
                    <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">INITIALIZING NEURAL LINK...</div>
                </div>

                {/* Right Column Skeleton */}
                <div className="space-y-4">
                    <div className="h-4 w-32 bg-white/5 rounded animate-pulse mb-4" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 w-full bg-white/5 rounded-xl animate-pulse delay-[200ms]" />
                    ))}
                </div>
            </div>
        </div>
    );
}
