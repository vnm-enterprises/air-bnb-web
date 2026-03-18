"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const bookingId =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("bookingId");

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-center py-24 px-6 text-center">

        <Clock3 size={64} className="text-amber-500 mb-6" />

        <h1 className="text-3xl font-semibold mb-4">
          Booking Request Submitted
        </h1>

        <p className="text-gray-600 mb-10 max-w-md">
          Your booking is currently pending host approval.
          We’ll notify you as soon as it’s confirmed.
        </p>

        <div className="border rounded-2xl p-6 max-w-md w-full shadow-sm mb-10">
          <div className="mb-4">
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold">
              Pending Approval
            </span>
          </div>

          <p className="font-semibold mb-2">
            Modern Beachside Villa
          </p>
          <p className="text-sm text-gray-500">
            Oct 12 – Oct 17 · 2 guests
          </p>

          <div className="flex justify-between mt-6 text-sm">
            <span>Total Paid</span>
            <span className="font-semibold">$750</span>
          </div>
        </div>

        <button
          onClick={() =>
            router.push(bookingId ? `/booking/${bookingId}` : "/dashboard")
          }
          className="bg-[#306966] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#255a58] transition"
        >
          View Pending Booking
        </button>

      </main>

      <Footer />
    </>
  );
}
