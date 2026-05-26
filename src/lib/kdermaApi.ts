export type ScheduleItem = {
  id: string;
  title: string;
  time: string;
};

export type ArticleRecord = {
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

export type AuthUser = {
  id: string;
  username: string;
  role: 'admin';
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

function getHeaders(token?: string) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

async function requestJson<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...Object.fromEntries(getHeaders(token).entries()),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

export function formatArticleDate(date: string) {
  return new Date(date).toLocaleString('cs-CZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function getStoredAdminToken() {
  return localStorage.getItem('kderma_admin_token');
}

export function setStoredAdminToken(token: string) {
  localStorage.setItem('kderma_admin_token', token);
}

export function clearStoredAdminToken() {
  localStorage.removeItem('kderma_admin_token');
}

export async function loginAdmin(username: string, password: string) {
  return requestJson<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchCurrentAdmin(token: string) {
  return requestJson<AuthUser>('/auth/me', { method: 'GET' }, token);
}

export async function logoutAdmin(token: string) {
  return requestJson<{ ok: boolean }>('/auth/logout', { method: 'POST' }, token);
}

export async function fetchPublicArticles() {
  return requestJson<ArticleRecord[]>('/articles', { method: 'GET' });
}

export async function fetchAdminArticles(token: string) {
  return requestJson<ArticleRecord[]>('/admin/articles', { method: 'GET' }, token);
}

export async function createAdminArticle(token: string, article: Partial<ArticleRecord>) {
  return requestJson<ArticleRecord>('/admin/articles', {
    method: 'POST',
    body: JSON.stringify(article),
  }, token);
}

export async function updateAdminArticle(token: string, id: string, article: Partial<ArticleRecord>) {
  return requestJson<ArticleRecord>(`/admin/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(article),
  }, token);
}

export async function deleteAdminArticle(token: string, id: string) {
  return requestJson<{ ok: boolean }>(`/admin/articles/${id}`, {
    method: 'DELETE',
  }, token);
}