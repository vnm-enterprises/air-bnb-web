import axios, { AxiosError, AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    _skipAuthRefresh?: boolean;
  }
}

const baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://example.com/wp-json';
const usesRestRoute = baseURL.includes('rest_route=');
const AUTH_FREE_ROUTES = [
  '/api/v1/login',
  '/api/v1/register',
  '/api/v1/verify-email',
  '/api/v1/forgot-password',
  '/api/v1/reset-password',
  '/api/v1/refresh',
];

let refreshPromise: Promise<string | null> | null = null;

const api = axios.create({
  baseURL,
});

function clearStoredAuth() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  delete api.defaults.headers.common.Authorization;
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return window.atob(padded);
}

function extractUserIdFromAccessToken(token: string): number | null {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  try {
    const payloadRaw = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadRaw) as {
      data?: {
        user?: {
          id?: number | string;
        };
      };
    };

    const id = Number(payload?.data?.user?.id);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

function resolveRefreshUserId(): number | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUserId = localStorage.getItem('user_id');
  if (storedUserId && /^\d+$/.test(storedUserId)) {
    return Number(storedUserId);
  }

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    return null;
  }

  const tokenUserId = extractUserIdFromAccessToken(accessToken);

  if (tokenUserId) {
    localStorage.setItem('user_id', String(tokenUserId));
  }

  return tokenUserId;
}

function shouldSkipRefresh(url: string): boolean {
  const normalized = url.startsWith('/') ? url : `/${url}`;
  return AUTH_FREE_ROUTES.some((route) => normalized.includes(route));
}

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const refreshToken = localStorage.getItem('refresh_token');
  const userId = resolveRefreshUserId();

  if (!refreshToken || !userId) {
    return null;
  }

  try {
    const response = await api.post<{ access_token: string; refresh_token?: string }>(
      '/api/v1/refresh',
      {
        refresh_token: refreshToken,
        user_id: userId,
      },
      {
        _skipAuthRefresh: true,
      } as AxiosRequestConfig
    );

    const accessToken = response.data?.access_token;

    if (!accessToken) {
      return null;
    }

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user_id', String(userId));

    if (response.data?.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return accessToken;
  } catch {
    return null;
  }
}

api.interceptors.request.use(
  (config) => {
    if (usesRestRoute && typeof config.url === 'string') {
      config.url = config.url.replace(/^\//, '');
    }

    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers && 'set' in config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Content-Type', undefined);
      } else if (config.headers) {
        const headers = config.headers as Record<string, unknown>;
        delete headers['Content-Type'];
        delete headers['content-type'];
      }
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = typeof originalRequest.url === 'string' ? originalRequest.url : '';

    if (originalRequest._skipAuthRefresh || originalRequest._retry || shouldSkipRefresh(requestUrl)) {
      if (shouldSkipRefresh(requestUrl) && (requestUrl.includes('api/v1/refresh') || requestUrl.includes('/api/v1/refresh'))) {
        clearStoredAuth();
      }

      return Promise.reject(error);
    }

    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      clearStoredAuth();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    originalRequest.headers = originalRequest.headers ?? {};
    (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newAccessToken}`;

    return api.request(originalRequest);
  }
);

export default api;
