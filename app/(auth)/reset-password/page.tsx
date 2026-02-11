// app/reset-password/page.tsx
'use client';
import AuthLayout from '@/components/auth/AuthLayout'
import PasswordStrength from '@/components/auth/PasswordStrength'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CheckCircle } from 'lucide-react';
import { useState } from 'react'

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const getPasswordStrength = () => {
    if (password.length < 6) return 'weak'
    if (password.length < 10) return 'medium'
    return 'strong'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    // Handle password reset
    setSuccess(true)
  }

  if (success) {
    return (
      <AuthLayout
        title="Password Reset Successful!"
        subtitle="Your password has been updated successfully."
      >
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="bg-primary/10 p-4 rounded-full">
            <span className="material-symbols-outlined text-[#2C5F5D] text-5xl"><CheckCircle /></span>
          </div>

          <div className="text-center space-y-2">
            <p className="text-[#628483] ">
              You can now log in with your new password.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Create a new password for your account."
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-[#111717] text-sm font-semibold leading-normal">
              New Password
            </span>
            <button
              type="button"
              className="text-[#2C5F5D] text-xs font-bold hover:underline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <Input
            placeholder="Minimum 8 characters"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordStrength strength={getPasswordStrength()} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[#111717] text-sm font-semibold leading-normal">
            Confirm Password
          </span>
          <Input
            placeholder="Re-enter your password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="bg-[#2C5F5D]/5 border border-[#2C5F5D]/20 rounded-lg p-4">
          <p className="text-sm text-[#628483]">
            <span className="material-symbols-outlined text-[#2C5F5D] text-sm mr-2">info</span>
            For security, make sure your new password is different from your previous one.
          </p>
        </div>

        <Button type="submit" variant="primary" size="lg" >
          Reset Password
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