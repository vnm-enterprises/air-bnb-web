"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  CalendarDays,
  Users,
  Star,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/listings", label: "Listings", icon: Home, exact: false },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays, exact: false },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/reviews", label: "Reviews", icon: Star, exact: false },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin())) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p: string) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";
  const displayName = user?.name || "Admin";

  function isActive(item: { href: string; exact: boolean }) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  }

  const SidebarContents = () => (
    <>
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
          <div className="w-8 h-8 rounded-lg bg-violet-600 text-white grid place-items-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[13px] font-bold leading-none text-white">StayTeal</div>
            <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Admin Console</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
          Management
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                active
                  ? "bg-violet-600/20 text-violet-300 font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
              ].join(" ")}
            >
              <span
                className={[
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  active ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-500",
                ].join(" ")}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span>{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />}
            </Link>
          );
        })}

        <div className="mt-5 pt-5 border-t border-slate-800 space-y-0.5">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
              <Home className="w-4 h-4" />
            </span>
            Back to Site
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-slate-200 truncate">{displayName}</div>
            <div className="text-[10px] text-slate-500">Administrator</div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Logout"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-red-400 transition disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-40">
        <SidebarContents />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 text-white grid place-items-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-[13px] font-bold text-white">Admin Console</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/60 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 md:hidden pt-14">
            <SidebarContents />
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="md:ml-60 min-h-screen pt-14 md:pt-0">{children}</main>
    </div>
  );
}
