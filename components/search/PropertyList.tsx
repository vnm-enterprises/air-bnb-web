"use client";

import { useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import { Property } from "@/types/Property";


const properties: Property[] = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  title: `Premium Stay ${i + 1}`,
  price: 120 + (i % 5) * 40,
  rating: 4.5 + (i % 4) * 0.1,
  reviews: 50 + i,
  total: 1000 + i * 25,
  superhost: i % 3 === 0,
  image:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  type: "Apartment · Colombo",
  details: "2 guests · 1 bedroom · 1 bath",
  amenities: ["Wifi", "Kitchen"],
  lat: 6.9 + Math.random() * 0.1,
  lng: 79.85 + Math.random() * 0.1,
}));

export default function PropertyList({
  onViewMap,
}: {
  onViewMap: (p: Property) => void;
}) {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const totalPages = Math.ceil(properties.length / perPage);

  const currentItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return properties.slice(start, start + perPage);
  }, [page]);

  return (
    <div className="p-6 space-y-8">
      {currentItems.map((p) => (
        <PropertyCard key={p.id} property={p} onViewMap={onViewMap} />
      ))}

      {/* Pagination */}
      <div className="flex justify-center gap-4 pt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-white rounded border"
        >
          Prev
        </button>

        <span className="font-semibold">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-white rounded border"
        >
          Next
        </button>
      </div>
    </div>
  );
}
