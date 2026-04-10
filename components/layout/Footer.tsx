"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[#d2e4e3] bg-linear-to-b from-[#f3faf9] via-[#e9f4f3] to-[#dfeeed] text-slate-700">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/55 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-[#cfe2e0] bg-white/58 p-6 text-sm shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1fr] lg:p-8">
          <div>
            <Link href="/about" className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2C5F5D] transition hover:text-[#234c4a]">
              Why PropBnb
            </Link>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">Everything important, right where guests and hosts expect it.</h3>
            <p className="mt-3 max-w-sm leading-6 text-slate-600">
              The footer now focuses on essential navigation: guest support, hosting tools, and legal information.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-[#d5e6e4] bg-white px-4 py-2 font-medium text-[#2C5F5D] transition hover:border-[#2C5F5D]"
              >
                Learn more
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center rounded-full border border-transparent bg-[#2C5F5D] px-4 py-2 font-medium text-white transition hover:bg-[#234c4a]"
              >
                Browse stays
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Guest Support</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link href="/help-center" className="transition hover:text-[#2C5F5D]">Help Center</Link></li>
              <li><Link href="/safety" className="transition hover:text-[#2C5F5D]">Safety Information</Link></li>
              <li><Link href="/cancellation-options" className="transition hover:text-[#2C5F5D]">Cancellation Options</Link></li>
              <li><Link href="/support" className="transition hover:text-[#2C5F5D]">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Hosting</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link href="/host" className="transition hover:text-[#2C5F5D]">Become a Host</Link></li>
              <li><Link href="/host/resources" className="transition hover:text-[#2C5F5D]">Host Resources</Link></li>
              <li><Link href="/host/dashboard" className="transition hover:text-[#2C5F5D]">Host Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Legal</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link href="/privacy-policy" className="transition hover:text-[#2C5F5D]">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="transition hover:text-[#2C5F5D]">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#d2e4e3] pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-600 md:flex-row">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} <Link href="/" className="font-medium text-slate-700 transition hover:text-[#2C5F5D]">PropBnb</Link>. All rights reserved.
            </div>

            <div className="text-center">
              Designed & Developed by{" "}
              <a
                href="https://maximumeffortlk.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#2C5F5D] hover:underline"
              >
                MES
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
