const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_ID_KEY = "user_id";
const AUTH_SESSION_COOKIE = "auth_session";
const AUTH_ROLES_COOKIE = "auth_roles";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (!isBrowser()) {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function removeCookie(name: string) {
  if (!isBrowser()) {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export type TokenSession = {
  accessToken: string;
  refreshToken?: string;
  userId?: number;
};

export const tokenStorage = {
  setSession(session: TokenSession) {
    if (!isBrowser()) {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);

    if (session.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    }

    if (typeof session.userId === "number" && Number.isFinite(session.userId)) {
      localStorage.setItem(USER_ID_KEY, String(session.userId));
    }

    // This cookie is a non-sensitive hint for middleware route gating.
    setCookie(AUTH_SESSION_COOKIE, "1", 60 * 60 * 24 * 30);
  },

  setAccessToken(accessToken: string) {
    if (!isBrowser()) {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    setCookie(AUTH_SESSION_COOKIE, "1", 60 * 60 * 24 * 30);
  },

  setRefreshToken(refreshToken: string) {
    if (!isBrowser()) {
      return;
    }

    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  setUserId(userId: number) {
    if (!isBrowser()) {
      return;
    }

    localStorage.setItem(USER_ID_KEY, String(userId));
  },

  setRoles(roles: string[]) {
    if (!isBrowser()) {
      return;
    }

    if (roles.length === 0) {
      removeCookie(AUTH_ROLES_COOKIE);
      return;
    }

    setCookie(AUTH_ROLES_COOKIE, roles.join(","), 60 * 60 * 24 * 30);
  },

  getAccessToken(): string | null {
    if (!isBrowser()) {
      return null;
    }

    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) {
      return null;
    }

    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUserId(): number | null {
    if (!isBrowser()) {
      return null;
    }

    const value = localStorage.getItem(USER_ID_KEY);
    if (!value || !/^\d+$/.test(value)) {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  },

  clearSession() {
    if (!isBrowser()) {
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    removeCookie(AUTH_SESSION_COOKIE);
    removeCookie(AUTH_ROLES_COOKIE);
  },
};
