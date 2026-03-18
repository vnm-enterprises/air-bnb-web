"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  Home,
  CalendarDays,
  Plus,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/host", label: "Dashboard", icon: LayoutGrid },
  { href: "/host/listings", label: "Listings", icon: Home },
  { href: "/host/bookings", label: "Bookings", icon: CalendarDays },
] as const;

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHost, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isHost())) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isHost, router]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f4f4]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  if (!isAuthenticated || !isHost()) {
    return null;
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p: string) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "HO";
  const displayName = user?.name || "Host";

  const pageTitle = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Host Portal";

  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      {/* ─── Desktop sidebar ─── */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-slate-200 hidden md:flex flex-col z-40">
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
            <div className="w-8 h-8 rounded-lg bg-[#2C5F5D] text-white grid place-items-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold leading-none text-slate-900">StayTeal</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Host Portal</div>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                  active
                    ? "bg-[#edf5f5] text-[#2C5F5D] font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    active ? "bg-[#2C5F5D] text-white" : "bg-slate-100 text-slate-400",
                  ].join(" ")}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span>{label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2C5F5D]" />
                )}
              </Link>
            );
          })}

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
              Actions
            </p>

            <Link
              href="/host/add-property/basics"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </span>
              Add New Listing
            </Link>

            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </span>
              Back to Site
            </Link>
          </div>
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f6f4f4]">
            <div className="w-8 h-8 rounded-full bg-[#2C5F5D] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-slate-800 truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-slate-400">Host Account</div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-1.5 rounded-lg hover:bg-slate-200 transition disabled:opacity-50"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Desktop top bar (right side of sidebar) ─── */}
      <div className="hidden md:flex fixed top-0 left-60 right-0 h-16 bg-white border-b border-slate-200 z-30 items-center justify-between px-6">
        <div className="text-[14px] font-semibold text-slate-800">{pageTitle}</div>
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-500" />
          </button>
          <Link
            href="/"
            className="text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-md px-3 py-2 hover:bg-slate-50 transition"
          >
            ← Back to Site
          </Link>
        </div>
      </div>

      {/* ─── Mobile header ─── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="h-14 px-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#2C5F5D] text-white grid place-items-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900">StayTeal Host</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/host/add-property/basics"
              className="bg-[#2C5F5D] text-white text-[11px] font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </Link>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down nav */}
        {mobileOpen && (
          <div className="bg-white border-t border-slate-200 px-4 pb-4 pt-2 space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition",
                    active
                      ? "bg-[#edf5f5] text-[#2C5F5D] font-semibold"
                      : "text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </header>

      {/* ─── Page content ─── */}
      <div className="md:ml-60 md:pt-16 pt-14">{children}</div>
    </div>
  );
}
