import React, { useState, useEffect, useRef } from 'react';
import { initialMarketInstruments } from '../../data/defaultData';
import {
  TrendingUp,
  TrendingDown,
  Maximize2,
  Clock,
  Layers,
  ChevronDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Play,
} from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
}

export const TradingPlatformShowcase: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('XAU/USD');
  const [timeframe, setTimeframe] = useState('15m');
  const [lotSize, setLotSize] = useState('0.50');
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [showIndicators, setShowIndicators] = useState({ ema20: true, ema50: true, volume: true });
  
  // Real-time fluctuating current price
  const [currentPrice, setCurrentPrice] = useState(2748.65);
  const [openPositions, setOpenPositions] = useState<Position[]>([
    {
      id: 'pos-1',
      symbol: 'XAU/USD',
      type: 'BUY',
      lots: 0.5,
      entryPrice: 2741.2,
      currentPrice: 2748.65,
      pnl: 372.5,
    },
    {
      id: 'pos-2',
      symbol: 'EUR/USD',
      type: 'SELL',
      lots: 1.0,
      entryPrice: 1.0855,
      currentPrice: 1.0834,
      pnl: 210.0,
    },
  ]);

  const [tradeNotification, setTradeNotification] = useState<string | null>(null);

  // Candlestick procedural array
  const [candles, setCandles] = useState<Array<{ time: string; open: number; high: number; low: number; close: number }>>(() => {
    const list = [];
    let base = 2735.0;
    for (let i = 0; i < 28; i++) {
      const delta = (Math.sin(i * 0.4) + (Math.random() - 0.45)) * 3.5;
      const open = base;
      const close = base + delta;
      const high = Math.max(open, close) + Math.random() * 2.2;
      const low = Math.min(open, close) - Math.random() * 2.2;
      list.push({
        time: `${10 + Math.floor(i / 4)}:${(i % 4) * 15 || '00'}`,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
      });
      base = close;
    }
    return list;
  });

  // Price tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const variance = (Math.random() - 0.49) * 0.45;
      setCurrentPrice((prev) => {
        const next = Number((prev + variance).toFixed(2));
        // update open positions
        setOpenPositions((positions) =>
          positions.map((pos) => {
            if (pos.symbol === selectedSymbol) {
              const diff = pos.type === 'BUY' ? next - pos.entryPrice : pos.entryPrice - next;
              return {
                ...pos,
                currentPrice: next,
                pnl: Number((diff * pos.lots * 100).toFixed(2)),
              };
            }
            return pos;
          })
        );
        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // Execute Simulated Order
  const handleExecuteOrder = (type: 'BUY' | 'SELL') => {
    const lots = parseFloat(lotSize) || 0.1;
    const newPos: Position = {
      id: 'pos-' + Date.now(),
      symbol: selectedSymbol,
      type,
      lots,
      entryPrice: currentPrice,
      currentPrice,
      pnl: 0,
    };
    setOpenPositions([newPos, ...openPositions]);
    setTradeNotification(`Executed ${type} ${lots} Lots on ${selectedSymbol} at ${currentPrice}`);
    setTimeout(() => setTradeNotification(null), 3500);
  };

  const closePosition = (id: string) => {
    setOpenPositions((prev) => prev.filter((p) => p.id !== id));
  };

  // Min / max for candlestick scaling
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 10;

  return (
    <section id="trading" className="py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087BFF]/15 border border-[#087BFF]/30 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00E59B] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
              High-Frequency Terminal
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Institutional Execution Showcase
          </h2>
          <p className="text-sm sm:text-base text-[#AAB5C5] mt-2">
            Experience our ultra-low latency simulated workspace with live liquidity brackets, real-time order books, and position calculators.
          </p>
        </div>

        {/* Terminal Container */}
        <div className="rounded-3xl glass-panel-glow border border-[#087BFF]/30 p-2 sm:p-4 overflow-hidden shadow-2xl">
          {/* Top Bar of the Terminal */}
          <div className="h-14 px-4 bg-[#050914] rounded-2xl border border-gray-800 flex flex-wrap items-center justify-between gap-3 mb-3">
            {/* Symbol Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-heading font-extrabold text-base text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D9FF]" />
                <span>{selectedSymbol}</span>
              </div>
              <div className="flex items-center gap-1">
                {['EUR/USD', 'GBP/USD', 'XAU/USD', 'BTC/USD', 'NAS100'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => {
                      setSelectedSymbol(sym);
                      if (sym === 'XAU/USD') setCurrentPrice(2748.65);
                      else if (sym === 'EUR/USD') setCurrentPrice(1.0834);
                      else if (sym === 'GBP/USD') setCurrentPrice(1.2965);
                      else if (sym === 'BTC/USD') setCurrentPrice(71850.0);
                      else setCurrentPrice(20492.3);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      selectedSymbol === sym
                        ? 'bg-[#087BFF] text-white font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe & Indicators */}
            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 rounded-xl bg-[#0A1224] border border-gray-800 text-xs font-mono">
                {['1m', '5m', '15m', '1h', '4h', '1D'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-0.5 rounded-lg transition-colors ${
                      timeframe === tf ? 'bg-[#087BFF]/30 text-[#00D9FF] font-bold' : 'text-gray-400'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#00E59B]">
                <span className="animate-pulse">●</span>
                <span>BID: {currentPrice}</span>
              </div>
            </div>
          </div>

          {/* Main Chart + Order Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Chart Area */}
            <div className="lg:col-span-8 bg-[#050914] rounded-2xl border border-gray-800 p-4 relative flex flex-col justify-between min-h-[360px]">
              {/* Notification Banner */}
              {tradeNotification && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-[#00E59B]/20 border border-[#00E59B] text-[#00E59B] text-xs font-mono flex items-center gap-2 shadow-lg animate-in fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>{tradeNotification}</span>
                </div>
              )}

              {/* Chart Grid Lines & Candlestick Canvas SVG */}
              <div className="relative w-full h-[300px]">
                {/* Horizontal price reference lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b border-[#087BFF]" />
                  <div className="border-b border-[#087BFF]" />
                  <div className="border-b border-[#087BFF]" />
                  <div className="border-b border-[#087BFF]" />
                </div>

                {/* SVG Candlesticks */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 280">
                  {candles.map((candle, idx) => {
                    const x = 20 + idx * 24;
                    const isBull = candle.close >= candle.open;
                    const highY = 280 - ((candle.high - minPrice) / priceRange) * 250 - 15;
                    const lowY = 280 - ((candle.low - minPrice) / priceRange) * 250 - 15;
                    const openY = 280 - ((candle.open - minPrice) / priceRange) * 250 - 15;
                    const closeY = 280 - ((candle.close - minPrice) / priceRange) * 250 - 15;
                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(Math.abs(closeY - openY), 3);

                    return (
                      <g key={idx}>
                        {/* Wick */}
                        <line
                          x1={x + 6}
                          y1={highY}
                          x2={x + 6}
                          y2={lowY}
                          stroke={isBull ? '#00E59B' : '#FF3B69'}
                          strokeWidth="1.5"
                        />
                        {/* Candle Body */}
                        <rect
                          x={x}
                          y={bodyTop}
                          width="12"
                          height={bodyHeight}
                          rx="1"
                          fill={isBull ? '#00E59B' : '#FF3B69'}
                          opacity="0.9"
                        />
                      </g>
                    );
                  })}

                  {/* Simulated EMA Line (Electric Blue) */}
                  <polyline
                    fill="none"
                    stroke="#087BFF"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    points={candles
                      .map((c, i) => `${26 + i * 24},${280 - ((c.close - minPrice) / priceRange) * 230 - 20}`)
                      .join(' ')}
                  />

                  {/* Current Price Horizontal Ray */}
                  <line
                    x1="0"
                    y1="140"
                    x2="700"
                    y2="140"
                    stroke="#00D9FF"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    className="animate-pulse"
                  />
                  <text x="630" y="135" fill="#00D9FF" fontSize="11" fontFamily="JetBrains Mono">
                    {currentPrice}
                  </text>
                </svg>
              </div>

              {/* Chart Bottom Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-[#00E59B]" /> Bullish Candle
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-[#FF3B69]" /> Bearish Candle
                  </span>
                  <span className="flex items-center gap-1 text-[#087BFF]">
                    <span className="w-2.5 h-1 bg-[#087BFF]" /> EMA (20)
                  </span>
                </div>
                <span>London Session High: {maxPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Execution & Depth Ladder */}
            <div className="lg:col-span-4 bg-[#050914] rounded-2xl border border-gray-800 p-4 space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-heading font-bold text-gray-300 uppercase mb-3 flex items-center justify-between">
                  <span>Quick Trade Ticket</span>
                  <span className="text-[10px] font-mono text-[#00E59B]">Spread: 0.2 Pips</span>
                </div>

                {/* Buy / Sell Big Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => handleExecuteOrder('SELL')}
                    className="py-3 px-4 rounded-xl bg-gradient-to-b from-[#FF3B69]/20 to-[#FF3B69]/40 border border-[#FF3B69] hover:brightness-125 transition-all text-center group"
                  >
                    <div className="text-[10px] font-mono uppercase text-red-200">SELL MARKET</div>
                    <div className="text-lg font-mono font-extrabold text-[#FF3B69]">
                      {(currentPrice - 0.1).toFixed(2)}
                    </div>
                  </button>

                  <button
                    onClick={() => handleExecuteOrder('BUY')}
                    className="py-3 px-4 rounded-xl bg-gradient-to-b from-[#00E59B]/20 to-[#00E59B]/40 border border-[#00E59B] hover:brightness-125 transition-all text-center group"
                  >
                    <div className="text-[10px] font-mono uppercase text-green-200">BUY MARKET</div>
                    <div className="text-lg font-mono font-extrabold text-[#00E59B]">
                      {(currentPrice + 0.1).toFixed(2)}
                    </div>
                  </button>
                </div>

                {/* Lot Size Stepper */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      POSITION LOTS
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setLotSize((prev) => Math.max(0.01, Number(prev) - 0.1).toFixed(2))
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#0A1224] border border-gray-700 text-white font-mono hover:bg-gray-800"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step="0.05"
                        value={lotSize}
                        onChange={(e) => setLotSize(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#0A1224] border border-gray-700 text-center font-mono text-sm text-white font-bold"
                      />
                      <button
                        onClick={() =>
                          setLotSize((prev) => (Number(prev) + 0.1).toFixed(2))
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#0A1224] border border-gray-700 text-white font-mono hover:bg-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Calculated Required Margin & Pip Value */}
                  <div className="p-3 rounded-xl bg-[#0A1224] border border-gray-800 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Margin Required:</span>
                      <span className="text-white">${(parseFloat(lotSize) * 200).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Pip Value (1.0 lot):</span>
                      <span className="text-[#00D9FF]">$10.00 / pip</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Book Depth Micro Ladder */}
              <div className="pt-2 border-t border-gray-800">
                <div className="text-[10px] font-mono text-gray-400 uppercase mb-2 flex justify-between">
                  <span>Depth Size</span>
                  <span>Price</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-[#FF3B69]">
                    <span>14.8 Lots</span>
                    <span>{(currentPrice + 0.4).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#FF3B69]">
                    <span>8.2 Lots</span>
                    <span>{(currentPrice + 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#00E59B]">
                    <span>22.5 Lots</span>
                    <span>{(currentPrice - 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#00E59B]">
                    <span>36.1 Lots</span>
                    <span>{(currentPrice - 0.4).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Simulated Positions Bar */}
          <div className="mt-3 p-4 bg-[#050914] rounded-2xl border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-bold text-white flex items-center gap-2">
                <span>Active Simulated Orders</span>
                <span className="px-2 py-0.5 rounded-full bg-[#087BFF]/20 text-[#00D9FF] text-[10px] font-mono">
                  {openPositions.length} Open
                </span>
              </span>
              <span className="text-xs font-mono text-[#AAB5C5]">
                Total Unrealized PnL:{' '}
                <strong
                  className={
                    openPositions.reduce((acc, p) => acc + p.pnl, 0) >= 0
                      ? 'text-[#00E59B]'
                      : 'text-[#FF3B69]'
                  }
                >
                  ${openPositions.reduce((acc, p) => acc + p.pnl, 0).toFixed(2)}
                </strong>
              </span>
            </div>

            {openPositions.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-500">
                No active simulated trades. Click BUY or SELL above to execute a paper trade.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-[10px]">
                      <th className="pb-1.5">Symbol</th>
                      <th className="pb-1.5">Side</th>
                      <th className="pb-1.5">Lots</th>
                      <th className="pb-1.5">Entry</th>
                      <th className="pb-1.5">Market</th>
                      <th className="pb-1.5">Profit / Loss</th>
                      <th className="pb-1.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {openPositions.map((pos) => (
                      <tr key={pos.id} className="hover:bg-white/5">
                        <td className="py-2 text-white font-bold">{pos.symbol}</td>
                        <td className="py-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              pos.type === 'BUY'
                                ? 'bg-[#00E59B]/20 text-[#00E59B]'
                                : 'bg-[#FF3B69]/20 text-[#FF3B69]'
                            }`}
                          >
                            {pos.type}
                          </span>
                        </td>
                        <td className="py-2 text-gray-300">{pos.lots}</td>
                        <td className="py-2 text-gray-400">{pos.entryPrice}</td>
                        <td className="py-2 text-white">{pos.currentPrice}</td>
                        <td
                          className={`py-2 font-bold ${
                            pos.pnl >= 0 ? 'text-[#00E59B]' : 'text-[#FF3B69]'
                          }`}
                        >
                          {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => closePosition(pos.id)}
                            className="px-2 py-0.5 rounded bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 text-[10px]"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
