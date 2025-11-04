import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import {
  getOTPKey,
  createAuthToken,
  AUTH_CONFIG,
} from '@/lib/auth-jwt';
import { OTPData, VerifyOTPRequest } from '@/types/auth';

// Lazy load Redis client
const getRedis = async () => {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL not configured');
  }

  try {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  let redis = null;

  try {
    const { email, code }: VerifyOTPRequest = await request.json();

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    const codeClean = code.trim();

    redis = await getRedis();

    // Get OTP from Redis
    const otpKey = getOTPKey(emailLower);
    const otpDataStr = await redis.get(otpKey);

    if (!otpDataStr) {
      return NextResponse.json(
        {
          success: false,
          error: 'Verification code expired or not found. Please request a new code.'
        },
        { status: 404 }
      );
    }

    const otpData: OTPData = JSON.parse(otpDataStr);

    // Check if expired
    if (new Date(otpData.expiresAt) < new Date()) {
      await redis.del(otpKey);
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new code.' },
        { status: 410 }
      );
    }

    // Check attempts
    if (otpData.attempts >= AUTH_CONFIG.MAX_ATTEMPTS) {
      await redis.del(otpKey);
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum verification attempts exceeded. Please request a new code.'
        },
        { status: 403 }
      );
    }

    // Verify code
    if (otpData.code !== codeClean) {
      // Increment attempts
      otpData.attempts += 1;
      await redis.set(
        otpKey,
        JSON.stringify(otpData),
        { EX: AUTH_CONFIG.OTP_EXPIRY_MINUTES * 60 }
      );

      const attemptsLeft = AUTH_CONFIG.MAX_ATTEMPTS - otpData.attempts;
      return NextResponse.json(
        {
          success: false,
          error: `Invalid code. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`
        },
        { status: 401 }
      );
    }

    // Code is valid! Delete OTP and create session
    await redis.del(otpKey);

    // Create JWT token
    const token = createAuthToken(emailLower);

    // Create response with httpOnly cookie using Set-Cookie header
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      email: emailLower,
    });

    // Set cookie manually via header for better control
    const cookieOptions = [
      `${AUTH_CONFIG.COOKIE_NAME}=${token}`,
      'Path=/',
      `Max-Age=${AUTH_CONFIG.SESSION_EXPIRY_HOURS * 60 * 60}`,
      'HttpOnly',
      'SameSite=Lax',
      process.env.NODE_ENV === 'production' ? 'Secure' : '',
    ].filter(Boolean).join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    return response;
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    if (redis) {
      try {
        await redis.quit();
      } catch (err) {
        console.error('Error closing Redis connection:', err);
      }
    }
  }
}
