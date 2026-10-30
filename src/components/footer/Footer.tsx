import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NovaLogo } from '../brand/NovaLogo';
import {
  ShieldAlert,
  Mail,
  Send,
  Youtube,
  Instagram,
  Twitter,
  ExternalLink,
  X,
  Shield,
  FileText,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { config, setActiveTab, setIsAdminOpen } = useApp();
  const { footer } = config;

  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    const el = document.getElementById(tabId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050914] border-t border-[#087BFF]/20 pt-16 pb-12 text-[#AAB5C5] text-xs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <NovaLogo size="md" showTagline={true} logoUrl={config.brand.logoUrl} />
            <p className="text-xs leading-relaxed max-w-sm text-gray-400 mt-3">
              {footer.about}
            </p>
            <div className="pt-2 flex items-center gap-3">
              {/* WhatsApp */}
              <a
                href={config.community.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0A1224] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#00E59B] hover:border-[#00E59B] transition-colors"
                title="WhatsApp Channel"
              >
                <Send className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href={config.youtube.channelUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0A1224] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors"
                title="YouTube Academy"
              >
                <Youtube className="w-4 h-4" />
              </a>

              {/* Email Support */}
              <a
                href={`mailto:${footer.email}`}
                className="w-9 h-9 rounded-xl bg-[#0A1224] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#00D9FF] hover:border-[#00D9FF] transition-colors"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>

              {/* Admin Portal */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="w-9 h-9 rounded-xl bg-[#0A1224] border border-[#087BFF]/40 flex items-center justify-center text-[#087BFF] hover:text-[#00D9FF] hover:border-[#00D9FF] transition-colors"
                title="Admin Control Center"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-4">
              Platform Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('trading')} className="hover:text-white transition-colors">
                  Trading Terminal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('markets')} className="hover:text-white transition-colors">
                  Global Markets
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('my-courses')} className="hover:text-white transition-colors">
                  My Courses Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-white transition-colors">
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Trading Education */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-4">
              Trading Academy
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#education" className="hover:text-white transition-colors">
                  Binary Trading Fundamentals
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-white transition-colors">
                  Order Block Strategy
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-white transition-colors">
                  Smart Money Concepts (SMC)
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-white transition-colors">
                  Price Action Trading
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-white transition-colors">
                  Risk & Money Management
                </a>
              </li>
            </ul>
          </div>

          {/* Trading Tools */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-4">
              Analytical Tools
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => handleNav('tools')} className="hover:text-white transition-colors">
                  Position Size Calculator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools')} className="hover:text-white transition-colors">
                  Risk-to-Reward Calculator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools')} className="hover:text-white transition-colors">
                  Margin & Pip Calculator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools')} className="hover:text-white transition-colors">
                  Trading Journal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('calendar')} className="hover:text-white transition-colors">
                  Economic Calendar
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Risk Disclaimer Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1224]/80 border border-amber-500/20 text-gray-400 text-[11px] leading-relaxed space-y-1.5">
          <div className="font-bold font-mono text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>REGULATORY RISK WARNING & DISCLAIMER</span>
          </div>
          <p>{footer.riskDisclaimer}</p>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} NOVA FX. All rights reserved. Built with pride for ambitious traders.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors underline"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[#087BFF] hover:underline"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>

      {/* Legal Dialog Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0A1224] border border-[#087BFF]/30 rounded-3xl p-6 sm:p-8 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-white">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#AAB5C5] space-y-3 leading-relaxed">
              <p>
                NOVA FX provides institutional training curriculum, market analytical simulators, and quantitative risk calculators. We do not solicit investments or operate as a licensed securities broker.
              </p>
              <p>
                All trading journal logs and user telemetry are secured with AES-256 standard encryption. Your personal trade notes are never monetized or exposed.
              </p>
              <p>
                Past performance shown in demonstration feeds or historical backtesting does not guarantee future results.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-800 text-right">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-xl bg-[#087BFF] text-white text-xs font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
