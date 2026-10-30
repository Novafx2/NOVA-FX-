import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NovaLogo } from '../brand/NovaLogo';
import {
  Sun,
  Moon,
  Shield,
  User,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart2,
  GraduationCap,
  Wrench,
  Info,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    config,
    theme,
    toggleTheme,
    currentUser,
    logout,
    setIsLoginModalOpen,
    setIsAdminOpen,
    activeTab,
    setActiveTab,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: TrendingUp },
    { id: 'trading', label: 'Trading Terminal', icon: BarChart2 },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'my-courses', label: 'My Courses', icon: GraduationCap },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'about', label: 'About Us', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    // If it's a section on the home page, smooth scroll to it
    if (id === 'trading' || id === 'markets' || id === 'tools' || id === 'about') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* 1. Announcement Bar */}
      {config.sections.announcement && config.announcement.enabled && !announcementDismissed && (
        <div className="bg-gradient-to-r from-[#087BFF]/90 via-[#0A1224] to-[#00D9FF]/90 border-b border-[#087BFF]/30 text-white text-xs py-2 px-4 relative flex items-center justify-between shadow-md">
          <div className="container mx-auto flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs">
            <span className="px-2 py-0.5 rounded-full bg-[#00D9FF] text-black font-extrabold uppercase text-[10px] tracking-wider animate-pulse">
              {config.announcement.badge}
            </span>
            <span className="font-medium text-gray-200">{config.announcement.text}</span>
            <a
              href={config.announcement.linkUrl}
              onClick={() => setActiveTab('home')}
              className="font-bold text-[#00D9FF] hover:underline flex items-center gap-1 ml-1"
            >
              <span>{config.announcement.linkText}</span>
            </a>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-gray-400 hover:text-white p-1"
            title="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <nav className="glass-panel border-b border-[#087BFF]/20 px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <NovaLogo
              size="md"
              showTagline={true}
              logoUrl={config.brand.logoUrl}
            />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.id
                    ? 'text-[#00D9FF] bg-[#087BFF]/15 border border-[#087BFF]/30 shadow-sm shadow-[#087BFF]/20'
                    : 'text-[#AAB5C5] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            <a
              href="#community"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#00E59B] hover:bg-[#00E59B]/10 transition-all flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#00E59B] animate-pulse" />
              <span>Signals</span>
            </a>
          </div>

          {/* Right Action Tools & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#0A1224] border border-[#087BFF]/20 text-gray-300 hover:text-white hover:border-[#00D9FF]/40 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-300" />
              )}
            </button>

            {/* Admin Dashboard Quick Access */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#0A1224] border border-[#087BFF]/30 text-[#00D9FF] text-xs font-semibold hover:bg-[#087BFF]/20 hover:border-[#00D9FF] transition-all flex items-center gap-1.5"
              title="Open Admin CMS Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-[#087BFF]" />
              <span className="hidden xl:inline">Admin</span>
            </button>

            {/* Login or User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('my-courses')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A1224] border border-[#087BFF]/30 hover:border-[#00D9FF]"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#087BFF] to-[#00D9FF] flex items-center justify-center text-[10px] font-bold text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-white max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-red-400 font-mono px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white hover:text-[#00D9FF] transition-colors"
              >
                Login
              </button>
            )}

            {/* Get Started CTA */}
            <a
              href="#pricing"
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#087BFF]/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#0A1224] border border-gray-800 text-gray-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#0A1224] border border-[#087BFF]/30 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-[#0A1224] border-b border-[#087BFF]/30 p-6 space-y-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id
                      ? 'bg-[#087BFF]/20 text-[#00D9FF]'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
              <a
                href="#community"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#00E59B] hover:bg-[#00E59B]/10"
              >
                <span className="w-2 h-2 rounded-full bg-[#00E59B]" />
                <span>Signals Community</span>
              </a>
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-3">
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#050914] border border-[#087BFF]/30 text-[#00D9FF] text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#087BFF]" />
                <span>Admin CMS Dashboard</span>
              </button>

              {currentUser ? (
                <button
                  onClick={logout}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold"
                >
                  Sign Out ({currentUser.name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white text-xs font-bold"
                >
                  Login / Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
