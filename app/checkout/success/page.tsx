"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-center py-24 px-6 text-center">

        <CheckCircle size={64} className="text-green-600 mb-6" />

        <h1 className="text-3xl font-semibold mb-4">
          Booking Confirmed!
        </h1>

        <p className="text-gray-600 mb-10 max-w-md">
          Your stay has been successfully booked.
          Confirmation details have been sent to your email.
        </p>

        <div className="border rounded-2xl p-6 max-w-md w-full shadow-sm mb-10">

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
          onClick={() => router.push("/dashboard")}
          className="bg-[#306966] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#255a58] transition"
        >
          View Bookings
        </button>

      </main>

      <Footer />
    </>
  );
}
