import api from './axios';

export type LoginResponse = {
  token: string;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
};

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wp_jwt', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem('wp_jwt');
  return null;
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('wp_jwt');
    // remove default header if set
    try {
      delete api.defaults.headers.common['Authorization'];
    } catch (e) {}
  }
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await api.post('/jwt-auth/v1/token', { username, password });
  const data = res.data as LoginResponse;
  if (data?.token) setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}
