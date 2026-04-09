"use client";

import Link from "next/link";
import { BadgeCheck, Sparkles, TrendingUp } from "lucide-react";

export default function HostBanner() {
  return (
    <section className="relative my-16 py-10 sm:my-18 sm:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-[#dcefed]/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative min-h-125 overflow-hidden rounded-4xl border border-[#c9dedd] shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:min-h-135 md:min-h-150">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            }}
          />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/72 via-slate-900/45 to-slate-950/10" />
          <div className="absolute inset-0 bg-linear-to-t from-[#041018]/60 via-transparent to-transparent" />
          <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#7ec8bb]/18 blur-3xl" />
          <div className="absolute right-10 top-10 h-40 w-40 rounded-full border border-white/18 bg-white/10 backdrop-blur-sm" />
          <div className="absolute bottom-8 right-16 h-36 w-36 rounded-full bg-[#2f6763]/25 blur-3xl" />

          <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-slate-950/82 via-slate-900/48 to-transparent md:w-[62%]" />

          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-12 sm:px-10 sm:py-16">
            <div className="max-w-2xl rounded-3xl border border-white/18 bg-white/8 p-6 backdrop-blur-md sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.26em] text-white/85">
                <Sparkles className="h-4 w-4 text-[#9ce3d4]" />
                Host with PropBnb
              </div>

              <h2 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Unlock the potential of your space.
              </h2>
              <p className="mb-7 text-base leading-relaxed text-slate-100/92 sm:text-lg">
                Join a community of thousands who have turned their properties into successful short-stay
                businesses. We handle the complexity, you keep the rewards.
              </p>

              <div className="mb-8 flex flex-wrap gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  <TrendingUp className="h-4 w-4 text-[#9ce3d4]" />
                  Smart pricing support
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  <BadgeCheck className="h-4 w-4 text-[#9ce3d4]" />
                  Trusted host tools
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/host/add-property/basics"
                  className="rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-slate-900 shadow-lg shadow-slate-900/25 transition hover:bg-slate-100"
                >
                  Become a host
                </Link>
                <Link
                  href="/host"
                  className="rounded-xl border border-white/60 bg-white/5 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-white/12"
                >
                  Learn how it works
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-slate-950/75 to-transparent" />
        </div>
      </div>
    </section>
  );
}
