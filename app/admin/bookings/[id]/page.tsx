"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, CreditCard, Receipt, User, Home } from "lucide-react";
import { getAdminBookingById, type AdminBooking } from "@/lib/adminApi";

function normalizeStatus(status: string): string {
  return String(status || "").trim().toLowerCase();
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const normalized = normalizeStatus(status);
  const map: Record<string, string> = {
    pending: "bg-amber-900/50 text-amber-300 border-amber-700/40",
    approved: "bg-blue-900/50 text-blue-300 border-blue-700/40",
    completed: "bg-emerald-900/50 text-emerald-300 border-emerald-700/40",
    rejected: "bg-red-900/50 text-red-400 border-red-700/40",
    cancelled: "bg-slate-800 text-slate-400 border-slate-700",
    refunded: "bg-violet-900/50 text-violet-300 border-violet-700/40",
  };

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${map[normalized] ?? map.cancelled}`}>
      {normalized || "unknown"}
    </span>
  );
}

export default function AdminBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = useMemo(() => {
    const raw = params?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [params]);

  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!bookingId) {
      setError("Invalid booking id.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAdminBookingById(bookingId);
      setBooking(data);
    } catch {
      setError("Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Booking Details</h1>
          <p className="text-[12px] text-slate-400 mt-0.5">Booking #{bookingId}</p>
        </div>
        <button
          onClick={() => router.push("/admin/bookings")}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[12px] text-slate-300 hover:bg-slate-800 transition"
        >
          Back to Bookings
        </button>
      </div>

      {loading && <div className="text-[12px] text-slate-400">Loading booking details...</div>}

      {error && !loading && (
        <div className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-[12px] text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && booking && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="border-b border-slate-800 px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Property</p>
              <p className="text-sm font-semibold text-slate-200">{booking.property_title}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <p className="text-slate-500 uppercase text-[10px]">Traveler</p>
              <p className="mt-1 text-slate-200 inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                {booking.traveler_name}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <p className="text-slate-500 uppercase text-[10px]">Dates</p>
              <p className="mt-1 text-slate-200 inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <p className="text-slate-500 uppercase text-[10px]">Guests</p>
              <p className="mt-1 text-slate-200">{booking.guest_count}</p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <p className="text-slate-500 uppercase text-[10px]">Payment</p>
              <p className="mt-1 text-slate-200 inline-flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                {String(booking.payment_status || "pending").toLowerCase()}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 sm:col-span-2">
              <p className="text-slate-500 uppercase text-[10px]">Total</p>
              <p className="mt-1 text-slate-100 font-semibold inline-flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-slate-500" />
                ${Number(booking.total_price || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 px-5 py-3 flex justify-end">
            <Link
              href={`/properties/${booking.property_id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[12px] text-slate-200 hover:bg-slate-700 transition"
            >
              <Home className="h-3.5 w-3.5" />
              View Property
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
