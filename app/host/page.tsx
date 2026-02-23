"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Bell,
  Plus,
  LayoutGrid,
  Home,
  CalendarDays,
  Mail,
  BarChart3,
  Settings,
  MoreHorizontal,
} from "lucide-react";

type BookingStatus = "Confirmed" | "Pending";

type RecentBooking = {
  id: string;
  guest: string;
  guestsMeta: string;
  property: string;
  location: string;
  dates: string;
  amount: string;
  status: BookingStatus;
};

const RECENT: RecentBooking[] = [
  {
    id: "1",
    guest: "Sarah Jenkins",
    guestsMeta: "2 guests",
    property: "Ocean View Villa",
    location: "Malibu, CA",
    dates: "Oct 12 - Oct 15",
    amount: "$1,240.00",
    status: "Confirmed",
  },
  {
    id: "2",
    guest: "Marcus Chen",
    guestsMeta: "1 guest",
    property: "Urban Loft",
    location: "Austin, TX",
    dates: "Oct 18 - Oct 20",
    amount: "$450.00",
    status: "Pending",
  },
  {
    id: "3",
    guest: "David Miller",
    guestsMeta: "4 guests",
    property: "Mountain Retreat",
    location: "Aspen, CO",
    dates: "Nov 02 - Nov 07",
    amount: "$2,160.00",
    status: "Confirmed",
  },
];

export default function HostDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isHost, loading } = useAuth();
  const [q, setQ] = useState("");

  // Redirect if not authenticated or not a host
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isHost())) {
      router.push('/login');
    }
  }, [isAuthenticated, isHost, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  const rows = useMemo(() => {
    const x = q.trim().toLowerCase();
    if (!x) return RECENT;
    return RECENT.filter(
      (r) =>
        r.guest.toLowerCase().includes(x) ||
        r.property.toLowerCase().includes(x) ||
        r.location.toLowerCase().includes(x)
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-[240px] bg-white border-r border-slate-200 hidden md:flex flex-col">
          <div className="px-5 h-14 flex items-center border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-bold leading-none">StayHost</div>
                <div className="text-[10px] text-slate-400 mt-1 leading-none">
                  Property Manager
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-1">
              <SideLink href="/host/dashboard" active icon={<LayoutGrid className="w-4 h-4" />}>
                Dashboard
              </SideLink>
              <SideLink href="/host/listings" icon={<Home className="w-4 h-4" />}>
                Listings
              </SideLink>
              <SideLink href="/host/bookings" icon={<CalendarDays className="w-4 h-4" />}>
                Bookings
              </SideLink>
              <SideLink href="/host/messages" icon={<Mail className="w-4 h-4" />}>
                Messages
              </SideLink>
              <SideLink href="/host/analytics" icon={<BarChart3 className="w-4 h-4" />}>
                Analytics
              </SideLink>
            </div>
          </div>

          <div className="mt-auto p-4">
            <SideLink href="/host/settings" icon={<Settings className="w-4 h-4" />}>
              Settings
            </SideLink>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
                🙂
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold truncate">Alex Thompson</div>
                <div className="text-[10px] text-slate-400">Pro Host</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Top bar */}
          <header className="bg-white border-b border-slate-200">
            <div className="px-6 h-14 flex items-center justify-between gap-4">
              <div className="relative w-full max-w-[520px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search bookings or guest names..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-[12px] outline-none focus:bg-white focus:border-slate-300"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-600" />
                </button>

                <button className="inline-flex items-center gap-2 bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white text-[11px] font-semibold px-3 py-2 rounded-md">
                  <Plus className="w-4 h-4" />
                  Add New Listing
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="px-6 py-8">
            <h1 className="text-2xl font-bold">Welcome back, Alex</h1>
            <p className="text-[12px] text-slate-500 mt-2">
              Here&apos;s a snapshot of your property performance today.
            </p>

            {/* Stat cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Monthly Earnings"
                value="$12,450.00"
                meta="+12.5%"
                metaGood
              />
              <StatCard title="Occupancy Rate" value="88%" withBar />
              <StatCard title="Total Listings" value="12" sub="Active across 3 cities" />
              <StatCard title="New Messages" value="5" meta="2 Urgent" metaGood />
            </div>

            {/* Recent bookings table */}
            <section className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="text-[12px] font-bold text-slate-900">Recent Bookings</div>
                <Link
                  href="/host/bookings"
                  className="text-[11px] text-slate-500 hover:text-slate-700 transition"
                >
                  View All
                </Link>
              </div>

              <div className="px-5">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] tracking-wide text-slate-400 border-b border-slate-200">
                        <th className="text-left font-semibold py-3">GUEST</th>
                        <th className="text-left font-semibold py-3">PROPERTY</th>
                        <th className="text-left font-semibold py-3">DATES</th>
                        <th className="text-left font-semibold py-3">AMOUNT</th>
                        <th className="text-left font-semibold py-3">STATUS</th>
                        <th className="text-right font-semibold py-3">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody className="text-[12px]">
                      {rows.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
                                🙂
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {r.guest}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {r.guestsMeta}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4">
                            <div className="text-slate-900 font-semibold">
                              {r.property}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {r.location}
                            </div>
                          </td>

                          <td className="py-4 text-slate-700">{r.dates}</td>

                          <td className="py-4 font-bold text-slate-900">{r.amount}</td>

                          <td className="py-4">
                            <StatusPill status={r.status} />
                          </td>

                          <td className="py-4">
                            <div className="flex justify-end">
                              <button
                                className="p-1.5 rounded-md hover:bg-slate-100 transition"
                                aria-label="More"
                              >
                                <MoreHorizontal className="w-4 h-4 text-slate-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {rows.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-10 text-center text-[12px] text-slate-500"
                          >
                            No results.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="py-4 text-center text-[10px] tracking-widest text-slate-400">
                  SHOWING LAST 3 ACTIVITIES
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

/* Components */

function SideLink({
  href,
  icon,
  children,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 px-3 py-2 rounded-md text-[12px] font-semibold transition",
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      <span className="text-slate-500">{icon}</span>
      {children}
    </Link>
  );
}

function StatCard({
  title,
  value,
  sub,
  meta,
  metaGood,
  withBar,
}: {
  title: string;
  value: string;
  sub?: string;
  meta?: string;
  metaGood?: boolean;
  withBar?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[10px] font-bold tracking-widest text-slate-400">
          {title.toUpperCase()}
        </div>
        <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200" />
      </div>

      <div className="mt-3 text-xl font-bold text-slate-900">{value}</div>

      {withBar && (
        <div className="mt-3 h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
          <div className="h-full bg-[#2C5F5D]" style={{ width: "88%" }} />
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="text-[11px] text-slate-500">{sub || ""}</div>
        {meta && (
          <div
            className={[
              "text-[11px] font-semibold",
              metaGood ? "text-green-600" : "text-slate-500",
            ].join(" ")}
          >
            {meta}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const styles =
    status === "Confirmed"
      ? "bg-[#2C5F5D] text-white"
      : "bg-[#F7E7B7] text-[#7A5A00] border border-[#F0D98B]";

  return (
    <span className={["inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-semibold", styles].join(" ")}>
      {status}
    </span>
  );
}