"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldAlert, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#05070a] border-t border-white/5 pt-24 pb-12 relative overflow-hidden z-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                {/* Brand Column */}
                <div className="md:col-span-1 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1F6BFF] to-[#0A4BBF] flex items-center justify-center shadow-[0_0_15px_rgba(31,107,255,0.3)]">
                            <ShieldAlert className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-wider text-white">VERTIXA</span>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed font-medium">
                        The Institutional Layer for B2B Authenticity. Securing the global financial back-office through neural anomaly detection.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Product Links */}
                <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Product</h4>
                    <ul className="space-y-4 text-white/40 text-sm font-medium">
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Neural Core</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Forensic Match</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Risk Monitor</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Infrastructure</Link></li>
                    </ul>
                </div>

                {/* Solutions Links */}
                <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Solutions</h4>
                    <ul className="space-y-4 text-white/40 text-sm font-medium">
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">For CFOs</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">For AP Teams</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Treasury Risk</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Global Trade</Link></li>
                    </ul>
                </div>

                {/* Company Links */}
                <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
                    <ul className="space-y-4 text-white/40 text-sm font-medium">
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Transparency</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Audit Trails</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-[#1F6BFF] transition-colors">Strategic Support</Link></li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 uppercase tracking-widest font-bold">
                <p>&copy; 2026 VERTIXA INSTITUTIONAL. All rights reserved.</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Shield</Link>
                    <Link href="#" className="hover:text-white transition-colors">Governance Terms</Link>
                </div>
            </div>
        </footer>
    );
}
