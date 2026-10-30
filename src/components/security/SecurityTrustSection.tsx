import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, EyeOff, Award, FileCheck, CheckCircle2 } from 'lucide-react';

export const SecurityTrustSection: React.FC = () => {
  const { config } = useApp();
  const { security } = config;

  const icons = [ShieldCheck, Lock, Award, EyeOff];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E59B]/15 border border-[#00E59B]/30 mb-3">
            <ShieldCheck className="w-4 h-4 text-[#00E59B]" />
            <span className="text-xs font-mono font-bold text-[#00E59B] uppercase tracking-wider">
              Security & Ethical Governance
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            {security.title}
          </h2>
          <p className="text-base text-[#AAB5C5] mt-3">
            {security.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {security.items.map((item, idx) => {
            const IconComponent = icons[idx % icons.length];

            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0A1224] border border-[#087BFF]/20 hover:border-[#00D9FF]/40 transition-all hover:shadow-xl hover:shadow-[#087BFF]/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#087BFF]/20 to-[#00D9FF]/20 border border-[#087BFF]/40 text-[#00D9FF] flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#AAB5C5] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center gap-1.5 text-[11px] font-mono text-[#00E59B]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Architecture</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
