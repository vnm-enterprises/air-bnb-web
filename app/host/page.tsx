"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { MoreHorizontal, Search } from "lucide-react";
import {
  fetchHostBookingsDetailed,
  fetchHostProperties,
  fetchPropertyMap,
} from "@/infrastructure/services/host-dashboard-service";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

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

type DashboardStats = {
  monthlyEarnings: number;
  occupancyRate: number;
  totalListings: number;
  pendingCount: number;
};

function toDashboardStatus(status: string): BookingStatus {
  if (["approved", "confirmed", "completed"].includes(status)) {
    return "Confirmed";
  }

  if (["cancelled", "rejected", "refunded"].includes(status)) {
    return "Cancelled";
  }

  return "Pending";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDateRange(checkIn: string, checkOut: string): string {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
    return "Dates unavailable";
  }

  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
  return `${inDate.toLocaleDateString("en-US", opts)} - ${outDate.toLocaleDateString("en-US", opts)}`;
}

function getOverlappingNights(
  checkIn: string,
  checkOut: string,
  monthStart: Date,
  monthEnd: Date
): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const overlapStart = new Date(Math.max(start.getTime(), monthStart.getTime()));
  const overlapEnd = new Date(Math.min(end.getTime(), monthEnd.getTime()));
  const diff = overlapEnd.getTime() - overlapStart.getTime();

  if (diff <= 0) {
    return 0;
  }

  return diff / (1000 * 60 * 60 * 24);
}

export default function HostDashboardPage() {
  const { isAuthenticated, isHost, loading, user } = useAuth();
  const isHostUser = isHost();
  const [q, setQ] = useState("");
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    monthlyEarnings: 0,
    occupancyRate: 0,
    totalListings: 0,
    pendingCount: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !isHostUser) {
      setDataLoading(false);
      return;
    }

    if (!user?.id) {
      setDataLoading(false);
      return;
    }

    let active = true;

    const fetchDashboardData = async () => {
      setDataLoading(true);
      setDataError(null);

      try {
        const normalizedBookings = await fetchHostBookingsDetailed(20);

        const propertyIds = normalizedBookings.map((booking) => booking.propertyId);
        const propertyMap = await fetchPropertyMap(propertyIds);

        const rowsFromApi: RecentBooking[] = normalizedBookings.map((booking) => {
          const property = propertyMap.get(booking.propertyId);
          const guestName = booking.travelerName || "Guest";

          return {
            id: String(booking.id),
            guest: guestName,
            guestsMeta: `${booking.guestCount || 0} guests`,
            property: property?.title || `Property #${booking.propertyId}`,
            location: property?.location || "Location unavailable",
            dates: formatDateRange(booking.checkIn, booking.checkOut),
            amount: formatCurrency(booking.totalPrice),
            status: toDashboardStatus(booking.status),
          };
        });
        const hostProperties = await fetchHostProperties(user.id, 50);

        const confirmedBookings = normalizedBookings.filter(
          (booking) => toDashboardStatus(booking.status) === "Confirmed"
        );
        const pendingCount = normalizedBookings.filter(
          (booking) => toDashboardStatus(booking.status) === "Pending"
        ).length;

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const monthlyEarnings = confirmedBookings.reduce((sum, booking) => {
          const checkIn = new Date(booking.checkIn);
          if (checkIn >= monthStart && checkIn < monthEnd) {
            return sum + booking.totalPrice;
          }
          return sum;
        }, 0);

        const bookedNights = confirmedBookings.reduce((sum, booking) => {
          return sum + getOverlappingNights(booking.checkIn, booking.checkOut, monthStart, monthEnd);
        }, 0);

        const occupancyRate = hostProperties.length
          ? Math.round((bookedNights / (hostProperties.length * daysInMonth)) * 100)
          : 0;

        if (!active) {
          return;
        }

        setRecentBookings(rowsFromApi);
        setStats({
          monthlyEarnings,
          occupancyRate: Math.max(0, Math.min(100, occupancyRate)),
          totalListings: hostProperties.length,
          pendingCount,
        });
      } catch {
        if (!active) {
          return;
        }
        setDataError("Failed to load dashboard data");
      } finally {
        if (active) {
          setDataLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      active = false;
    };
  }, [loading, isAuthenticated, isHostUser, user?.id]);

  const rows = useMemo(() => {
    const x = q.trim().toLowerCase();
    if (!x) return recentBookings;
    return recentBookings.filter(
      (r) =>
        r.guest.toLowerCase().includes(x) ||
        r.property.toLowerCase().includes(x) ||
        r.location.toLowerCase().includes(x)
    );
  }, [q, recentBookings]);

  return (
    <div className="px-6 py-8">
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.name?.split(" ")[0] ?? "Host"} 👋
            </h1>
            <p className="text-[12px] text-slate-500 mt-2">
              Here&apos;s a snapshot of your property performance today.
            </p>

            {dataError && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                {dataError}
              </div>
            )}

            {/* Stat cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Monthly Earnings"
                value={formatCurrency(stats.monthlyEarnings)}
                meta={stats.monthlyEarnings > 0 ? "Live" : "No confirmed bookings"}
                metaGood={stats.monthlyEarnings > 0}
              />
              <StatCard
                title="Occupancy Rate"
                value={`${stats.occupancyRate}%`}
                withBar
                barWidth={stats.occupancyRate}
              />
              <StatCard
                title="Total Listings"
                value={String(stats.totalListings)}
                sub={stats.totalListings > 0 ? "Live from API" : "No active listings"}
              />
              <StatCard
                title="New Messages"
                value={String(stats.pendingCount)}
                meta={`${stats.pendingCount} Pending`}
              />
            </div>

            {/* Recent bookings table */}
            <section className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="text-[12px] font-bold text-slate-900">Recent Bookings</div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search bookings..."
                      className="bg-slate-100/80 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none focus:bg-white focus:border-slate-300 w-40"
                    />
                  </div>
                  <Link
                  href="/host/bookings"
                  className="text-[11px] text-slate-500 hover:text-slate-700 transition"
                >
                  View All
                </Link>
                </div>
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
                      {dataLoading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-10 text-center text-[12px] text-slate-500"
                          >
                            Loading dashboard data...
                          </td>
                        </tr>
                      ) : (
                        rows.map((r) => (
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
                        ))
                      )}

                      {!dataLoading && rows.length === 0 && (
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
    </div>
  );
}

function StatCard({
  title,
  value,
  sub,
  meta,
  metaGood,
  withBar,
  barWidth,
}: {
  title: string;
  value: string;
  sub?: string;
  meta?: string;
  metaGood?: boolean;
  withBar?: boolean;
  barWidth?: number;
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
          <div
            className="h-full bg-[#2C5F5D]"
            style={{ width: `${Math.max(0, Math.min(100, barWidth ?? 88))}%` }}
          />
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
      : status === "Cancelled"
      ? "bg-slate-200 text-slate-700 border border-slate-300"
      : "bg-[#F7E7B7] text-[#7A5A00] border border-[#F0D98B]";

  return (
    <span className={["inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-semibold", styles].join(" ")}>
      {status}
    </span>
  );
}