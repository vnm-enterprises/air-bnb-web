import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/properties',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

const AUTH_REQUIRED_PREFIXES = ['/dashboard', '/profile', '/booking', '/checkout', '/wishlist', '/host', '/admin'];

const HOST_REQUIRED_PREFIXES = ['/host'];
const ADMIN_REQUIRED_PREFIXES = ['/admin'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAuthRequired(pathname: string): boolean {
  return AUTH_REQUIRED_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function requiresHostRole(pathname: string): boolean {
  return HOST_REQUIRED_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function requiresAdminRole(pathname: string): boolean {
  return ADMIN_REQUIRED_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Middleware for Next.js route protection
 *
 * Note: This middleware only handles basic route access.
 * Actual authentication and role-based authorization happens at:
 * 1. Page level (via useAuth hook and useEffect redirects)
 * 2. Component level (via ProtectedRoute component)
 * 3. API level (via JWT validation in backend)
 *
 * This is because Next.js middleware runs server-side and cannot access
 * localStorage where JWT tokens are stored.
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = request.cookies.get('auth_session')?.value === '1';
  const roleCookie = request.cookies.get('auth_roles')?.value || '';
  const roles = roleCookie
    .split(',')
    .map((role) => role.trim())
    .filter(Boolean);

  if (isPublicRoute(pathname)) {
    if (hasSession && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/properties', request.url));
    }

    return NextResponse.next();
  }

  // Client auth state is stored in localStorage, so hard-redirecting when the
  // session hint cookie is missing can incorrectly log out users on refresh.
  if (isAuthRequired(pathname) && !hasSession) {
    return NextResponse.next();
  }

  if (requiresHostRole(pathname) && hasSession && !roles.includes('host')) {
    return NextResponse.redirect(new URL('/properties', request.url));
  }

  if (requiresAdminRole(pathname) && hasSession && !roles.includes('administrator')) {
    return NextResponse.redirect(new URL('/properties', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

