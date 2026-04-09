"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[#d2e4e3] bg-linear-to-b from-[#f3faf9] via-[#e9f4f3] to-[#dfeeed] text-slate-700">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/55 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-14">
        <div className="mb-10 grid gap-6 rounded-3xl border border-[#cfe2e0] bg-white/72 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur sm:grid-cols-[1.35fr_1fr] sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#2C5F5D]">PropBnb</p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Stay inspired. Travel smarter.
            </h2>
            <p className="mt-3 max-w-xl text-base text-slate-600">
              Discover unforgettable stays, host with confidence, and manage your travel journey from one refined platform.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-600 sm:justify-self-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d5e6e4] bg-[#f2fbfa] px-4 py-2">
              <Mail className="h-4 w-4 text-[#2C5F5D]" />
              support@propbnb.com
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d5e6e4] bg-[#f2fbfa] px-4 py-2">
              <Phone className="h-4 w-4 text-[#2C5F5D]" />
              +94 77 123 4567
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d5e6e4] bg-[#f2fbfa] px-4 py-2">
              <MapPin className="h-4 w-4 text-[#2C5F5D]" />
              Colombo, Sri Lanka
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Support</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link href="/support" className="transition hover:text-[#2C5F5D]">Help Center</Link></li>
              <li><Link href="/support?safety=1" className="transition hover:text-[#2C5F5D]">Safety Information</Link></li>
              <li><Link href="/support?topic=cancellation" className="transition hover:text-[#2C5F5D]">Cancellation Options</Link></li>
              <li><Link href="/support?topic=report" className="transition hover:text-[#2C5F5D]">Report Concern</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Hosting</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link href="/host" className="transition hover:text-[#2C5F5D]">Become a Host</Link></li>
              <li><Link href="/host/dashboard" className="transition hover:text-[#2C5F5D]">Host Resources</Link></li>
              <li><Link href="/host/bookings" className="transition hover:text-[#2C5F5D]">Community Forum</Link></li>
              <li><Link href="/host/listings" className="transition hover:text-[#2C5F5D]">Responsible Hosting</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Company</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link href="/" className="transition hover:text-[#2C5F5D]">About</Link></li>
              <li><Link href="/properties" className="transition hover:text-[#2C5F5D]">Careers</Link></li>
              <li><Link href="/support" className="transition hover:text-[#2C5F5D]">Press</Link></li>
              <li><Link href="/profile" className="transition hover:text-[#2C5F5D]">Investors</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Legal</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link href="/support?topic=privacy" className="transition hover:text-[#2C5F5D]">Privacy Policy</Link></li>
              <li><Link href="/support?topic=terms" className="transition hover:text-[#2C5F5D]">Terms of Service</Link></li>
              <li><Link href="/support?topic=cookies" className="transition hover:text-[#2C5F5D]">Cookie Policy</Link></li>
              <li><Link href="/support?topic=accessibility" className="transition hover:text-[#2C5F5D]">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#d2e4e3] pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-600 md:flex-row">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} PropBnb. All rights reserved.
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
