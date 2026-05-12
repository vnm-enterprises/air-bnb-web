"use client";
/* eslint-disable @next/next/no-img-element */

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Share2, Heart, Mail, Phone, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DayPicker, DateRange, Matcher } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import {
  getPropertyById,
  getPropertyHostContact,
  getUnavailableDates,
  Property,
  PropertyHostContact,
} from "@/infrastructure/services/property-service";
import { getPropertyReviews, replyToReview, type PropertyReview } from "@/infrastructure/services/review-service";
import { useWishlist } from "@/hooks/useWishlist";
import { resolveImageUrl } from "@/lib/image";
import "react-day-picker/dist/style.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";

function formatRating(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "New";
  }

  return value.toFixed(2);
}

function formatDateLabel(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function parseDateOnly(dateString: string): Date | null {
  const [year, month, day] = dateString.split("-").map(Number);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  // Build dates in local time to avoid timezone shifts from YYYY-MM-DD parsing.
  const parsed = new Date(year, month - 1, day);
  parsed.setHours(0, 0, 0, 0);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { isHost, isAuthenticated, user } = useAuth();
  const { isInWishlist, isProcessing, toggleWishlist, canUseWishlist } = useWishlist();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [hostContact, setHostContact] = useState<PropertyHostContact | null>(null);
  const [hostContactError, setHostContactError] = useState<string | null>(null);
  const [hostContactLoading, setHostContactLoading] = useState(false);
  const [hostContactOpen, setHostContactOpen] = useState(false);
  const [disabledDateMatchers, setDisabledDateMatchers] = useState<Matcher[]>([]);
  const [unavailableDatesRefreshTick, setUnavailableDatesRefreshTick] = useState(0);
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewReplyDrafts, setReviewReplyDrafts] = useState<Record<number, string>>({});
  const [replyingReviewId, setReplyingReviewId] = useState<number | null>(null);

  const earliestBookableDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const propertyId = useMemo(() => {
    const rawId = params?.id;
    const value = Array.isArray(rawId) ? rawId[0] : rawId;
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : NaN;
  }, [params]);

  useEffect(() => {
    if (!Number.isFinite(propertyId) || propertyId <= 0) {
      setError("Invalid property ID");
      setLoading(false);
      return;
    }

    let active = true;

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPropertyById(propertyId);

        if (!active) {
          return;
        }

        setProperty(response.data);
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        setError(getApiMessage(err, "Failed to load property details"));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => {
      active = false;
    };
  }, [propertyId]);

  useEffect(() => {
    if (!Number.isFinite(propertyId) || propertyId <= 0) {
      return;
    }

    let active = true;

    const fetchUnavailableDates = async () => {
      // Clear previous dates when switching properties
      setDisabledDateMatchers([]);

      try {
        const response = await getUnavailableDates(propertyId);

        if (!active) {
          return;
        }

        const unavailableRanges: Matcher[] = [];

        response.data.unavailable_dates.forEach((unavailableRange) => {
          const start = parseDateOnly(unavailableRange.from);
          const end = parseDateOnly(unavailableRange.to);

          if (!start || !end || start > end) {
            return;
          }

          // Include the checkout day in the greyed range so the full booked
          // period (check-in through check-out inclusive) is visually blocked.
          // The backend conflict check uses an exclusive boundary so back-to-back
          // bookings still work correctly at the API level.
          unavailableRanges.push({ from: start, to: end });
        });

        setDisabledDateMatchers(unavailableRanges);
      } catch (err) {
        console.error("Failed to fetch unavailable dates:", err);
        setDisabledDateMatchers([]);
      }
    };

    fetchUnavailableDates();

    return () => {
      active = false;
    };
  }, [propertyId, unavailableDatesRefreshTick]);

  useEffect(() => {
    const triggerUnavailableDatesRefresh = () => {
      setUnavailableDatesRefreshTick((current) => current + 1);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        triggerUnavailableDatesRefresh();
      }
    };

    window.addEventListener("focus", triggerUnavailableDatesRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", triggerUnavailableDatesRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!property) {
      return;
    }

    const maxGuests = Math.max(1, Number(property.max_guests || 1));
    setGuests((current) => Math.min(Math.max(current, 1), maxGuests));
  }, [property]);

  useEffect(() => {
    if (!Number.isFinite(propertyId) || propertyId <= 0) {
      return;
    }

    let active = true;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);

      try {
        const response = await getPropertyReviews(propertyId, { page: 1, per_page: 20 });

        if (!active) {
          return;
        }

        setReviews(response.data.reviews || []);
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        setReviews([]);
        setReviewsError(getApiMessage(err, "Failed to load reviews"));
      } finally {
        if (active) {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      active = false;
    };
  }, [propertyId]);

  const imageUrls = useMemo(() => {
    if (!property?.images || !Array.isArray(property.images)) {
      return [FALLBACK_IMAGE];
    }

    const valid = property.images.filter(
      (image): image is string => typeof image === "string" && image.trim().length > 0
    );

    return valid.length > 0
      ? valid.map((image) => resolveImageUrl(image, FALLBACK_IMAGE))
      : [FALLBACK_IMAGE];
  }, [property]);

  const amenities = useMemo(() => {
    if (!property?.amenities || !Array.isArray(property.amenities)) {
      return [];
    }

    return property.amenities.filter(
      (amenity): amenity is string => typeof amenity === "string" && amenity.trim().length > 0
    );
  }, [property]);

  const nights =
    range?.from && range?.to
      ? Math.max(0, differenceInDays(range.to, range.from))
      : 0;

  const nightlyPrice = Number(property?.price || 0);
  const cleaningFee = nights > 0 ? Math.round(nightlyPrice * 0.12) : 0;
  const serviceFee = nights > 0 ? Math.round(nightlyPrice * nights * 0.08) : 0;
  const subtotal = nights * nightlyPrice;
  const total = subtotal + cleaningFee + serviceFee;

  const maxGuests = Math.max(1, Number(property?.max_guests || 1));
  const guestOptions = Array.from({ length: maxGuests }, (_, index) => index + 1);

  const handleHostReply = async (reviewId: number) => {
    const reply = (reviewReplyDrafts[reviewId] || "").trim();

    if (!reply) {
      setReviewsError("Reply cannot be empty");
      return;
    }

    setReviewsError(null);
    setReplyingReviewId(reviewId);

    try {
      await replyToReview(reviewId, reply);

      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                host_reply: reply,
              }
            : review
        )
      );

      setReviewReplyDrafts((current) => ({
        ...current,
        [reviewId]: "",
      }));
    } catch (err: unknown) {
      setReviewsError(getApiMessage(err, "Failed to add host reply"));
    } finally {
      setReplyingReviewId(null);
    }
  };

  const openHostContactModal = async () => {
    if (!property) {
      return;
    }

    setHostContactOpen(true);
    setHostContactError(null);

    if (hostContact || hostContactLoading) {
      return;
    }

    setHostContactLoading(true);

    try {
      const response = await getPropertyHostContact(property.id);
      setHostContact(response.data);
    } catch (err: unknown) {
      setHostContactError(getApiMessage(err, "Unable to load host contact details right now."));
    } finally {
      setHostContactLoading(false);
    }
  };

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

  if (error || !property) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="border border-red-100 bg-red-50 text-red-700 rounded-xl p-6">
            <p className="font-medium">{error || "Property not found"}</p>
            <button
              onClick={() => router.push("/properties")}
              className="mt-4 px-4 py-2 text-sm rounded-md bg-[#2C5F5D] text-white hover:bg-[#244f4d] transition"
            >
              Back to Properties
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const ratingText = formatRating(Number(property.rating_average || 0));
  const reviewCount = Number(property.rating_count || 0);
  const beds = Math.max(1, Number(property.bedrooms || 1));
  const listedOn = formatDateLabel(property.created_at);
  const hostName = (property.host_name || "Host").trim() || "Host";
  const isPropertyHostOwner = Boolean(
    isHost() && user?.id && Number(user.id) === Number(property.host_id)
  );

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="rounded-3xl  p-5 sm:p-7 ">
          <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:justify-between lg:items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0f2f31]">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-base text-slate-700 mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#d1e6e3] px-3 py-1.5">
                  <Star size={14} className="fill-[#1e5f5c] text-[#1e5f5c]" />
                  {ratingText} ({reviewCount} reviews)
                </span>
                <span className="inline-flex items-center rounded-full bg-white border border-[#d1e6e3] px-3 py-1.5 text-slate-600">
                  {property.location || "Location unavailable"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  void navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <Share2 size={16} />
              Share
            </button>

            <button
              onClick={() => {
                if (canUseWishlist) {
                  void toggleWishlist(propertyId);
                } else {
                  router.push("/login");
                }
              }}
              disabled={isProcessing(propertyId)}
              className="inline-flex items-center gap-2 rounded-full border border-[#2f6d6a] bg-[#2f6d6a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#255a58] disabled:opacity-60"
            >
              <Heart
                size={16}
                className={isInWishlist(propertyId) ? "fill-white text-white" : ""}
              />
              {isInWishlist(propertyId) ? "Saved" : "Save"}
            </button>
          </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-7 rounded-3xl overflow-hidden">
          <div className="sm:col-span-2 sm:row-span-2 h-105 sm:h-120 xl:h-130 overflow-hidden rounded-2xl">
            <img
              src={imageUrls[0]}
              className="w-full h-full object-cover transition duration-700 hover:scale-[1.03]"
              alt={property.title}
            />
          </div>

          {(imageUrls.length > 1 ? imageUrls.slice(1, 5) : [FALLBACK_IMAGE, FALLBACK_IMAGE, FALLBACK_IMAGE, FALLBACK_IMAGE]).map((image, index) => (
            <div key={`${image}-${index}`} className="h-56 sm:h-60 xl:h-63 overflow-hidden rounded-2xl">
              <img
                src={image}
                className="w-full h-full object-cover transition duration-700 hover:scale-[1.04]"
                alt={`${property.title} image ${index + 2}`}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="rounded-2xl border border-[#d9ece9] bg-linear-to-br from-[#f3fbfa] to-white p-6 sm:p-7 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#123c3a]">
                Entire property hosted by {hostName}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-2">
                {property.max_guests} guests · {property.bedrooms} bedrooms · {beds} beds · {property.bathrooms} baths
              </p>
              <p className="text-sm sm:text-base text-slate-500 mt-3">
                A refined stay designed for calm mornings, productive afternoons, and cozy evenings.
              </p>
            </div>

            {stripHtml(property.description || "").length > 0 ? (
              <div
                className="prose prose-slate max-w-none text-gray-700 leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">No description provided.</p>
            )}

            <hr />

            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#123c3a] mb-6">
                What this place offers
              </h3>

              {amenities.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(showAllAmenities ? amenities : amenities.slice(0, 4)).map((amenity) => (
                      <div
                        key={amenity}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700"
                      >
                        {amenity}
                      </div>
                    ))}
                  </div>

                  {amenities.length > 4 && (
                    <button
                      onClick={() => setShowAllAmenities((current) => !current)}
                      className="mt-6 border px-6 py-2 rounded-full text-sm"
                    >
                      {showAllAmenities
                        ? "Show less"
                        : `Show all ${amenities.length} amenities`}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">Amenities will be available soon.</p>
              )}
            </div>

            <hr />

            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#123c3a] mb-6">
                Guest reviews
              </h3>

              {reviewsLoading ? (
                <p className="text-sm text-gray-500">Loading reviews...</p>
              ) : reviewsError ? (
                <p className="text-sm text-red-600">{reviewsError}</p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-500">No approved reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-slate-200 rounded-xl p-4 bg-white">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-slate-900">{review.reviewer_name || "Guest"}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          {Array.from({ length: 5 }, (_, index) => {
                            const starValue = index + 1;
                            return (
                              <Star
                                key={`${review.id}-${starValue}`}
                                size={14}
                                className={
                                  starValue <= Number(review.rating)
                                    ? "fill-black text-black"
                                    : "text-gray-300"
                                }
                              />
                            );
                          })}
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                        {review.comment || "No comment provided."}
                      </p>

                      {review.host_reply && (
                        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Host reply
                          </p>
                          <p className="mt-1 text-sm text-slate-700">{review.host_reply}</p>
                        </div>
                      )}

                      {isPropertyHostOwner && !review.host_reply && (
                        <div className="mt-3">
                          <textarea
                            value={reviewReplyDrafts[review.id] || ""}
                            onChange={(event) =>
                              setReviewReplyDrafts((current) => ({
                                ...current,
                                [review.id]: event.target.value,
                              }))
                            }
                            placeholder="Write a reply to this guest"
                            className="w-full min-h-22.5 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                          />
                          <button
                            onClick={() => void handleHostReply(review.id)}
                            disabled={replyingReviewId === review.id}
                            className="mt-2 px-4 py-2 text-sm rounded-lg bg-[#2C5F5D] text-white hover:bg-[#244f4d] transition disabled:opacity-60"
                          >
                            {replyingReviewId === review.id ? "Posting reply..." : "Reply as host"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr />

            <div className="border rounded-2xl p-8 bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80"
                  className="w-16 h-16 rounded-full object-cover"
                  alt="Host profile"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Hosted by {hostName}</h3>
                    <span className="text-green-600 text-sm">●</span>
                  </div>

                  <p className="text-sm text-gray-500">Listing created in {listedOn}</p>
                </div>
              </div>

              <div className="flex gap-16 mt-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Reviews</p>
                  <p className="text-lg font-semibold">{reviewCount}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Rating</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    {ratingText === "New" ? "New" : ratingText} <Star size={14} className="fill-black" />
                  </p>
                </div>
              </div>


            </div>
          </div>

          {!isHost() ? (
            <div className="border rounded-2xl p-6 shadow-lg sticky top-24 h-fit">
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">
                  ${nightlyPrice}
                  <span className="text-sm font-normal"> / night</span>
                </div>
                <div className="text-sm flex items-center gap-1">
                  <Star size={14} className="fill-black" />
                  {ratingText}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#cfe3e0] bg-linear-to-b from-white to-[#f2f9f8] p-4 shadow-inner">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  disabled={disabledDateMatchers}
                  excludeDisabled
                  fromDate={earliestBookableDate}
                  className="w-full"
                  classNames={{
                    months: "w-full",
                    month: "w-full",
                    caption: "mb-3 flex items-center justify-between px-2",
                    caption_label: "text-lg font-semibold text-[#123c3a]",
                    nav: "flex items-center gap-1",
                    nav_button:
                      "h-8 w-8 rounded-full border border-[#bdd9d5] bg-white text-[#2f6d6a] transition hover:bg-[#eaf5f3]",
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell:
                      "h-9 w-10 text-[12px] font-semibold uppercase tracking-wide text-slate-500 flex items-center justify-center",
                    row: "mt-1 flex w-full",
                    cell: "h-10 w-10 p-0 text-sm",
                    day: "h-10 w-10 rounded-full text-sm font-medium text-slate-700 transition hover:bg-[#e8f4f2]",
                  }}
                  modifiersClassNames={{
                    disabled: "booking-day-unavailable text-slate-300",
                    today: "font-bold text-[#1f5f5c]",
                    selected: "bg-[#2f6d6a] text-white hover:bg-[#255a58]",
                    range_start: "bg-[#2f6d6a] text-white rounded-l-full",
                    range_end: "bg-[#2f6d6a] text-white rounded-r-full",
                    range_middle: "bg-[#d8ecea] text-[#1b5452]",
                  }}
                />
                <p className="mt-2 text-xs font-medium text-slate-500">Unavailable dates are greyed out.</p>
              </div>

              <div className="mt-4">
                <label className="text-xs text-gray-500">Guests</label>
                <select
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                  className="w-full border rounded-lg p-3 mt-1 text-sm"
                >
                  {guestOptions.map((value) => (
                    <option key={value} value={value}>
                      {value} guests
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push("/login");
                    return;
                  }

                  setBookingError(null);

                  if (!range?.from || !range?.to) {
                    setBookingError("Please select both check-in and check-out dates.");
                    return;
                  }

                  if (range.from < earliestBookableDate) {
                    setBookingError("Check-in date cannot be in the past.");
                    return;
                  }

                  if (nights <= 0) {
                    setBookingError("Please select at least one night for your stay.");
                    return;
                  }

                  const bookingData = {
                    property_id: property.id,
                    check_in: formatDateForApi(range.from),
                    check_out: formatDateForApi(range.to),
                    guests,
                    propertyTitle: property.title,
                    propertyLocation: property.location,
                    propertyImage: imageUrls[0],
                    pricePerNight: nightlyPrice,
                    nights,
                    cleaningFee,
                    serviceFee,
                    total,
                  };

                  localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
                  router.push("/checkout");
                }}
                className="mt-4 w-full bg-[#306966] text-white py-3 rounded-lg font-medium hover:bg-[#244f4d] transition"
              >
                {isAuthenticated ? "Reserve Now" : "Login to Book"}
              </button>

              {bookingError && (
                <p className="mt-3 text-xs text-red-600">{bookingError}</p>
              )}

              {nights > 0 && (
                <div className="mt-6 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>
                      ${nightlyPrice} × {nights} nights
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>${cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PropBnb service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total before taxes</span>
                    <span>${total}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-2xl p-6 shadow-lg sticky top-24 h-fit bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-semibold">
                  ${nightlyPrice}
                  <span className="text-sm font-normal"> / night</span>
                </div>
                <div className="text-sm flex items-center gap-1">
                  <Star size={14} className="fill-black" />
                  {ratingText}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">Host Account</p>
                <p className="text-xs text-blue-700">
                  As a host, you cannot book properties. Switch to a traveler account or create a separate account to make bookings.
                </p>
              </div>

              <button
                onClick={() => router.push("/host")}
                className="mt-4 w-full bg-[#306966] text-white py-3 rounded-lg font-medium hover:bg-[#244f4d] transition"
              >
                Go to Host Dashboard
              </button>
            </div>
          )}
        </div>

        {hostContactOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/55"
              onClick={() => setHostContactOpen(false)}
            />

            <div className="fixed inset-0 z-50 grid place-items-center p-4">
              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Contact Host</p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-900">{hostName}</h4>
                  </div>
                  <button
                    onClick={() => setHostContactOpen(false)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
                    aria-label="Close host contact popup"
                  >
                    <X size={16} />
                  </button>
                </div>

                {hostContactLoading ? (
                  <div className="mt-5 text-sm text-slate-500">Loading host contact details...</div>
                ) : hostContactError ? (
                  <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    {hostContactError}
                  </div>
                ) : hostContact ? (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="text-sm font-medium text-slate-900">{hostContact.host_name}</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Email</p>
                      <a
                        href={`mailto:${hostContact.host_email}`}
                        className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#2C5F5D] hover:underline"
                      >
                        <Mail size={14} />
                        {hostContact.host_email}
                      </a>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Phone</p>
                      {hostContact.host_phone ? (
                        <a
                          href={`tel:${hostContact.host_phone}`}
                          className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#2C5F5D] hover:underline"
                        >
                          <Phone size={14} />
                          {hostContact.host_phone}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-slate-600">Phone number is not available.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
