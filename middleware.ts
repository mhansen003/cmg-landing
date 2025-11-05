import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken, AUTH_CONFIG } from './lib/auth-jwt';

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/api/auth/send-otp',
  '/api/auth/verify-otp',
  '/api',
  '/_next',
  '/favicon.ico',
  '/icon.svg',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get(AUTH_CONFIG.COOKIE_NAME)?.value;

  if (!token) {
    console.log(`[Auth] No token found for ${pathname}`);
    // Redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  try {
    const session = verifyAuthToken(token);

    if (!session) {
      console.log(`[Auth] Invalid session for ${pathname}`);
      // Invalid or expired token - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);

      // Clear invalid cookie
      response.cookies.set(AUTH_CONFIG.COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return response;
    }

    console.log(`[Auth] Valid session for ${session.email} accessing ${pathname}`);
    // Token is valid, allow access
    return NextResponse.next();
  } catch (error) {
    console.error(`[Auth] Error verifying token:`, error);
    // On error, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
