"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(searchParams.get("message") || "");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/properties");
    }
  }, [isAuthenticated, router]);

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
    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    // Call login from context
    const res = await login(email, password);
    
    if (res.success) {
      // Redirect to properties or dashboard
      router.push("/properties");
    } else {
      setError(res.message || "Login failed");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f4f4] flex">

      {/* LEFT BRAND PANEL (Same as signup) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2C5F5D] text-white flex-col justify-center px-20">
        <h2 className="text-4xl font-bold leading-tight">
          Welcome back to StayTeal
        </h2>
        <p className="mt-6 text-sm opacity-80 max-w-md">
          Manage your stays, bookings, and properties effortlessly.
          Your journey continues here.
        </p>
      </div>

      {/* RIGHT AUTH SECTION */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">

        <div className="w-full max-w-md">

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-10 py-10">

            <h1 className="text-2xl font-bold text-center">
              Sign In
            </h1>

            <p className="text-center text-sm text-slate-500 mt-2">
              Access your account to continue.
            </p>

            {message && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 text-[12px]">{message}</p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="mt-8 space-y-5">

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-[12px] font-semibold">{error}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-[#2C5F5D] outline-none"
                    disabled={loading}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <Link 
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#2C5F5D] hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>

                  <div className="mt-2 relative">
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 px-4 pr-12 rounded-lg border border-slate-200 focus:border-[#2C5F5D] outline-none"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      disabled={loading}
                    >
                      {showPw ? (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-lg bg-[#2C5F5D] hover:bg-[#244f4d] disabled:opacity-50 text-white font-semibold transition"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

              </div>
            </form>

            {/* DIVIDER */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs text-slate-400">
                Or continue with
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {/* SOCIAL */}
            <div className="mt-6 grid grid-cols-2 gap-4">

              <button 
                type="button"
                disabled={loading}
                className="h-11 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition font-semibold text-sm"
              >
                Google
              </button>

              <button 
                type="button"
                disabled={loading}
                className="h-11 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition font-semibold text-sm"
              >
                Apple
              </button>

            </div>

            <p className="mt-8 text-center text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#2C5F5D] hover:underline"
              >
                Create account
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
