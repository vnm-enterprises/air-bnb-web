"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email address");
      setLoading(false);
      return;
    }

    // Call API
    const res = await requestPasswordReset(email);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Failed to send reset email");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f4f4] flex">

      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2C5F5D] text-white flex-col justify-center px-20">
        <h2 className="text-4xl font-bold leading-tight">
          Reset Your Password
        </h2>
        <p className="mt-6 text-sm opacity-80 max-w-md">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* RIGHT AUTH SECTION */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">

        <div className="w-full max-w-md">

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-10 py-10">

            {!success ? (
              <>
                <h1 className="text-2xl font-bold text-center">
                  Forgot Password
                </h1>

                <p className="text-center text-sm text-slate-500 mt-2">
                  We'll send you a reset link via email.
                </p>

                {/* FORM */}
                <form onSubmit={handleSubmit}>
                  <div className="mt-8 space-y-5">

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-[12px] font-semibold">{error}</p>
                      </div>
                    )}

                    {/* Email Input */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-[#2C5F5D] outline-none"
                        disabled={loading}
                        autoFocus
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-[#2C5F5D] text-white rounded-lg font-semibold hover:bg-[#244f4d] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                  </div>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-[#2C5F5D] hover:underline font-semibold"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </>
            ) : (
              /* SUCCESS MESSAGE */
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Check Your Email
                </h2>

                <p className="text-sm text-slate-600 mt-3 max-w-sm mx-auto">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and follow the instructions.
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full h-11 bg-[#2C5F5D] text-white rounded-lg font-semibold hover:bg-[#244f4d] transition"
                  >
                    Back to Login
                  </button>

                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="w-full text-sm text-[#2C5F5D] hover:underline"
                  >
                    Didn't receive the email? Try again
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Help Text */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Having trouble? <Link href="/support" className="text-[#2C5F5D] hover:underline">Contact Support</Link>
          </p>

        </div>

      </div>

    </div>
  );
}
