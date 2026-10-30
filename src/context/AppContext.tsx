import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SiteConfig, Course, EconomicEvent, TradeRecord, UserProgress, UserProfile } from '../types';
import {
  initialSiteConfig,
  initialCourses,
  initialEconomicEvents,
  initialTradeRecords,
} from '../data/defaultData';

interface AppContextType {
  config: SiteConfig;
  courses: Course[];
  economicEvents: EconomicEvent[];
  tradeRecords: TradeRecord[];
  userProgress: UserProgress;
  currentUser: UserProfile | null;
  activeTab: string;
  theme: 'dark' | 'light';
  isLoginModalOpen: boolean;
  isAdminOpen: boolean;
  selectedCourseForModal: Course | null;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setIsLoginModalOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setSelectedCourseForModal: (course: Course | null) => void;
  updateConfig: (newConfig: Partial<SiteConfig>) => Promise<boolean>;
  saveCourse: (course: Course) => Promise<boolean>;
  deleteCourse: (id: string) => Promise<boolean>;
  enrollInCourse: (courseId: string) => Promise<boolean>;
  toggleLessonComplete: (courseId: string, lessonId: string) => Promise<boolean>;
  addTrade: (trade: Omit<TradeRecord, 'id'>) => Promise<boolean>;
  deleteTrade: (id: string) => Promise<boolean>;
  saveEconomicEvent: (event: EconomicEvent) => Promise<boolean>;
  deleteEconomicEvent: (id: string) => Promise<boolean>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetAllData: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('nova_config');
    return saved ? JSON.parse(saved) : initialSiteConfig;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('nova_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>(() => {
    const saved = localStorage.getItem('nova_calendar');
    return saved ? JSON.parse(saved) : initialEconomicEvents;
  });

  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>(() => {
    const saved = localStorage.getItem('nova_trades');
    return saved ? JSON.parse(saved) : initialTradeRecords;
  });

  const [userProgress, setUserProgress] = useState<UserProgress>({
    enrolledCourses: ['course-binary', 'course-smc'],
    completedLessons: {
      'course-binary': ['l1', 'l2'],
      'course-smc': ['l-smc-1'],
    },
    quizScores: { 'course-binary': 90 },
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Initial Fetch from persistent Express backend
  useEffect(() => {
    async function fetchServerData() {
      try {
        const [configRes, coursesRes, calendarRes, tradesRes, progressRes] = await Promise.allSettled([
          fetch('/api/config'),
          fetch('/api/courses'),
          fetch('/api/calendar'),
          fetch('/api/trades'),
          fetch('/api/progress?userId=' + (currentUser?.id || 'guest')),
        ]);

        if (configRes.status === 'fulfilled' && configRes.value.ok) {
          const data = await configRes.value.json();
          setConfig(data);
          localStorage.setItem('nova_config', JSON.stringify(data));
        }

        if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
          const data = await coursesRes.value.json();
          setCourses(data);
          localStorage.setItem('nova_courses', JSON.stringify(data));
        }

        if (calendarRes.status === 'fulfilled' && calendarRes.value.ok) {
          const data = await calendarRes.value.json();
          setEconomicEvents(data);
          localStorage.setItem('nova_calendar', JSON.stringify(data));
        }

        if (tradesRes.status === 'fulfilled' && tradesRes.value.ok) {
          const data = await tradesRes.value.json();
          setTradeRecords(data);
          localStorage.setItem('nova_trades', JSON.stringify(data));
        }

        if (progressRes.status === 'fulfilled' && progressRes.value.ok) {
          const data = await progressRes.value.json();
          setUserProgress(data);
        }
      } catch (err) {
        console.warn('Backend server not connected yet, using local state persistence:', err);
      }
    }

    fetchServerData();
  }, [currentUser?.id]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateConfig = async (newConfig: Partial<SiteConfig>): Promise<boolean> => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('nova_config', JSON.stringify(updated));

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      return res.ok;
    } catch {
      return true; // saved locally
    }
  };

  const saveCourse = async (courseToSave: Course): Promise<boolean> => {
    const exists = courses.some((c) => c.id === courseToSave.id);
    let updatedCourses: Course[];
    if (exists) {
      updatedCourses = courses.map((c) => (c.id === courseToSave.id ? courseToSave : c));
    } else {
      updatedCourses = [courseToSave, ...courses];
    }
    setCourses(updatedCourses);
    localStorage.setItem('nova_courses', JSON.stringify(updatedCourses));

    try {
      const endpoint = exists ? `/api/courses/${courseToSave.id}` : '/api/courses';
      const method = exists ? 'PUT' : 'POST';
      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseToSave),
      });
      return true;
    } catch {
      return true;
    }
  };

  const deleteCourse = async (id: string): Promise<boolean> => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    localStorage.setItem('nova_courses', JSON.stringify(updated));

    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return true;
    }
  };

  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    if (!userProgress.enrolledCourses.includes(courseId)) {
      const updated: UserProgress = {
        ...userProgress,
        enrolledCourses: [...userProgress.enrolledCourses, courseId],
      };
      setUserProgress(updated);

      try {
        await fetch(`/api/courses/${courseId}/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser?.id || 'guest' }),
        });
      } catch (err) {
        console.warn('Enrollment offline:', err);
      }
    }
    return true;
  };

  const toggleLessonComplete = async (courseId: string, lessonId: string): Promise<boolean> => {
    const currentCompleted = userProgress.completedLessons[courseId] || [];
    const isCompleted = currentCompleted.includes(lessonId);
    const newCompleted = isCompleted
      ? currentCompleted.filter((id) => id !== lessonId)
      : [...currentCompleted, lessonId];

    const updated: UserProgress = {
      ...userProgress,
      completedLessons: {
        ...userProgress.completedLessons,
        [courseId]: newCompleted,
      },
    };
    setUserProgress(updated);

    try {
      await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'guest',
          lessonId,
          completed: !isCompleted,
        }),
      });
    } catch (err) {
      console.warn('Progress update offline:', err);
    }
    return true;
  };

  const addTrade = async (tradeData: Omit<TradeRecord, 'id'>): Promise<boolean> => {
    const newTrade: TradeRecord = {
      ...tradeData,
      id: 'trade-' + Date.now(),
    };
    const updated = [newTrade, ...tradeRecords];
    setTradeRecords(updated);
    localStorage.setItem('nova_trades', JSON.stringify(updated));

    try {
      await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrade),
      });
    } catch (err) {
      console.warn('Trade log offline:', err);
    }
    return true;
  };

  const deleteTrade = async (id: string): Promise<boolean> => {
    const updated = tradeRecords.filter((t) => t.id !== id);
    setTradeRecords(updated);
    localStorage.setItem('nova_trades', JSON.stringify(updated));

    try {
      await fetch(`/api/trades/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete trade offline:', err);
    }
    return true;
  };

  const saveEconomicEvent = async (event: EconomicEvent): Promise<boolean> => {
    const exists = economicEvents.some((e) => e.id === event.id);
    let updated: EconomicEvent[];
    if (exists) {
      updated = economicEvents.map((e) => (e.id === event.id ? event : e));
    } else {
      updated = [...economicEvents, event];
    }
    setEconomicEvents(updated);
    localStorage.setItem('nova_calendar', JSON.stringify(updated));

    try {
      const endpoint = exists ? `/api/calendar/${event.id}` : '/api/calendar';
      const method = exists ? 'PUT' : 'POST';
      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (err) {
      console.warn('Calendar sync offline:', err);
    }
    return true;
  };

  const deleteEconomicEvent = async (id: string): Promise<boolean> => {
    const updated = economicEvents.filter((e) => e.id !== id);
    setEconomicEvents(updated);
    localStorage.setItem('nova_calendar', JSON.stringify(updated));

    try {
      await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete calendar event offline:', err);
    }
    return true;
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('nova_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch {
      // Offline fallback login for demonstration
      if (email.toLowerCase() === 'admin@novafx.com' && pass === 'nova2026!') {
        const adminUser: UserProfile = {
          id: 'admin-1',
          email: 'admin@novafx.com',
          name: 'NOVA FX Master Admin',
          role: 'admin',
          joinedDate: '2026-01-01',
        };
        setCurrentUser(adminUser);
        localStorage.setItem('nova_user', JSON.stringify(adminUser));
        return { success: true };
      }
      if (email.toLowerCase() === 'trader@novafx.com') {
        const traderUser: UserProfile = {
          id: 'trader-1',
          email: 'trader@novafx.com',
          name: 'Alex Trader',
          role: 'trader',
          joinedDate: '2026-05-15',
        };
        setCurrentUser(traderUser);
        localStorage.setItem('nova_user', JSON.stringify(traderUser));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials. Use admin@novafx.com / nova2026!' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nova_user');
  };

  const resetAllData = async (): Promise<boolean> => {
    setConfig(initialSiteConfig);
    setCourses(initialCourses);
    setEconomicEvents(initialEconomicEvents);
    setTradeRecords(initialTradeRecords);
    localStorage.clear();

    try {
      await fetch('/api/db/reset', { method: 'POST' });
    } catch (err) {
      console.warn('Reset offline:', err);
    }
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        config,
        courses,
        economicEvents,
        tradeRecords,
        userProgress,
        currentUser,
        activeTab,
        theme,
        isLoginModalOpen,
        isAdminOpen,
        selectedCourseForModal,
        setActiveTab,
        setTheme,
        toggleTheme,
        setIsLoginModalOpen,
        setIsAdminOpen,
        setSelectedCourseForModal,
        updateConfig,
        saveCourse,
        deleteCourse,
        enrollInCourse,
        toggleLessonComplete,
        addTrade,
        deleteTrade,
        saveEconomicEvent,
        deleteEconomicEvent,
        login,
        logout,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
