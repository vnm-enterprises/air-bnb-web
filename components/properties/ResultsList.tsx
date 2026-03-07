"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getProperties } from "@/lib/propertyApi";
import type { Property } from "@/lib/propertyApi";

export default function ResultsList() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const perPage = 6;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties({
          page,
          per_page: perPage,
        });
        if (response.success) {
          setProperties(response.data.properties);
          setTotalPages(response.data.pagination.pages);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page]);

  const getImageUrl = (property: Property): string => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return 'https://images.unsplash.com/photo-1562183241-b8d776b07f16?q=80&w=1200&auto=format&fit=crop';
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-lg font-semibold mb-8">
        {loading ? 'Loading...' : `${properties.length} stays found`}
      </h2>

      {/* Cards */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-center text-slate-500">No properties found</div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              onClick={() => router.push(`/properties/${property.id}`)}
              className="group flex rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
            >
              {/* IMAGE */}
              <div className="w-72 h-56 flex-shrink-0 overflow-hidden">
                <img
                  src={getImageUrl(property)}
                  alt={property.title}
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
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {property.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star
                        size={14}
                        className="fill-black text-black"
                      />
                      {property.rating_average.toFixed(2)}
                      <span className="text-gray-400 font-normal">
                        ({property.rating_count})
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-4 leading-relaxed line-clamp-2">
                    {property.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {property.amenities && property.amenities.slice(0, 4).map((a) => (
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
                    ${property.price}
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
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && properties.length > 0 && (
        <div className="flex gap-3 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
      )}
    </div>
  );
}
