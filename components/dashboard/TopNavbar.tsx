"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TopNavbar() {
    const pathname = usePathname();
    const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard';
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40 transition-all">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={pageTitle}
                className="text-xl font-semibold text-foreground tracking-tight"
            >
                {pageTitle}
            </motion.h1>

            <div className="flex items-center gap-6">

                {/* System Status - Pulsing Dot with Tooltip on Hover */}
                <div className="group relative flex items-center gap-2 px-3 py-1.5 bg-green-500/5 rounded-full border border-green-500/20 hover:bg-green-500/10 transition-colors cursor-help">
                    <div className="relative flex items-center justify-center w-2 h-2">
                        <div className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs font-semibold text-green-600">AI Active</span>

                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs text-muted-foreground z-50">
                        System uptime: 99.9%<br />
                        Agents active: 4/4<br />
                        Latency: 24ms
                    </div>
                </div>

                {/* Notifications with Badge Animation */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="relative cursor-pointer hover:bg-accent p-2 rounded-full transition-colors"
                >
                    <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                </motion.button>

                {/* Search Bar with Command Hint */}
                <div className={cn(
                    "hidden md:flex items-center rounded-lg px-3 py-1.5 transition-all duration-300 border",
                    searchFocused
                        ? "bg-background border-primary w-64 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]"
                        : "bg-secondary/50 border-transparent w-48 hover:bg-secondary hover:w-56"
                )}>
                    <Search className={cn("w-4 h-4 mr-2 transition-colors", searchFocused ? "text-primary" : "text-muted-foreground")} />
                    <input
                        type="text"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Search invoices..."
                        className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                    />
                    <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>

                {/* User Profile with Dropdown Hint */}
                <div className="flex items-center gap-3 pl-4 border-l border-border hover:bg-accent/50 p-1 rounded-lg cursor-pointer transition-colors group">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Admin User</div>
                        <div className="text-xs text-muted-foreground">Finance Team</div>
                    </div>
                    <Avatar className="border-2 border-background group-hover:border-primary transition-colors">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>

            </div>
        </header>
    );
}
