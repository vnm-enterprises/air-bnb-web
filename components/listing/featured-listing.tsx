"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, ChevronRight } from "lucide-react";
import { getProperties } from "@/lib/propertyApi";
import type { Property } from "@/lib/propertyApi";
import { useWishlist } from "@/hooks/useWishlist";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80";

function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="aspect-[3/4] rounded-xl bg-slate-200" />
      <div className="h-5 w-3/4 rounded bg-slate-200" />
      <div className="h-4 w-1/2 rounded bg-slate-200" />
      <div className="h-10 w-full rounded-lg bg-slate-200" />
    </div>
  );
}

export default function CuratedCollections() {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isInWishlist, isProcessing, toggleWishlist, canUseWishlist } = useWishlist();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProperties({ per_page: 8 });
      if (response.success) {
        setProperties(response.data?.properties ?? []);
      } else {
        setError("Failed to load properties");
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProperties();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-center">
        <div className="flex-1">
          <h3 className="flex items-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            <Star className="mr-2 h-6 w-6 text-yellow-500" />
            Curated Collections
          </h3>
          <p className="mt-2 font-medium text-slate-500">
            Discover our most exceptional retreats and urban escapes.
          </p>
        </div>

        <button
          onClick={() => router.push("/properties")}
          className="inline-flex items-center gap-2 self-start whitespace-nowrap font-bold text-[#2C5F5D] transition-all hover:gap-3"
        >
          Explore all collections
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => <PropertyCardSkeleton key={index} />)
        ) : error ? (
          <div className="col-span-full rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            <p>{error}</p>
            <button
              onClick={() => void fetchProperties()}
              className="mt-3 rounded-md border border-red-300 px-4 py-2 text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="col-span-full text-center text-slate-500">No properties found</div>
        ) : (
          properties.map((property, index) => {
            const imageSrc = property.images?.[0] || FALLBACK_IMAGE;
            const rating = Number.isFinite(property.rating_average)
              ? property.rating_average
              : 0;

            return (
              <div
                key={property.id}
                className="group relative flex h-full cursor-pointer flex-col"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => router.push(`/properties/${property.id}`)}
              >
                <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={imageSrc}
                    alt={property.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canUseWishlist) {
                        void toggleWishlist(property.id);
                      } else {
                        router.push("/login");
                      }
                    }}
                    disabled={isProcessing(property.id)}
                    className="absolute left-4 top-4 z-10 rounded-full bg-white/90 p-2 transition-transform hover:scale-110 disabled:opacity-60"
                    aria-label={isInWishlist(property.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`h-4 w-4 ${isInWishlist(property.id) ? "fill-red-500 text-red-500" : "text-slate-700"}`}
                    />
                  </button>

                  {hoveredIndex === index && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" />
                  )}
                </div>

                <div className="flex flex-1 flex-col space-y-2">
                  <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{property.title}</h3>
                  <p className="line-clamp-2 text-sm text-slate-500">{property.location}</p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs font-bold">{rating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm font-bold text-[#2C5F5D]">${property.price}/night</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/properties/${property.id}`);
                    }}
                    className="mt-auto w-full rounded-lg border border-slate-300 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
