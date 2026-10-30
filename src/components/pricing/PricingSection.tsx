import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { config, setActiveTab } = useApp();
  const { pricingPlans } = config;
  const [isAnnual, setIsAnnual] = useState(true);
  const [checkoutModalPlan, setCheckoutModalPlan] = useState<string | null>(null);

  const handlePlanClick = (planName: string, link: string) => {
    if (link.startsWith('#')) {
      const target = link.substring(1);
      setActiveTab(target === 'education' ? 'home' : target);
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCheckoutModalPlan(planName);
    }
  };

  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#087BFF]/15 border border-[#087BFF]/30 mb-3">
            <Sparkles className="w-4 h-4 text-[#00D9FF]" />
            <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
              Transparent Membership Tiers
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Invest in Your Trading Mastery
          </h2>
          <p className="text-base text-[#AAB5C5] mt-2">
            No hidden recurring traps or upsells. Choose the tier that matches your trading ambitions.
          </p>

          {/* Billing Frequency Switcher */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-[#0A1224] border border-[#087BFF]/40 p-1 transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D9FF] shadow-md transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
                Annual Billing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00E59B]/20 border border-[#00E59B]/40 text-[#00E59B] text-[10px] font-mono font-bold">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#0A1224] border-2 border-[#00D9FF] shadow-2xl shadow-[#087BFF]/25 scale-105 z-10'
                    : 'bg-[#0A1224]/80 border border-[#087BFF]/20 hover:border-[#087BFF]/50'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white text-[11px] font-mono font-extrabold tracking-wider shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
                    {plan.name}
                  </div>

                  <p className="text-xs text-[#AAB5C5] mt-2 min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="my-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white">
                        ${price}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {price === 0 ? '/ forever' : isAnnual ? '/ month (billed yearly)' : '/ month'}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-gray-800">
                    <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                      Included with plan:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-200">
                        <Check className="w-4 h-4 text-[#00E59B] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Button */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <button
                    onClick={() => handlePlanClick(plan.name, plan.buttonLink)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white shadow-lg shadow-[#087BFF]/30 hover:brightness-110'
                        : 'bg-[#050914] border border-[#087BFF]/40 text-white hover:bg-[#087BFF]/20 hover:border-[#00D9FF]'
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configurable Checkout Modal (No fake payments) */}
      {checkoutModalPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A1224] border border-[#087BFF]/40 rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#087BFF]/20 border border-[#087BFF]/40 text-[#00D9FF] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-heading text-white">
              Enroll in {checkoutModalPlan}
            </h3>

            <p className="text-xs text-[#AAB5C5] leading-relaxed">
              Payment integrations (Stripe / Crypto / Bank Transfer) are configured directly via the Admin Dashboard.
            </p>

            <div className="p-4 rounded-xl bg-[#050914] border border-gray-800 text-xs text-left space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Selected Plan:</span>
                <span className="text-white font-bold">{checkoutModalPlan}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Billing Frequency:</span>
                <span className="text-[#00D9FF] font-bold">
                  {isAnnual ? 'Annual (20% Off)' : 'Monthly'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCheckoutModalPlan(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-xs font-semibold text-gray-300"
              >
                Close
              </button>
              <a
                href={config.community.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#00E59B] text-black text-xs font-bold hover:bg-[#00c988]"
              >
                Contact Admissions
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
