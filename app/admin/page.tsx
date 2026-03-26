"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  CalendarDays,
  Users,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getAdminStats, type AdminStats } from "@/lib/adminApi";

const EMPTY_STATS: AdminStats = {
  properties: { total: 0, active: 0, pending: 0, hidden: 0 },
  bookings:   { total: 0, pending: 0, approved: 0, completed: 0, cancelled: 0 },
  reviews:    { total: 0, pending: 0 },
  users:      { total: 0 },
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: "emerald" | "blue" | "violet" | "amber";
  href?: string;
}) {
  const accentClasses = {
    emerald: {
      border: "border-emerald-700/40",
      icon: "bg-emerald-600/20 text-emerald-400",
      value: "text-emerald-300",
    },
    blue: {
      border: "border-blue-700/40",
      icon: "bg-blue-600/20 text-blue-400",
      value: "text-blue-300",
    },
    violet: {
      border: "border-violet-700/40",
      icon: "bg-violet-600/20 text-violet-400",
      value: "text-violet-300",
    },
    amber: {
      border: "border-amber-700/40",
      icon: "bg-amber-600/20 text-amber-400",
      value: "text-amber-300",
    },
  };

  const currentAccent = accent ? accentClasses[accent] : null;

  const content = (
    <div
      className={[
        "bg-slate-900 border rounded-xl p-5 transition hover:border-slate-600",
        currentAccent ? currentAccent.border : "border-slate-800",
      ].join(" ")}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={[
            "w-9 h-9 rounded-lg flex items-center justify-center",
            currentAccent ? currentAccent.icon : "bg-slate-800 text-slate-400",
          ].join(" ")}
        >
          <Icon className="w-4 h-4" />
        </span>
        {href && (
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">View →</span>
        )}
      </div>
      <div className={["text-2xl font-bold", currentAccent ? currentAccent.value : "text-white"].join(" ")}>
        {value}
      </div>
      <div className="text-[12px] text-slate-400 mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-800">
        <h2 className="text-[13px] font-semibold text-slate-200">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch {
      setError("Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-[12px] text-slate-400 mt-0.5">
          Platform overview — manage listings, bookings, users and reviews.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-900/30 border border-red-800 text-red-400 rounded-xl text-[12px]">
          {error}
        </div>
      )}

      {/* Top stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Properties"
          value={loading ? "—" : stats.properties.total}
          sub={`${stats.properties.active} active · ${stats.properties.pending} pending`}
          icon={Home}
          accent="emerald"
          href="/admin/listings"
        />
        <StatCard
          label="Total Bookings"
          value={loading ? "—" : stats.bookings.total}
          sub={`${stats.bookings.pending} pending · ${stats.bookings.completed} completed`}
          icon={CalendarDays}
          accent="blue"
          href="/admin/bookings"
        />
        <StatCard
          label="Total Users"
          value={loading ? "—" : stats.users.total}
          icon={Users}
          accent="violet"
          href="/admin/users"
        />
        <StatCard
          label="Total Reviews"
          value={loading ? "—" : stats.reviews.total}
          sub={`${stats.reviews.pending} awaiting moderation`}
          icon={Star}
          accent="amber"
          href="/admin/reviews"
        />
      </div>

      {/* Detail rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Listings breakdown */}
        <SectionCard title="Listings by Status">
          <div className="space-y-3">
            {[
              { label: "Active", value: stats.properties.active, color: "bg-emerald-500", icon: CheckCircle },
              { label: "Pending moderation", value: stats.properties.pending, color: "bg-amber-500", icon: Clock },
              { label: "Hidden", value: stats.properties.hidden, color: "bg-slate-600", icon: AlertCircle },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-[12px] text-slate-300 flex-1">{label}</span>
                <span className="text-[13px] font-bold text-white">{loading ? "—" : value}</span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/listings?status=pending"
            className="mt-4 block text-center text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition py-2 border border-slate-800 rounded-lg"
          >
            Review pending listings →
          </Link>
        </SectionCard>

        {/* Bookings breakdown */}
        <SectionCard title="Bookings by Status">
          <div className="space-y-3">
            {[
              { label: "Pending", value: stats.bookings.pending, color: "bg-amber-500" },
              { label: "Approved", value: stats.bookings.approved, color: "bg-blue-500" },
              { label: "Completed", value: stats.bookings.completed, color: "bg-emerald-500" },
              { label: "Cancelled", value: stats.bookings.cancelled, color: "bg-slate-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                <TrendingUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-[12px] text-slate-300 flex-1">{label}</span>
                <span className="text-[13px] font-bold text-white">{loading ? "—" : value}</span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/bookings"
            className="mt-4 block text-center text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition py-2 border border-slate-800 rounded-lg"
          >
            Manage all bookings →
          </Link>
        </SectionCard>

        {/* Reviews moderation */}
        <SectionCard title="Reviews Moderation">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-amber-300">{loading ? "—" : stats.reviews.pending}</div>
            <div>
              <div className="text-[12px] text-slate-300 font-semibold">Reviews pending moderation</div>
              <div className="text-[11px] text-slate-500">
                out of {loading ? "—" : stats.reviews.total} total reviews
              </div>
            </div>
          </div>
          <Link
            href="/admin/reviews?status=pending"
            className="mt-4 block text-center text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition py-2 border border-slate-800 rounded-lg"
          >
            Moderate reviews →
          </Link>
        </SectionCard>

        {/* Quick links */}
        <SectionCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Approve listings", href: "/admin/listings?status=pending", icon: CheckCircle },
              { label: "Manage bookings", href: "/admin/bookings", icon: CalendarDays },
              { label: "Moderate reviews", href: "/admin/reviews?status=pending", icon: Star },
              { label: "Manage users", href: "/admin/users", icon: Users },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition text-[12px] font-medium text-slate-300"
              >
                <Icon className="w-4 h-4 text-violet-400 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
