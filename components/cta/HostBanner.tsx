"use client";

import Link from "next/link";

export default function HostBanner() {
  return (
    <section className="my-14 bg-slate-200 py-10 sm:my-16 sm:py-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl">
        <div className="relative min-h-[460px] overflow-hidden rounded-2xl sm:min-h-[520px] md:min-h-[560px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-800/30" />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-slate-900/80 to-transparent md:w-[65%]" />

          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-12 sm:px-10 sm:py-16">
            <div className="max-w-2xl">
              <h2 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Unlock the potential of your space.
              </h2>
              <p className="mb-8 text-base text-slate-200 sm:text-lg">
                Join a community of thousands who have turned their properties into successful short-stay
                businesses. We handle the complexity, you keep the rewards.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/host/add-property/basics"
                  className="rounded-xl bg-white px-6 py-3 text-center font-medium text-slate-900 shadow-lg transition hover:bg-slate-100"
                >
                  Become a host
                </Link>
                <Link
                  href="/host"
                  className="rounded-xl border border-white px-6 py-3 text-center font-medium text-white transition hover:bg-white/10"
                >
                  Learn how it works
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-slate-900/90 to-transparent" />
        </div>
      </div>
    </section>
  );
}
