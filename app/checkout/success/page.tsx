"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, CalendarDays, CreditCard, Home, User, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { getBookingById } from "@/infrastructure/services/booking-service";
import { getPropertyById } from "@/infrastructure/services/property-service";

type ReceiptData = {
  bookingId: number;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  bookingStatus: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  totalPaid: number;
  guestName: string;
  guestEmail: string;
  paidAt: string;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function nightCount(from: string, to: string): number {
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

function normalizeBookingStatus(status: string): string {
  const normalized = (status || "").toLowerCase().trim();

  if (normalized === "approved") return "confirmed";
  if (normalized === "rejected") return "cancelled";
  return normalized || "pending";
}

function statusPillClass(status: string): string {
  if (status === "confirmed") return "bg-blue-100 text-blue-700";
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-slate-200 text-slate-600";
  return "bg-amber-100 text-amber-700";
}

function statusMessage(status: string): string {
  if (status === "confirmed") {
    return "Your booking is confirmed by the host.";
  }

  if (status === "completed") {
    return "This booking has been completed. Thank you for staying with us.";
  }

  if (status === "cancelled") {
    return "This booking has been cancelled.";
  }

  return "Your booking is pending host approval. We will notify you once it is confirmed.";
}

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = Number(searchParams.get("bookingId") || 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedRaw = localStorage.getItem("lastBookingReceipt");
        const stored = storedRaw ? (JSON.parse(storedRaw) as Partial<ReceiptData>) : null;

        const id = Number.isFinite(bookingId) && bookingId > 0
          ? bookingId
          : Number(stored?.bookingId || 0);

        if (!id) {
          throw new Error("Booking reference is missing.");
        }

        const bookingRes = await getBookingById(id);
        const booking = bookingRes.data;

        const propertyId = Number(booking.property_id || 0);
        const propertyRes = propertyId > 0 ? await getPropertyById(propertyId) : null;
        const property = propertyRes?.data;

        const computedNights = stored?.nights || nightCount(String(booking.check_in), String(booking.check_out));
        const pricePerNight = Number(stored?.pricePerNight || booking.price_snapshot || 0);
        const subtotal = computedNights * pricePerNight;
        const cleaningFee = Number(stored?.cleaningFee ?? Math.round(pricePerNight * 0.12));
        const serviceFee = Number(stored?.serviceFee ?? Math.round(subtotal * 0.08));
        const totalPaid = Number(stored?.totalPaid ?? booking.total_price ?? subtotal + cleaningFee + serviceFee);

        const nextReceipt: ReceiptData = {
          bookingId: id,
          propertyTitle: stored?.propertyTitle || property?.title || `Property #${propertyId}`,
          propertyLocation: stored?.propertyLocation || property?.location || "Location unavailable",
          propertyImage: stored?.propertyImage || property?.images?.[0] || "",
          bookingStatus: normalizeBookingStatus(String(booking.status || "pending")),
          checkIn: String(stored?.checkIn || booking.check_in || ""),
          checkOut: String(stored?.checkOut || booking.check_out || ""),
          guests: Number(stored?.guests || booking.guest_count || 1),
          nights: computedNights,
          pricePerNight,
          cleaningFee,
          serviceFee,
          totalPaid,
          guestName: String(stored?.guestName || "Guest"),
          guestEmail: String(stored?.guestEmail || ""),
          paidAt: String(stored?.paidAt || new Date().toISOString()),
        };

        if (!active) return;

        setReceipt(nextReceipt);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load booking confirmation.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [bookingId]);

  const subtotal = useMemo(() => {
    if (!receipt) return 0;
    return receipt.nights * receipt.pricePerNight;
  }, [receipt]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-[#306966] mx-auto" />
              <p className="mt-4 text-sm text-slate-500">Loading booking confirmation...</p>
            </div>
          ) : error || !receipt ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-medium text-red-700">{error || "Could not load confirmation details."}</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-5 rounded-xl bg-[#306966] px-6 py-3 text-white font-medium hover:bg-[#255a58] transition"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <CheckCircle2 size={64} className="text-emerald-600 mx-auto mb-4" />
                <h1 className="text-3xl font-semibold text-slate-900">Booking Request Submitted</h1>
                <p className="text-slate-600 mt-2">
                  {statusMessage(receipt.bookingStatus)}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Booking Reference</p>
                      <p className="text-sm font-semibold text-slate-900">#{receipt.bookingId}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusPillClass(receipt.bookingStatus)}`}>
                      {receipt.bookingStatus.charAt(0).toUpperCase() + receipt.bookingStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={receipt.propertyImage || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80"}
                        alt={receipt.propertyTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{receipt.propertyTitle}</p>
                      <p className="text-sm text-slate-500">{receipt.propertyLocation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Dates</p>
                      <p className="mt-1 text-slate-800 inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-[#306966]" />
                        {formatDate(receipt.checkIn)} - {formatDate(receipt.checkOut)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Guest</p>
                      <p className="mt-1 text-slate-800 inline-flex items-center gap-1.5">
                        <User className="h-4 w-4 text-[#306966]" />
                        {receipt.guestName} ({receipt.guests})
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Payment</p>
                      <p className="mt-1 text-slate-800 inline-flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-[#306966]" />
                        Dummy Gateway
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>${receipt.pricePerNight.toFixed(2)} x {receipt.nights} nights</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-slate-600">
                      <span>Cleaning fee</span>
                      <span>${receipt.cleaningFee.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-slate-600">
                      <span>Service fee</span>
                      <span>${receipt.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 border-t border-slate-200 pt-3 flex justify-between text-base font-semibold text-slate-900">
                      <span>Total Paid</span>
                      <span>${receipt.totalPaid.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push(`/booking/${receipt.bookingId}`)}
                  className="rounded-xl bg-[#306966] px-8 py-3 text-white font-medium hover:bg-[#255a58] transition"
                >
                  View Booking Details
                </button>
                <button
                  onClick={() => router.push("/properties")}
                  className="rounded-xl border border-slate-300 px-6 py-3 text-slate-700 font-medium hover:bg-slate-50 transition inline-flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Continue Browsing
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-[#306966] mx-auto" />
                <p className="mt-4 text-sm text-slate-500">Loading booking confirmation...</p>
              </div>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
