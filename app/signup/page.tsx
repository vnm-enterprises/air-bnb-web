"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth";

type Role = "traveler" | "host";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("traveler");
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => passwordStrength(pw), [pw]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }
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
    if (pw.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (!agreedTerms) {
      setError("You must agree to the Terms of Service");
      setLoading(false);
      return;
    }

    try {
      const res = await signup({ name, email, password: pw, role });
      
      if (res.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPw("");
        
        // Redirect to verify email page or login after a short delay
        setTimeout(() => {
          router.push(`/login?message=${encodeURIComponent("Please check your email to verify your account")}`);
        }, 2000);
      } else {
        setError(res.error || "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT IMAGE PANEL */}
        <div className="relative hidden lg:block">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80)",
            }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-[#0f4a47]/70" />

          {/* Top brand */}
          <div className="relative z-10 p-10 flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-md bg-white/15 border border-white/25 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-semibold">StayTeal</span>
          </div>

          {/* Hero copy */}
          <div className="relative z-10 px-10 mt-14 max-w-[520px]">
            <h1 className="text-white text-4xl font-extrabold leading-tight">
              Experience the art of hospitality.
            </h1>
            <p className="text-white/75 text-[13px] leading-relaxed mt-4 max-w-[420px]">
              Whether you&apos;re exploring the world or opening your doors, StayTeal makes every
              stay feel like home.
            </p>
          </div>

          {/* Bottom social proof */}
          <div className="absolute left-10 bottom-10 z-10 text-white/80 text-[12px] flex items-center gap-3">
            <AvatarStack />
            <span>Joined by 10k+ travelers this month</span>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="bg-white flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[460px]">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="text-[#2C5F5D]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="font-semibold">StayTeal</span>
            </div>

            <h2 className="text-2xl font-bold">Begin your journey</h2>
            <p className="text-[12px] text-slate-500 mt-2">
              Join our community of travelers and hosts.
            </p>

            {success ? (
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-[12px] font-semibold">
                  ✓ Signup successful! Please check your email to verify your account.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Role toggle */}
                <div className="mt-5 bg-slate-100 border border-slate-200 rounded-md p-1 flex">
                  <button
                    type="button"
                    onClick={() => setRole("traveler")}
                    className={[
                      "flex-1 h-9 rounded-md text-[12px] font-semibold transition",
                      role === "traveler"
                        ? "bg-white shadow-sm text-slate-900"
                        : "text-slate-600 hover:text-slate-900",
                    ].join(" ")}
                  >
                    I&apos;m a Traveler
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("host")}
                    className={[
                      "flex-1 h-9 rounded-md text-[12px] font-semibold transition",
                      role === "host"
                        ? "bg-white shadow-sm text-slate-900"
                        : "text-slate-600 hover:text-slate-900",
                    ].join(" ")}
                  >
                    I&apos;m a Host
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-[12px] font-semibold">{error}</p>
                  </div>
                )}

                {/* Form */}
                <div className="mt-6 space-y-4">
                  <Field
                    label="Full Name"
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Field
                    label="Email Address"
                    placeholder="alex@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-700"
                        onClick={() => setShowPw((v) => !v)}
                      >
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>

                    <div className="mt-2 relative">
                      <input
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        type={showPw ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        className="w-full h-10 px-3 pr-10 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </div>

                    {/* Strength bar */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[#2C5F5D]"
                          style={{ width: `${strength.pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-500">
                        {strength.label}
                      </span>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 accent-[#2C5F5D]"
                    />
                    <span>
                      I agree to the{" "}
                      <span className="underline decoration-slate-300 underline-offset-2 cursor-pointer text-slate-600">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="underline decoration-slate-300 underline-offset-2 cursor-pointer text-slate-600">
                        Privacy Policy
                      </span>
                      . I also agree to receive occasional updates from StayTeal.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-md bg-[#2C5F5D] hover:bg-[#244f4d] disabled:opacity-50 transition text-white font-semibold text-[12px]"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  {/* Divider */}
                  <div className="pt-2">
                    <div className="flex items-center gap-3">
                      <div className="h-px bg-slate-200 flex-1" />
                      <span className="text-[10px] text-slate-400 tracking-widest">
                        OR SIGN UP WITH
                      </span>
                      <div className="h-px bg-slate-200 flex-1" />
                    </div>
                  </div>

                  {/* Social */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={loading}
                      className="h-10 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition flex items-center justify-center gap-2 text-[12px] font-semibold text-slate-700"
                    >
                      <GoogleIcon />
                      Google
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      className="h-10 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition flex items-center justify-center gap-2 text-[12px] font-semibold text-slate-700"
                    >
                      <AppleIcon />
                      Apple
                    </button>
                  </div>

                  <p className="text-center text-[11px] text-slate-500 pt-1">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[#2C5F5D] hover:text-[#244f4d]"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* Small note (keeps spacing similar) */}
            <p className="text-center text-[11px] text-slate-400 mt-8">
              © {new Date().getFullYear()} StayTeal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable field */
function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
      />
    </div>
  );
}

/* Password strength helper */
function passwordStrength(pw: string): { pct: number; label: string } {
  const p = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /\d/.test(pw);
  const hasSym = /[^A-Za-z0-9]/.test(pw);

  let score = 0;
  if (p >= 8) score += 1;
  if (p >= 12) score += 1;
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNum) score += 1;
  if (hasSym) score += 1;

  const pct = Math.min(100, Math.round((score / 6) * 100));

  let label = "WEAK";
  if (pct >= 70) label = "STRONG";
  else if (pct >= 45) label = "MEDIUM";

  return { pct: Math.max(8, pct), label };
}

/* Avatar stack like screenshot */
function AvatarStack() {
  return (
    <div className="flex -space-x-2">
      <div className="w-7 h-7 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-[11px]">
        😊
      </div>
      <div className="w-7 h-7 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-[11px]">
        😄
      </div>
      <div className="w-7 h-7 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-[11px]">
        🙂 
      </div>
    </div>
  );
}

/* Inline icons */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.648 32.657 29.239 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.962 3.038l5.657-5.657C34.046 6.053 29.272 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.962 3.038l5.657-5.657C34.046 6.053 29.272 4 24 4c-7.682 0-14.363 4.338-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.217 0-9.611-3.317-11.267-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a11.97 11.97 0 0 1-4.084 5.565l.003-.002 6.19 5.238C36.971 39.169 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.365 1.43c0 1.14-.43 2.2-1.17 3.02-.8.9-2.11 1.6-3.34 1.51-.16-1.16.43-2.32 1.14-3.13.79-.9 2.19-1.58 3.37-1.4ZM20.62 17.37c-.48 1.11-.71 1.6-1.33 2.59-.87 1.38-2.1 3.11-3.62 3.12-1.35.01-1.7-.88-3.53-.87-1.84.01-2.23.89-3.58.87-1.52-.01-2.69-1.58-3.56-2.96-2.44-3.86-2.7-8.39-1.19-10.7 1.07-1.64 2.76-2.6 4.35-2.6 1.62 0 2.64.9 3.98.9 1.3 0 2.09-.9 3.97-.9 1.42 0 2.93.78 4 2.12-3.52 1.93-2.95 7.04.51 8.43Z"
      />
    </svg>
  );
}