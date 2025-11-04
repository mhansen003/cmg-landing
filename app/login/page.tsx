'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === 'otp' && otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, [step]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate username is not empty
    if (!email || email.trim().length === 0) {
      setError('Please enter your username');
      return;
    }

    // Construct full email by appending @cmgfi.com
    const fullEmail = `${email.trim()}@cmgfi.com`;

    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fullEmail }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code');
      }

      setSuccess('Verification code sent! Check your email.');
      setStep('otp');
      setCountdown(300); // 5 minutes
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('');
    while (newOtp.length < 6) newOtp.push('');
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    otpInputs.current[lastIndex]?.focus();
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    // Construct full email
    const fullEmail = `${email.trim()}@cmgfi.com`;

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fullEmail, code }),
        credentials: 'include', // Important for cookies!
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      // Success! Redirect to landing page
      setSuccess('✅ Verified! Redirecting...');

      // Wait to ensure cookie is fully set, then force full page reload
      setTimeout(() => {
        // Force a full page reload to ensure cookie is picked up
        window.location.href = '/';
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setOtp(['', '', '', '', '', '']);
    await handleSendOTP(new Event('submit') as any);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-accent-green">CMG</span>{' '}
            <span className="text-white">Tools</span>
          </h1>
          <p className="text-gray-400">Secure Employee Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl border border-white/10 p-8 shadow-2xl">
          {step === 'email' ? (
            <form onSubmit={handleSendOTP}>
              <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-gray-400 mb-6">
                Enter your CMG username to receive a verification code
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CMG Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="firstname.lastname"
                    className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors pr-24"
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    @cmgfi.com
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 bg-gradient-to-r from-accent-green to-accent-blue text-dark-500 font-bold rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Verification Code'
                )}
              </button>

              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  🔒 Secure verification • CMG employees only
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
                className="mb-4 text-accent-blue hover:text-accent-green transition-colors text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change email
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Enter Code</h2>
              <p className="text-gray-400 mb-6">
                We sent a 6-digit code to <span className="text-accent-green font-medium">{email}@cmgfi.com</span>
              </p>

              {success && (
                <div className="mb-4 p-3 bg-accent-green/10 border border-accent-green/50 rounded-lg text-accent-green text-sm">
                  {success}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Verification Code
                </label>
                <div className="flex gap-2 justify-between" onPaste={handleOTPPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpInputs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-full aspect-square text-center text-2xl font-bold bg-dark-500 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/50 transition-all"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {countdown > 0 && (
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-400">
                    Code expires in <span className="text-accent-green font-mono">{formatTime(countdown)}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full py-3 bg-gradient-to-r from-accent-green to-accent-blue text-dark-500 font-bold rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || loading}
                className="w-full py-2 text-sm text-gray-400 hover:text-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend code in ${formatTime(countdown)}` : 'Resend code'}
              </button>

              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  💡 Tip: Check your spam folder if you don't see the email
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? Contact your IT administrator
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
