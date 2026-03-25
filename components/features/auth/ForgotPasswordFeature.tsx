"use client";

import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/application/hooks/use-forgot-password";

export function ForgotPasswordFeature() {
  const { email, setEmail, loading, error, success, handleSubmit, resetForm } = useForgotPassword();

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="We will send a secure reset link to your email."
      sideTitle="Reset your password"
      sideDescription="Recover access to your account in a few steps."
      footer={
        <Link href="/login" className="font-semibold text-[#2C5F5D] hover:underline">
          Back to Login
        </Link>
      }
    >
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <AuthAlert variant="error">{error}</AuthAlert>}

          <div>
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              autoFocus
              className="mt-2"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <AuthAlert variant="success">
            Password reset instructions were sent to <strong>{email}</strong>.
          </AuthAlert>
          <p className="text-sm text-slate-600">
            Please check your inbox and spam folder. If you still do not receive it in a few minutes,
            try requesting another email.
          </p>
          <button onClick={resetForm} className="text-sm font-semibold text-[#2C5F5D] hover:underline">
            Send another email
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
