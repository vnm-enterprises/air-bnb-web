"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "@/application/hooks/use-login-form";

export default function LoginPage() {
  const {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    infoMessage,
    handleSubmit,
  } = useLoginForm();

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Access your account to continue."
      sideTitle="Welcome back to StayTeal"
      sideDescription="Manage your stays, bookings, and properties from one place."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#2C5F5D] hover:underline">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {infoMessage && <AuthAlert variant="info">{infoMessage}</AuthAlert>}
        {error && <AuthAlert variant="error">{error}</AuthAlert>}

        <div>
          <label className="text-xs font-semibold text-slate-700">Email Address</label>
          <Input
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#2C5F5D] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative mt-2">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-12"
              disabled={loading}
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-500" />
              ) : (
                <Eye className="h-4 w-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full"
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
}
