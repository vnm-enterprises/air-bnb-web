"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<"user" | "host">("user");

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

            {/* ROLE SELECTOR */}
            <div className="mt-6 bg-slate-100 rounded-lg p-1 flex text-sm font-semibold">
              <button
                onClick={() => setRole("user")}
                className={`flex-1 py-2 rounded-md transition ${
                  role === "user"
                    ? "bg-white shadow text-[#2C5F5D]"
                    : "text-slate-600"
                }`}
              >
                User
              </button>

              <button
                onClick={() => setRole("host")}
                className={`flex-1 py-2 rounded-md transition ${
                  role === "host"
                    ? "bg-white shadow text-[#2C5F5D]"
                    : "text-slate-600"
                }`}
              >
                Host
              </button>
            </div>

            {/* FORM */}
            <div className="mt-8 space-y-5">

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="mt-2 w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-[#2C5F5D] outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button className="text-xs font-semibold text-[#2C5F5D] hover:underline">
                    Forgot?
                  </button>
                </div>

                <div className="mt-2 relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-11 px-4 pr-12 rounded-lg border border-slate-200 focus:border-[#2C5F5D] outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              <button className="w-full h-12 rounded-lg bg-[#2C5F5D] hover:bg-[#244f4d] text-white font-semibold transition">
                Sign In as {role === "user" ? "User" : "Host"}
              </button>

            </div>

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

              <button className="h-11 border border-slate-200 rounded-lg hover:bg-slate-50 transition font-semibold text-sm">
                Google
              </button>

              <button className="h-11 border border-slate-200 rounded-lg hover:bg-slate-50 transition font-semibold text-sm">
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
