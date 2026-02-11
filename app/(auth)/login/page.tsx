// app/login/page.tsx
'use client';
import AuthLayout from '@/components/auth/AuthLayout'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useState } from 'react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your journey with StayTeal."
    >
      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Email Address"
          placeholder="alex@example.com"
          type="email"
          required
        />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-[#111717] dark:text-white text-sm font-semibold leading-normal">
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
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            required
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <input
              className="rounded border-[#d6e1e0] text-[#2C5F5D] focus:ring-[#2C5F5D]"
              id="remember"
              type="checkbox"
            />
            <label className="text-sm text-[#628483]" htmlFor="remember">
              Remember me
            </label>
          </div>
          <a className="text-[#2C5F5D] text-sm font-bold hover:underline" href="#">
            Forgot password?
          </a>
        </div>

        <Button type="submit" variant="primary" size="lg" >
          Log In
        </Button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-[#eaf0f0] dark:border-gray-800"></div>
          <span className="flex-shrink mx-4 text-xs font-medium text-[#628483] uppercase tracking-widest">
            Or log in with
          </span>
          <div className="flex-grow border-t border-[#eaf0f0] dark:border-gray-800"></div>
        </div>

        <SocialAuthButtons />
      </form>

      <p className="text-center text-sm text-[#628483] font-medium">
        Don&apos;t have an account?
        <a className="text-[#2C5F5D] font-bold hover:underline ml-1" href="/register">
          Sign up
        </a>
      </p>
    </AuthLayout>
  )
}