import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import {
  isValidCMGEmail,
  getOTPKey,
  getRateLimitKey,
  AUTH_CONFIG,
} from '@/lib/auth-jwt';
import { generateOTP, sendOTPEmail } from '@/lib/auth-email';
import { OTPData, SendOTPRequest } from '@/types/auth';

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
    const { email }: SendOTPRequest = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Check if email is from allowed domain
    if (!isValidCMGEmail(emailLower)) {
      return NextResponse.json(
        {
          success: false,
          error: `Only @${AUTH_CONFIG.ALLOWED_DOMAIN} emails are allowed`
        },
        { status: 403 }
      );
    }

    redis = await getRedis();

    // Check rate limiting
    const rateLimitKey = getRateLimitKey(emailLower);
    const requestCount = await redis.get(rateLimitKey);

    if (requestCount && parseInt(requestCount) >= AUTH_CONFIG.MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requests. Please try again in ${AUTH_CONFIG.RATE_LIMIT_WINDOW_MINUTES} minutes.`
        },
        { status: 429 }
      );
    }

    // Increment rate limit counter
    const newCount = requestCount ? parseInt(requestCount) + 1 : 1;
    await redis.set(
      rateLimitKey,
      newCount.toString(),
      { EX: AUTH_CONFIG.RATE_LIMIT_WINDOW_MINUTES * 60 }
    );

    // Generate OTP
    const code = generateOTP();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + AUTH_CONFIG.OTP_EXPIRY_MINUTES * 60 * 1000);

    const otpData: OTPData = {
      code,
      email: emailLower,
      attempts: 0,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Store OTP in Redis with TTL
    const otpKey = getOTPKey(emailLower);
    await redis.set(
      otpKey,
      JSON.stringify(otpData),
      { EX: AUTH_CONFIG.OTP_EXPIRY_MINUTES * 60 }
    );

    // Send email
    try {
      await sendOTPEmail(emailLower, code);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send verification email. Please check your SMTP configuration.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${emailLower}`,
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
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
