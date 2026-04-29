"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, ChevronRight } from "lucide-react";
import { getProperties } from "@/infrastructure/services/property-service";
import type { Property } from "@/infrastructure/services/property-service";
import { useWishlist } from "@/hooks/useWishlist";
import { resolveImageUrl } from "@/lib/image";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80";

function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="aspect-video rounded-xl bg-slate-200" />
      <div className="h-5 w-3/4 rounded bg-slate-200" />
      <div className="h-4 w-1/2 rounded bg-slate-200" />
      <div className="h-10 w-full rounded-lg bg-slate-200" />
    </div>
  );
}

export default function CuratedCollections() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { isInWishlist, isProcessing, toggleWishlist, canUseWishlist } = useWishlist();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProperties({ per_page: 6 });
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

  useEffect(() => {
    if (properties.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % properties.length);
    }, 3500);

    return () => {
      window.clearInterval(interval);
    };
  }, [properties.length]);

  useEffect(() => {
    if (carouselIndex >= properties.length) {
      setCarouselIndex(0);
    }
  }, [carouselIndex, properties.length]);

  const renderPropertyCard = (property: Property) => {
    const imageSrc = resolveImageUrl(property.images?.[0], FALLBACK_IMAGE);
    const rating = Number.isFinite(property.rating_average)
      ? property.rating_average
      : 0;

    return (
      <article
        key={property.id}
        className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#d5e6e5] bg-white shadow-[0_14px_32px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.14)]"
        onClick={() => router.push(`/properties/${property.id}`)}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 25vw"
            className="object-cover"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/25 to-transparent" />

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
            className="absolute right-4 top-4 z-10 rounded-full border border-white/70 bg-white/92 p-2.5 shadow-sm disabled:opacity-60"
            aria-label={isInWishlist(property.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist(property.id) ? "fill-red-500 text-red-500" : "text-slate-700"}`}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-xl font-bold leading-tight tracking-[-0.01em] text-slate-900">
            {property.title}
          </h3>

          <p className="mt-2 line-clamp-1 text-sm font-medium text-slate-500">
            {property.location}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4faf9] px-3 py-1.5 text-sm font-semibold text-slate-700">
              <Star className="h-4 w-4 text-yellow-500" />
              {rating.toFixed(1)}
            </div>

            <div className="text-xl font-bold tracking-[-0.01em] text-[#2C5F5D]">
              ${property.price}
              <span className="ml-1 text-sm font-semibold text-slate-500">/night</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/properties/${property.id}`);
            }}
            className="mt-5 w-full rounded-xl bg-linear-to-r from-[#2f6763] to-[#245955] py-2.5 text-base font-semibold text-white"
          >
            View details
          </button>
        </div>
      </article>
    );
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-[#b7d9d5] to-transparent" />

      <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
        <div className="flex-1">
          <h3 className="flex items-center text-3xl font-extrabold tracking-[-0.02em] text-slate-900 sm:text-4xl">
            <Star className="mr-2.5 h-7 w-7 text-yellow-500" />
            Curated Collections
          </h3>
          <p className="mt-3 max-w-2xl text-lg font-medium text-slate-600 sm:text-xl">
            Discover our most exceptional retreats and urban escapes.
          </p>
        </div>

        <button
          onClick={() => router.push("/properties")}
          className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full border border-[#c6e0de] bg-[#edf8f7] px-5 py-2.5 text-lg font-bold text-[#275b58]"
        >
          Explore all collections
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <PropertyCardSkeleton key={index} />)
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
          properties.map((property) => renderPropertyCard(property))
        )}
      </div>

      {!loading && !error && properties.length > 0 && (
        <div className="hidden">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {properties.map((property) => (
                <div key={property.id} className="min-w-full px-1">
                  {renderPropertyCard(property)}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {properties.map((property, index) => (
              <button
                key={`dot-${property.id}`}
                type="button"
                onClick={() => setCarouselIndex(index)}
                className={`h-2.5 rounded-full transition-all ${carouselIndex === index ? "w-6 bg-[#2C5F5D]" : "w-2.5 bg-[#c7ddd9]"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
