import axios, { AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://example.com/wp-json';
const usesRestRoute = baseURL.includes('rest_route=');

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (usesRestRoute && typeof config.url === 'string') {
      config.url = config.url.replace(/^\//, '');
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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
