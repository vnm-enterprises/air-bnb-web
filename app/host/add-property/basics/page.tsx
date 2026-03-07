"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Plus, Minus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createProperty } from "@/lib/propertyApi";

type Step = { n: number; label: string };

const STEPS: Step[] = [
  { n: 1, label: "Basics" },
  { n: 2, label: "Photos" },
  { n: 3, label: "Amenities" },
  { n: 4, label: "Pricing" },
  { n: 5, label: "Review" },
];

export default function AddPropertyBasicsPage() {
  const router = useRouter();
  const { isAuthenticated, isHost } = useAuth();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [guests, setGuests] = useState("4");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isHost()) {
      router.push('/login');
    }
  }, [isAuthenticated, isHost, router]);

  const remaining = useMemo(() => Math.max(0, 500 - desc.length), [desc]);

  const handleAmenityToggle = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    
    // Validation
    if (!title || !desc || !address || !price) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const propertyData = {
        title,
        description: desc,
        location: address,
        price: parseFloat(price),
        max_guests: parseInt(guests),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseFloat(bathrooms),
        amenities: amenities.length > 0 ? amenities : ["WiFi", "Kitchen"],
        images: imageUrl ? [imageUrl] : ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"],
        status: "pending"
      };

      const response = await createProperty(propertyData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/host/listings');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error creating property:', err);
      setError(err.response?.data?.message || 'Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-slate-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold">HostStay</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-[11px] font-semibold text-slate-600">
            <Link href="/host/dashboard" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/host/bookings" className="hover:text-slate-900">
              Bookings
            </Link>
            <Link href="/host/inbox" className="hover:text-slate-900">
              Inbox
            </Link>
            <Link href="/host/properties" className="hover:text-slate-900">
              Properties
            </Link>
          </nav>

          <div className="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
            🙂
          </div>
        </div>
      </header>

      {/* Page */}
      <main>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">Add New Property</h1>
            </div>
            <button className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition">
              Save &amp; Exit
            </button>
          </div>

          {/* Stepper */}
          <div className="mt-4">
            <div className="grid grid-cols-5 gap-4 text-[11px] text-slate-500">
              {STEPS.map((s) => (
                <div key={s.n} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold",
                        s.n === 1
                          ? "bg-[#2C5F5D] border-[#2C5F5D] text-white"
                          : "bg-white border-slate-200 text-slate-500",
                      ].join(" ")}
                    >
                      {s.n}
                    </span>
                    <span className={s.n === 1 ? "font-semibold text-slate-900" : ""}>
                      {s.label}
                    </span>
                  </div>

                  <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-[#2C5F5D]"
                      style={{ width: s.n === 1 ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two columns */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Tell us about */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-[14px] font-bold">Tell us about your place</h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Property Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sunset Coastal Villa"
                    className="mt-2 w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">
                    A catchy name helps your property stand out in searches.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Property Category
                  </label>
                  <div className="mt-2 relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="appearance-none w-full h-10 px-3 pr-10 rounded-md border border-slate-200 bg-white text-[12px] text-slate-700 outline-none focus:border-slate-300"
                    >
                      <option value="">Select a category</option>
                      <option>Villa</option>
                      <option>Apartment</option>
                      <option>Cabin</option>
                      <option>House</option>
                      <option>Studio</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describe the unique features, atmosphere, and surroundings of your space..."
                    className="mt-2 w-full min-h-[140px] px-3 py-2 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300 resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-400 mt-2">
                    {desc.length} / 500 characters
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      Price per Night ($)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="250"
                      className="mt-2 w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      Max Guests
                    </label>
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      placeholder="4"
                      className="mt-2 w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      placeholder="2"
                      className="mt-2 w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      placeholder="2"
                      className="mt-2 w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Amenities
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['WiFi', 'Kitchen', 'Pool', 'Parking', 'AC', 'TV', 'Gym', 'Hot Tub'].map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-3 py-1.5 text-[11px] rounded-md border transition ${
                          amenities.includes(amenity)
                            ? 'bg-[#2C5F5D] text-white border-[#2C5F5D]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Property Image URL (optional)
                  </label>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-2 w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">
                    Leave blank to use a default image
                  </p>
                </div>
              </div>
            </section>

            {/* Right: Location */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-[14px] font-bold">Where is it located?</h2>

              <div className="mt-5">
                <label className="text-[11px] font-semibold text-slate-700">
                  Search Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your street address"
                  className="mt-2 w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
                />

                <button className="mt-3 inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 transition text-[11px] font-semibold px-3 py-1.5 rounded-md text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px]">
                    📍
                  </span>
                  Current Location
                </button>
              </div>

              {/* Map placeholder */}
              <div className="mt-4 relative h-[290px] rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                {/* center pin */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#2C5F5D]" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-[11px] text-slate-600 shadow-sm">
                      Move the pin to adjust
                    </div>
                  </div>
                </div>

                {/* Zoom controls */}
                <div className="absolute right-3 bottom-3 flex flex-col gap-2">
                  <button
                    className="w-9 h-9 rounded-md bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
                    aria-label="Zoom in"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    className="w-9 h-9 rounded-md bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
                    aria-label="Zoom out"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
              Property created successfully! Redirecting to your listings...
            </div>
          )}

          {/* Bottom actions */}
          <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/host"
              className="text-[12px] text-slate-500 hover:text-slate-700 transition"
            >
              ← Back to Dashboard
            </Link>

            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => router.push('/host')}
                className="bg-white border border-slate-200 hover:bg-slate-50 transition text-[11px] font-semibold px-4 py-2 rounded-md text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || success}
                className="bg-[#2C5F5D] hover:bg-[#244f4d] disabled:bg-slate-300 disabled:cursor-not-allowed transition text-white text-[11px] font-semibold px-4 py-2 rounded-md inline-flex items-center gap-2"
              >
                {loading ? 'Creating Property...' : success ? 'Property Created!' : 'Create Property'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}