'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import api from '@/infrastructure/http/api-client';

export type UserRole = 'traveler' | 'host';

export interface User {
  id: number;
  email: string;
  name: string;
  roles: UserRole[];
  profile_image?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
  isHost: () => boolean;
  isTraveler: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getApiErrorMessage = useCallback((error: unknown, fallback: string) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error
    ) {
      const response = (error as { response?: { status?: number; data?: { message?: string } } }).response;
      const apiMessage = response?.data?.message;

      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
        return apiMessage;
      }

      if (response?.status === 401) {
        return 'Invalid credentials. Please check your email and password.';
      }
    }

    return fallback;
  }, []);

  const clearStoredAuth = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  // Initialize from storage and validate token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate token by fetching current user
        const res = await api.get('/api/v1/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.id) {
          setUser(res.data);
          localStorage.setItem('user_id', String(res.data.id));
        } else {
          clearStoredAuth();
        }
      } catch {
        clearStoredAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [clearStoredAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await api.post('/api/v1/login', {
          email: email.trim().toLowerCase(),
          password,
        });

        const { access_token, refresh_token } = res.data;

        if (!access_token) {
          return { success: false, message: 'No access token received' };
        }

        localStorage.setItem('access_token', access_token);
        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }

        // Set auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // Fetch user data
        const userRes = await api.get('/api/v1/me');
        setUser(userRes.data);
        if (userRes.data?.id) {
          localStorage.setItem('user_id', String(userRes.data.id));
        }

        return { success: true };
      } catch (error: unknown) {
        const message = getApiErrorMessage(
          error,
          'Unable to sign in right now. Please try again.'
        );
        return { success: false, message };
      }
    },
    [getApiErrorMessage]
  );

  const signup = useCallback(
    async (data: { name: string; email: string; password: string; role: UserRole }) => {
      try {
        const res = await api.post('/api/v1/register', {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role
        });

        return {
          success: true,
          message: res.data?.message || 'Signup successful. Please verify your email.'
        };
      } catch (error: unknown) {
        const message = getApiErrorMessage(error, 'Unable to create your account right now.');
        return { success: false, message };
      }
    },
    [getApiErrorMessage]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/api/v1/logout');
    } catch {
      // Continue with logout even if API call fails
    } finally {
      clearStoredAuth();
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    }
  }, [clearStoredAuth]);

  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      const storedUserId = localStorage.getItem('user_id');
      const currentUserId =
        user?.id ??
        (storedUserId && /^\d+$/.test(storedUserId) ? parseInt(storedUserId, 10) : null);

      if (!refresh || !currentUserId) {
        return false;
      }

      const res = await api.post('/api/v1/refresh', {
        refresh_token: refresh,
        user_id: currentUserId
      });

      const { access_token, refresh_token: newRefresh } = res.data;

      localStorage.setItem('access_token', access_token);
      if (newRefresh) {
        localStorage.setItem('refresh_token', newRefresh);
      }
      localStorage.setItem('user_id', String(currentUserId));

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      refreshTimerRef.current = setTimeout(() => {
        void refreshToken();
      }, 14 * 60 * 1000);

      return true;
    } catch {
      clearStoredAuth();
      return false;
    }
  }, [clearStoredAuth, user]);

  const hasRole = useCallback(
    (role: UserRole) => {
      return user?.roles?.includes(role) ?? false;
    },
    [user]
  );

  const isHost = useCallback(() => hasRole('host'), [hasRole]);
  const isTraveler = useCallback(() => hasRole('traveler'), [hasRole]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshToken,
    hasRole,
    isHost,
    isTraveler
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
