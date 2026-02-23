import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup', '/properties', '/verify-email', '/'];

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
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow all public routes without any checks
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // For all other routes, let them through
  // Client-side protection via AuthContext will handle redirects
  // This approach is standard for Next.js apps using localStorage for tokens
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

