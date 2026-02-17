"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#020005] border-t border-white/5 pt-24 pb-12 relative overflow-hidden z-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                {/* Brand Column */}
                <div className="md:col-span-1 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-wider text-white">XYLO</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        The Biological Supply Chain Intelligence Platform. Transforming dead data into living outcomes.
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
                    <h4 className="text-white font-semibold mb-6">Product</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Genesis Engine</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Neural Match</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Vendor Portal</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Integrations</Link></li>
                    </ul>
                </div>

                {/* Solutions Links */}
                <div>
                    <h4 className="text-white font-semibold mb-6">Solutions</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">For Procurement</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">For Finance</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">For Suppliers</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Enterprise</Link></li>
                    </ul>
                </div>

                {/* Company Links */}
                <div>
                    <h4 className="text-white font-semibold mb-6">Company</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Manifesto</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>&copy; 2026 XYLO Inc. All rights reserved.</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
