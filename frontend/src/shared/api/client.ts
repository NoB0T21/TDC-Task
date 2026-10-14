import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ── Request interceptor: attach Bearer token ───────────────────────────────
apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('tdc_auth');
  if (stored) {
    try {
      const { token } = JSON.parse(stored) as { token: string };
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Corrupt storage — ignore, let the 401 handler clean it up
    }
  }
  return config;
});

// ── Response interceptor: handle 401 globally ──────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tdc_auth');
      // Only redirect if we're not already on /login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
