"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  CheckCircle2
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      const success = Math.random() > 0.3;
      success
        ? router.push("/checkout/success")
        : router.push("/checkout/error");
    }, 1500);
  };

  return (
    <>
      <Header />

      <main className="bg-[#f7f7f7] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* BREADCRUMB */}
          <div className="text-sm text-gray-500 mb-6">
            Search Results &gt; Property Details &gt;{" "}
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Checkout
            </span>
          </div>

          <h1 className="text-3xl font-semibold mb-10">
            Confirm and Book
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-8">

              {/* TRIP CARD */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold mb-4">
                  Your Trip
                </h2>

                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500 uppercase text-xs">
                      Dates
                    </p>
                    <p>Oct 12 – Oct 17, 2023</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase text-xs">
                      Guests
                    </p>
                    <p>2 guests</p>
                  </div>
                </div>
              </div>

              {/* GUEST INFO */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold mb-6">
                  Guest Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="First Name"
                    className="border rounded-lg p-3"
                  />
                  <input
                    placeholder="Last Name"
                    className="border rounded-lg p-3"
                  />
                </div>

                <input
                  placeholder="Email Address"
                  className="border rounded-lg p-3 mt-4 w-full"
                />
              </div>

              {/* PAYMENT */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold mb-6">
                  Payment Method
                </h2>

                <div className="border rounded-xl p-6 bg-gray-50 space-y-4">

                  <input
                    placeholder="Card Number"
                    className="border rounded-lg p-3 w-full bg-white"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="MM/YY"
                      className="border rounded-lg p-3 bg-white"
                    />
                    <input
                      placeholder="CVV"
                      className="border rounded-lg p-3 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                  <Lock size={16} />
                  Your card will be charged once the host accepts the booking.
                </div>
              </div>

              {/* CONFIRM BUTTON */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#306966] text-white py-4 rounded-xl font-medium hover:bg-[#255a58] transition shadow-md"
              >
                {loading ? "Processing..." : "Confirm and Pay"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By selecting the button above, you agree to the Property Rules,
                Guest Refund Policy, and Terms of Service.
              </p>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="bg-white rounded-2xl p-6 shadow-md h-fit">

              <div className="flex gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80"
                  className="w-24 h-20 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Entire Villa
                  </p>
                  <p className="font-semibold">
                    Modern Beachside Villa
                  </p>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    ⭐ 4.95
                    <span className="text-gray-500">
                      (128 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <hr className="mb-6" />

              <h3 className="font-semibold mb-4">
                Price Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>£120 × 5 nights</span>
                  <span>£600.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>£45.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>£25.00</span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total (GBP)</span>
                <span>£670.00</span>
              </div>

              <div className="flex items-center gap-2 mt-6 bg-green-50 text-green-700 text-xs px-4 py-3 rounded-lg">
                <ShieldCheck size={16} />
                PRICE GUARANTEE
              </div>

              <div className="flex justify-between text-xs text-gray-400 mt-6">
                <div className="flex items-center gap-1">
                  <Lock size={14} /> SSL SECURED
                </div>
                <div>VERIFIED HOST</div>
                <div>NO HIDDEN FEES</div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
