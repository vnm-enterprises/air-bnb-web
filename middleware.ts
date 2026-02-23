import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup', '/properties', '/verify-email', '/'];
const PROTECTED_ROUTES: { [key: string]: string[] } = {
  '/host': ['host'],
  '/dashboard': ['traveler'],
  '/wishlist': ['traveler'],
  '/booking': ['traveler'],
  '/checkout': ['traveler']
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Get access token
  const accessToken = request.cookies.get('access_token')?.value;

  // No token - redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check route-specific permission
  for (const [protected_route, required_roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(protected_route)) {
      // Token exists, allow access for now
      // Role validation happens on client side with AuthContext
      return NextResponse.next();
    }
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

