import React from 'react';
import { useApp } from '../../context/AppContext';
import { TradingHologramScene } from '../3d/TradingHologramScene';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  PlayCircle,
  Users,
  Award,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { config, setActiveTab } = useApp();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Grid Pattern & Ambient Glow Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#087BFF]/15 via-[#00D9FF]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#087BFF]/15 border border-[#087BFF]/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00E59B] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#00D9FF] uppercase">
                {config.brand.tagline}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1] text-white">
              <span>{config.hero.headingLine1}</span>
              <br />
              <span className="bg-gradient-to-r from-[#087BFF] via-[#00D9FF] to-[#00E59B] bg-clip-text text-transparent glow-text-blue">
                {config.hero.headingLine2}
              </span>
              <br />
              <span className="text-white">{config.hero.headingLine3}</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#AAB5C5] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {config.hero.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={config.hero.primaryCtaAction}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#087BFF]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{config.hero.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={config.hero.secondaryCtaAction}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0A1224]/80 border border-[#00E59B]/40 text-white font-bold text-sm tracking-wide hover:bg-[#00E59B]/10 hover:border-[#00E59B] transition-all flex items-center justify-center gap-2 group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E59B] animate-ping" />
                <span>{config.hero.secondaryCtaText}</span>
              </a>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 border-t border-gray-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#AAB5C5]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00E59B]" />
                <span>Prop-Firm Risk Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00D9FF]" />
                <span>Sub-Millisecond Ticks</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Institutional SMC Models</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Holographic Trading Platform Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#087BFF]/40 via-transparent to-[#00D9FF]/20 shadow-2xl">
              <div className="rounded-[22px] bg-[#0A1224]/90 backdrop-blur-xl border border-[#087BFF]/30 p-2 overflow-hidden">
                {/* 3D WebGL Hologram Scene */}
                <TradingHologramScene />
              </div>

              {/* Decorative Corner Glowing Accents */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#00D9FF]/40 blur-md pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-[#087BFF]/40 blur-md pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bottom Hero Metric Counters */}
        <div className="mt-14 pt-8 border-t border-gray-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          {config.hero.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0A1224]/60 border border-[#087BFF]/15 hover:border-[#00D9FF]/30 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                {stat.value}
              </div>
              <div className="text-xs text-[#AAB5C5] font-medium mt-1">{stat.label}</div>
              <div className="text-[11px] font-mono text-[#00E59B] mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
