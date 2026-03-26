"use client";

import Link from "next/link";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Plus, Minus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createProperty, uploadPropertyImages } from "@/infrastructure/services/property-service";

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isHost()) {
      router.push('/login');
    }
  }, [isAuthenticated, isHost, router]);

  const handleAmenityToggle = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImageFiles(files);
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
        status: "pending"
      };

      const response = await createProperty(propertyData);

      if (response.success) {
        if (imageFiles.length > 0) {
          try {
            await uploadPropertyImages(response.data.id, imageFiles);
          } catch (uploadErr: unknown) {
            console.error('Error uploading property images:', uploadErr);
            setError('Property created, but image upload failed. You can upload images later from WordPress Media.');
          }
        }

        setSuccess(true);
        setTimeout(() => {
          router.push('/host/listings');
        }, 2000);
      }
    } catch (err: unknown) {
      console.error('Error creating property:', err);

      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Failed to create property. Please try again.'
          : 'Failed to create property. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      {/* Page */}
      <main>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">Create New Listing</h1>
              <p className="mt-2 text-sm text-slate-600">
                Everything is completed in this single screen: details, amenities, images, and publishing.
              </p>
            </div>
            <span className="rounded-full border border-[#cde2e1] bg-[#eef7f7] px-3 py-1 text-[11px] font-semibold text-[#2C5F5D]">
              Single-step publishing
            </span>
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
                    Property Photos
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelection}
                    className="mt-2 block w-full text-[12px] text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#2C5F5D] file:px-3 file:py-2 file:text-[11px] file:font-semibold file:text-white hover:file:bg-[#244f4d]"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">
                    Photos are uploaded to WordPress Media Library after property creation.
                  </p>
                  {imageFiles.length > 0 && (
                    <p className="text-[10px] text-slate-500 mt-2">
                      {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected
                    </p>
                  )}
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