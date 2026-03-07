"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileDown, FileText, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { confirmBooking, getBookingById, getHostBookings } from "@/lib/bookingApi";
import { getPropertyById } from "@/lib/propertyApi";
import { markPaymentComplete } from "@/lib/paymentApi";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

type BookingRow = {
  id: string;
  guestName: string;
  guestMeta: string;
  property: string;
  dateRange: string;
  nights: string;
  total: string;
  status: BookingStatus;
  rawTotal: number;
  rawGuests: number;
  paymentStatus?: string;
};

const TABS: { label: string; value: "All" | BookingStatus }[] = [
  { label: "All Bookings", value: "All" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Pending", value: "Pending" },
  { label: "Cancelled", value: "Cancelled" },
];

function toStatus(status: string): BookingStatus {
  const normalized = status.toLowerCase();

  if (["approved", "confirmed", "completed"].includes(normalized)) {
    return "Confirmed";
  }

  if (["cancelled", "rejected", "refunded"].includes(normalized)) {
    return "Cancelled";
  }

  return "Pending";
}

function formatDateRange(checkIn: string, checkOut: string): string {
  const from = new Date(checkIn);
  const to = new Date(checkOut);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return "Dates unavailable";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
  };

  return `${from.toLocaleDateString("en-US", options)} - ${to.toLocaleDateString("en-US", options)}`;
}

function calculateNightsLabel(checkIn: string, checkOut: string): string {
  const from = new Date(checkIn);
  const to = new Date(checkOut);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return "0 nights";
  }

  const diffMs = to.getTime() - from.getTime();
  const nights = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  return `${nights} night${nights === 1 ? "" : "s"}`;
}

export default function HostBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isHost, loading: authLoading, user } = useAuth();

  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("All");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isHost())) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, isHost, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !isHost()) {
      return;
    }

    let active = true;

    const fetchHostBookings = async () => {
      setDataLoading(true);
      setDataError(null);

      try {
        const firstPage = await getHostBookings({ page: 1, per_page: 50 });
        const payload: any = firstPage?.data;

        let bookingIds: number[] = [];
        let bookingItems: any[] = [];

        if (Array.isArray(payload)) {
          bookingItems = payload;
        } else if (Array.isArray(payload?.bookings)) {
          const first = payload.bookings[0];

          if (typeof first === "number" || typeof first === "string") {
            bookingIds = payload.bookings.map((id: number | string) => Number(id)).filter((id: number) => id > 0);
          } else {
            bookingItems = payload.bookings;
          }
        }

        if (bookingIds.length > 0) {
          const details = await Promise.all(
            bookingIds.map(async (id) => {
              try {
                const response = await getBookingById(id);
                return response.data;
              } catch {
                return null;
              }
            })
          );

          bookingItems = details.filter(Boolean);
        }

        const normalized = bookingItems
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
            status: String(booking.status ?? "pending"),
            payment_status: String(booking.payment_status ?? "pending"),
          }))
          .filter((booking: any) => booking.id > 0);

        const propertyIds = Array.from(
          new Set(
            normalized
              .map((booking: any) => booking.property_id)
              .filter((propertyId: number) => propertyId > 0)
          )
        );

        const propertyEntries = await Promise.all(
          propertyIds.map(async (propertyId) => {
            try {
              const response = await getPropertyById(propertyId);
              return [propertyId, response.data] as const;
            } catch {
              return [propertyId, null] as const;
            }
          })
        );

        const propertyMap = new Map<number, any>(
          propertyEntries.filter((entry): entry is readonly [number, any] => entry[1] !== null)
        );

        const rows: BookingRow[] = normalized.map((booking: any) => {
          const property = propertyMap.get(booking.property_id);
          const guestName = booking.traveler_name || "Guest";

          return {
            id: String(booking.id),
            guestName,
            guestMeta: booking.traveler_name ? "Traveler" : "Guest",
            property: property?.title || `Property #${booking.property_id}`,
            dateRange: formatDateRange(booking.check_in, booking.check_out),
            nights: calculateNightsLabel(booking.check_in, booking.check_out),
            total: `$${booking.total_price.toFixed(2)}`,
            status: toStatus(booking.status),
            rawTotal: booking.total_price,
            rawGuests: booking.guest_count,
            paymentStatus: booking.payment_status,
          };
        });

        if (!active) {
          return;
        }

        setBookings(rows);
      } catch (error: any) {
        if (!active) {
          return;
        }

        setDataError(error?.response?.data?.message || "Failed to load host bookings");
        setBookings([]);
      } finally {
        if (active) {
          setDataLoading(false);
        }
      }
    };

    fetchHostBookings();

    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated, isHost, user?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesTab = tab === "All" ? true : booking.status === tab;
      const matchesQuery =
        !q ||
        booking.guestName.toLowerCase().includes(q) ||
        booking.property.toLowerCase().includes(q);

      return matchesTab && matchesQuery;
    });
  }, [bookings, tab, query]);

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const activeGuests = bookings.reduce((sum, booking) => sum + Math.max(0, booking.rawGuests), 0);
    const monthlyRevenue = bookings
      .filter((booking) => booking.status === "Confirmed")
      .reduce((sum, booking) => sum + booking.rawTotal, 0);

    return {
      totalBookings,
      activeGuests,
      monthlyRevenue,
    };
  }, [bookings]);

  const handleMarkPaid = async (bookingId: string) => {
    setDataError(null);
    setMarkingPaidId(bookingId);

    try {
      await markPaymentComplete(Number(bookingId));
      setBookings((current) =>
        current.map((row) =>
          row.id === bookingId
            ? {
                ...row,
                paymentStatus: "paid",
              }
            : row
        )
      );
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setDataError(apiMessage || "Failed to mark payment as completed");
    } finally {
      setMarkingPaidId(null);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    setDataError(null);
    setConfirmingId(bookingId);

    try {
      await confirmBooking(Number(bookingId));
      setBookings((current) =>
        current.map((row) =>
          row.id === bookingId
            ? {
                ...row,
                status: "Confirmed",
              }
            : row
        )
      );
    } catch (error: any) {
      const statusCode = error?.response?.status;
      const apiMessage = error?.response?.data?.message;

      if (statusCode === 402) {
        setDataError(apiMessage || "Payment must be marked as completed before confirming.");
      } else if (statusCode === 422) {
        setDataError(apiMessage || "Booking cannot be confirmed from its current status.");
      } else {
        setDataError(apiMessage || "Failed to confirm booking");
      }
    } finally {
      setConfirmingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f4f4] text-slate-900">
      {/* Top Host Nav */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <div className="text-slate-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold">StayTeal Host</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-5 text-[11px] font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-900">
                Home
              </Link>

              <Link href="/host" className="hover:text-slate-900">
                Dashboard
              </Link>

              <Link
                href="/host/bookings"
                className="text-slate-900 font-semibold relative"
              >
                Bookings
                <span className="absolute left-0 -bottom-[6px] h-[2px] w-full bg-[#2C5F5D]" />
              </Link>

              <Link href="/host/listings" className="hover:text-slate-900">
                Listings
              </Link>
              <Link href="/host/inbox" className="hover:text-slate-900">
                Inbox
              </Link>
            </nav>

            <Link
              href="/host/add-property/basics"
              className="bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white text-[11px] font-semibold px-3 py-1.5 rounded-md"
            >
              Add Listing
            </Link>

            <div className="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
              🙂
            </div>
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Title + Export */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold leading-tight">Booking Management</h1>
              <p className="text-[12px] text-slate-500 mt-1">
                {dataLoading ? "Loading booking activity..." : `You have ${bookings.filter((b) => b.status === "Pending").length} pending requests that need your attention.`}
              </p>
            </div>

            <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 transition text-[11px] font-semibold px-3 py-2 rounded-md">
              <FileDown className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <StatCard label="Total Bookings" value={String(stats.totalBookings)} />
            <StatCard label="Active Guests" value={String(stats.activeGuests)} />
            <StatCard label="Monthly Revenue" value={`$${stats.monthlyRevenue.toFixed(2)}`} accent />
          </div>

          {/* Table Card */}
          <section className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="px-5 pt-4">
              <div className="flex items-center gap-5 border-b border-slate-200">
                {TABS.map((t) => {
                  const active = t.value === tab;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTab(t.value)}
                      className={[
                        "text-[11px] font-semibold pb-3",
                        active
                          ? "text-slate-900 border-b-2 border-[#2C5F5D]"
                          : "text-slate-500 hover:text-slate-800",
                      ].join(" ")}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="px-5 py-3">
              <div className="relative w-full sm:w-[340px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by guest name or property..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-[12px] outline-none focus:bg-white focus:border-slate-300"
                />
              </div>
            </div>

            {dataError && (
              <div className="px-5 py-3 bg-red-50 border-y border-red-100 text-[12px] text-red-700">
                {dataError}
              </div>
            )}

            {/* Table */}
            <div className="px-5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] tracking-wide text-slate-400 border-b border-slate-200">
                      <th className="text-left font-semibold py-3">GUEST</th>
                      <th className="text-left font-semibold py-3">PROPERTY</th>
                      <th className="text-left font-semibold py-3">DATES</th>
                      <th className="text-left font-semibold py-3">TOTAL</th>
                      <th className="text-left font-semibold py-3">STATUS</th>
                      <th className="text-right font-semibold py-3">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody className="text-[12px]">
                    {dataLoading ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[12px] text-slate-500">
                          Loading bookings...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-[12px] text-slate-500"
                        >
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((b) => (
                        <tr
                          key={b.id}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
                                🙂
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{b.guestName}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{b.guestMeta}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 text-slate-800">{b.property}</td>

                          <td className="py-4">
                            <div className="text-slate-800">{b.dateRange}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{b.nights}</div>
                          </td>

                          <td className="py-4 font-semibold text-slate-900">{b.total}</td>

                          <td className="py-4">
                            <StatusPill status={b.status} />
                          </td>

                          <td className="py-4">
                            <div className="flex items-center justify-end gap-2 text-slate-600">
                              {b.status === "Pending" && b.paymentStatus !== "paid" && (
                                <button
                                  onClick={() => handleMarkPaid(b.id)}
                                  disabled={markingPaidId === b.id}
                                  className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-60"
                                >
                                  {markingPaidId === b.id ? "Marking..." : "Mark as Paid"}
                                </button>
                              )}
                              {b.status === "Pending" && b.paymentStatus === "paid" && (
                                <button
                                  onClick={() => handleConfirmBooking(b.id)}
                                  disabled={confirmingId === b.id}
                                  className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-[#2C5F5D] text-white hover:bg-[#244f4d] transition disabled:opacity-60"
                                >
                                  {confirmingId === b.id ? "Confirming..." : "Confirm"}
                                </button>
                              )}
                              <Link
                                href={`/booking/${b.id}`}
                                className="p-1.5 rounded-md hover:bg-slate-100 transition"
                                aria-label="View booking"
                              >
                                <FileText className="w-4 h-4 text-[#2C5F5D]" />
                              </Link>
                              <button
                                className="p-1.5 rounded-md hover:bg-slate-100 transition"
                                aria-label="Edit booking"
                              >
                                <Pencil className="w-4 h-4 text-slate-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination summary */}
              <div className="flex items-center justify-between py-4 text-[11px] text-slate-500">
                <div>Showing {filtered.length} of {bookings.length} bookings</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f4a47] text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-white">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold">RealEstate</h3>
            </div>
            <p className="text-white/75 text-[12px] leading-relaxed mt-3">
              Your trusted partner in finding the perfect home. We make real estate simple.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-[13px]">Quick Links</h4>
            <FooterLink>Buy Property</FooterLink>
            <FooterLink>Sell Property</FooterLink>
            <FooterLink>Rent Property</FooterLink>
            <FooterLink>About Us</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-[13px]">Property Types</h4>
            <FooterLink>Houses</FooterLink>
            <FooterLink>Apartments</FooterLink>
            <FooterLink>Condos</FooterLink>
            <FooterLink>Villas</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-[13px]">Contact Us</h4>
            <div className="space-y-2 text-white/75 text-[12px]">
              <p>(555) 123-4567</p>
              <p>info@realestate.com</p>
              <p>123 Main St, City, State</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-5 text-center text-[11px] text-white/60">
            © {new Date().getFullYear()} RealEstate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="text-[10px] text-slate-400 font-semibold">{label}</div>
      <div className={["mt-2 text-lg font-bold", accent ? "text-[#2C5F5D]" : "text-slate-900"].join(" ")}>
        {value}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const styles =
    status === "Confirmed"
      ? "bg-[#2C5F5D] text-white"
      : status === "Pending"
      ? "bg-slate-100 text-slate-600"
      : "bg-slate-100 text-slate-500";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "px-3 py-1 rounded-full",
        "text-[10px] font-semibold",
        styles,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-white/75 hover:text-white transition cursor-pointer text-[12px] mb-2">
      {children}
    </div>
  );
}
