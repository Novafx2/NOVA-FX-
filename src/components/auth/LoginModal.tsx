import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NovaLogo } from '../brand/NovaLogo';
import { Lock, Mail, X, Shield, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, setIsAdminOpen } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleMode, setRoleMode] = useState<'trader' | 'admin'>('trader');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setIsLoginModalOpen(false);
      if (email.toLowerCase().includes('admin')) {
        setIsAdminOpen(true);
      }
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const setDemoTrader = () => {
    setEmail('trader@novafx.com');
    setPassword('trader123');
    setRoleMode('trader');
  };

  const setDemoAdmin = () => {
    setEmail('admin@novafx.com');
    setPassword('nova2026!');
    setRoleMode('admin');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0A1224] border border-[#087BFF]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <NovaLogo size="md" showTagline={true} />
          <h2 className="text-xl font-bold font-heading text-white mt-4">
            Welcome to NOVA FX
          </h2>
          <p className="text-xs text-[#AAB5C5] mt-1">
            Access your courses, trading journal, and institutional analytics.
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="p-1 rounded-xl bg-[#050914] border border-gray-800 grid grid-cols-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setRoleMode('trader');
              setDemoTrader();
            }}
            className={`py-2 rounded-lg transition-all ${
              roleMode === 'trader'
                ? 'bg-[#087BFF] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trader Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleMode('admin');
              setDemoAdmin();
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              roleMode === 'admin'
                ? 'bg-[#00D9FF] text-black shadow-sm font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleMode === 'admin' ? 'admin@novafx.com' : 'trader@novafx.com'}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white focus:outline-none focus:border-[#087BFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white focus:outline-none focus:border-[#087BFF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#087BFF]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to NOVA FX'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-4 border-t border-gray-800 text-center space-y-2">
          <p className="text-[11px] text-gray-400">Quick-Fill Demo Credentials:</p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={setDemoTrader}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-mono"
            >
              Demo Trader
            </button>
            <button
              type="button"
              onClick={setDemoAdmin}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#087BFF]/20 hover:bg-[#087BFF]/30 text-[#00D9FF] font-mono font-semibold"
            >
              Master Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
