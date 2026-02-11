// app/verify-email/page.tsx
'use client';
import AuthLayout from '@/components/auth/AuthLayout'
import Button from '@/components/ui/Button'
import { CheckSquare, Mail } from 'lucide-react';
import { useState } from 'react'

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false)

  const handleResend = () => {
    // Handle resend verification email
    setResent(true)
    setTimeout(() => setResent(false), 5000)
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We've sent a verification link to your email address."
    >
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="bg-[#2C5F5D]/10 p-4 rounded-full">
          <span className="material-symbols-outlined text-[#2C5F5D] text-5xl"><Mail /></span>
        </div>

        <div className="text-center space-y-4">
          <div>
            <p className="text-[#628483] mb-2">
              Please check your inbox and click the verification link to complete your registration.
            </p>
            <p className="text-sm text-[#628483] ">
              Didn&apos;t receive the email?{' '}
              <button
                onClick={handleResend}
                disabled={resent}
                className={`text-[#2C5F5D] font-bold hover:underline ${
                  resent ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {resent ? 'Sent!' : 'Resend email'}
              </button>
            </p>
          </div>

          <div className="bg-[#2C5F5D]/5 border border-[#2C5F5D]/20 rounded-lg p-4 max-w-md">
            <p className="text-sm text-[#628483] flex items-start gap-2">
              <span className="material-symbols-outlined text-[#2C5F5D] text-sm mt-0.5"><CheckSquare /></span>
              Check your spam folder if you don&apos;t see the email in your inbox.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => window.location.href = '/login'}
        >
          Back to Login
        </Button>
      </div>
    </AuthLayout>
  )
}