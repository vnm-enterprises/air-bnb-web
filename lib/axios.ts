import axios, { AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://example.com/wp-json';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('wp_jwt');
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
        localStorage.removeItem('wp_jwt');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
