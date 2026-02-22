"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    ShieldAlert,
    Users,
    FileClock,
    Settings,
    Zap,
    LogOut,
    Wrench,
    ChevronRight,
    Eye // Added Eye icon
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Process Invoice",
        href: "/dashboard/process",
        icon: FileText,
    },
    {
        title: "Fraud Monitor",
        href: "/dashboard/fraud",
        icon: ShieldAlert,
    },
    {
        title: "Vendors",
        href: "/dashboard/vendors",
        icon: Users,
    },
    {
        title: "Presentation",
        href: "/dashboard/pitch",
        icon: FileText,
    },
    {
        title: "AI Decision Logs",
        href: "/dashboard/logs",
        icon: FileClock,
    },
    {
        title: "Visual Control",
        href: "/dashboard/vision",
        icon: Eye,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 256 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-r border-border bg-card/95 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-50 shadow-md group/sidebar"
        >
            {/* Brand Logo */}
            <div className="h-16 flex items-center px-6 border-b border-border justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0 bg-primary text-primary-foreground p-1.5 rounded-lg shadow-lg shadow-blue-500/20"
                    >
                        <ShieldAlert className="w-5 h-5 fill-current" />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                        className="font-bold text-lg tracking-tight text-primary whitespace-nowrap"
                    >
                        VERTIXA AI
                    </motion.span>
                </div>
            </div>


            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
                {!collapsed && (
                    <div className="text-[10px] font-bold text-muted-foreground px-4 mb-2 uppercase tracking-widest opacity-75">
                        Workspace
                    </div>
                )}

                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group flex items-center"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-secondary rounded-lg"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className={cn(
                                "relative z-10 flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium transition-colors duration-200",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}>
                                <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive && "fill-current")} />

                                {!collapsed && (
                                    <span className="truncate">{item.title}</span>
                                )}

                                {isActive && !collapsed && (
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer / Settings */}
            <div className="p-3 border-t border-border space-y-1 bg-background/50">
                {!collapsed && (
                    <div className="text-[10px] font-bold text-muted-foreground px-4 mb-2 uppercase tracking-widest opacity-75">
                        Configuration
                    </div>
                )}

                <Link
                    href="/dashboard/maintenance"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary group/metric",
                        pathname === "/dashboard/maintenance" ? "bg-secondary text-primary" : "text-muted-foreground"
                    )}
                >
                    <Wrench className="w-5 h-5 group-hover/metric:rotate-45 transition-transform" />
                    {!collapsed && "Maintenance"}
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors text-left">
                    <LogOut className="w-5 h-5" />
                    {!collapsed && "Sign Out"}
                </button>
            </div>

            {/* Collapse Toggle (Hover Area) */}
            <div
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-transparent hover:bg-border/50 rounded-r-lg cursor-pointer flex items-center justify-center opacity-0 group-hover/sidebar:opacity-100 transition-opacity"
                onClick={() => setCollapsed(!collapsed)}
            >
                <div className="w-1 h-8 bg-muted-foreground/20 rounded-full" />
            </div>
        </motion.div>
    );
}
