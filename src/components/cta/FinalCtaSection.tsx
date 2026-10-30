import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  const { config, setActiveTab } = useApp();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#087BFF]/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl glass-panel-glow border border-[#087BFF]/40 p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Orbs */}
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-[#087BFF]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-[#00D9FF]/20 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#087BFF]/20 border border-[#087BFF]/40">
            <Sparkles className="w-4 h-4 text-[#00D9FF]" />
            <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
              Begin Your Journey Today
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Ready to Trade with an Institutional Edge?
          </h2>

          <p className="text-base text-[#AAB5C5] max-w-xl mx-auto leading-relaxed">
            Join over 45,000 ambitious traders who transformed their performance using NOVA FX education, mathematical risk tools, and daily market insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#education"
              onClick={() => setActiveTab('home')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#087BFF]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={config.community.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00E59B] text-black font-extrabold text-sm tracking-wide shadow-xl shadow-[#00E59B]/25 hover:bg-[#00c988] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Join WhatsApp Signals</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
