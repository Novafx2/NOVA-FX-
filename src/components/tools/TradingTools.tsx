import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  Scale,
  Percent,
  BookMarked,
  BrainCircuit,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export const TradingTools: React.FC = () => {
  const { tradeRecords, addTrade, deleteTrade } = useApp();
  const [activeTool, setActiveTool] = useState<
    'position-size' | 'risk-reward' | 'risk-calculator' | 'journal' | 'quiz'
  >('position-size');

  // Tool 1: Position Size Calculator State
  const [psAccountSize, setPsAccountSize] = useState<number>(10000);
  const [psRiskPercent, setPsRiskPercent] = useState<number>(1.0);
  const [psStopLossPips, setPsStopLossPips] = useState<number>(20);
  const [psPair, setPsPair] = useState<string>('EUR/USD');

  const psDollarRisk = (psAccountSize * psRiskPercent) / 100;
  // EUR/USD standard 1 pip = $10 per lot. Gold 10 pips = $10 per 0.1 lot.
  const pipValuePerLot = psPair === 'XAU/USD' ? 10.0 : psPair === 'BTC/USD' ? 1.0 : 10.0;
  const calculatedLots = Number(
    (psDollarRisk / (psStopLossPips * pipValuePerLot || 1)).toFixed(2)
  );

  // Tool 2: Risk-to-Reward Calculator State
  const [rrDirection, setRrDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [rrEntry, setRrEntry] = useState<number>(2740.0);
  const [rrStopLoss, setRrStopLoss] = useState<number>(2732.0);
  const [rrTakeProfit, setRrTakeProfit] = useState<number>(2764.0);

  const riskDistance =
    rrDirection === 'BUY' ? Math.max(0, rrEntry - rrStopLoss) : Math.max(0, rrStopLoss - rrEntry);
  const rewardDistance =
    rrDirection === 'BUY' ? Math.max(0, rrTakeProfit - rrEntry) : Math.max(0, rrEntry - rrTakeProfit);
  const calculatedRatio = riskDistance > 0 ? (rewardDistance / riskDistance).toFixed(2) : '0';
  const breakEvenWinRate =
    parseFloat(calculatedRatio) > 0
      ? (100 / (1 + parseFloat(calculatedRatio))).toFixed(1)
      : '50.0';

  // Tool 3: Margin & Leverage Calculator State
  const [calcBalance, setCalcBalance] = useState<number>(25000);
  const [calcLeverage, setCalcLeverage] = useState<number>(100);
  const [calcLotSize, setCalcLotSize] = useState<number>(1.0);
  const requiredMargin = ((calcLotSize * 100000) / calcLeverage).toFixed(2);
  const marginLevel =
    parseFloat(requiredMargin) > 0
      ? ((calcBalance / parseFloat(requiredMargin)) * 100).toFixed(0)
      : '0';

  // Tool 4: New Trade Journal Form State
  const [newPair, setNewPair] = useState('XAU/USD');
  const [newType, setNewType] = useState<'BUY' | 'SELL'>('BUY');
  const [newLots, setNewLots] = useState(0.5);
  const [newEntry, setNewEntry] = useState(2745.0);
  const [newExit, setNewExit] = useState(2758.0);
  const [newPnl, setNewPnl] = useState(650.0);
  const [newPips, setNewPips] = useState(130);
  const [newOutcome, setNewOutcome] = useState<'WIN' | 'LOSS' | 'BE'>('WIN');
  const [newStrategy, setNewStrategy] = useState('Smart Money Order Block');
  const [newNotes, setNewNotes] = useState('Clean 15m mitigation with zero drawdown.');

  const handleCreateTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTrade({
      pair: newPair,
      type: newType,
      lotSize: newLots,
      entryPrice: newEntry,
      exitPrice: newExit,
      stopLoss: newEntry - 10,
      takeProfit: newExit,
      pnl: newPnl,
      pnlPips: newPips,
      outcome: newOutcome,
      date: new Date().toISOString().split('T')[0],
      strategy: newStrategy,
      notes: newNotes,
    });
    alert('Trade successfully logged in your persistent journal!');
  };

  // Journal Analytics Calculations
  const totalTrades = tradeRecords.length;
  const winningTrades = tradeRecords.filter((t) => t.outcome === 'WIN').length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0';
  const totalNetPnl = tradeRecords.reduce((acc, t) => acc + t.pnl, 0);

  // Tool 5: Trading Quiz State
  const quizQuestions = [
    {
      q: 'What distinguishes an institutional Order Block from retail support/resistance?',
      options: [
        'A simple moving average crossover',
        'The last counter-trend candle before an aggressive displacement creating imbalance (FVG)',
        'Any round psychological number on the chart',
        'A trendline touched at least 3 times',
      ],
      correct: 1,
      explanation:
        'Order blocks represent true institutional footprint where large orders were accumulated right before a violent displacement leaving Fair Value Gaps.',
    },
    {
      q: 'If your risk-to-reward is 1:3, what minimum win rate is needed to break even mathematically?',
      options: ['50%', '33.3%', '25%', '20%'],
      correct: 2,
      explanation: 'At a 1:3 ratio, Break-even Win Rate = 1 / (1 + 3) = 1/4 = 25%.',
    },
    {
      q: 'What is a "Liquidity Sweep" (Judas Swing) in Smart Money Concepts?',
      options: [
        'When a retail broker increases spreads at midnight',
        'When market makers drive price past key highs/lows to trigger retail stop-losses before reversing',
        'A technical indicator based on volume profile',
        'When an economic news release has zero impact',
      ],
      correct: 1,
      explanation:
        'Liquidity pools sit above swing highs (buy stops) and below swing lows (sell stops). Smart money sweeps these pools to fill institutional orders.',
    },
    {
      q: 'According to quantitative risk management, what is the maximum recommended risk per trade?',
      options: ['1% to 2% of total account capital', '10% to 15%', '5% on high confidence setups', 'Whatever leverage allows'],
      correct: 0,
      explanation:
        'Risking 1% to 2% protects your portfolio against mathematical drawdowns and consecutive losing streaks, ensuring long-term survival.',
    },
  ];

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const calculateQuizScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score += 25;
    });
    return score;
  };

  return (
    <section id="tools" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#087BFF]/15 border border-[#087BFF]/30 mb-3">
            <Calculator className="w-4 h-4 text-[#00D9FF]" />
            <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
              Quantitative Tools Suite
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Institutional Trading Tools
          </h2>
          <p className="text-base text-[#AAB5C5] mt-2">
            Calculate precise lot sizes, audit risk-to-reward ratios, maintain your verified trade journal, and test your smart money knowledge.
          </p>
        </div>

        {/* Tools Selection Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {[
            { id: 'position-size', label: 'Position Size Calculator', icon: Scale },
            { id: 'risk-reward', label: 'Risk-to-Reward Calculator', icon: Percent },
            { id: 'risk-calculator', label: 'Margin & Leverage', icon: DollarSign },
            { id: 'journal', label: 'Trading Journal', icon: BookMarked },
            { id: 'quiz', label: 'Trading Quiz', icon: BrainCircuit },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTool === tool.id
                  ? 'bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white shadow-lg shadow-[#087BFF]/30'
                  : 'bg-[#0A1224] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              <tool.icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>

        {/* TOOL 1: POSITION SIZE CALCULATOR */}
        {activeTool === 'position-size' && (
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#0A1224] border border-[#087BFF]/30 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-5">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    Position Size & Risk Calculator
                  </h3>
                  <p className="text-xs text-[#AAB5C5] mt-1">
                    Calculate exact lot sizing based on your stop-loss distance and allowed cash risk.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Account Size ($)
                    </label>
                    <input
                      type="number"
                      value={psAccountSize}
                      onChange={(e) => setPsAccountSize(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Risk Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={psRiskPercent}
                      onChange={(e) => setPsRiskPercent(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Stop Loss (Pips / Points)
                    </label>
                    <input
                      type="number"
                      value={psStopLossPips}
                      onChange={(e) => setPsStopLossPips(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Instrument
                    </label>
                    <select
                      value={psPair}
                      onChange={(e) => setPsPair(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-white"
                    >
                      <option value="EUR/USD">EUR/USD</option>
                      <option value="GBP/USD">GBP/USD</option>
                      <option value="USD/JPY">USD/JPY</option>
                      <option value="XAU/USD">XAU/USD (Gold)</option>
                      <option value="BTC/USD">BTC/USD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Output Results Card */}
              <div className="md:col-span-5 p-6 rounded-2xl bg-[#050914] border border-[#087BFF]/30 space-y-4 text-center">
                <div className="text-xs font-mono uppercase text-gray-400">Recommended Position Size</div>
                <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#00E59B] tracking-tight">
                  {calculatedLots} <span className="text-xl text-white">Lots</span>
                </div>
                <div className="pt-3 border-t border-gray-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-gray-400">
                    <span>Cash Risk Amount:</span>
                    <span className="text-[#FF3B69] font-bold">${psDollarRisk.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Account Sizing:</span>
                    <span className="text-white">${psAccountSize.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: RISK TO REWARD CALCULATOR */}
        {activeTool === 'risk-reward' && (
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#0A1224] border border-[#087BFF]/30 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-xl font-bold font-heading text-white">
                  Risk-to-Reward (R:R) Ratio Calculator
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setRrDirection('BUY')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                      rrDirection === 'BUY'
                        ? 'bg-[#00E59B] text-black shadow-md'
                        : 'bg-[#050914] text-gray-400'
                    }`}
                  >
                    LONG / BUY
                  </button>
                  <button
                    onClick={() => setRrDirection('SELL')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                      rrDirection === 'SELL'
                        ? 'bg-[#FF3B69] text-white shadow-md'
                        : 'bg-[#050914] text-gray-400'
                    }`}
                  >
                    SHORT / SELL
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      Entry Price
                    </label>
                    <input
                      type="number"
                      value={rrEntry}
                      onChange={(e) => setRrEntry(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      Stop Loss
                    </label>
                    <input
                      type="number"
                      value={rrStopLoss}
                      onChange={(e) => setRrStopLoss(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-[#FF3B69]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      Take Profit
                    </label>
                    <input
                      type="number"
                      value={rrTakeProfit}
                      onChange={(e) => setRrTakeProfit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-[#00E59B]"
                    />
                  </div>
                </div>
              </div>

              {/* R:R Ratio Result */}
              <div className="md:col-span-5 p-6 rounded-2xl bg-[#050914] border border-[#087BFF]/30 space-y-4 text-center">
                <div className="text-xs font-mono uppercase text-gray-400">Calculated R:R Ratio</div>
                <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#00D9FF]">
                  1 : {calculatedRatio}
                </div>
                <div className="pt-3 border-t border-gray-800 text-xs font-mono text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Break-even Win Rate:</span>
                    <span className="text-white font-bold">{breakEvenWinRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reward Distance:</span>
                    <span className="text-[#00E59B]">{rewardDistance.toFixed(2)} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: MARGIN CALCULATOR */}
        {activeTool === 'risk-calculator' && (
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#0A1224] border border-[#087BFF]/30 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-xl font-bold font-heading text-white">
                  Margin & Required Leverage Calculator
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      Account Equity ($)
                    </label>
                    <input
                      type="number"
                      value={calcBalance}
                      onChange={(e) => setCalcBalance(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      Broker Leverage
                    </label>
                    <select
                      value={calcLeverage}
                      onChange={(e) => setCalcLeverage(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-white"
                    >
                      <option value={30}>1:30 (Retail EU)</option>
                      <option value={100}>1:100 (Standard)</option>
                      <option value={200}>1:200</option>
                      <option value={500}>1:500 (Pro)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      Contract Volume (Lots)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={calcLotSize}
                      onChange={(e) => setCalcLotSize(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 font-mono text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 p-6 rounded-2xl bg-[#050914] border border-[#087BFF]/30 space-y-4 text-center">
                <div className="text-xs font-mono uppercase text-gray-400">Required Margin Deposit</div>
                <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#00E59B]">
                  ${requiredMargin}
                </div>
                <div className="pt-3 border-t border-gray-800 text-xs font-mono text-gray-400 flex justify-between">
                  <span>Margin Level Health:</span>
                  <span className="text-[#00D9FF] font-bold">{marginLevel}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 4: TRADING JOURNAL */}
        {activeTool === 'journal' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20">
                <div className="text-xs font-mono text-gray-400">Total Logged Trades</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">{totalTrades}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20">
                <div className="text-xs font-mono text-gray-400">Win Rate</div>
                <div className="text-2xl font-bold font-mono text-[#00E59B] mt-1">{winRate}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20">
                <div className="text-xs font-mono text-gray-400">Net Realized PnL</div>
                <div className="text-2xl font-bold font-mono text-[#00E59B] mt-1">
                  +${totalNetPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20">
                <div className="text-xs font-mono text-gray-400">Profit Factor</div>
                <div className="text-2xl font-bold font-mono text-[#00D9FF] mt-1">2.84</div>
              </div>
            </div>

            {/* Quick Log Form */}
            <form
              onSubmit={handleCreateTrade}
              className="p-6 rounded-3xl bg-[#0A1224] border border-[#087BFF]/30 space-y-4"
            >
              <h4 className="font-heading font-bold text-white text-base">
                Log New Trade into Persistent Journal
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">Pair</label>
                  <input
                    type="text"
                    value={newPair}
                    onChange={(e) => setNewPair(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">Side</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">Lots</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLots}
                    onChange={(e) => setNewLots(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">PnL ($)</label>
                  <input
                    type="number"
                    value={newPnl}
                    onChange={(e) => setNewPnl(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-[#00E59B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">Outcome</label>
                  <select
                    value={newOutcome}
                    onChange={(e: any) => setNewOutcome(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                  >
                    <option value="WIN">WIN</option>
                    <option value="LOSS">LOSS</option>
                    <option value="BE">BE</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-[#087BFF] hover:bg-[#00D9FF] text-white hover:text-black font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Trade</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Trades History Table */}
            <div className="rounded-3xl bg-[#0A1224] border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-[#050914] border-b border-gray-800 text-gray-400 text-[10px] uppercase">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Instrument</th>
                      <th className="py-3 px-4">Side</th>
                      <th className="py-3 px-4">Lots</th>
                      <th className="py-3 px-4">Strategy</th>
                      <th className="py-3 px-4">Profit / Loss</th>
                      <th className="py-3 px-4">Outcome</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/80">
                    {tradeRecords.map((trade) => (
                      <tr key={trade.id} className="hover:bg-white/5">
                        <td className="py-3 px-4 text-gray-400">{trade.date}</td>
                        <td className="py-3 px-4 font-bold text-white">{trade.pair}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              trade.type === 'BUY'
                                ? 'bg-[#00E59B]/20 text-[#00E59B]'
                                : 'bg-[#FF3B69]/20 text-[#FF3B69]'
                            }`}
                          >
                            {trade.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{trade.lotSize}</td>
                        <td className="py-3 px-4 text-gray-300 font-sans">{trade.strategy}</td>
                        <td
                          className={`py-3 px-4 font-bold ${
                            trade.pnl >= 0 ? 'text-[#00E59B]' : 'text-[#FF3B69]'
                          }`}
                        >
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              trade.outcome === 'WIN'
                                ? 'bg-[#00E59B]/20 text-[#00E59B]'
                                : 'bg-[#FF3B69]/20 text-[#FF3B69]'
                            }`}
                          >
                            {trade.outcome}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deleteTrade(trade.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 5: TRADING QUIZ */}
        {activeTool === 'quiz' && (
          <div className="max-w-3xl mx-auto rounded-3xl bg-[#0A1224] border border-[#087BFF]/30 p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Institutional Smart Money Aptitude Quiz
                </h3>
                <p className="text-xs text-[#AAB5C5] mt-1">
                  Test your technical edge, order block identification, and mathematical survival rules.
                </p>
              </div>
              {quizSubmitted && (
                <div className="px-4 py-2 rounded-xl bg-[#00E59B]/20 border border-[#00E59B] text-[#00E59B] font-mono font-bold text-sm">
                  Score: {calculateQuizScore()}%
                </div>
              )}
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-3 p-4 rounded-2xl bg-[#050914] border border-gray-800">
                  <div className="text-sm font-semibold text-white">
                    {qIdx + 1}. {q.q}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = quizAnswers[qIdx] === optIdx;
                      const isCorrect = q.correct === optIdx;

                      let btnStyle = 'bg-[#0A1224] border-gray-800 text-gray-300 hover:border-gray-700';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-[#00E59B]/20 border-[#00E59B] text-[#00E59B]';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'bg-[#FF3B69]/20 border-[#FF3B69] text-[#FF3B69]';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-[#087BFF]/20 border-[#087BFF] text-white';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                          className={`w-full text-left p-3 rounded-xl text-xs border transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-[#00E59B] shrink-0" />
                          )}
                          {quizSubmitted && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-[#FF3B69] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="text-[11px] text-[#AAB5C5] mt-2 pt-2 border-t border-gray-800 font-mono">
                      💡 Explanation: {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              {quizSubmitted ? (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#087BFF] text-white text-xs font-bold"
                >
                  Retake Quiz
                </button>
              ) : (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white text-xs font-bold hover:brightness-110 ml-auto"
                >
                  Submit & Check Answers
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
