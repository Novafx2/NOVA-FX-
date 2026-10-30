import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Filter, Clock, Info, AlertTriangle, ArrowUpDown, Globe } from 'lucide-react';

export const EconomicCalendar: React.FC = () => {
  const { economicEvents } = useApp();

  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Tomorrow' | 'This Week'>('All');
  const [currencyFilter, setCurrencyFilter] = useState<string>('All');
  const [impactFilter, setImpactFilter] = useState<'All' | 'HIGH' | 'MEDIUM' | 'LOW'>('All');

  // Country Flags Mapping
  const flagMap: Record<string, string> = {
    US: '🇺🇸',
    EU: '🇪🇺',
    GB: '🇬🇧',
    JP: '🇯🇵',
    CAD: '🇨🇦',
    CA: '🇨🇦',
    AU: '🇦🇺',
    CH: '🇨🇭',
  };

  const filteredEvents = economicEvents.filter((ev) => {
    if (dateFilter !== 'All' && ev.date !== dateFilter) return false;
    if (currencyFilter !== 'All' && ev.currency !== currencyFilter) return false;
    if (impactFilter !== 'All' && ev.impact !== impactFilter) return false;
    return true;
  });

  return (
    <section id="calendar" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#087BFF]/15 border border-[#087BFF]/30 mb-3">
              <Calendar className="w-4 h-4 text-[#00D9FF]" />
              <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
                Forex Factory Inspired Feed
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              Institutional Economic Calendar
            </h2>
            <p className="text-base text-[#AAB5C5] mt-2 max-w-xl">
              Track central bank interest rate decisions, inflation releases, and market-moving macroeconomic catalysts.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#087BFF]/10 border border-[#087BFF]/30 text-[#00D9FF] text-xs font-mono flex items-center gap-2 self-start md:self-auto">
            <Info className="w-4 h-4 shrink-0" />
            <span>Demonstration Calendar Data (UTC Time)</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#050914] border border-gray-800 text-xs">
            {(['All', 'Today', 'Tomorrow', 'This Week'] as const).map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  dateFilter === df
                    ? 'bg-[#087BFF] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {df}
              </button>
            ))}
          </div>

          {/* Currency Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#050914] border border-gray-800 text-xs font-mono">
            {['All', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'].map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrencyFilter(cur)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currencyFilter === cur
                    ? 'bg-[#00D9FF] text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>

          {/* Impact Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#050914] border border-gray-800 text-xs font-mono">
            {(['All', 'HIGH', 'MEDIUM', 'LOW'] as const).map((imp) => (
              <button
                key={imp}
                onClick={() => setImpactFilter(imp)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  impactFilter === imp
                    ? imp === 'HIGH'
                      ? 'bg-red-500 text-white'
                      : imp === 'MEDIUM'
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-400 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {imp}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Table */}
        <div className="rounded-3xl bg-[#0A1224] border border-[#087BFF]/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#050914] border-b border-gray-800 text-gray-400 font-mono text-[11px] uppercase">
                  <th className="py-3.5 px-4">Time / Date</th>
                  <th className="py-3.5 px-4">Currency</th>
                  <th className="py-3.5 px-4">Impact</th>
                  <th className="py-3.5 px-4">Macro Event</th>
                  <th className="py-3.5 px-4">Actual</th>
                  <th className="py-3.5 px-4">Forecast</th>
                  <th className="py-3.5 px-4">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 font-mono">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No economic releases match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => {
                    const isHigh = ev.impact === 'HIGH';
                    const isMed = ev.impact === 'MEDIUM';

                    return (
                      <tr
                        key={ev.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        {/* Time & Date */}
                        <td className="py-3.5 px-4 text-gray-300 font-medium">
                          <div className="text-white font-bold">{ev.time}</div>
                          <div className="text-[10px] text-gray-500">{ev.date}</div>
                        </td>

                        {/* Country & Currency */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{flagMap[ev.countryCode] || '🌐'}</span>
                            <span className="font-bold text-white text-xs">{ev.currency}</span>
                          </div>
                        </td>

                        {/* Impact Level Badge (Forex Factory style color indicator) */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                              isHigh
                                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                                : isMed
                                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                                : 'bg-gray-500/20 border border-gray-500/40 text-gray-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-gray-400'
                              }`}
                            />
                            {ev.impact}
                          </span>
                        </td>

                        {/* Event Title */}
                        <td className="py-3.5 px-4 font-sans font-semibold text-white group-hover:text-[#00D9FF] transition-colors">
                          {ev.title}
                        </td>

                        {/* Actual Value */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold text-xs ${
                              ev.actual === 'Pending' ? 'text-gray-500' : 'text-[#00E59B]'
                            }`}
                          >
                            {ev.actual}
                          </span>
                        </td>

                        {/* Forecast Value */}
                        <td className="py-3.5 px-4 text-gray-400">{ev.forecast}</td>

                        {/* Previous Value */}
                        <td className="py-3.5 px-4 text-gray-500">{ev.previous}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
