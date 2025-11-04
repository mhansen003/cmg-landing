import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/lib/auth-jwt';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  // Clear the auth cookie
  response.cookies.set(AUTH_CONFIG.COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
