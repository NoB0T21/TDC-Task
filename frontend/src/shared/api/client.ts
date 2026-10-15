import axios from 'axios';

const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (!envUrl) {
    return 'http://localhost:5000/api';
  }
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 45_000,
});

apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('tdc_auth');
  if (stored) {
    try {
      const { token } = JSON.parse(stored) as { token: string };
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tdc_auth');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
