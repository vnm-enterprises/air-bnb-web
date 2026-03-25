"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Receipt, CreditCard, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getBookingById, cancelBooking } from "@/infrastructure/services/booking-service";
import { getPropertyById, Property } from "@/infrastructure/services/property-service";
import { createReview } from "@/infrastructure/services/review-service";

type BookingDetails = {
  id: number;
  property_id: number;
  traveler_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
  total_price: number;
  price_snapshot: number;
  status: string;
  payment_status: string;
};

function normalizeStatus(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized === "approved") {
    return "confirmed";
  }

  if (normalized === "rejected") {
    return "cancelled";
  }

  return normalized;
}

function statusClass(status: string): string {
  const normalized = normalizeStatus(status);

  if (normalized === "confirmed") {
    return "bg-blue-100 text-blue-700";
  }

  if (normalized === "pending") {
    return "bg-amber-100 text-amber-700";
  }

  if (normalized === "completed") {
    return "bg-green-100 text-green-700";
  }

  return "bg-slate-200 text-slate-600";
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString();
}

function getNightCount(checkIn: string, checkOut: string): number {
  const from = new Date(checkIn);
  const to = new Date(checkOut);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return 0;
  }

  const diffMs = to.getTime() - from.getTime();
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, nights);
}

function getApiMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return fallback;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const bookingId = useMemo(() => {
    const raw = params?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : NaN;
  }, [params]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    if (!Number.isFinite(bookingId) || bookingId <= 0) {
      setError("Invalid booking ID");
      setLoading(false);
      return;
    }

    let active = true;

    const fetchBooking = async () => {
      setLoading(true);
      setError(null);

      try {
        const bookingResponse = await getBookingById(bookingId);
        const raw: any = bookingResponse?.data;

        const normalizedBooking: BookingDetails = {
          id: Number(raw?.id || bookingId),
          property_id: Number(raw?.property_id || 0),
          traveler_id: Number(raw?.traveler_id || raw?.user_id || 0),
          check_in: String(raw?.check_in || ""),
          check_out: String(raw?.check_out || ""),
          guest_count: Number(raw?.guest_count || raw?.guests || 1),
          total_price: Number(raw?.total_price || 0),
          price_snapshot: Number(raw?.price_snapshot || 0),
          status: String(raw?.status || "pending"),
          payment_status: String(raw?.payment_status || "pending"),
        };

        let propertyData: Property | null = null;

        if (normalizedBooking.property_id > 0) {
          try {
            const propertyResponse = await getPropertyById(normalizedBooking.property_id);
            propertyData = propertyResponse.data;
          } catch {
            propertyData = null;
          }
        }

        if (!active) {
          return;
        }

        setBooking(normalizedBooking);
        setProperty(propertyData);
        setReviewSubmitted(false);
        setReviewFeedback(null);
        setReviewComment("");
        setReviewRating(5);
      } catch (err: any) {
        if (!active) {
          return;
        }

        setError(err?.response?.data?.message || "Failed to load booking details");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBooking();

    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated, bookingId]);

  const handleCancelBooking = async () => {
    if (!booking) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    );

    if (!confirmed) return;

    setCanceling(true);
    setCancelError(null);

    try {
      await cancelBooking(booking.id);

      // Clear Next.js router cache so the property page re-fetches fresh
      // unavailable dates the next time the user navigates to it.
      router.refresh();

      // Update local state
      setBooking({
        ...booking,
        status: 'cancelled'
      });

      // Show success message
      alert('Booking cancelled successfully');

      // Optionally redirect to dashboard
      // router.push('/dashboard');
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message;
      setCancelError(apiMessage || 'Failed to cancel booking');
    } finally {
      setCanceling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!booking) return;

    const comment = reviewComment.trim();

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewFeedback({ type: "error", message: "Please select a rating between 1 and 5." });
      return;
    }

    if (comment.length < 3) {
      setReviewFeedback({ type: "error", message: "Please add a short comment for your review." });
      return;
    }

    setReviewSubmitting(true);
    setReviewFeedback(null);

    try {
      await createReview({
        booking_id: booking.id,
        rating: reviewRating,
        comment,
      });

      setReviewSubmitted(true);
      setReviewComment("");
      setReviewFeedback({
        type: "success",
        message: "Review submitted successfully. It is now pending moderation.",
      });
    } catch (err: unknown) {
      const statusCode =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { status?: number } }).response?.status === "number"
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;

      if (statusCode === 409) {
        setReviewSubmitted(true);
        setReviewFeedback({
          type: "success",
          message: "A review already exists for this booking.",
        });
      } else {
        setReviewFeedback({
          type: "error",
          message: getApiMessage(err, "Failed to submit review."),
        });
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (authLoading || (!isAuthenticated && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f8fafc] py-14">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              <p className="font-medium">{error || "Booking not found"}</p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm rounded-md bg-[#2C5F5D] text-white hover:bg-[#244f4d] transition"
                >
                  Back to Dashboard
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const nights = getNightCount(booking.check_in, booking.check_out);
  const propertyImage =
    property?.images && property.images.length > 0 && typeof property.images[0] === "string"
      ? property.images[0]
      : "https://images.unsplash.com/photo-1517457373614-b7152f800908?auto=format&fit=crop&w=900&q=80";
  const status = normalizeStatus(booking.status);
  const canReview = status === "completed";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f8fafc] py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Booking Details</h1>
              <p className="text-slate-500 mt-2 text-sm">Booking #{booking.id}</p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/"
                className="px-4 py-2 text-sm rounded-lg bg-[#2C5F5D] text-white hover:bg-[#244f4d] transition"
              >
                Home
              </Link>
            </div>
          </div>

          <section className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1 h-64 md:h-full">
                <img src={propertyImage} alt={property?.title || "Property"} className="w-full h-full object-cover" />
              </div>

              <div className="md:col-span-2 p-6 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {property?.title || `Property #${booking.property_id}`}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <MapPin size={14} />
                      {property?.location || "Location unavailable"}
                    </div>
                  </div>

                  <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusClass(status)}`}>
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar size={14} />
                    <span>
                      {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Users size={14} />
                    <span>
                      {booking.guest_count} guests • {nights} nights
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Receipt size={14} />
                    <span>Total: ${booking.total_price.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <CreditCard size={14} />
                    <span>Payment: {booking.payment_status.toLowerCase()}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href={`/properties/${booking.property_id}`}
                    className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                  >
                    View Property
                  </Link>

                  <Link
                    href="/checkout/success"
                    className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                  >
                    Payment Status
                  </Link>

                  {(status === 'pending' || status === 'confirmed') && (
                    <button
                      onClick={handleCancelBooking}
                      disabled={canceling}
                      className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {canceling ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>

                {cancelError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {cancelError}
                  </div>
                )}
              </div>
            </div>
          </section>

          {canReview && (
            <section className="mt-8 bg-white border rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-slate-900">Share your experience</h3>
              <p className="text-sm text-slate-500 mt-1">
                Your review helps other travelers and supports hosts.
              </p>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-700 mb-2">Rating</p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReviewRating(value)}
                        className="text-slate-300 hover:text-slate-800 transition"
                        aria-label={`Set rating to ${value}`}
                        disabled={reviewSubmitted}
                      >
                        <Star
                          size={20}
                          className={value <= reviewRating ? "fill-black text-black" : "text-slate-300"}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="review-comment" className="text-sm font-medium text-slate-700">
                  Comment
                </label>
                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  disabled={reviewSubmitted}
                  placeholder="Tell others what stood out about this stay"
                  className="mt-2 w-full min-h-[130px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
                />
              </div>

              {reviewFeedback && (
                <div
                  className={`mt-4 rounded-lg p-3 text-sm ${
                    reviewFeedback.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {reviewFeedback.message}
                </div>
              )}

              <button
                onClick={() => void handleSubmitReview()}
                disabled={reviewSubmitting || reviewSubmitted}
                className="mt-5 px-5 py-2.5 rounded-lg bg-[#2C5F5D] text-white text-sm font-medium hover:bg-[#244f4d] transition disabled:opacity-60"
              >
                {reviewSubmitted
                  ? "Review submitted"
                  : reviewSubmitting
                    ? "Submitting review..."
                    : "Submit review"}
              </button>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
