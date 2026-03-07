'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/axios';

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
        } else {
          // Invalid token response
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await api.post('/api/v1/login', { email, password });
        
        const { access_token, refresh_token, expires_in } = res.data;
        
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

        // Set token refresh timeout (900 seconds = 15 minutes)
        if (expires_in) {
          setTimeout(() => refreshToken(), (expires_in - 60) * 1000);
        }

        return { success: true };
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Login failed';
        return { success: false, message };
      }
    },
    []
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
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Signup failed';
        return { success: false, message };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/api/v1/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      const currentUser = user;

      if (!refresh || !currentUser) {
        return false;
      }

      const res = await api.post('/api/v1/refresh', {
        refresh_token: refresh,
        user_id: currentUser.id
      });

      const { access_token, refresh_token: newRefresh } = res.data;

      localStorage.setItem('access_token', access_token);
      if (newRefresh) {
        localStorage.setItem('refresh_token', newRefresh);
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Schedule next refresh
      setTimeout(() => refreshToken(), 14 * 60 * 1000); // 14 minutes

      return true;
    } catch (error) {
      // Refresh failed, clear auth
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      return false;
    }
  }, [user]);

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
