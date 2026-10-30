import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, ArrowUpRight, TrendingUp, CheckCircle2, Shield, Bell } from 'lucide-react';

export const SignalsCommunity: React.FC = () => {
  const { config } = useApp();
  const { community } = config;

  const handleOpenWhatsApp = () => {
    if (community.whatsappUrl) {
      window.open(community.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="community" className="py-20 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00E59B]/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Description & Configured WhatsApp Button */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E59B]/15 border border-[#00E59B]/30">
              <span className="w-2 h-2 rounded-full bg-[#00E59B] animate-ping" />
              <span className="text-xs font-mono font-bold text-[#00E59B] uppercase tracking-wider">
                VIP Signals & Institutional Desk
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              TRADE WITH THE NOVA FX COMMUNITY
            </h2>

            <p className="text-base text-[#AAB5C5] leading-relaxed">
              {community.description} Stay connected with our trading community and access high-probability market insights directly on your mobile device.
            </p>

            {/* Metrics Chips */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 text-center">
                <div className="text-lg font-bold font-heading text-white">{community.membersCount}</div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Traders</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 text-center">
                <div className="text-lg font-bold font-heading text-[#00E59B]">{community.accuracyRate}</div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Accuracy</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 text-center">
                <div className="text-lg font-bold font-heading text-[#00D9FF]">{community.dailySignals}</div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Daily Alerts</div>
              </div>
            </div>

            {/* Prominent Configurable WhatsApp Action Button */}
            <div className="pt-4">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00E59B] hover:bg-[#00c988] text-black font-extrabold text-base tracking-wide shadow-2xl shadow-[#00E59B]/30 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                {/* Official WhatsApp Emblem Icon */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.178.182-.077.355.101.173.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.571 4.184 1.574 5.945l-1.636 5.973 6.136-1.61c1.706.945 3.666 1.488 5.751 1.488 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.6c-1.892 0-3.661-.531-5.178-1.451l-.371-.225-3.642.956.973-3.551-.247-.393c-1.026-1.633-1.575-3.528-1.575-5.536 0-5.309 4.311-9.62 9.62-9.62 5.309 0 9.62 4.311 9.62 9.62 0 5.309-4.311 9.62-9.62 9.62z"/>
                </svg>
                <span>Join Official WhatsApp Community</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <div className="text-[11px] text-gray-500 font-mono mt-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#00E59B]" />
                <span>Configured URL: {community.whatsappUrl}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Verified Signals Live Feed Card */}
          <div className="lg:col-span-6">
            <div className="p-6 rounded-3xl bg-[#0A1224] border border-[#087BFF]/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#00D9FF]" />
                  <span className="font-heading font-bold text-white text-sm">
                    Recent Verified Alpha Signals
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#00E59B] px-2 py-0.5 rounded bg-[#00E59B]/10">
                  LIVE DESK FEED
                </span>
              </div>

              <div className="space-y-3">
                {community.recentSignals.map((sig) => (
                  <div
                    key={sig.id}
                    className="p-4 rounded-2xl bg-[#050914] border border-gray-800 hover:border-[#087BFF]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-white text-sm">
                          {sig.pair}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            sig.type === 'BUY'
                              ? 'bg-[#00E59B]/20 text-[#00E59B]'
                              : 'bg-[#FF3B69]/20 text-[#FF3B69]'
                          }`}
                        >
                          {sig.type}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#00E59B]">
                        {sig.pips}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-gray-400 py-1 border-t border-gray-800/60">
                      <div>Entry: <span className="text-white">{sig.entry}</span></div>
                      <div>TP: <span className="text-[#00E59B]">{sig.tp}</span></div>
                      <div>SL: <span className="text-[#FF3B69]">{sig.sl}</span></div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                      <span className="flex items-center gap-1 text-[#00D9FF]">
                        <CheckCircle2 className="w-3 h-3" /> {sig.status}
                      </span>
                      <span>{sig.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
