"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/application/hooks/use-reset-password";

export function ResetPasswordFeature() {
  const {
    invalidLink,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    success,
    handleSubmit,
  } = useResetPassword();

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Choose a new password for your account."
      sideTitle="Create a strong new password"
      sideDescription="Use a unique password you do not use on other websites."
      footer={
        <Link href="/login" className="font-semibold text-[#2C5F5D] hover:underline">
          Back to Login
        </Link>
      }
    >
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <AuthAlert variant="error">{error}</AuthAlert>}
          {invalidLink && !error && (
            <AuthAlert variant="error">
              This reset link is invalid or expired. Please request a new password reset email.
            </AuthAlert>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700">New Password</label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                className="pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
            <div className="relative mt-2">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading || invalidLink} className="w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      ) : (
        <AuthAlert variant="success">Password updated successfully. Redirecting you to login...</AuthAlert>
      )}
    </AuthLayout>
  );
}
