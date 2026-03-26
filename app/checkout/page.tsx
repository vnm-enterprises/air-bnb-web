"use client";
/* eslint-disable @next/next/no-img-element */

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/infrastructure/services/booking-service";

type GuestForm = {
  firstName: string;
  lastName: string;
  email: string;
};

type CardForm = {
  cardNumber: string;
  expiry: string;
  cvv: string;
};

type FormErrors = Partial<Record<keyof GuestForm | keyof CardForm | "booking", string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"ready" | "processing" | "finalizing">("ready");
  const [guestForm, setGuestForm] = useState<GuestForm>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [cardForm, setCardForm] = useState<CardForm>({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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

  function getTodayDateOnly(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function parseName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return { firstName: "", lastName: "" };
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };

    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" "),
    };
  }

  function validateForm(): boolean {
    const nextErrors: FormErrors = {};

    if (!guestForm.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!guestForm.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!guestForm.email.trim() || !validateEmail(guestForm.email.trim())) {
      nextErrors.email = "A valid email is required.";
    }

    const digits = cardForm.cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) {
      nextErrors.cardNumber = "Enter a valid card number.";
    }

    if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry)) {
      nextErrors.expiry = "Use MM/YY format.";
    } else {
      const [monthText, yearText] = cardForm.expiry.split("/");
      const month = Number(monthText);
      const year = Number(`20${yearText}`);

      if (month < 1 || month > 12) {
        nextErrors.expiry = "Expiry month must be between 01 and 12.";
      } else {
        const now = new Date();
        const expiryDate = new Date(year, month, 0);
        expiryDate.setHours(23, 59, 59, 999);

        if (expiryDate < now) {
          nextErrors.expiry = "Card expiry date is in the past.";
        }
      }
    }

    if (!/^\d{3,4}$/.test(cardForm.cvv.trim())) {
      nextErrors.cvv = "CVV must be 3 or 4 digits.";
    }

    if (!bookingData.property_id || !bookingData.check_in || !bookingData.check_out) {
      nextErrors.booking = "Missing booking information. Please start again from the property page.";
    }

    const checkInDate = new Date(bookingData.check_in);
    const checkOutDate = new Date(bookingData.check_out);
    const today = getTodayDateOnly();

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      nextErrors.booking = "Booking dates are invalid. Please choose dates again.";
    } else {
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        nextErrors.booking = "Check-in date cannot be in the past.";
      }

      if (checkOutDate <= checkInDate) {
        nextErrors.booking = "Check-out must be after check-in.";
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  // Get booking details from local storage
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

    if (user) {
      const parsed = parseName(user.name || "");
      setGuestForm((current) => ({
        firstName: current.firstName || parsed.firstName,
        lastName: current.lastName || parsed.lastName,
        email: current.email || user.email || "",
      }));
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
  }, [isAuthenticated, router, user]);

  const handlePayment = async () => {
    setError(null);

    if (!validateForm()) {
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    setLoading(true);
    setStep("processing");

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));

      setStep("finalizing");

      const response = await createBooking({
        property_id: bookingData.property_id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guest_count: bookingData.guests
      });

      if (response.success) {
        const receiptPayload = {
          bookingId: response.data.booking_id,
          propertyTitle: bookingData.propertyTitle,
          propertyLocation: bookingData.propertyLocation,
          propertyImage: bookingData.propertyImage,
          checkIn: bookingData.check_in,
          checkOut: bookingData.check_out,
          guests: bookingData.guests,
          nights: bookingData.nights,
          pricePerNight: bookingData.pricePerNight,
          cleaningFee: bookingData.cleaningFee,
          serviceFee: bookingData.serviceFee,
          totalPaid: bookingData.total,
          guestName: `${guestForm.firstName.trim()} ${guestForm.lastName.trim()}`.trim(),
          guestEmail: guestForm.email.trim(),
          paidAt: new Date().toISOString(),
        };

        localStorage.removeItem('pendingBooking');
        localStorage.setItem("lastBookingReceipt", JSON.stringify(receiptPayload));
        router.push(`/checkout/success?bookingId=${response.data.booking_id}`);
      }
    } catch (err: unknown) {
      setError(getApiMessage(err, "Failed to create booking"));
      setStep("ready");
    } finally {
      setLoading(false);
    }
  };

  const updateGuestField = (key: keyof GuestForm, value: string) => {
    setGuestForm((current) => ({ ...current, [key]: value }));
    setFormErrors((current) => ({ ...current, [key]: undefined }));
  };

  const updateCardField = (key: keyof CardForm, value: string) => {
    let nextValue = value;

    if (key === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 19);
      nextValue = digits.replace(/(.{4})/g, "$1 ").trim();
    }

    if (key === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      nextValue = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }

    if (key === "cvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardForm((current) => ({ ...current, [key]: nextValue }));
    setFormErrors((current) => ({ ...current, [key]: undefined }));
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
                    value={guestForm.firstName}
                    onChange={(event) => updateGuestField("firstName", event.target.value)}
                    placeholder="First Name"
                    className={`border rounded-lg p-3 ${formErrors.firstName ? "border-red-300 bg-red-50" : ""}`}
                  />
                  <input
                    value={guestForm.lastName}
                    onChange={(event) => updateGuestField("lastName", event.target.value)}
                    placeholder="Last Name"
                    className={`border rounded-lg p-3 ${formErrors.lastName ? "border-red-300 bg-red-50" : ""}`}
                  />
                </div>

                {(formErrors.firstName || formErrors.lastName) && (
                  <p className="mt-2 text-xs text-red-600">{formErrors.firstName || formErrors.lastName}</p>
                )}

                <input
                  value={guestForm.email}
                  onChange={(event) => updateGuestField("email", event.target.value)}
                  placeholder="Email Address"
                  className={`border rounded-lg p-3 mt-4 w-full ${formErrors.email ? "border-red-300 bg-red-50" : ""}`}
                />

                {formErrors.email && <p className="mt-2 text-xs text-red-600">{formErrors.email}</p>}
              </div>

              {/* PAYMENT */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold mb-6">
                  Payment Method
                </h2>

                <div className="border rounded-xl p-6 bg-gray-50 space-y-4">

                  <input
                    value={cardForm.cardNumber}
                    onChange={(event) => updateCardField("cardNumber", event.target.value)}
                    placeholder="Card Number"
                    className={`border rounded-lg p-3 w-full bg-white ${formErrors.cardNumber ? "border-red-300 bg-red-50" : ""}`}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      value={cardForm.expiry}
                      onChange={(event) => updateCardField("expiry", event.target.value)}
                      placeholder="MM/YY"
                      className={`border rounded-lg p-3 bg-white ${formErrors.expiry ? "border-red-300 bg-red-50" : ""}`}
                    />
                    <input
                      value={cardForm.cvv}
                      onChange={(event) => updateCardField("cvv", event.target.value)}
                      placeholder="CVV"
                      className={`border rounded-lg p-3 bg-white ${formErrors.cvv ? "border-red-300 bg-red-50" : ""}`}
                    />
                  </div>
                </div>

                {(formErrors.cardNumber || formErrors.expiry || formErrors.cvv) && (
                  <p className="mt-3 text-xs text-red-600">
                    {formErrors.cardNumber || formErrors.expiry || formErrors.cvv}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                  <Lock size={16} />
                  Dummy gateway in use: no real card charge will occur.
                </div>
              </div>

              {/* CONFIRM BUTTON */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#306966] text-white py-4 rounded-xl font-medium hover:bg-[#255a58] transition shadow-md"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {step === "processing" ? "Processing payment..." : "Finalizing booking..."}
                  </span>
                ) : (
                  "Confirm and Pay"
                )}
              </button>

              {formErrors.booking && <p className="text-xs text-red-600 -mt-4">{formErrors.booking}</p>}

              {!loading && !error && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Booking details are validated. Click Confirm and Pay to submit your request.
                </div>
              )}

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
