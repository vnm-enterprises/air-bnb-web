import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  sideTitle: string;
  sideDescription: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  sideTitle,
  sideDescription,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <aside className="hidden bg-[#2C5F5D] px-20 py-16 text-white lg:flex lg:flex-col lg:justify-center">
          <h2 className="text-4xl font-bold leading-tight">{sideTitle}</h2>
          <p className="mt-6 max-w-md text-sm opacity-85">{sideDescription}</p>
        </aside>

        <main className="flex items-center justify-center px-6 py-12 sm:py-16">
          <div className="w-full max-w-md">
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
