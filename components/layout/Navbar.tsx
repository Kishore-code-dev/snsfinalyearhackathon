"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Shield as ShieldAlert } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md border-b border-white/5 bg-[#020005]/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#1F6BFF] to-[#0A4BBF] flex items-center justify-center shadow-[0_0_15px_rgba(31,107,255,0.3)]">
                            <ShieldAlert className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white antialiased">VERTIXA</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="bg-white/5 border border-white/10 rounded-full px-6 py-2 backdrop-blur-xl flex items-center space-x-8">
                            <Link href="#product" className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group">
                                Product
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1F6BFF] transition-all group-hover:w-full" />
                            </Link>
                            <Link href="#solutions" className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group">
                                Solutions
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1F6BFF] transition-all group-hover:w-full" />
                            </Link>
                            <Link href="#pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group">
                                Pricing
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1F6BFF] transition-all group-hover:w-full" />
                            </Link>
                            <Link href="#company" className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group">
                                Company
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1F6BFF] transition-all group-hover:w-full" />
                            </Link>
                        </div>
                    </div>

                    {/* CTA & Mobile Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                            Log In
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] flex items-center gap-2 group"
                        >
                            Launch App <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#020005] border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="#product" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">Product</Link>
                        <Link href="#solutions" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">Solutions</Link>
                        <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-[#1F6BFF] font-bold">Launch App</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
