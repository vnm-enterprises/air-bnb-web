"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getHostBookings, getBookingById } from "@/lib/bookingApi";
import { getProperties, getPropertyById } from "@/lib/propertyApi";
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
  const router = useRouter();
  const { isAuthenticated, isHost, loading, user, logout } = useAuth();
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
  const [loggingOut, setLoggingOut] = useState(false);

  // Redirect if not authenticated or not a host
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isHost())) {
      router.push('/login');
    }
  }, [isAuthenticated, isHost, loading, router]);

  useEffect(() => {
    if (loading || !isAuthenticated || !isHost()) {
      return;
    }

    let active = true;

    const fetchDashboardData = async () => {
      setDataLoading(true);
      setDataError(null);

      try {
        const hostBookingsResponse = await getHostBookings({ page: 1, per_page: 20 });
        const hostBookingsPayload: any = hostBookingsResponse?.data;

        let bookingIds: number[] = [];
        let bookingItems: any[] = [];

        if (Array.isArray(hostBookingsPayload)) {
          bookingItems = hostBookingsPayload;
        } else if (Array.isArray(hostBookingsPayload?.bookings)) {
          const first = hostBookingsPayload.bookings[0];
          if (typeof first === "number") {
            bookingIds = hostBookingsPayload.bookings;
          } else {
            bookingItems = hostBookingsPayload.bookings;
          }
        }

        if (bookingIds.length > 0) {
          const detailResponses = await Promise.all(
            bookingIds.map(async (id) => {
              try {
                const res = await getBookingById(id);
                return res.data;
              } catch {
                return null;
              }
            })
          );

          bookingItems = detailResponses.filter(Boolean);
        }

        const normalizedBookings = bookingItems
          .map((booking: any) => ({
            id: Number(booking.id),
            property_id: Number(booking.property_id),
            traveler_id: Number(booking.traveler_id ?? booking.user_id ?? 0),
            traveler_name:
              typeof booking.traveler_name === "string" ? booking.traveler_name.trim() : "",
            check_in: String(booking.check_in ?? ""),
            check_out: String(booking.check_out ?? ""),
            guest_count: Number(booking.guest_count ?? booking.guests ?? 0),
            total_price: Number(booking.total_price ?? 0),
            status: String(booking.status ?? "pending").toLowerCase(),
          }))
          .filter((booking) => booking.id > 0 && booking.property_id > 0);

        const propertyIds = Array.from(
          new Set(normalizedBookings.map((booking) => booking.property_id))
        );

        const propertyEntries = await Promise.all(
          propertyIds.map(async (propertyId) => {
            try {
              const propertyResponse = await getPropertyById(propertyId);
              return [propertyId, propertyResponse.data] as const;
            } catch {
              return [propertyId, null] as const;
            }
          })
        );

        const propertyMap = new Map<number, any>(
          propertyEntries.filter((entry): entry is readonly [number, any] => entry[1] !== null)
        );

        const rowsFromApi: RecentBooking[] = normalizedBookings.map((booking) => {
          const property = propertyMap.get(booking.property_id);
          const guestName = booking.traveler_name || "Guest";

          return {
            id: String(booking.id),
            guest: guestName,
            guestsMeta: `${booking.guest_count || 0} guests`,
            property: property?.title || `Property #${booking.property_id}`,
            location: property?.location || "Location unavailable",
            dates: formatDateRange(booking.check_in, booking.check_out),
            amount: formatCurrency(booking.total_price),
            status: toDashboardStatus(booking.status),
          };
        });

        const firstPropertiesPage = await getProperties({ page: 1, per_page: 50 });
        const propertiesPageCount = firstPropertiesPage.data.pagination.pages || 1;

        const allProperties = [...firstPropertiesPage.data.properties];
        if (propertiesPageCount > 1) {
          const propertyPageRequests: Promise<any>[] = [];
          for (let page = 2; page <= propertiesPageCount; page += 1) {
            propertyPageRequests.push(getProperties({ page, per_page: 50 }));
          }

          const additionalPages = await Promise.all(propertyPageRequests);
          additionalPages.forEach((pageRes) => {
            allProperties.push(...pageRes.data.properties);
          });
        }

        const hostProperties = allProperties.filter(
          (property) => property.host_id === user?.id
        );

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
          const checkIn = new Date(booking.check_in);
          if (checkIn >= monthStart && checkIn < monthEnd) {
            return sum + booking.total_price;
          }
          return sum;
        }, 0);

        const bookedNights = confirmedBookings.reduce((sum, booking) => {
          return sum + getOverlappingNights(booking.check_in, booking.check_out, monthStart, monthEnd);
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
      } catch (error) {
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
  }, [loading, isAuthenticated, isHost, user?.id]);

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

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-[240px] bg-white border-r border-slate-200 hidden md:flex flex-col">
          <div className="px-5 h-14 flex items-center border-b border-slate-200">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
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
            </Link>
          </div>

          <div className="p-4">
            <div className="space-y-1">
              <SideLink href="/host" active icon={<LayoutGrid className="w-4 h-4" />}>
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

                <Link
                  href="/"
                  className="inline-flex items-center bg-white border border-slate-200 hover:bg-slate-50 transition text-slate-700 text-[11px] font-semibold px-3 py-2 rounded-md"
                >
                  Home
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center bg-white border border-slate-200 hover:bg-slate-50 transition text-slate-700 text-[11px] font-semibold px-3 py-2 rounded-md disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>

                <Link
                  href="/host/add-property/basics"
                  className="inline-flex items-center gap-2 bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white text-[11px] font-semibold px-3 py-2 rounded-md"
                >
                  <Plus className="w-4 h-4" />
                  Add New Listing
                </Link>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="px-6 py-8">
            <h1 className="text-2xl font-bold">Welcome back, Alex</h1>
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