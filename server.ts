import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialSiteConfig,
  initialCourses,
  initialEconomicEvents,
  initialTradeRecords,
  initialMarketInstruments,
} from './src/data/defaultData.ts';
import type { SiteConfig, Course, EconomicEvent, TradeRecord, UserProgress } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'nova_db.json');

// Interface for persistent storage
interface DatabaseSchema {
  config: SiteConfig;
  courses: Course[];
  economicEvents: EconomicEvent[];
  tradeRecords: TradeRecord[];
  userProgress: Record<string, UserProgress>; // userId or 'guest' -> progress
  integrations: {
    firebase: { enabled: boolean; projectId: string; apiKey: string; status: 'connected' | 'disconnected' | 'configuring' };
    supabase: { enabled: boolean; projectUrl: string; anonKey: string; status: 'connected' | 'disconnected' | 'configuring' };
    whatsAppBot: { enabled: boolean; phoneId: string; status: 'active' | 'inactive' };
    youtubeApi: { enabled: boolean; channelId: string; status: 'active' | 'mock' };
  };
  users: Array<{
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: 'admin' | 'trader';
  }>;
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database if missing
function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      // Merge with initial defaults if any keys are missing
      return {
        config: { ...initialSiteConfig, ...(data.config || {}) },
        courses: data.courses && data.courses.length > 0 ? data.courses : initialCourses,
        economicEvents: data.economicEvents && data.economicEvents.length > 0 ? data.economicEvents : initialEconomicEvents,
        tradeRecords: data.tradeRecords && data.tradeRecords.length > 0 ? data.tradeRecords : initialTradeRecords,
        userProgress: data.userProgress || {
          guest: {
            enrolledCourses: ['course-binary', 'course-smc'],
            completedLessons: {
              'course-binary': ['l1', 'l2'],
              'course-smc': ['l-smc-1'],
            },
            quizScores: { 'course-binary': 90 },
          },
        },
        integrations: data.integrations || {
          firebase: { enabled: false, projectId: '', apiKey: '', status: 'configuring' },
          supabase: { enabled: false, projectUrl: '', anonKey: '', status: 'configuring' },
          whatsAppBot: { enabled: true, phoneId: '+1 (555) 902-3900', status: 'active' },
          youtubeApi: { enabled: true, channelId: '@novafxtrading', status: 'mock' },
        },
        users: data.users || [
          {
            id: 'admin-1',
            email: 'admin@novafx.com',
            name: 'NOVA FX Master Admin',
            passwordHash: 'nova2026!',
            role: 'admin',
          },
          {
            id: 'trader-1',
            email: 'trader@novafx.com',
            name: 'Alex Trader',
            passwordHash: 'trader123',
            role: 'trader',
          },
        ],
      };
    }
  } catch (err) {
    console.error('Error loading database file, falling back to default:', err);
  }

  const defaultDb: DatabaseSchema = {
    config: initialSiteConfig,
    courses: initialCourses,
    economicEvents: initialEconomicEvents,
    tradeRecords: initialTradeRecords,
    userProgress: {
      guest: {
        enrolledCourses: ['course-binary', 'course-smc'],
        completedLessons: {
          'course-binary': ['l1', 'l2'],
          'course-smc': ['l-smc-1'],
        },
        quizScores: { 'course-binary': 90 },
      },
    },
    integrations: {
      firebase: { enabled: false, projectId: '', apiKey: '', status: 'configuring' },
      supabase: { enabled: false, projectUrl: '', anonKey: '', status: 'configuring' },
      whatsAppBot: { enabled: true, phoneId: '+1 (555) 902-3900', status: 'active' },
      youtubeApi: { enabled: true, channelId: '@novafxtrading', status: 'mock' },
    },
    users: [
      {
        id: 'admin-1',
        email: 'admin@novafx.com',
        name: 'NOVA FX Master Admin',
        passwordHash: 'nova2026!',
        role: 'admin',
      },
      {
        id: 'trader-1',
        email: 'trader@novafx.com',
        name: 'Alex Trader',
        passwordHash: 'trader123',
        role: 'trader',
      },
    ],
  };

  saveDatabase(defaultDb);
  return defaultDb;
}

let db = loadDatabase();

function saveDatabase(dataToSave: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '20mb' }));

  // Request logger for API routes
  app.use('/api', (req, res, next) => {
    next();
  });

  // --- API Endpoints ---

  // Site Configuration
  app.get('/api/config', (_req, res) => {
    res.json(db.config);
  });

  app.post('/api/config', (req, res) => {
    try {
      const updatedConfig = req.body;
      db.config = { ...db.config, ...updatedConfig };
      saveDatabase(db);
      res.json({ success: true, config: db.config });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update config' });
    }
  });

  // Courses
  app.get('/api/courses', (_req, res) => {
    res.json(db.courses);
  });

  app.post('/api/courses', (req, res) => {
    try {
      const newCourse: Course = req.body;
      if (!newCourse.id) {
        newCourse.id = 'course-' + Date.now();
      }
      db.courses.unshift(newCourse);
      saveDatabase(db);
      res.status(201).json({ success: true, course: newCourse });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/courses/:id', (req, res) => {
    const { id } = req.params;
    const index = db.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    db.courses[index] = { ...db.courses[index], ...req.body };
    saveDatabase(db);
    res.json({ success: true, course: db.courses[index] });
  });

  app.delete('/api/courses/:id', (req, res) => {
    const { id } = req.params;
    db.courses = db.courses.filter((c) => c.id !== id);
    saveDatabase(db);
    res.json({ success: true, message: 'Course deleted' });
  });

  // User Progress & Course Enrollment
  app.get('/api/progress', (req, res) => {
    const userId = (req.query.userId as string) || 'guest';
    const progress = db.userProgress[userId] || {
      enrolledCourses: [],
      completedLessons: {},
      quizScores: {},
    };
    res.json(progress);
  });

  app.post('/api/courses/:id/enroll', (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId || 'guest';
    if (!db.userProgress[userId]) {
      db.userProgress[userId] = {
        enrolledCourses: [],
        completedLessons: {},
        quizScores: {},
      };
    }
    if (!db.userProgress[userId].enrolledCourses.includes(id)) {
      db.userProgress[userId].enrolledCourses.push(id);
      saveDatabase(db);
    }
    res.json({ success: true, progress: db.userProgress[userId] });
  });

  app.post('/api/courses/:id/progress', (req, res) => {
    const { id: courseId } = req.params;
    const { userId = 'guest', lessonId, completed = true, quizScore } = req.body;

    if (!db.userProgress[userId]) {
      db.userProgress[userId] = {
        enrolledCourses: [courseId],
        completedLessons: {},
        quizScores: {},
      };
    }

    if (!db.userProgress[userId].completedLessons[courseId]) {
      db.userProgress[userId].completedLessons[courseId] = [];
    }

    if (lessonId) {
      const completedList = db.userProgress[userId].completedLessons[courseId];
      if (completed && !completedList.includes(lessonId)) {
        completedList.push(lessonId);
      } else if (!completed && completedList.includes(lessonId)) {
        db.userProgress[userId].completedLessons[courseId] = completedList.filter((lid) => lid !== lessonId);
      }
    }

    if (quizScore !== undefined) {
      db.userProgress[userId].quizScores[courseId] = quizScore;
    }

    saveDatabase(db);
    res.json({ success: true, progress: db.userProgress[userId] });
  });

  // Trading Journal
  app.get('/api/trades', (_req, res) => {
    res.json(db.tradeRecords);
  });

  app.post('/api/trades', (req, res) => {
    try {
      const trade: TradeRecord = req.body;
      if (!trade.id) trade.id = 'trade-' + Date.now();
      db.tradeRecords.unshift(trade);
      saveDatabase(db);
      res.status(201).json({ success: true, trade });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/trades/:id', (req, res) => {
    const { id } = req.params;
    db.tradeRecords = db.tradeRecords.filter((t) => t.id !== id);
    saveDatabase(db);
    res.json({ success: true, message: 'Trade record deleted' });
  });

  // Economic Calendar
  app.get('/api/calendar', (_req, res) => {
    res.json(db.economicEvents);
  });

  app.post('/api/calendar', (req, res) => {
    try {
      const event: EconomicEvent = req.body;
      if (!event.id) event.id = 'eco-' + Date.now();
      db.economicEvents.push(event);
      saveDatabase(db);
      res.status(201).json({ success: true, event });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/calendar/:id', (req, res) => {
    const { id } = req.params;
    const index = db.economicEvents.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    db.economicEvents[index] = { ...db.economicEvents[index], ...req.body };
    saveDatabase(db);
    res.json({ success: true, event: db.economicEvents[index] });
  });

  app.delete('/api/calendar/:id', (req, res) => {
    const { id } = req.params;
    db.economicEvents = db.economicEvents.filter((e) => e.id !== id);
    saveDatabase(db);
    res.json({ success: true, message: 'Event deleted' });
  });

  // Authentication
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase() && u.passwordHash === password
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: 'nova-token-' + Buffer.from(user.email).toString('base64'),
    });
  });

  // Integrations Settings (Supabase / Firebase / WhatsApp / YouTube)
  app.get('/api/integrations', (_req, res) => {
    res.json(db.integrations);
  });

  app.post('/api/integrations', (req, res) => {
    db.integrations = { ...db.integrations, ...req.body };
    saveDatabase(db);
    res.json({ success: true, integrations: db.integrations });
  });

  // Database Backup, Export and Reset
  app.get('/api/db/export', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="nova_db_backup.json"');
    res.send(JSON.stringify(db, null, 2));
  });

  app.post('/api/db/import', (req, res) => {
    try {
      const importedData = req.body;
      if (!importedData.config || !importedData.courses) {
        return res.status(400).json({ error: 'Invalid backup structure' });
      }
      db = importedData;
      saveDatabase(db);
      res.json({ success: true, message: 'Database successfully imported' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/db/reset', (_req, res) => {
    db = {
      config: initialSiteConfig,
      courses: initialCourses,
      economicEvents: initialEconomicEvents,
      tradeRecords: initialTradeRecords,
      userProgress: {
        guest: {
          enrolledCourses: ['course-binary', 'course-smc'],
          completedLessons: {
            'course-binary': ['l1', 'l2'],
            'course-smc': ['l-smc-1'],
          },
          quizScores: { 'course-binary': 90 },
        },
      },
      integrations: {
        firebase: { enabled: false, projectId: '', apiKey: '', status: 'configuring' },
        supabase: { enabled: false, projectUrl: '', anonKey: '', status: 'configuring' },
        whatsAppBot: { enabled: true, phoneId: '+1 (555) 902-3900', status: 'active' },
        youtubeApi: { enabled: true, channelId: '@novafxtrading', status: 'mock' },
      },
      users: [
        {
          id: 'admin-1',
          email: 'admin@novafx.com',
          name: 'NOVA FX Master Admin',
          passwordHash: 'nova2026!',
          role: 'admin',
        },
        {
          id: 'trader-1',
          email: 'trader@novafx.com',
          name: 'Alex Trader',
          passwordHash: 'trader123',
          role: 'trader',
        },
      ],
    };
    saveDatabase(db);
    res.json({ success: true, message: 'Database reset to initial factory configuration' });
  });

  // Vite Integration (Dev mode vs Production)
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NOVA FX Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[NOVA FX Server] Initialization failed:', err);
  process.exit(1);
});
