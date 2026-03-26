"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignupForm } from "@/application/hooks/use-signup-form";

export default function SignupPage() {
  const {
    role,
    setRole,
    showPassword,
    setShowPassword,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    agreedTerms,
    setAgreedTerms,
    loading,
    error,
    success,
    strength,
    handleSubmit,
  } = useSignupForm();

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join as a traveler or host and start your journey."
      sideTitle="Start your StayTeal journey"
      sideDescription="Create your account to discover stays, host properties, and manage bookings with ease."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2C5F5D] hover:underline">
            Login
          </Link>
        </>
      }
    >
      {success ? (
        <AuthAlert variant="success">
          Account created successfully. Please verify your email before signing in.
        </AuthAlert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <AuthAlert variant="error">{error}</AuthAlert>}

          <div className="flex rounded-md border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setRole("traveler")}
              className={`h-9 flex-1 rounded-md text-xs font-semibold transition ${
                role === "traveler" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              I&apos;m a Traveler
            </button>
            <button
              type="button"
              onClick={() => setRole("host")}
              className={`h-9 flex-1 rounded-md text-xs font-semibold transition ${
                role === "host" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              I&apos;m a Host
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="e.g. Alex Johnson"
              className="mt-2 h-10"
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="alex@example.com"
              className="mt-2 h-10"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="relative mt-2">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className="h-10 pr-10"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md hover:bg-slate-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-500" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-500" />
                )}
              </button>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full bg-[#2C5F5D]" style={{ width: `${strength.pct}%` }} />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-slate-500">{strength.label}</span>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 accent-[#2C5F5D]"
              disabled={loading}
            />
            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-md text-sm"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
