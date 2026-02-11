// app/forgot-password/page.tsx
'use client';
import AuthLayout from '@/components/auth/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail } from 'lucide-react';
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset request
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent a password reset link to your email address."
      >
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="bg-[#2C5F5D]/10 p-4 rounded-full">
            <span className="material-symbols-outlined text-[#2C5F5D] text-5xl"><Mail /></span>
          </div>

          <div className="text-center space-y-2">
            <p className="text-[#628483] ">
              Please check your inbox for instructions to reset your password.
            </p>
            <p className="text-sm text-[#628483] ">
              If you don&apos;t see the email, check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#2C5F5D] font-bold hover:underline"
              >
                try again
              </button>
            </p>
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

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="No worries, we'll send you a reset link."
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          placeholder="alex@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <p className="text-sm text-[#628483] leading-relaxed">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>

        <Button type="submit" variant="primary" size="lg" >
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-[#628483] font-medium">
        Remember your password?
        <a className="text-[#2C5F5D] font-bold hover:underline ml-1" href="/login">
          Log in
        </a>
      </p>
    </AuthLayout>
  )
}