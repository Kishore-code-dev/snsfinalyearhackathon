"use client";

import GenesisHero from "@/components/landing/GenesisHero";
import RiskAwarenessBanner, { MarketUrgency, SystemFailure } from "@/components/landing/VertixaSections";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/layout/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F14] font-[family-name:var(--font-outfit)]">
      <NoiseOverlay />

      {/* 1. Executive Risk Awareness Banner */}
      <RiskAwarenessBanner />

      {/* 2. Hero: The Institutional Hook */}
      <GenesisHero />

      {/* 3. Market Urgency: The Metric Proof */}
      <MarketUrgency />

      {/* 4. Infrastructure Analysis: Why Systems Fail */}
      <SystemFailure />

      {/* 5. FAQ */}
      <FAQSection />

      {/* 6. Strategic CTA */}
      <section className="py-32 bg-gradient-to-b from-[#0B0F14] to-[#05070a] relative z-10 text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
            Secure Your <br /> <span className="text-[#1F6BFF]">Financial Integrity.</span>
          </h2>
          <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto">
            Audit your local B2B operations with Vertixa's neural verification suite.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-5 bg-[#1F6BFF] text-white font-bold text-lg rounded-md hover:bg-[#1F6BFF]/90 transition-all shadow-xl">
              Schedule Security Audit
            </button>
            <button className="px-10 py-5 border border-white/10 text-white font-medium text-lg rounded-md hover:bg-white/5 transition-colors">
              Speak with a Risk Specialist
            </button>
          </div>
        </div>
      </section>


      <Footer />
    </main>
  );
}
