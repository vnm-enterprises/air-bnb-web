"use client";
/* eslint-disable @next/next/no-img-element */

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/infrastructure/services/booking-service";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const response = (error as { response?: { status?: number; data?: { message?: string } } }).response;
      const statusCode = response?.status;
      const apiMessage = response?.data?.message;

      if (statusCode === 409) {
        return apiMessage || "Selected dates are no longer available. Please choose different dates.";
      }

      if (statusCode === 422) {
        return apiMessage || "Please review booking details and try again.";
      }

      return apiMessage || fallback;
    }

    return fallback;
  };

  // Get booking details from URL params
  const [bookingData, setBookingData] = useState({
    property_id: 0,
    check_in: "",
    check_out: "",
    guests: 0,
    propertyTitle: "",
    propertyLocation: "",
    propertyImage: "",
    pricePerNight: 0,
    nights: 0,
    cleaningFee: 350,
    serviceFee: 0,
    total: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Load booking data from localStorage (set from property page)
    const savedBooking = localStorage.getItem('pendingBooking');
    if (savedBooking) {
      const data = JSON.parse(savedBooking);
      setBookingData(data);
    } else {
      // No booking data, redirect back
      router.push('/properties');
    }
  }, [isAuthenticated, router]);

  const handlePayment = async () => {
    if (!bookingData.property_id || !bookingData.check_in || !bookingData.check_out) {
      setError("Missing booking information. Please start from property page.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await createBooking({
        property_id: bookingData.property_id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guest_count: bookingData.guests
      });

      if (response.success) {
        localStorage.removeItem('pendingBooking');
        router.push(`/checkout/success?bookingId=${response.data.booking_id}`);
      }
    } catch (err: unknown) {
      setError(getApiMessage(err, "Failed to create booking"));
    } finally {
      setLoading(false);
    }
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

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
                    <p>{bookingData.check_in ? new Date(bookingData.check_in).toLocaleDateString() : 'Select dates'} – {bookingData.check_out ? new Date(bookingData.check_out).toLocaleDateString() : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase text-xs">
                      Guests
                    </p>
                    <p>{bookingData.guests || 0} guests</p>
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
                  src={bookingData.propertyImage || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80"}
                  alt={bookingData.propertyTitle || "Property image"}
                  className="w-24 h-20 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Property
                  </p>
                  <h3 className="font-semibold text-sm">
                    {bookingData.propertyTitle || "Property"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {bookingData.propertyLocation || "Location"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>
                    ${bookingData.pricePerNight || 0} × {bookingData.nights || 0} nights
                  </span>
                  <span>${(bookingData.pricePerNight * bookingData.nights) || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>${bookingData.cleaningFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${bookingData.serviceFee}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${bookingData.total || 0}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
