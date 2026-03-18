"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/lib/auth";
export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const params =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search);
  const key = params?.get("key") || "";
  const login = params?.get("login") || "";
  const invalidLink = !key || !login;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (invalidLink) {
      setError("Invalid reset link. Please request a new password reset.");
      setLoading(false);
      return;
    }

    // Validation
    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      setLoading(false);
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number");
      setLoading(false);
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character (@, #, $, etc.)");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Call API
    const res = await resetPassword(key, login, password);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login?message=Password reset successful. Please login.");
      }, 2000);
    } else {
      setError(res.error || "Password reset failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f4f4] flex">

      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2C5F5D] text-white flex-col justify-center px-20">
        <h2 className="text-4xl font-bold leading-tight">
          Create New Password
        </h2>
        <p className="mt-6 text-sm opacity-80 max-w-md">
          Choose a strong password to secure your account.
        </p>
      </div>

      {/* RIGHT AUTH SECTION */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">

        <div className="w-full max-w-md">

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-10 py-10">

            {!success ? (
              <>
                <h1 className="text-2xl font-bold text-center">
                  Reset Password
                </h1>

                <p className="text-center text-sm text-slate-500 mt-2">
                  Enter your new password below.
                </p>

                {/* FORM */}
                <form onSubmit={handleSubmit}>
                  <div className="mt-8 space-y-5">

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-[12px] font-semibold">{error}</p>
                      </div>
                    )}

                    {invalidLink && !error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-[12px] font-semibold">
                          Invalid reset link. Please request a new password reset.
                        </p>
                      </div>
                    )}

                    {/* New Password Input */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        New Password
                      </label>
                      <div className="mt-2 relative">
                        <input
                          type={showPw ? "text" : "password"}
                          placeholder="Min 8 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-11 px-4 pr-12 rounded-lg border border-slate-200 focus:border-[#2C5F5D] outline-none"
                          disabled={loading}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          {showPw ? (
                            <EyeOff className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Must have uppercase, lowercase, number & special character
                      </p>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        Confirm Password
                      </label>
                      <div className="mt-2 relative">
                        <input
                          type={showConfirmPw ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-11 px-4 pr-12 rounded-lg border border-slate-200 focus:border-[#2C5F5D] outline-none"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPw ? (
                            <EyeOff className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || invalidLink}
                      className="w-full h-11 bg-[#2C5F5D] text-white rounded-lg font-semibold hover:bg-[#244f4d] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
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
                  Password Reset!
                </h2>

                <p className="text-sm text-slate-600 mt-3">
                  Your password has been successfully reset. Redirecting to login...
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
