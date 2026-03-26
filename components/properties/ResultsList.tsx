"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Heart, RefreshCw } from "lucide-react";
import type { Property } from "@/infrastructure/services/property-service";
import { useWishlist } from "@/hooks/useWishlist";
import { resolveImageUrl } from "@/lib/image";

interface ResultsListProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
}

function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#d8e8e7] bg-white p-4 shadow-sm">
      <div className="grid animate-pulse gap-4 md:grid-cols-[320px_1fr]">
        <div className="h-56 rounded-2xl bg-slate-200" />
        <div className="space-y-3 py-2">
          <div className="h-6 w-1/2 rounded bg-slate-200" />
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-16 w-full rounded bg-slate-200" />
          <div className="h-10 w-48 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function ResultsList({
  properties,
  loading,
  error,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  onRetry,
}: ResultsListProps) {
  const router = useRouter();
  const { isInWishlist, isProcessing, toggleWishlist, canUseWishlist } = useWishlist();

  const getImageUrl = (property: Property): string => {
    if (property.images && property.images.length > 0) {
      return resolveImageUrl(property.images[0], "https://images.unsplash.com/photo-1562183241-b8d776b07f16?q=80&w=1200&auto=format&fit=crop");
    }

    return "https://images.unsplash.com/photo-1562183241-b8d776b07f16?q=80&w=1200&auto=format&fit=crop";
  };

  const resultLabel = loading
    ? "Loading stays..."
    : totalResults === 1
      ? "1 stay found"
      : `${totalResults} stays found`;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">{resultLabel}</h2>
        {!loading && !error && (
          <p className="text-sm text-slate-500">Handpicked and verified listings</p>
        )}
      </div>

      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => <PropertySkeleton key={index} />)
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-700">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            )}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-[#d8e8e7] bg-[#f6fbfb] p-8 text-center text-slate-600">
            No properties matched these filters. Try broadening your search.
          </div>
        ) : (
          properties.map((property) => (
            <article
              key={property.id}
              onClick={() => router.push(`/properties/${property.id}`)}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-[#d8e8e7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="grid gap-4 p-4 md:grid-cols-[320px_1fr] md:gap-6 md:p-5">
                <div className="relative h-56 overflow-hidden rounded-2xl md:h-full md:min-h-[220px]">
                  <Image
                    src={getImageUrl(property)}
                    alt={property.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <button
                    onClick={(event) => {
                      event.stopPropagation();

                      if (canUseWishlist) {
                        void toggleWishlist(property.id);
                      } else {
                        router.push("/login");
                      }
                    }}
                    disabled={isProcessing(property.id)}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md transition hover:scale-110 disabled:opacity-60"
                    aria-label={isInWishlist(property.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isInWishlist(property.id) ? "fill-red-500 text-red-500" : "text-slate-700"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex flex-col justify-between gap-4 py-1">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{property.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{property.location}</p>
                      </div>

                      <div className="inline-flex items-center gap-1 rounded-full bg-[#f0f7f7] px-3 py-1 text-sm font-medium text-slate-700">
                        <Star size={14} className="fill-[#2C5F5D] text-[#2C5F5D]" />
                        {property.rating_average.toFixed(2)}
                        <span className="text-slate-500">({property.rating_count})</span>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {property.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {property.amenities?.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-[#edf5f5] px-3 py-1 text-xs font-medium text-[#2C5F5D]"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3 border-t border-[#e3efee] pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Starting from</p>
                      <p className="text-2xl font-bold text-slate-900">
                        ${property.price}
                        <span className="ml-1 text-sm font-normal text-slate-500">/ night</span>
                      </p>
                    </div>

                    <span className="rounded-full bg-[#e8f6f1] px-3 py-1 text-xs font-semibold text-[#1f7a58]">
                      Free cancellation
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {!loading && properties.length > 0 && totalPages > 1 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                currentPage === pageNumber
                  ? "border-[#2C5F5D] bg-[#2C5F5D] text-white"
                  : "border-[#c7dddd] text-slate-700 hover:bg-[#edf5f5]"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
