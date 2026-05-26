import express from 'express';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash, randomUUID } from 'crypto';
import { defaultArticles } from './defaultArticles';

type ScheduleItem = {
  id: string;
  title: string;
  time: string;
};

type ArticleRecord = {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  published: boolean;
  category: string;
  schedule: ScheduleItem[];
  createdAt: string;
  updatedAt: string;
};

type UserRecord = {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin';
};

type SessionRecord = {
  token: string;
  userId: string;
  createdAt: string;
};

type DatabaseFile = {
  users: UserRecord[];
  sessions: SessionRecord[];
  articles: ArticleRecord[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'kderma-db.json');
const defaultAdminUsername = 'admin';
const defaultAdminPassword = 'admin123';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function createDefaultDatabase(): DatabaseFile {
  return {
    users: [
      {
        id: 'admin',
        username: defaultAdminUsername,
        passwordHash: hashPassword(defaultAdminPassword),
        role: 'admin',
      },
    ],
    sessions: [],
    articles: defaultArticles.map((article) => ({
      ...article,
    })),
  };
}

function ensureDatabaseFile() {
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  if (!existsSync(dbPath)) {
    writeFileSync(dbPath, JSON.stringify(createDefaultDatabase(), null, 2), 'utf8');
  }
}

function loadDatabase(): DatabaseFile {
  ensureDatabaseFile();
  const raw = readFileSync(dbPath, 'utf8');
  const parsed = JSON.parse(raw) as Partial<DatabaseFile>;
  const fallback = createDefaultDatabase();
  const articles = Array.isArray(parsed.articles) ? parsed.articles : [];

  if (articles.length === 0) {
    const seeded = {
      users: Array.isArray(parsed.users) ? parsed.users : fallback.users,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      articles: fallback.articles,
    };
    saveDatabase(seeded);
    return seeded;
  }

  return {
    users: Array.isArray(parsed.users) ? parsed.users : fallback.users,
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    articles: articles.length > 0 ? articles : fallback.articles,
  };
}

function saveDatabase(db: DatabaseFile) {
  writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

function getAuthToken(authorizationHeader?: string) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.slice('Bearer '.length).trim();
}

function getCurrentUser(db: DatabaseFile, authorizationHeader?: string) {
  const token = getAuthToken(authorizationHeader);
  if (!token) return null;

  const session = db.sessions.find((item) => item.token === token);
  if (!session) return null;

  return db.users.find((user) => user.id === session.userId) ?? null;
}

function sortArticles(articles: ArticleRecord[]) {
  return [...articles].sort((a, b) => {
    const left = new Date(b.updatedAt || b.date).getTime();
    const right = new Date(a.updatedAt || a.date).getTime();
    return left - right;
  });
}

function sanitizeArticlePayload(body: any, fallback?: Partial<ArticleRecord>): ArticleRecord {
  const now = new Date().toISOString();

  return {
    id: String(body?.id || fallback?.id || randomUUID()),
    title: String(body?.title || '').slice(0, 50),
    description: String(body?.description || ''),
    content: String(body?.content || ''),
    date: body?.date ? new Date(body.date).toISOString() : fallback?.date || now,
    published: Boolean(body?.published),
    category: String(body?.category || 'Oznámení'),
    schedule: Array.isArray(body?.schedule) ? body.schedule.map((item: any, index: number) => ({
      id: String(item?.id || `${index}-${Date.now()}`),
      title: String(item?.title || ''),
      time: String(item?.time || ''),
    })) : (fallback?.schedule || []),
    createdAt: fallback?.createdAt || now,
    updatedAt: now,
  };
}

const app = express();
app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/login', (req, res) => {
  const db = loadDatabase();
  const { username, password } = req.body ?? {};
  const user = db.users.find((item) => item.username === username);

  if (!user || user.passwordHash !== hashPassword(String(password || ''))) {
    res.status(401).json({ error: 'Neplatné přihlašovací údaje.' });
    return;
  }

  const token = randomUUID();
  db.sessions = db.sessions.filter((session) => session.userId !== user.id);
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  saveDatabase(db);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  const db = loadDatabase();
  const user = getCurrentUser(db, req.headers.authorization);

  if (!user) {
    res.status(401).json({ error: 'Neautorizováno.' });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
  });
});

app.post('/api/auth/logout', (req, res) => {
  const db = loadDatabase();
  const token = getAuthToken(req.headers.authorization);

  if (token) {
    db.sessions = db.sessions.filter((session) => session.token !== token);
    saveDatabase(db);
  }

  res.json({ ok: true });
});

app.get('/api/articles', (_req, res) => {
  const db = loadDatabase();
  res.json(sortArticles(db.articles.filter((article) => article.published)));
});

app.get('/api/admin/articles', (req, res) => {
  const db = loadDatabase();
  const user = getCurrentUser(db, req.headers.authorization);

  if (!user) {
    res.status(401).json({ error: 'Neautorizováno.' });
    return;
  }

  res.json(sortArticles(db.articles));
});

app.post('/api/admin/articles', (req, res) => {
  const db = loadDatabase();
  const user = getCurrentUser(db, req.headers.authorization);

  if (!user) {
    res.status(401).json({ error: 'Neautorizováno.' });
    return;
  }

  const article = sanitizeArticlePayload(req.body);
  db.articles = [article, ...db.articles.filter((item) => item.id !== article.id)];
  saveDatabase(db);
  res.status(201).json(article);
});

app.put('/api/admin/articles/:id', (req, res) => {
  const db = loadDatabase();
  const user = getCurrentUser(db, req.headers.authorization);

  if (!user) {
    res.status(401).json({ error: 'Neautorizováno.' });
    return;
  }

  const articleId = req.params.id;
  const existing = db.articles.find((item) => item.id === articleId);

  if (!existing) {
    res.status(404).json({ error: 'Článek nenalezen.' });
    return;
  }

  const updated = sanitizeArticlePayload({ ...req.body, id: articleId }, existing);
  db.articles = db.articles.map((item) => (item.id === articleId ? updated : item));
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/admin/articles/:id', (req, res) => {
  const db = loadDatabase();
  const user = getCurrentUser(db, req.headers.authorization);

  if (!user) {
    res.status(401).json({ error: 'Neautorizováno.' });
    return;
  }

  db.articles = db.articles.filter((item) => item.id !== req.params.id);
  saveDatabase(db);
  res.status(204).send();
});

const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  ensureDatabaseFile();
  console.log(`K-DERMA local API running on http://localhost:${port}`);
  console.log(`Default admin login: ${defaultAdminUsername} / ${defaultAdminPassword}`);
});