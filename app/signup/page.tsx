"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";

type Role = "traveler" | "host";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getPasswordValidationError(password: string): string {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include at least one special character.";
  }

  return "";
}

function passwordStrength(password: string): { pct: number; label: string } {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /\d/.test(password);
  const hasSym = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNum) score += 1;
  if (hasSym) score += 1;

  const pct = Math.min(100, Math.round((score / 6) * 100));

  if (pct >= 70) {
    return { pct: Math.max(10, pct), label: "STRONG" };
  }

  if (pct >= 45) {
    return { pct: Math.max(10, pct), label: "MEDIUM" };
  }

  return { pct: Math.max(10, pct), label: "WEAK" };
}

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("traveler");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    setError("");

    if (!normalizedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!agreedTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name: normalizedName,
        email: normalizedEmail,
        password,
        role,
      });

      if (!result.success) {
        setError(result.error || "Unable to create your account right now.");
        return;
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setAgreedTerms(false);

      setTimeout(() => {
        router.push(
          `/login?message=${encodeURIComponent("Please check your email to verify your account")}`
        );
      }, 1800);
    } catch {
      setError("Something went wrong while creating your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="e.g. Alex Johnson"
              className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-300"
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="alex@example.com"
              className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-300"
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
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className="h-10 w-full rounded-md border border-slate-200 px-3 pr-10 text-sm outline-none focus:border-slate-300"
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

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-md bg-[#2C5F5D] text-sm font-semibold text-white transition hover:bg-[#244f4d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
