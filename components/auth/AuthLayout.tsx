import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  sideTitle: string;
  sideDescription: string;
  children: ReactNode;
  footer?: ReactNode;
  sideImageUrl?: string;
}

export default function AuthLayout({
  title,
  subtitle,
  sideTitle,
  sideDescription,
  children,
  footer,
  sideImageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=80",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden px-20 py-16 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${sideImageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a4341]/80 via-[#2C5F5D]/74 to-[#153331]/88" />

          <div className="relative z-10 flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur hover:bg-white/20"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold leading-tight">{sideTitle}</h2>
            <p className="mt-6 max-w-md text-sm opacity-90">{sideDescription}</p>
          </div>
        </aside>

        <main className="flex items-center justify-center px-6 py-12 sm:py-16">
          <div className="w-full max-w-md">
            <div className="mb-4 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Back to Home
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
              <div className="mb-8 text-center">
                <Link href="/" className="mb-4 inline-flex items-center gap-2 text-[#2C5F5D]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
                  </svg>
                  <span className="font-semibold">StayTeal</span>
                </Link>

                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
              </div>

              {children}
            </div>

            {footer && <div className="mt-6 text-center text-xs text-slate-500">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
