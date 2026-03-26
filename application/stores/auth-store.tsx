"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/infrastructure/services";
import { tokenStorage } from "@/infrastructure/security/token-storage";

export type UserRole = "traveler" | "host";

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

type AuthStatus = "initializing" | "authenticated" | "anonymous";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRoles(value: unknown): UserRole[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is UserRole => item === "host" || item === "traveler");
}

function normalizeUser(payload: unknown): User | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const source = payload as {
    id?: unknown;
    email?: unknown;
    name?: unknown;
    roles?: unknown;
    profile_image?: unknown;
  };

  const id = Number(source.id);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const email = typeof source.email === "string" ? source.email : "";
  const name = typeof source.name === "string" ? source.name : "";

  if (!email || !name) {
    return null;
  }

  return {
    id,
    email,
    name,
    roles: normalizeRoles(source.roles),
    profile_image: typeof source.profile_image === "string" ? source.profile_image : undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshActionRef = useRef<() => Promise<boolean>>(async () => false);
  const initializedRef = useRef(false);

  const resetRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback(() => {
    resetRefreshTimer();
    // Keep session alive proactively; axios interceptor handles emergency refresh on 401.
    refreshTimerRef.current = setTimeout(() => {
      void refreshActionRef.current();
    }, 12 * 60 * 1000);
  }, [resetRefreshTimer]);

  const setAuthenticatedUser = useCallback(
    (nextUser: User) => {
      setUser(nextUser);
      setStatus("authenticated");
      tokenStorage.setUserId(nextUser.id);
      tokenStorage.setRoles(nextUser.roles);
      scheduleRefresh();
    },
    [scheduleRefresh]
  );

  const clearSession = useCallback(() => {
    authService.clearAuthTokens();
    tokenStorage.clearSession();
    setUser(null);
    setStatus("anonymous");
    resetRefreshTimer();
  }, [resetRefreshTimer]);

  const fetchAndStoreCurrentUser = useCallback(async (): Promise<User | null> => {
    const raw = await authService.getCurrentUser();
    const normalized = normalizeUser(raw);

    if (!normalized) {
      return null;
    }

    setAuthenticatedUser(normalized);
    return normalized;
  }, [setAuthenticatedUser]);

  const refreshTokenInternal = useCallback(async (): Promise<boolean> => {
    const refreshed = await authService.refreshAccessToken();

    if (!refreshed.success) {
      clearSession();
      return false;
    }

    const nextUser = await fetchAndStoreCurrentUser();

    if (!nextUser) {
      clearSession();
      return false;
    }

    scheduleRefresh();

    return true;
  }, [clearSession, fetchAndStoreCurrentUser, scheduleRefresh]);

  useEffect(() => {
    refreshActionRef.current = refreshTokenInternal;
  }, [refreshTokenInternal]);

  const initializeSession = useCallback(async () => {
    const accessToken = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();

    if (!accessToken && !refreshToken) {
      setStatus("anonymous");
      return;
    }

    try {
      const loadedUser = await fetchAndStoreCurrentUser();
      if (loadedUser) {
        return;
      }

      const refreshed = await refreshTokenInternal();
      if (!refreshed) {
        setStatus("anonymous");
      }
    } catch {
      clearSession();
    }
  }, [clearSession, fetchAndStoreCurrentUser, refreshTokenInternal]);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    void initializeSession();

    return () => {
      resetRefreshTimer();
    };
  }, [initializeSession, resetRefreshTimer]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);

    if (!result.success) {
      return { success: false, message: result.error || "Unable to sign in right now. Please try again." };
    }

    const loadedUser = await fetchAndStoreCurrentUser();
    if (!loadedUser) {
      clearSession();
      return { success: false, message: "Your session could not be initialized. Please try again." };
    }

    return { success: true };
  }, [clearSession, fetchAndStoreCurrentUser]);

  const signup = useCallback(async (data: { name: string; email: string; password: string; role: UserRole }) => {
    const result = await authService.signup(data);
    return {
      success: result.success,
      message: result.success
        ? result.message || "Signup successful. Please verify your email."
        : result.error || "Unable to create your account right now.",
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const hasRole = useCallback((role: UserRole) => user?.roles.includes(role) ?? false, [user]);
  const isHost = useCallback(() => hasRole("host"), [hasRole]);
  const isTraveler = useCallback(() => hasRole("traveler"), [hasRole]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading: status === "initializing",
    isAuthenticated: status === "authenticated" && !!user,
    login,
    signup,
    logout,
    refreshToken: refreshTokenInternal,
    hasRole,
    isHost,
    isTraveler,
  }), [hasRole, isHost, isTraveler, login, logout, refreshTokenInternal, signup, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
