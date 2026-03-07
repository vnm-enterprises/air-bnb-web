"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Share2, Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker, DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import "react-day-picker/dist/style.css";

export default function PropertyPage() {
  const router = useRouter();
  const { isHost, isAuthenticated } = useAuth();

  /* ---------------- BACKEND MOCK DATA ---------------- */

  const property = {
    id: 1,
    title: "Modern Minimalist Villa with Ocean View",
    location: "Malibu, California",
    rating: 4.92,
    reviews: 128,
    price: 1250,
    host: "Julian",
    hostJoined: "May 2018",
    guests: 10,
    bedrooms: 5,
    beds: 6,
    baths: 5.5,
    description:
      "Welcome to your private oasis in the heart of Malibu. This architectural masterpiece offers panoramic views of the Pacific Ocean through floor-to-ceiling glass walls. Designed with focus on minimalism and natural materials, every corner of this villa exudes tranquility.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde"
    ],
    amenities: [
      "Ocean view",
      "Private infinity pool",
      "High-speed Wi-Fi",
      "Chef’s kitchen",
      "Air conditioning",
      "Washer",
      "Dryer",
      "Gym",
      "Free parking",
      "TV"
    ],
    reviewBreakdown: {
      Cleanliness: 4.9,
      Accuracy: 4.8,
      Communication: 5.0,
      Location: 4.9,
      Value: 4.7
    }
  };

  /* ---------------- STATE ---------------- */

  const [liked, setLiked] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(4);

  const nights =
    range?.from && range?.to
      ? differenceInDays(range.to, range.from)
      : 0;

  const cleaningFee = 350;
  const serviceFee = 845;
  const subtotal = nights * property.price;
  const total = subtotal + cleaningFee + serviceFee;

  /* ---------------- UI ---------------- */

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">
              {property.title}
            </h1>

            <div className="flex items-center gap-3 text-sm mt-2">
              <Star size={14} className="fill-black" />
              {property.rating} ({property.reviews} reviews)
              <span className="text-gray-600">
                • {property.location}
              </span>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <button
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
              className="flex items-center gap-2 hover:underline"
            >
              <Share2 size={16} />
              Share
            </button>

            <button
              onClick={() => setLiked(!liked)}
              className="flex items-center gap-2 hover:underline"
            >
              <Heart
                size={16}
                className={liked ? "fill-black" : ""}
              />
              Save
            </button>
          </div>
        </div>

        {/* GALLERY */}
        <div className="grid grid-cols-4 gap-2 mt-6 rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 h-[420px]">
            <img
              src={`${property.images[0]}?auto=format&fit=crop&w=1200&q=80`}
              className="w-full h-full object-cover"
            />
          </div>

          {property.images.slice(1).map((img, i) => (
            <div key={i} className="h-[205px]">
              <img
                src={`${img}?auto=format&fit=crop&w=800&q=80`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-10">

            <div>
              <h2 className="text-lg font-semibold">
                Entire villa hosted by {property.host}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {property.guests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.baths} baths
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>

            <hr />

            {/* AMENITIES */}
            <div>
              <h3 className="text-lg font-semibold mb-6">
                What this place offers
              </h3>

              <div className="grid grid-cols-2 gap-y-4">
                {(showAllAmenities
                  ? property.amenities
                  : property.amenities.slice(0, 4)
                ).map((a) => (
                  <div key={a}>{a}</div>
                ))}
              </div>

              <button
                onClick={() =>
                  setShowAllAmenities(!showAllAmenities)
                }
                className="mt-6 border px-6 py-2 rounded-full text-sm"
              >
                {showAllAmenities
                  ? "Show less"
                  : `Show all ${property.amenities.length} amenities`}
              </button>
            </div>

            <hr />

            {/* REVIEWS SECTION */}
          {/* HOST REVIEW CARD */}
<div className="border rounded-2xl p-8 bg-white shadow-sm">

  <div className="flex items-center gap-4">
    <img
      src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80"
      className="w-16 h-16 rounded-full object-cover"
    />

    <div>
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-lg">
          Hosted by Julian
        </h3>
        <span className="text-green-600 text-sm">●</span>
      </div>

      <p className="text-sm text-gray-500">
        Joined in May 2018
      </p>
    </div>
  </div>

  {/* STATS */}
  <div className="flex gap-16 mt-8">

    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        Reviews
      </p>
      <p className="text-lg font-semibold">
        482
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        Rating
      </p>
      <p className="text-lg font-semibold flex items-center gap-1">
        4.9 <Star size={14} className="fill-black" />
      </p>
    </div>

  </div>

  <button className="mt-8 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition">
    Contact Host
  </button>

</div>


          </div>

          {/* BOOKING CARD */}
          {!isHost() ? (
            <div className="border rounded-2xl p-6 shadow-lg sticky top-24 h-fit">

              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">
                  ${property.price}
                  <span className="text-sm font-normal">
                    {" "} / night
                  </span>
                </div>
                <div className="text-sm flex items-center gap-1">
                  <Star size={14} className="fill-black" />
                  {property.rating}
                </div>
              </div>

              {/* CALENDAR */}
              <div className="mt-6 border rounded-xl p-4">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                />
              </div>

              {/* GUESTS */}
              <div className="mt-4">
                <label className="text-xs text-gray-500">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) =>
                    setGuests(Number(e.target.value))
                  }
                  className="w-full border rounded-lg p-3 mt-1 text-sm"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map((g) => (
                    <option key={g} value={g}>
                      {g} guests
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push('/login');
                  } else {
                    if (!range?.from || !range?.to) {
                      alert('Please select check-in and check-out dates');
                      return;
                    }
                    
                    // Prepare booking data
                    const bookingData = {
                      property_id: property.id,
                      check_in: range.from.toISOString().split('T')[0],
                      check_out: range.to.toISOString().split('T')[0],
                      guests: guests,
                      propertyTitle: property.title,
                      propertyLocation: property.location,
                      propertyImage: property.images[0] + "?auto=format&fit=crop&w=300&q=80",
                      pricePerNight: property.price,
                      nights: nights,
                      cleaningFee: cleaningFee,
                      serviceFee: serviceFee,
                      total: total
                    };
                    
                    // Save to localStorage
                    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
                    
                    // Navigate to checkout
                    router.push('/checkout');
                  }
                }}
                className="mt-6 w-full bg-[#306966] text-white py-3 rounded-lg font-medium hover:bg-[#244f4d] transition"
              >
                {isAuthenticated ? 'Reserve Now' : 'Login to Book'}
              </button>

              {nights > 0 && (
                <div className="mt-6 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>
                      ${property.price} × {nights} nights
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>${cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staybnb service fee</span>
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
            /* MESSAGE FOR HOSTS */
            <div className="border rounded-2xl p-6 shadow-lg sticky top-24 h-fit bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-semibold">
                  ${property.price}
                  <span className="text-sm font-normal">
                    {" "} / night
                  </span>
                </div>
                <div className="text-sm flex items-center gap-1">
                  <Star size={14} className="fill-black" />
                  {property.rating}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  Host Account
                </p>
                <p className="text-xs text-blue-700">
                  As a host, you cannot book properties. Switch to a traveler account or create a separate account to make bookings.
                </p>
              </div>

              <button
                onClick={() => router.push('/host')}
                className="mt-4 w-full bg-[#306966] text-white py-3 rounded-lg font-medium hover:bg-[#244f4d] transition"
              >
                Go to Host Dashboard
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
