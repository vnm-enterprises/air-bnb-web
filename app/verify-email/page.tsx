'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.get('/api/v1/verify-email', { params: { token } });
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
      } catch (err: any) {
        setStatus('error');
        const error = err?.response?.data?.message || 'Verification failed. The link may be expired or invalid.';
        setMessage(error);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f4f4] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-[#2C5F5D] rounded-full mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-900">Verifying Email</h1>
              <p className="text-slate-600 mt-2">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Email Verified!</h1>
              <p className="text-slate-600 mt-2">{message}</p>
              <Link
                href="/login"
                className="mt-6 inline-block px-6 py-2 bg-[#2C5F5D] text-white font-semibold rounded-md hover:bg-[#244f4d] transition"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Verification Failed</h1>
              <p className="text-slate-600 mt-2">{message}</p>
              <Link
                href="/signup"
                className="mt-6 inline-block px-6 py-2 bg-[#2C5F5D] text-white font-semibold rounded-md hover:bg-[#244f4d] transition"
              >
                Try Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
