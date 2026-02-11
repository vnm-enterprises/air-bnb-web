// app/register/page.tsx
'use client'
import AuthLayout from '@/components/auth/AuthLayout'
import RoleSelector from '@/components/auth/RoleSelector'
import PasswordStrength from '@/components/auth/PasswordStrength'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useState } from 'react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  const getPasswordStrength = () => {
    if (password.length < 6) return 'weak'
    if (password.length < 10) return 'medium'
    return 'strong'
  }

  return (
    <AuthLayout
      title="Begin your journey"
      subtitle="Join our community of travelers and hosts."
    >
      <RoleSelector />

      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Full Name"
          placeholder="e.g. Alex Johnson"
          type="text"
          required
        />

        <Input
          label="Email Address"
          placeholder="alex@example.com"
          type="email"
          required
        />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-[#111717]  text-sm font-semibold leading-normal">
              Password
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

        <div className="flex items-start gap-3 py-2">
          <input
            className="mt-1 rounded border-[#d6e1e0] text-[#2C5F5D] focus:ring-[#2C5F5D]"
            id="terms"
            type="checkbox"
            required
          />
          <label className="text-xs text-[#628483] leading-relaxed" htmlFor="terms">
            I agree to the <a className="text-[#2C5F5D] font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-[#2C5F5D] font-bold hover:underline" href="#">Privacy Policy</a>. I also agree to receive occasional updates from StayTeal.
          </label>
        </div>

        <Button type="submit" variant="primary" size="lg" >
          Create Account
        </Button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-[#eaf0f0] "></div>
          <span className="flex-shrink mx-4 text-xs font-medium text-[#628483] uppercase tracking-widest">
            Or sign up with
          </span>
          <div className="flex-grow border-t border-[#eaf0f0] "></div>
        </div>

        <SocialAuthButtons />
      </form>

      <p className="text-center text-sm text-[#628483] font-medium">
        Already have an account?
        <a className="text-[#2C5F5D] font-bold hover:underline ml-1" href="/login">
          Log in
        </a>
      </p>
    </AuthLayout>
  )
}