/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { MarketOverview } from './components/markets/MarketOverview';
import { TradingPlatformShowcase } from './components/trading/TradingPlatformShowcase';
import { TradingEducation } from './components/education/TradingEducation';
import { MyCourseDashboard } from './components/mycourses/MyCourseDashboard';
import { SignalsCommunity } from './components/community/SignalsCommunity';
import { YouTubeSection } from './components/youtube/YouTubeSection';
import { EconomicCalendar } from './components/calendar/EconomicCalendar';
import { TradingTools } from './components/tools/TradingTools';
import { SecurityTrustSection } from './components/security/SecurityTrustSection';
import { PricingSection } from './components/pricing/PricingSection';
import { TestimonialsSection } from './components/testimonials/TestimonialsSection';
import { FinalCtaSection } from './components/cta/FinalCtaSection';
import { Footer } from './components/footer/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginModal } from './components/auth/LoginModal';

function MainLayout() {
  const { config, activeTab, isAdminOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#050914] text-white selection:bg-[#087BFF] selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Body: Switch between LMS View and Platform Showcase */}
      <main className="flex-1">
        {activeTab === 'my-courses' ? (
          <MyCourseDashboard />
        ) : (
          <>
            {config.sections.hero && <HeroSection />}
            {config.sections.marketOverview && <MarketOverview />}
            {config.sections.tradingShowcase && <TradingPlatformShowcase />}
            {config.sections.education && <TradingEducation />}
            {config.sections.signalsCommunity && <SignalsCommunity />}
            {config.sections.youtube && <YouTubeSection />}
            {config.sections.economicCalendar && <EconomicCalendar />}
            {config.sections.tradingTools && <TradingTools />}
            {config.sections.security && <SecurityTrustSection />}
            {config.sections.pricing && <PricingSection />}
            {config.sections.testimonials && <TestimonialsSection />}
            {config.sections.cta && <FinalCtaSection />}
          </>
        )}
      </main>

      {/* Footer */}
      {config.sections.footer && <Footer />}

      {/* Admin Dashboard CMS Modal / Drawer */}
      {isAdminOpen && <AdminDashboard />}

      {/* Login & Authentication Modal */}
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
