"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Share2,
  CalendarDays,
  Users,
  LogIn,
  LogOut,
  DollarSign,
} from "lucide-react";

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900 flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[#2C5F5D]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold">StayTeal</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-[12px] font-semibold text-slate-600">
            <Link href="/explore" className="hover:text-slate-900">
              Explore
            </Link>
            <Link href="/trips" className="hover:text-slate-900">
              Trips
            </Link>
            <Link href="/messages" className="hover:text-slate-900">
              Messages
            </Link>
          </nav>

          <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
            🙂
          </div>
        </div>
      </header>

      {/* Center Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col items-center text-center">
            {/* Check icon */}
            <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#2C5F5D] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-bold">Booking Confirmed!</h1>
            <p className="mt-2 text-[12px] text-slate-500 max-w-[520px] leading-relaxed">
              Pack your bags! Your stay at Seaside Modern Villa is confirmed. We&apos;ve sent the
              details to your email.
            </p>

            {/* Booking Card */}
            <section className="mt-8 w-full max-w-[560px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold tracking-widest text-slate-500">
                      BOOKING ID: <span className="tracking-normal font-semibold">BK-9921</span>
                    </div>

                    <div className="mt-1 text-[16px] font-bold text-slate-900">
                      Seaside Modern Villa
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-[12px] text-slate-600">
                      <CalendarDays className="w-4 h-4 text-slate-500" />
                      <span>Oct 12 - Oct 15, 2025</span>
                      <span className="text-slate-300">•</span>
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>2 Guests</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 transition text-[11px] font-semibold text-slate-700">
                        <Download className="w-4 h-4" />
                        Download Receipt
                      </button>

                      <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 transition text-[11px] font-semibold text-slate-700">
                        <Share2 className="w-4 h-4" />
                        Share Trip
                      </button>
                    </div>
                  </div>

                  {/* Right image */}
                  <div className="w-[170px] h-[92px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img
                      alt="Villa"
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-200 my-5" />

                {/* Details rows */}
                <div className="space-y-3 text-[12px]">
                  <DetailRow
                    icon={<LogIn className="w-4 h-4 text-slate-500" />}
                    label="Check-in"
                    value="3:00 PM"
                  />
                  <DetailRow
                    icon={<LogOut className="w-4 h-4 text-slate-500" />}
                    label="Check-out"
                    value="11:00 AM"
                  />
                  <DetailRow
                    icon={<DollarSign className="w-4 h-4 text-slate-500" />}
                    label="Total Paid"
                    value="$750.00"
                    valueBold
                  />
                </div>
              </div>
            </section>

            {/* CTA buttons */}
            <div className="mt-8 w-full max-w-[560px] flex flex-col items-center gap-3">
              <Link
                href="/trips"
                className="w-full max-w-[360px] text-center bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white font-semibold text-[12px] py-3 rounded-lg"
              >
                View My Trip
              </Link>

              <Link
                href="/"
                className="text-[12px] text-slate-500 hover:text-slate-700 transition"
              >
                ← Back to Home
              </Link>

              <p className="mt-6 text-[11px] text-slate-500">
                Need help?{" "}
                <span className="underline decoration-slate-300 underline-offset-2 cursor-pointer hover:text-slate-700">
                  Contact our support team
                </span>{" "}
                or{" "}
                <span className="underline decoration-slate-300 underline-offset-2 cursor-pointer hover:text-slate-700">
                  message the host
                </span>{" "}
                directly.
              </p>

              <p className="mt-6 text-[11px] text-slate-400">
                © {new Date().getFullYear()} StayTeal Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueBold,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueBold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-600">
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
        <span>{label}</span>
      </div>

      <div className={valueBold ? "font-bold text-slate-900" : "text-slate-700"}>
        {value}
      </div>
    </div>
  );
}
