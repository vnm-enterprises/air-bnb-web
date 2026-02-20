"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";

export const dummyData = [
  {
    id: 1,
    title: "Modern Minimalist Villa with Ocean View",
    location: "Malibu, California",
    price: 1250,
    rating: 4.92,
    reviews: 36,
    excerpt:
      "Welcome to your private oasis in the heart of Malibu. This architectural masterpiece offers panoramic views of the Pacific Ocean through floor-to-ceiling glass walls. Designed with a focus on minimalism and natural materials in every corner of this villa tranquility.",
    amenities: [
      "Ocean view",
      "Private infinity pool",
      "Chef's kitchen",
      "High-speed Wi-Fi",
      "Smart home automation",
      "Spa",
    ],
    description:
      "Welcome to your private oasis in the heart of Malibu. This architectural masterpiece offers panoramic views of the Pacific Ocean through floor-to-ceiling glass walls. Designed with a focus on minimalism and natural materials in every corner of this villa tranquility.",
    hostedBy: "Julian",
    hostRating: 4.92,
    hostReviews: 482,
    hostImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    hostSuperhost: true,
    hostResponseTime: "within an hour",
    lat: 34.0195,
    lng: -118.8631,
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d049?q=80&w=1200&auto=format&fit=crop",
    type: "Villa",
    details: "10 guests • 5 bedrooms • 4 bathrooms",
    checkInDate: "Dec 2, 2025",
    checkOutDate: "Dec 7, 2025",
    costPerNight: 1250,
    cleaningFee: 350,
    serviceFee: 845,
    totalCost: 7445,
  },
  {
    id: 2,
    title: "Aegean Glass Villa",
    location: "Santorini, Greece",
    price: 520,
    rating: 4.88,
    reviews: 124,
    excerpt: "Stunning villa with infinite ocean views and modern amenities.",
    amenities: ["Ocean view", "Pool", "Kitchen", "WiFi"],
    lat: 36.3932,
    lng: 25.4615,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    type: "Villa",
    details: "8 guests • 4 bedrooms • 3 bathrooms",
  },
  {
    id: 3,
    title: "Zen Garden Retreat",
    location: "Kyoto, Japan",
    price: 215,
    rating: 4.97,
    reviews: 98,
    excerpt: "Peaceful traditional home surrounded by lush gardens.",
    amenities: ["Garden", "Tea house", "WiFi", "Kitchen"],
    lat: 34.9784,
    lng: 135.7804,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
    type: "Traditional House",
    details: "6 guests • 3 bedrooms • 2 bathrooms",
  },
  {
    id: 4,
    title: "Alpine Mountain Chalet",
    location: "Zermatt, Switzerland",
    price: 680,
    rating: 4.91,
    reviews: 156,
    excerpt: "Luxury chalet with breathtaking mountain vistas.",
    amenities: ["Mountain view", "Fireplace", "Hot tub", "WiFi"],
    lat: 46.0207,
    lng: 7.7491,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    type: "Chalet",
    details: "8 guests • 4 bedrooms • 3 bathrooms",
  },
  {
    id: 5,
    title: "Tropical Paradise Villa",
    location: "Bali, Indonesia",
    price: 340,
    rating: 4.89,
    reviews: 203,
    excerpt: "Beautiful tropical villa with private beach access.",
    amenities: ["Beach access", "Pool", "Garden", "WiFi"],
    lat: -8.6705,
    lng: 115.2126,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    type: "Villa",
    details: "10 guests • 5 bedrooms • 4 bathrooms",
  },
  {
    id: 6,
    title: "Urban Loft Downtown",
    location: "New York, USA",
    price: 450,
    rating: 4.85,
    reviews: 167,
    excerpt: "Modern loft in the heart of Manhattan.",
    amenities: ["City view", "Kitchen", "WiFi", "Gym"],
    lat: 40.7128,
    lng: -74.006,
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694cb59?q=80&w=1200&auto=format&fit=crop",
    type: "Loft",
    details: "4 guests • 2 bedrooms • 1 bathroom",
  },
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: i + 7,
    title: `Luxury Stay ${i + 7}`,
    location: "Colombo, Sri Lanka",
    price: 120 + i * 10,
    rating: 4.7 + Math.random() * 0.3,
    reviews: 40 + i * 3,
    excerpt:
      "Beautiful modern stay located in the heart of the city with stunning views and premium amenities.",
    amenities: ["Wifi", "Pool", "Kitchen"],
    lat: 6.9271 + Math.random() * 0.02,
    lng: 79.8612 + Math.random() * 0.02,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
    type: "Villa",
    details: "6 guests • 3 bedrooms • 2 bathrooms",
  })),
];

export default function ResultsList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const perPage = 6;

  const paginated = dummyData.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div>

      {/* Title */}
      <h2 className="text-lg font-semibold mb-8">
        300+ stays in Colombo
      </h2>

      {/* Cards */}
      <div className="space-y-8">
        {paginated.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              router.push(`/properties/${item.id}`)
            }
            className="group flex rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
          >
            {/* IMAGE */}
            <div className="w-72 h-56 flex-shrink-0 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-6 flex flex-col justify-between">

              {/* TOP SECTION */}
              <div>
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star
                      size={14}
                      className="fill-black text-black"
                    />
                    {item.rating.toFixed(2)}
                    <span className="text-gray-400 font-normal">
                      ({item.reviews})
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4 leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* PRICE SECTION */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-900">
                  ${item.price}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    / night
                  </span>
                </div>

                <span className="text-xs text-green-600 font-medium">
                  Free cancellation
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-3 mt-10">
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 border rounded-full transition ${
              page === p
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

    </div>
  );
}
