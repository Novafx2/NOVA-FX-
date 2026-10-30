import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NovaLogo } from '../brand/NovaLogo';
import type { Course, EconomicEvent, SiteConfig } from '../../types';
import {
  Shield,
  Save,
  RotateCcw,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Layout,
  BookOpen,
  DollarSign,
  MessageSquare,
  Video,
  Calendar,
  Lock,
  Layers,
  Sparkles,
  Database,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    config,
    updateConfig,
    courses,
    saveCourse,
    deleteCourse,
    economicEvents,
    saveEconomicEvent,
    deleteEconomicEvent,
    currentUser,
    login,
    logout,
    resetAllData,
    setIsAdminOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'branding'
    | 'hero'
    | 'sections'
    | 'courses'
    | 'community'
    | 'youtube'
    | 'calendar'
    | 'pricing'
    | 'testimonials'
    | 'database'
  >('branding');

  // Preview state
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Form states initialized with current config
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Course editing state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Economic event editing state
  const [editingEvent, setEditingEvent] = useState<EconomicEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Login form for admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = await login(adminEmail, adminPass);
    if (!result.success) {
      setLoginError(result.error || 'Authentication failed');
    }
  };

  const handleQuickAdminLogin = async () => {
    setAdminEmail('admin@novafx.com');
    setAdminPass('nova2026!');
    const result = await login('admin@novafx.com', 'nova2026!');
    if (!result.success) {
      setLoginError(result.error || 'Authentication failed');
    }
  };

  const handleSaveConfig = async () => {
    setSaveStatus('Saving to persistent database...');
    const success = await updateConfig(formData);
    if (success) {
      setSaveStatus('All changes saved to persistent storage!');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('Failed to persist changes');
    }
  };

  // Image upload simulation to base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({
            ...prev,
            brand: { ...prev.brand, logoUrl: reader.result as string },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // If user is not admin, show secure login barrier
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="w-full max-w-md bg-[#0A1224] border border-[#087BFF]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#087BFF] to-[#00D9FF] flex items-center justify-center mb-3 shadow-lg shadow-[#087BFF]/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">NOVA FX Admin Security</h2>
            <p className="text-sm text-[#AAB5C5] mt-1">
              Role-based access required to customize website architecture and settings.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@novafx.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-gray-700 text-white text-sm focus:outline-none focus:border-[#087BFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-gray-700 text-white text-sm focus:outline-none focus:border-[#087BFF]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#087BFF]/30"
            >
              Authenticate & Unlock Admin Panel
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-400 mb-2">Development Demo Access:</p>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#087BFF]/20 text-[#00D9FF] hover:bg-[#087BFF]/30 font-mono transition-colors"
            >
              Auto-Fill & Login as Master Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050914] text-white flex flex-col overflow-hidden">
      {/* Top Admin Header Bar */}
      <header className="h-16 px-6 bg-[#0A1224] border-b border-[#087BFF]/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <NovaLogo size="sm" showTagline={false} logoUrl={formData.brand.logoUrl} />
          <div className="h-5 w-px bg-gray-700" />
          <span className="px-2.5 py-0.5 rounded-md bg-[#087BFF]/20 border border-[#087BFF]/40 text-[#00D9FF] text-xs font-mono font-semibold">
            ADMINISTRATOR CMS
          </span>
          <span className="text-xs text-[#AAB5C5] hidden md:inline">
            Logged in as <strong className="text-white">{currentUser.name}</strong>
          </span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          {saveStatus && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00E59B]/10 border border-[#00E59B]/30 text-[#00E59B] text-xs font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              {saveStatus}
            </div>
          )}

          {/* Toggle Live Preview */}
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              showLivePreview
                ? 'bg-[#087BFF] text-white border-[#087BFF] shadow-lg shadow-[#087BFF]/30'
                : 'bg-[#050914] text-[#AAB5C5] border-gray-700 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Live Preview</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveConfig}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#087BFF]/30 hover:brightness-110 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>

          {/* Close Admin Button */}
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-xl bg-[#050914] border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            title="Exit Admin Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace (Split or Full Width) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Tabs Sidebar */}
        <nav className="w-64 bg-[#0A1224]/80 border-r border-[#087BFF]/15 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'branding'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Brand & Styling</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'hero'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Hero & Headings</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'sections'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Section Visibility</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'courses'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses CMS</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'community'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp & Community</span>
            </button>

            <button
              onClick={() => setActiveTab('youtube')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'youtube'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>YouTube Academy</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'calendar'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Economic Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'pricing'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Pricing Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'database'
                  ? 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#087BFF]/40'
                  : 'text-[#AAB5C5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Database & Cloud Sync</span>
            </button>
          </div>

          <div className="mt-auto p-4 border-t border-gray-800">
            <button
              onClick={logout}
              className="w-full py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all text-center"
            >
              Sign Out of Admin
            </button>
          </div>
        </nav>

        {/* Editor Form View */}
        <main className={`flex-1 p-6 overflow-y-auto ${showLivePreview ? 'w-1/2' : 'w-full'}`}>
          {/* TAB 1: BRANDING & STYLING */}
          {activeTab === 'branding' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading">Brand Identity & Styling</h3>
                <p className="text-xs text-[#AAB5C5] mt-1">
                  Customize logo, brand colors, typography, and top announcement banner.
                </p>
              </div>

              {/* Logo Settings */}
              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <h4 className="text-sm font-semibold text-white">Logo Customization</h4>
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-xl bg-[#050914] border border-gray-800 flex items-center justify-center">
                    <NovaLogo size="md" showTagline={false} logoUrl={formData.brand.logoUrl} />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="block text-xs text-[#AAB5C5]">Custom Logo Image URL (or upload below)</label>
                    <input
                      type="text"
                      value={formData.brand.logoUrl || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand: { ...formData.brand, logoUrl: e.target.value },
                        })
                      }
                      placeholder="Leave blank to use default transparent vector NOVA FX logo"
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                    />
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#087BFF]/20 border border-[#087BFF]/40 text-[#00D9FF] text-xs font-medium hover:bg-[#087BFF]/30 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Logo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      {formData.brand.logoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              brand: { ...formData.brand, logoUrl: '' },
                            })
                          }
                          className="text-xs text-red-400 hover:underline"
                        >
                          Reset to Vector Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-800">
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={formData.brand.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand: { ...formData.brand, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Brand Tagline</label>
                    <input
                      type="text"
                      value={formData.brand.tagline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand: { ...formData.brand, tagline: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Color Palette */}
              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <h4 className="text-sm font-semibold text-white">Color Palette & Accents</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Primary Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.brand.primaryBg}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand: { ...formData.brand, primaryBg: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs">{formData.brand.primaryBg}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Electric Blue Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.brand.accentBlue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand: { ...formData.brand, accentBlue: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs">{formData.brand.accentBlue}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Cyan Secondary Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.brand.accentCyan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand: { ...formData.brand, accentCyan: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs">{formData.brand.accentCyan}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">Top Announcement Bar</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.announcement.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          announcement: { ...formData.announcement, enabled: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087BFF]" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={formData.announcement.badge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          announcement: { ...formData.announcement, badge: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#AAB5C5] mb-1">Announcement Message</label>
                    <input
                      type="text"
                      value={formData.announcement.text}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          announcement: { ...formData.announcement, text: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & HEADINGS */}
          {activeTab === 'hero' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading">Hero Section Customization</h3>
                <p className="text-xs text-[#AAB5C5] mt-1">
                  Control main headings, descriptions, buttons and performance statistics.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Headline Line 1</label>
                    <input
                      type="text"
                      value={formData.hero.headingLine1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headingLine1: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Headline Line 2</label>
                    <input
                      type="text"
                      value={formData.hero.headingLine2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headingLine2: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Headline Line 3</label>
                    <input
                      type="text"
                      value={formData.hero.headingLine3}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headingLine3: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#AAB5C5] mb-1">Hero Description</label>
                  <textarea
                    rows={3}
                    value={formData.hero.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-800">
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      value={formData.hero.primaryCtaText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, primaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Secondary Button Text</label>
                    <input
                      type="text"
                      value={formData.hero.secondaryCtaText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, secondaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Stats */}
              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <h4 className="text-sm font-semibold text-white">Performance Metrics Counters</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.hero.stats.map((stat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#050914] border border-gray-800 space-y-1">
                      <div className="text-[10px] text-gray-400 uppercase">{stat.label}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...formData.hero.stats];
                            newStats[idx].value = e.target.value;
                            setFormData({ ...formData, hero: { ...formData.hero, stats: newStats } });
                          }}
                          className="px-2 py-1 rounded bg-[#0A1224] border border-gray-700 text-xs font-bold text-[#00E59B]"
                        />
                        <input
                          type="text"
                          value={stat.change}
                          onChange={(e) => {
                            const newStats = [...formData.hero.stats];
                            newStats[idx].change = e.target.value;
                            setFormData({ ...formData, hero: { ...formData.hero, stats: newStats } });
                          }}
                          className="px-2 py-1 rounded bg-[#0A1224] border border-gray-700 text-xs text-gray-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECTION VISIBILITY */}
          {activeTab === 'sections' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading">Section Visibility Manager</h3>
                <p className="text-xs text-[#AAB5C5] mt-1">
                  Instantly enable or disable any section across the entire NOVA FX website.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 divide-y divide-gray-800">
                {Object.entries(formData.sections).map(([secKey, isEnabled]) => (
                  <div key={secKey} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div>
                      <div className="text-sm font-medium capitalize text-white">
                        {secKey.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {isEnabled ? 'Currently displayed on the live website' : 'Hidden from public visitors'}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sections: {
                              ...formData.sections,
                              [secKey]: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E59B]" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COURSES CMS */}
          {activeTab === 'courses' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading">Trading Courses CMS</h3>
                  <p className="text-xs text-[#AAB5C5] mt-1">
                    Manage syllabus, modules, video lessons, levels, and thumbnails.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCourse({
                      id: 'course-' + Date.now(),
                      title: 'New Trading Masterclass',
                      slug: 'new-course-' + Date.now(),
                      level: 'Intermediate',
                      category: 'Strategy',
                      duration: '3h 30m',
                      lessonsCount: 8,
                      rating: 5.0,
                      reviewsCount: 12,
                      studentsCount: 150,
                      shortDescription: 'Master institutional strategies and risk setups.',
                      fullDescription: 'Comprehensive deep dive curriculum.',
                      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
                      instructor: {
                        name: 'Lead Trader',
                        role: 'Senior Market Strategist',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
                      },
                      modules: [],
                    });
                    setIsCourseModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white text-xs font-semibold flex items-center gap-2 hover:brightness-110"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>
              </div>

              {/* Courses Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#087BFF]/20 text-[#00D9FF]">
                          {course.level}
                        </span>
                        <span className="text-xs text-gray-400">{course.duration}</span>
                      </div>
                      <h4 className="font-heading font-bold text-white text-base">{course.title}</h4>
                      <p className="text-xs text-[#AAB5C5] line-clamp-2 mt-1">
                        {course.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                      <div className="text-xs text-gray-400">
                        {course.lessonsCount} lessons • {course.studentsCount} students
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setIsCourseModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#087BFF]/10 text-[#00D9FF] hover:bg-[#087BFF]/30"
                          title="Edit Course"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WHATSAPP & COMMUNITY */}
          {activeTab === 'community' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading">Signals Community & WhatsApp</h3>
                <p className="text-xs text-[#AAB5C5] mt-1">
                  Configure your WhatsApp community URL, group title, and recent signals showcase.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <div className="p-3 rounded-xl bg-[#00E59B]/10 border border-[#00E59B]/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00E59B] text-black font-bold flex items-center justify-center shrink-0">
                    WA
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#00E59B]">Configurable WhatsApp Community Link</div>
                    <div className="text-[11px] text-gray-300">
                      This exact URL will open whenever users click the WhatsApp button on the website.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#AAB5C5] mb-1">WhatsApp Group / Invite URL</label>
                  <input
                    type="url"
                    value={formData.community.whatsappUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        community: { ...formData.community, whatsappUrl: e.target.value },
                      })
                    }
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-[#00E59B]/40 text-sm text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Group Name</label>
                    <input
                      type="text"
                      value={formData.community.groupTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          community: { ...formData.community, groupTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Members Count</label>
                    <input
                      type="text"
                      value={formData.community.membersCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          community: { ...formData.community, membersCount: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Claimed Accuracy</label>
                    <input
                      type="text"
                      value={formData.community.accuracyRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          community: { ...formData.community, accuracyRate: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: YOUTUBE ACADEMY */}
          {activeTab === 'youtube' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading">YouTube Channel Integration</h3>
                <p className="text-xs text-[#AAB5C5] mt-1">
                  Configure YouTube channel URL, description, subscriber metrics and featured videos.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <div>
                  <label className="block text-xs text-[#AAB5C5] mb-1">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={formData.youtube.channelUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        youtube: { ...formData.youtube, channelUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Channel Name</label>
                    <input
                      type="text"
                      value={formData.youtube.channelTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          youtube: { ...formData.youtube, channelTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAB5C5] mb-1">Subscribers Count</label>
                    <input
                      type="text"
                      value={formData.youtube.subscribers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          youtube: { ...formData.youtube, subscribers: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#AAB5C5] mb-1">Channel Description</label>
                  <textarea
                    rows={2}
                    value={formData.youtube.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        youtube: { ...formData.youtube, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ECONOMIC CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading">Economic Calendar Settings</h3>
                  <p className="text-xs text-[#AAB5C5] mt-1">
                    Manage Forex Factory style events, impact levels, currencies, and forecasts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingEvent({
                      id: 'eco-' + Date.now(),
                      country: 'United States',
                      countryCode: 'US',
                      currency: 'USD',
                      title: 'CPI Inflation Rate (YoY)',
                      date: 'Today',
                      time: '12:30 UTC',
                      impact: 'HIGH',
                      actual: 'Pending',
                      forecast: '2.4%',
                      previous: '2.5%',
                    });
                    setIsEventModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#087BFF] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Event
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 font-mono">
                      <th className="pb-2">Time / Date</th>
                      <th className="pb-2">Currency</th>
                      <th className="pb-2">Event Title</th>
                      <th className="pb-2">Impact</th>
                      <th className="pb-2">Actual</th>
                      <th className="pb-2">Forecast</th>
                      <th className="pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {economicEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-white/5">
                        <td className="py-2.5 font-mono">{event.time} ({event.date})</td>
                        <td className="py-2.5 font-bold text-white">{event.currency}</td>
                        <td className="py-2.5 text-gray-200">{event.title}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              event.impact === 'HIGH'
                                ? 'bg-red-500/20 text-red-400'
                                : event.impact === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {event.impact}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-[#00E59B]">{event.actual}</td>
                        <td className="py-2.5 font-mono text-gray-400">{event.forecast}</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => deleteEconomicEvent(event.id)}
                            className="text-red-400 hover:text-red-300"
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
          )}

          {/* TAB 8: PRICING PLANS */}
          {activeTab === 'pricing' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading">Pricing Plans Manager</h3>
                <p className="text-xs text-[#AAB5C5] mt-1">
                  Customize plan names, monthly/annual fees, feature bullets and button targets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.pricingPlans.map((plan, idx) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-3"
                  >
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase">Plan Name</label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const newPlans = [...formData.pricingPlans];
                          newPlans[idx].name = e.target.value;
                          setFormData({ ...formData, pricingPlans: newPlans });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-sm font-bold text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase">Monthly ($)</label>
                        <input
                          type="number"
                          value={plan.priceMonthly}
                          onChange={(e) => {
                            const newPlans = [...formData.pricingPlans];
                            newPlans[idx].priceMonthly = Number(e.target.value);
                            setFormData({ ...formData, pricingPlans: newPlans });
                          }}
                          className="w-full px-2 py-1 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase">Annual ($)</label>
                        <input
                          type="number"
                          value={plan.priceAnnual}
                          onChange={(e) => {
                            const newPlans = [...formData.pricingPlans];
                            newPlans[idx].priceAnnual = Number(e.target.value);
                            setFormData({ ...formData, pricingPlans: newPlans });
                          }}
                          className="w-full px-2 py-1 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase">Description</label>
                      <textarea
                        rows={2}
                        value={plan.description}
                        onChange={(e) => {
                          const newPlans = [...formData.pricingPlans];
                          newPlans[idx].description = e.target.value;
                          setFormData({ ...formData, pricingPlans: newPlans });
                        }}
                        className="w-full px-2 py-1 rounded-lg bg-[#050914] border border-gray-700 text-xs text-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase">Button Label</label>
                      <input
                        type="text"
                        value={plan.buttonText}
                        onChange={(e) => {
                          const newPlans = [...formData.pricingPlans];
                          newPlans[idx].buttonText = e.target.value;
                          setFormData({ ...formData, pricingPlans: newPlans });
                        }}
                        className="w-full px-2 py-1 rounded-lg bg-[#050914] border border-gray-700 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: DATABASE & CLOUD SYNC */}
          {activeTab === 'database' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading">Database & External Integrations</h3>
                <p className="text-xs text-[#AAB5C5] mt-1">
                  Manage persistent data storage, export/import backups, and configure external services.
                </p>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-[#00E59B]/10 border border-[#00E59B]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00E59B]/20 text-[#00E59B] flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Full-Stack Persistent Backend Active</div>
                    <div className="text-xs text-[#AAB5C5]">
                      Server stores all modifications in <code className="text-[#00D9FF]">/data/nova_db.json</code>
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#00E59B] text-black text-xs font-bold font-mono">
                  ONLINE
                </span>
              </div>

              {/* Backup & Export Actions */}
              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <h4 className="text-sm font-semibold text-white">Data Backup & Factory Reset</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/api/db/export"
                    download="nova_fx_backup.json"
                    className="px-4 py-2 rounded-xl bg-[#087BFF]/20 border border-[#087BFF]/40 text-[#00D9FF] text-xs font-semibold hover:bg-[#087BFF]/30 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Download JSON Database Backup
                  </a>
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to reset all data to pristine factory defaults?')) {
                        await resetAllData();
                        alert('NOVA FX database reset to default!');
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Factory Defaults
                  </button>
                </div>
              </div>

              {/* Supabase & Firebase Integration Screen */}
              <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 space-y-4">
                <h4 className="text-sm font-semibold text-white">External Database Connectors</h4>
                <p className="text-xs text-gray-400">
                  Ready to link with enterprise cloud databases (Supabase / Firebase Firestore):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#050914] border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Supabase PostgreSQL</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400">Ready</span>
                    </div>
                    <input
                      type="text"
                      placeholder="SUPABASE_URL (e.g. https://xyz.supabase.co)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0A1224] border border-gray-700 text-xs font-mono"
                    />
                    <input
                      type="password"
                      placeholder="SUPABASE_ANON_KEY"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0A1224] border border-gray-700 text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#050914] border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Firebase Firestore</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400">Ready</span>
                    </div>
                    <input
                      type="text"
                      placeholder="FIREBASE_PROJECT_ID"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0A1224] border border-gray-700 text-xs font-mono"
                    />
                    <input
                      type="password"
                      placeholder="FIREBASE_API_KEY"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0A1224] border border-gray-700 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Live Website Preview Frame (If enabled) */}
        {showLivePreview && (
          <aside className="w-1/2 bg-[#050914] border-l border-[#087BFF]/20 flex flex-col">
            <div className="h-10 px-4 bg-[#0A1224] border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">LIVE PREVIEW</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-[#087BFF] text-white' : 'text-gray-400'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1 rounded ${previewDevice === 'tablet' ? 'bg-[#087BFF] text-white' : 'text-gray-400'}`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-[#087BFF] text-white' : 'text-gray-400'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-3 bg-black/50 flex items-center justify-center overflow-hidden">
              <div
                className={`h-full bg-[#050914] rounded-xl border border-gray-800 shadow-2xl overflow-y-auto transition-all ${
                  previewDevice === 'desktop'
                    ? 'w-full'
                    : previewDevice === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[375px]'
                }`}
              >
                {/* Live Preview Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <NovaLogo size="sm" logoUrl={formData.brand.logoUrl} />
                  <span className="text-xs text-[#00E59B] font-mono">● LIVE</span>
                </div>
                <div className="p-6 text-center">
                  <h1 className="text-2xl font-bold font-heading text-white">
                    {formData.hero.headingLine1} <br />
                    <span className="bg-gradient-to-r from-[#087BFF] to-[#00D9FF] bg-clip-text text-transparent">
                      {formData.hero.headingLine2}
                    </span>
                  </h1>
                  <p className="text-xs text-gray-300 mt-2 max-w-sm mx-auto">
                    {formData.hero.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button className="px-3 py-1.5 rounded-lg bg-[#087BFF] text-white text-xs font-semibold">
                      {formData.hero.primaryCtaText}
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-white">
                      {formData.hero.secondaryCtaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Course Edit Modal */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0A1224] border border-[#087BFF]/30 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading">
                {editingCourse.id ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={(e: any) =>
                      setEditingCourse({ ...editingCourse, level: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Mastery">Mastery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editingCourse.thumbnail}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, thumbnail: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingCourse.shortDescription}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-700 text-xs text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await saveCourse(editingCourse);
                  setIsCourseModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#087BFF] text-white text-xs font-semibold hover:brightness-110"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Economic Event Modal */}
      {isEventModalOpen && editingEvent && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A1224] border border-[#087BFF]/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading">Add / Edit Economic Event</h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Event Title</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Currency</label>
                  <input
                    type="text"
                    value={editingEvent.currency}
                    onChange={(e) => setEditingEvent({ ...editingEvent, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Impact</label>
                  <select
                    value={editingEvent.impact}
                    onChange={(e: any) =>
                      setEditingEvent({ ...editingEvent, impact: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-gray-700 text-xs text-white"
                  >
                    <option value="HIGH">HIGH (Red)</option>
                    <option value="MEDIUM">MEDIUM (Orange)</option>
                    <option value="LOW">LOW (Gray)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Time</label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Forecast</label>
                  <input
                    type="text"
                    value={editingEvent.forecast}
                    onChange={(e) => setEditingEvent({ ...editingEvent, forecast: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Previous</label>
                  <input
                    type="text"
                    value={editingEvent.previous}
                    onChange={(e) => setEditingEvent({ ...editingEvent, previous: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#050914] border border-gray-700 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-700 text-xs text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await saveEconomicEvent(editingEvent);
                  setIsEventModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#087BFF] text-white text-xs font-semibold"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
