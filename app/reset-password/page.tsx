"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/lib/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";

function getPasswordError(password: string, confirmPassword: string): string {
  if (!password) {
    return "Please enter a new password.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const query = useMemo(() => {
    if (typeof window === "undefined") {
      return { key: "", login: "" };
    }

    const params = new URLSearchParams(window.location.search);
    return {
      key: params.get("key") || "",
      login: params.get("login") || "",
    };
  }, []);

  const invalidLink = !query.key || !query.login;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (invalidLink) {
      setError("This reset link is invalid or expired. Please request a new one.");
      return;
    }

    const passwordError = getPasswordError(password, confirmPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(query.key, query.login, password);

      if (!result.success) {
        setError(result.error || "Unable to reset password. Please request a new link.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?message=Password reset successful. You can now sign in.");
      }, 1800);
    } finally {
      setLoading(false);
    }
  };

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
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 px-4 pr-12 outline-none focus:border-[#2C5F5D]"
                disabled={loading}
                autoComplete="new-password"
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
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 px-4 pr-12 outline-none focus:border-[#2C5F5D]"
                disabled={loading}
                autoComplete="new-password"
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

          <button
            type="submit"
            disabled={loading || invalidLink}
            className="h-11 w-full rounded-lg bg-[#2C5F5D] font-semibold text-white transition hover:bg-[#244f4d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <AuthAlert variant="success">
          Password updated successfully. Redirecting you to login...
        </AuthAlert>
      )}
    </AuthLayout>
  );
}
