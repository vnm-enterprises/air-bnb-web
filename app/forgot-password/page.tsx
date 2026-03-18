"use client";

import Link from "next/link";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    setError("");

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await requestPasswordReset(normalizedEmail);

      if (!result.success) {
        setError(result.error || "Unable to send reset instructions right now.");
        return;
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

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
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#2C5F5D]"
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-[#2C5F5D] font-semibold text-white transition hover:bg-[#244f4d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
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
          <button
            onClick={() => {
              setSuccess(false);
              setError("");
              setEmail("");
            }}
            className="text-sm font-semibold text-[#2C5F5D] hover:underline"
          >
            Send another email
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
