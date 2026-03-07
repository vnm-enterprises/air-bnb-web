"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, ChevronRight } from "lucide-react";
import { getProperties } from "@/lib/propertyApi";
import type { Property } from "@/lib/propertyApi";

export default function CuratedCollections() {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties({ per_page: 8 });
        if (response.success) {
          setProperties(response.data.properties);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);



  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div className="flex-1">
          <h3 className="text-3xl font-extrabold text-slate-900 flex items-center">
            <Star className="mr-2 h-6 w-6 text-yellow-500" />
            Curated Collections
          </h3>
          <p className="text-slate-500 font-medium mt-2">
            Discover our most exceptional retreats and urban escapes.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-[#2C5F5D] font-bold hover:gap-3 transition-all whitespace-nowrap">
          Explore all collections
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : properties.length === 0 ? (
          <div className="col-span-full text-center text-slate-500">No properties found</div>
        ) : (
          properties.map((property, index) => (
            <div
              key={property.id}
              className="group relative cursor-pointer flex flex-col h-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => router.push(`/properties/${property.id}`)}
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 flex-shrink-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
                    })`,
                  }}
                ></div>

                <button className="absolute top-4 left-4 p-2 bg-white/90  rounded-full hover:scale-110 transition-transform">
                  <Heart className="h-4 w-4 text-slate-700 " />
                </button>

                {hoveredIndex === index && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" />
                )}
              </div>

              <div className="space-y-2 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-lg line-clamp-2">
                  {property.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {property.location}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-bold">
                      {property.rating_average.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#2C5F5D]">
                    ${property.price}/night
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/properties/${property.id}`);
                  }}
                  className="w-full border border-slate-300 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors mt-auto"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}