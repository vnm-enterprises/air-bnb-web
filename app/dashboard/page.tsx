"use client";

import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState, useEffect, useMemo } from "react";
import { Calendar, MapPin, Clock3, RefreshCw, CreditCard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getBookingById, getUserBookings, cancelBooking, completeBooking } from "@/infrastructure/services/booking-service";
import { getPropertyById } from "@/infrastructure/services/property-service";
import type { Booking } from "@/infrastructure/services/booking-service";
import { resolveImageUrl } from "@/lib/image";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517457373614-b7152f800908?auto=format&fit=crop&w=1200&q=80";

type Notice = {
  type: "success" | "error";
  message: string;
} | null;

function normalizeBookingStatus(status: string): Booking["status"] {
  const normalized = status.toLowerCase();

  if (normalized === "approved") {
    return "confirmed";
  }

  if (normalized === "rejected") {
    return "cancelled";
  }

  if (["pending", "confirmed", "cancelled", "completed"].includes(normalized)) {
    return normalized as Booking["status"];
  }

  return "pending";
}

function getApiMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (typeof response?.data?.message === "string" && response.data.message.trim().length > 0) {
      return response.data.message;
    }
  }

  return fallback;
}

function formatDateSafe(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleDateString();
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isTraveler, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<Booking["status"]>("confirmed");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isTraveler())) {
      router.push("/login");
    }
  }, [isAuthenticated, isTraveler, authLoading, router]);

  useEffect(() => {
    let active = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getUserBookings({ status: activeTab });

        if (!response.success) {
          if (active) {
            setBookings([]);
          }
          return;
        }

        const payload = response.data as unknown;
        let bookingItems: unknown[] = [];

        if (Array.isArray(payload)) {
          bookingItems = payload;
        } else if (
          typeof payload === "object" &&
          payload !== null &&
          "bookings" in payload &&
          Array.isArray((payload as { bookings: unknown[] }).bookings)
        ) {
          const rawBookings = (payload as { bookings: unknown[] }).bookings;
          const first = rawBookings[0];

          if (typeof first === "number" || typeof first === "string") {
            const details = await Promise.all(
              rawBookings.map(async (id) => {
                try {
                  const bookingResponse = await getBookingById(Number(id));
                  return bookingResponse.data;
                } catch {
                  return null;
                }
              })
            );

            bookingItems = details.filter((item): item is Booking => Boolean(item));
          } else {
            bookingItems = rawBookings;
          }
        }

        const normalizedBookings: Booking[] = bookingItems
          .map((booking) => {
            const candidate = booking as Partial<Booking> & {
              traveler_id?: number;
              guest_count?: number;
            };

            return {
              id: Number(candidate.id),
              property_id: Number(candidate.property_id),
              user_id: Number(candidate.user_id ?? candidate.traveler_id ?? 0),
              check_in: String(candidate.check_in ?? ""),
              check_out: String(candidate.check_out ?? ""),
              guests: Number(candidate.guests ?? candidate.guest_count ?? 1),
              total_price: Number(candidate.total_price ?? 0),
              status: normalizeBookingStatus(String(candidate.status ?? "pending")),
              created_at: String(candidate.created_at ?? ""),
              updated_at: String(candidate.updated_at ?? ""),
            };
          })
          .filter((booking) => booking.id > 0);

        const propertyIds = Array.from(
          new Set(normalizedBookings.map((booking) => booking.property_id).filter((id) => id > 0))
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

        const propertyMap = new Map(
          propertyEntries.filter((entry): entry is readonly [number, NonNullable<(typeof entry)[1]>] => entry[1] !== null)
        );

        const hydratedBookings = normalizedBookings.map((booking) => {
          const property = propertyMap.get(booking.property_id);
          const firstImage = Array.isArray(property?.images) ? property.images[0] : "";

          return {
            ...booking,
            property: property
              ? {
                  title: property.title || `Property #${booking.property_id}`,
                  location: property.location || "Location unavailable",
                  image: typeof firstImage === "string" ? firstImage : "",
                }
              : undefined,
          };
        });

        if (active) {
          setBookings(hydratedBookings);
        }
      } catch (fetchError: unknown) {
        if (active) {
          setError(getApiMessage(fetchError, "Failed to load your bookings."));
          setBookings([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated && isTraveler()) {
      void fetchBookings();
    }

    return () => {
      active = false;
    };
  }, [activeTab, isAuthenticated, isTraveler]);

  const handleCancelBooking = async (bookingId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setNotice(null);
    setCancelingId(bookingId);

    try {
      await cancelBooking(bookingId);
      router.refresh();

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
        )
      );

      setNotice({
        type: "success",
        message: "Booking cancelled successfully.",
      });

      if (activeTab !== "cancelled") {
        setActiveTab("cancelled");
      }
    } catch (cancelError: unknown) {
      setNotice({
        type: "error",
        message: getApiMessage(cancelError, "Failed to cancel booking. Please try again."),
      });
    } finally {
      setCancelingId(null);
    }
  };

  const handleCompleteBooking = async (bookingId: number) => {
    const confirmed = window.confirm("Mark this booking as completed?");
    if (!confirmed) {
      return;
    }

    setNotice(null);
    setCompletingId(bookingId);

    try {
      await completeBooking(bookingId);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "completed" } : booking
        )
      );

      setNotice({
        type: "success",
        message: "Booking marked as completed.",
      });

      if (activeTab !== "completed") {
        setActiveTab("completed");
      }
    } catch (completeError: unknown) {
      setNotice({
        type: "error",
        message: getApiMessage(completeError, "Failed to mark booking as completed."),
      });
    } finally {
      setCompletingId(null);
    }
  };

  const canMarkCompleted = (booking: Booking): boolean => {
    if (booking.status !== "confirmed") {
      return false;
    }

    const checkout = new Date(booking.check_out);
    if (Number.isNaN(checkout.getTime())) {
      return false;
    }

    checkout.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return checkout <= today;
  };

  const filteredBookings = useMemo(
    () => bookings.filter((booking) => booking.status === activeTab),
    [bookings, activeTab]
  );

  const statusCounts = useMemo(() => {
    return bookings.reduce(
      (acc, booking) => {
        acc[booking.status] += 1;
        return acc;
      },
      {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
      } as Record<Booking["status"], number>
    );
  }, [bookings]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#ebf4f4] via-[#f7fbfb] to-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <section className="mb-8 rounded-3xl border border-[#d4e7e6] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2C5F5D]">
                  Traveler Dashboard
                </p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">My Bookings</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Track your trips, manage upcoming stays, and review completed journeys.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {([
                  "confirmed",
                  "pending",
                  "completed",
                  "cancelled",
                ] as Booking["status"][]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      activeTab === status
                        ? "border-[#2C5F5D] bg-[#2C5F5D] text-white"
                        : "border-[#d6e8e7] bg-[#f8fcfc] text-slate-700 hover:bg-[#eef6f6]"
                    }`}
                  >
                    <p className="text-xs capitalize">{status}</p>
                    <p className="mt-1 text-xl font-bold">{statusCounts[status]}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {notice && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
                notice.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {notice.message}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-[#d4e7e6] bg-white">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#2C5F5D]" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              {error}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-2xl border border-[#d8e8e7] bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">No {activeTab} bookings yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                {activeTab === "confirmed"
                  ? "Discover new stays and confirm your next trip."
                  : `You currently have no ${activeTab} bookings.`}
              </p>
              <button
                onClick={() => router.push("/properties")}
                className="mt-5 rounded-full bg-[#2C5F5D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244f4d]"
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-3xl border border-[#d8e8e7] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="grid gap-4 p-4 md:grid-cols-[260px_1fr] md:gap-6 md:p-6">
                    <div className="relative h-52 overflow-hidden rounded-2xl md:h-full md:min-h-[200px]">
                      <Image
                        src={resolveImageUrl(booking.property?.image || "", FALLBACK_IMAGE)}
                        alt={booking.property?.title || "Property"}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 260px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                              {booking.property?.title || `Booking #${booking.id}`}
                            </h2>
                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                              <MapPin className="h-4 w-4" />
                              {booking.property?.location || "Location unavailable"}
                            </div>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                          <p className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#2C5F5D]" />
                            {formatDateSafe(booking.check_in)} - {formatDateSafe(booking.check_out)}
                          </p>
                          <p className="inline-flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-[#2C5F5D]" />
                            {booking.guests} guests
                          </p>
                          <p className="inline-flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[#2C5F5D]" />
                            Total ${booking.total_price}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelingId === booking.id}
                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {cancelingId === booking.id ? (
                              <span className="inline-flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Cancelling...
                              </span>
                            ) : (
                              "Cancel Booking"
                            )}
                          </button>
                        )}

                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleCompleteBooking(booking.id)}
                            disabled={completingId === booking.id || !canMarkCompleted(booking)}
                            title={!canMarkCompleted(booking) ? "Available after checkout date" : "Mark booking as completed"}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {completingId === booking.id ? (
                              <span className="inline-flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Completing...
                              </span>
                            ) : !canMarkCompleted(booking) ? (
                              "Complete (after checkout)"
                            ) : (
                              "Mark as Completed"
                            )}
                          </button>
                        )}

                        <Link
                          href={`/booking/${booking.id}`}
                          className="rounded-full border border-[#2C5F5D] px-4 py-2 text-sm font-semibold text-[#2C5F5D] transition hover:bg-[#2C5F5D] hover:text-white"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    confirmed: "border-blue-200 bg-blue-50 text-blue-700",
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    completed: "border-green-200 bg-green-50 text-green-700",
    cancelled: "border-slate-300 bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
