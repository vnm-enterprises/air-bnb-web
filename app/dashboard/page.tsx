"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getBookingById, getUserBookings, cancelBooking } from "@/lib/bookingApi";
import { getPropertyById } from "@/lib/propertyApi";
import type { Booking } from "@/lib/bookingApi";

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

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isTraveler, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Booking["status"]>("confirmed");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  // Redirect if not authenticated or not a traveler
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isTraveler())) {
      router.push('/login');
    }
  }, [isAuthenticated, isTraveler, authLoading, router]);

  // Fetch user bookings
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

        const payload: any = response.data;
        let bookingItems: any[] = [];

        if (Array.isArray(payload)) {
          bookingItems = payload;
        } else if (Array.isArray(payload?.bookings)) {
          const rawBookings = payload.bookings;
          const first = rawBookings[0];

          if (typeof first === "number" || typeof first === "string") {
            const details = await Promise.all(
              rawBookings.map(async (id: number | string) => {
                try {
                  const bookingResponse = await getBookingById(Number(id));
                  return bookingResponse.data;
                } catch {
                  return null;
                }
              })
            );

            bookingItems = details.filter(Boolean);
          } else {
            bookingItems = rawBookings;
          }
        }

        const normalizedBookings: Booking[] = bookingItems
          .map((booking: any) => ({
            id: Number(booking.id),
            property_id: Number(booking.property_id),
            user_id: Number(booking.user_id ?? booking.traveler_id ?? 0),
            check_in: String(booking.check_in ?? ""),
            check_out: String(booking.check_out ?? ""),
            guests: Number(booking.guests ?? booking.guest_count ?? 1),
            total_price: Number(booking.total_price ?? 0),
            status: normalizeBookingStatus(String(booking.status ?? "pending")),
            created_at: String(booking.created_at ?? ""),
            updated_at: String(booking.updated_at ?? ""),
          }))
          .filter((booking) => booking.id > 0);

        const propertyIds = Array.from(
          new Set(
            normalizedBookings
              .map((booking) => booking.property_id)
              .filter((propertyId) => propertyId > 0)
          )
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
      } catch (err) {
        console.error('Error fetching bookings:', err);
        if (active) {
          setError('Failed to load bookings');
          setBookings([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated && isTraveler()) {
      fetchBookings();
    }

    return () => {
      active = false;
    };
  }, [activeTab, isAuthenticated, isTraveler]);

  const handleCancelBooking = async (bookingId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    );

    if (!confirmed) return;

    setCancelingId(bookingId);

    try {
      await cancelBooking(bookingId);
      
      // Update local state - remove from current list and add to cancelled
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
        )
      );

      // Show success message
      alert('Booking cancelled successfully');
      
      // Switch to cancelled tab if not already there
      if (activeTab !== 'cancelled') {
        setActiveTab('cancelled');
      }
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message;
      alert(apiMessage || 'Failed to cancel booking');
    } finally {
      setCancelingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  const filtered = bookings.filter((booking) => booking.status === activeTab);

  /* ---------------- UI ---------------- */

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f8fafc] py-14">
        <div className="max-w-6xl mx-auto px-6">

          {/* PAGE HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-slate-900">
              My Bookings
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Manage and review your stays.
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b mb-8">
            {(["confirmed", "pending", "cancelled", "completed"] as Booking["status"][]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? "border-b-2 border-[#2C5F5D] text-[#2C5F5D]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* BOOKINGS LIST */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800">
                No {activeTab} bookings
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                You don't have any {activeTab} stays at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row gap-6"
                >
                  {/* IMAGE */}
                  <img
                    src={
                      booking.property?.image ||
                      'https://images.unsplash.com/photo-1517457373614-b7152f800908?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={booking.property?.title || 'Property'}
                    className="w-full md:w-56 h-40 object-cover rounded-xl"
                  />

                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {booking.property?.title || `Booking #${booking.id}`}
                      </h2>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <MapPin size={14} />
                        {booking.property?.location || 'Location not available'}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                        <Calendar size={14} />
                        {new Date(booking.check_in).toLocaleDateString()} –{' '}
                        {new Date(booking.check_out).toLocaleDateString()}
                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        {booking.guests} guests
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="text-lg font-semibold text-slate-900">
                        ${booking.total_price}
                      </div>

                      <div className="flex items-center gap-4">
                        <StatusBadge status={booking.status} />

                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleCancelBooking(booking.id);
                            }}
                            disabled={cancelingId === booking.id}
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelingId === booking.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}

                        <Link
                          href={`/booking/${booking.id}`}
                          className="px-4 py-2 text-sm bg-[#2C5F5D] text-white rounded-lg hover:bg-[#244f4d] transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    confirmed: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-slate-200 text-slate-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
