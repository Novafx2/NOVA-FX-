import React, { useState, useEffect } from 'react';
import { initialMarketInstruments } from '../../data/defaultData';
import type { MarketInstrument } from '../../types';
import { TrendingUp, TrendingDown, Activity, Info } from 'lucide-react';

interface MarketOverviewProps {
  onSelectInstrument?: (symbol: string) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ onSelectInstrument }) => {
  const [instruments, setInstruments] = useState<MarketInstrument[]>(initialMarketInstruments);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'forex' | 'metals' | 'crypto' | 'indices'>('all');

  // Simulated Live Market Pulse Ticks (Demonstration Data)
  useEffect(() => {
    const interval = setInterval(() => {
      setInstruments((prev) =>
        prev.map((inst) => {
          // Subtle micro fluctuation
          const variance = (Math.random() - 0.49) * (inst.price * 0.0006);
          const newPrice = Number((inst.price + variance).toFixed(inst.price > 500 ? 2 : 5));
          const newSparkline = [...inst.sparkline.slice(1), newPrice];
          return {
            ...inst,
            price: newPrice,
            sparkline: newSparkline,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const filteredInstruments =
    selectedFilter === 'all'
      ? instruments
      : instruments.filter((inst) => inst.category === selectedFilter);

  return (
    <section id="markets" className="py-12 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Clear Demonstration Label */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E59B] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
                Live Liquidity Feed
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-white">
              Global Market Overview
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Demonstration Data Badge (as requested by user) */}
            <div className="px-3 py-1.5 rounded-lg bg-[#087BFF]/10 border border-[#087BFF]/30 text-[#00D9FF] text-xs font-mono flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Simulated Demo Feed (Sub-sec Ticks)</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center p-1 rounded-xl bg-[#0A1224] border border-gray-800 text-xs">
              {(['all', 'forex', 'metals', 'crypto', 'indices'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                    selectedFilter === cat
                      ? 'bg-[#087BFF] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Market Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {filteredInstruments.map((item) => {
            const isBullish = item.changePercent >= 0;

            return (
              <div
                key={item.symbol}
                onClick={() => onSelectInstrument && onSelectInstrument(item.symbol)}
                className="group relative p-4 rounded-2xl bg-[#0A1224]/80 border border-[#087BFF]/15 hover:border-[#087BFF]/50 transition-all hover:shadow-xl hover:shadow-[#087BFF]/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-bold text-white text-base tracking-wide group-hover:text-[#00D9FF] transition-colors">
                      {item.symbol}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        isBullish
                          ? 'bg-[#00E59B]/15 text-[#00E59B]'
                          : 'bg-[#FF3B69]/15 text-[#FF3B69]'
                      }`}
                    >
                      {isBullish ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {isBullish ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </span>
                  </div>

                  <div className="text-[11px] text-[#AAB5C5] truncate">{item.name}</div>
                </div>

                {/* Price Display */}
                <div className="my-3">
                  <div className="text-xl font-mono font-extrabold text-white">
                    {item.price > 500
                      ? `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : item.price.toFixed(5)}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Vol: {item.volume}
                  </div>
                </div>

                {/* Mini SVG Sparkline */}
                <div className="h-9 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                    {(() => {
                      const min = Math.min(...item.sparkline);
                      const max = Math.max(...item.sparkline);
                      const range = max - min || 1;
                      const points = item.sparkline
                        .map((val, idx) => {
                          const x = (idx / (item.sparkline.length - 1)) * 100;
                          const y = 30 - ((val - min) / range) * 26 - 2;
                          return `${x},${y}`;
                        })
                        .join(' ');
                      return (
                        <polyline
                          fill="none"
                          stroke={isBullish ? '#00E59B' : '#FF3B69'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                      );
                    })()}
                  </svg>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span>L: {item.low24h}</span>
                  <span>H: {item.high24h}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
