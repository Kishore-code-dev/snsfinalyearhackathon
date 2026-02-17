"use client";

import GenesisHero from "@/components/landing/GenesisHero";
import ProblemSection from "@/components/landing/ProblemSection";
import FeatureDeepDive from "@/components/landing/FeatureDeepDive";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/layout/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020005] font-[family-name:var(--font-outfit)]">
      <NoiseOverlay />

      {/* 1. Hero: The Hook */}
      <GenesisHero />

      {/* 2. Problem: The Gap */}
      <ProblemSection />

      {/* 3. Deep Feature Analysis (Alternating) */}
      <FeatureDeepDive />

      {/* 4. FAQ */}
      <FAQSection />

      {/* 5. Final CTA */}
      <section className="py-32 bg-gradient-to-b from-[#020005] to-cyan-950/20 relative z-10 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
            Let's Build Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Living Supply Chain.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the network of autonomous enterprises. Stop managing documents. Start managing flow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-cyan-50 transition-all shadow-xl hover:shadow-cyan-500/20 scale-105 hover:scale-110 duration-300">
              Book a Demo
            </button>
            <button className="px-10 py-5 border border-white/10 text-white font-medium text-lg rounded-full hover:bg-white/5 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
