export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
    logoUrl?: string;
    primaryBg: string;
    secondaryBg: string;
    accentBlue: string;
    accentCyan: string;
    accentGreen: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    badge: string;
    linkUrl: string;
    linkText: string;
  };
  hero: {
    headingLine1: string;
    headingLine2: string;
    headingLine3: string;
    description: string;
    primaryCtaText: string;
    primaryCtaAction: string;
    secondaryCtaText: string;
    secondaryCtaAction: string;
    stats: Array<{ label: string; value: string; change: string }>;
  };
  sections: {
    announcement: boolean;
    hero: boolean;
    marketOverview: boolean;
    tradingShowcase: boolean;
    education: boolean;
    myCourses: boolean;
    signalsCommunity: boolean;
    youtube: boolean;
    economicCalendar: boolean;
    tradingTools: boolean;
    security: boolean;
    pricing: boolean;
    testimonials: boolean;
    cta: boolean;
    footer: boolean;
  };
  community: {
    whatsappUrl: string;
    groupTitle: string;
    description: string;
    membersCount: string;
    accuracyRate: string;
    dailySignals: string;
    recentSignals: Array<{
      id: string;
      pair: string;
      type: 'BUY' | 'SELL';
      entry: string;
      tp: string;
      sl: string;
      status: 'TARGET 1 HIT' | 'TARGET 2 HIT' | 'ACTIVE' | 'CLOSED';
      pips: string;
      time: string;
    }>;
  };
  youtube: {
    channelTitle: string;
    channelUrl: string;
    subscribers: string;
    description: string;
    featuredVideos: Array<{
      id: string;
      title: string;
      views: string;
      duration: string;
      thumbnail: string;
      youtubeId: string;
      category: string;
    }>;
  };
  security: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  pricingPlans: Array<{
    id: string;
    name: string;
    priceMonthly: number;
    priceAnnual: number;
    description: string;
    popular?: boolean;
    badge?: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    review: string;
    profitHighlight: string;
    date: string;
  }>;
  footer: {
    about: string;
    email: string;
    telegramUrl: string;
    instagramUrl: string;
    twitterUrl: string;
    riskDisclaimer: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
  videoUrl?: string;
  isFreePreview?: boolean;
  summary: string;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
  category: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  modules: CourseModule[];
}

export interface UserProgress {
  enrolledCourses: string[]; // course ids
  completedLessons: Record<string, string[]>; // courseId -> lessonId[]
  quizScores: Record<string, number>;
}

export interface TradeRecord {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  lotSize: number;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  pnl: number;
  pnlPips: number;
  outcome: 'WIN' | 'LOSS' | 'BE';
  date: string;
  strategy: string;
  notes: string;
}

export interface EconomicEvent {
  id: string;
  country: string;
  countryCode: string;
  currency: string;
  title: string;
  date: string;
  time: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actual: string;
  forecast: string;
  previous: string;
  revised?: string;
}

export interface MarketInstrument {
  symbol: string;
  name: string;
  category: 'forex' | 'crypto' | 'metals' | 'indices';
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  sparkline: number[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trader';
  avatar?: string;
  joinedDate: string;
}
