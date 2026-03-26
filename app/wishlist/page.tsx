"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import type { Property } from "@/infrastructure/services/property-service";
import { getMyWishlist, removeFromWishlist } from "@/infrastructure/services/wishlist-service";
import { resolveImageUrl } from "@/lib/image";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";

type Notice = {
  type: "error" | "success";
  message: string;
} | null;

function getApiMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;

    if (typeof response?.data?.message === "string" && response.data.message.trim().length > 0) {
      return response.data.message;
    }
  }

  return fallback;
}

function WishlistCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#d8e8e7] bg-white p-3 shadow-sm">
      <div className="h-48 rounded-xl bg-slate-200" />
      <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />
    </div>
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isTraveler, loading } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isTraveler())) {
      router.push("/login");
    }
  }, [isAuthenticated, isTraveler, loading, router]);

  useEffect(() => {
    if (loading || !isAuthenticated || !isTraveler()) {
      return;
    }

    let active = true;

    const fetchWishlist = async () => {
      setDataLoading(true);
      setNotice(null);

      try {
        const response = await getMyWishlist();

        if (!active) {
          return;
        }

        setProperties(response.data.properties || []);
      } catch (fetchError: unknown) {
        if (!active) {
          return;
        }

        setNotice({
          type: "error",
          message: getApiMessage(fetchError, "Failed to load your wishlist."),
        });
        setProperties([]);
      } finally {
        if (active) {
          setDataLoading(false);
        }
      }
    };

    void fetchWishlist();

    return () => {
      active = false;
    };
  }, [loading, isAuthenticated, isTraveler]);

  const averagePrice = useMemo(() => {
    if (!properties.length) {
      return 0;
    }

    const total = properties.reduce((sum, property) => sum + Number(property.price || 0), 0);
    return Math.round(total / properties.length);
  }, [properties]);

  const handleRemove = async (propertyId: number) => {
    setNotice(null);
    setRemovingId(propertyId);

    try {
      await removeFromWishlist(propertyId);
      setProperties((current) => current.filter((property) => property.id !== propertyId));
      setNotice({ type: "success", message: "Removed from wishlist." });
    } catch (removeError: unknown) {
      setNotice({
        type: "error",
        message: getApiMessage(removeError, "Failed to remove property from wishlist."),
      });
    } finally {
      setRemovingId(null);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#ebf4f4] via-[#f7fbfb] to-white px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <section className="mb-8 rounded-3xl border border-[#d7e8e7] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2C5F5D]">Saved Stays</p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">My Wishlist</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Keep track of favorite places and return when you are ready to book.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-sm sm:w-auto">
                <div className="rounded-xl border border-[#d8e8e7] bg-[#f8fcfc] px-4 py-3">
                  <p className="text-xs text-slate-500">Saved</p>
                  <p className="text-xl font-bold text-slate-900">{properties.length}</p>
                </div>
                <div className="rounded-xl border border-[#d8e8e7] bg-[#f8fcfc] px-4 py-3">
                  <p className="text-xs text-slate-500">Avg/Night</p>
                  <p className="text-xl font-bold text-slate-900">${averagePrice || 0}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => router.push("/properties")}
              className="rounded-full bg-[#2C5F5D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#244f4d]"
            >
              Browse More Stays
            </button>
          </div>

          {notice && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
                notice.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {notice.message}
            </div>
          )}

          {dataLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <WishlistCardSkeleton key={index} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-2xl border border-[#d8e8e7] bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Your wishlist is empty</h2>
              <p className="mt-2 text-sm text-slate-500">
                Browse properties and tap the heart icon to save your favorites.
              </p>
              <button
                onClick={() => router.push("/properties")}
                className="mt-5 rounded-full bg-[#2C5F5D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#244f4d]"
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {properties.map((property) => {
                const image =
                  Array.isArray(property.images) && property.images.length > 0
                    ? property.images[0]
                    : FALLBACK_IMAGE;
                const ratingValue = Number(property.rating_average || 0);

                return (
                  <article
                    key={property.id}
                    className="group overflow-hidden rounded-2xl border border-[#d8e8e7] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <button
                      onClick={() => router.push(`/properties/${property.id}`)}
                      className="w-full text-left"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={resolveImageUrl(image, FALLBACK_IMAGE)}
                          alt={property.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                          Saved
                        </span>
                      </div>

                      <div className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{property.title}</h3>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                            <Star className="h-4 w-4 fill-[#2C5F5D] text-[#2C5F5D]" />
                            {ratingValue > 0 ? ratingValue.toFixed(1) : "New"}
                          </span>
                        </div>

                        <p className="line-clamp-1 text-sm text-slate-500">{property.location}</p>
                        <p className="text-sm text-slate-700">
                          <span className="text-lg font-bold text-slate-900">${Number(property.price || 0)}</span>
                          <span className="ml-1 text-xs text-slate-500">/ night</span>
                        </p>
                      </div>
                    </button>

                    <div className="border-t border-[#e3efee] p-3">
                      <button
                        onClick={() => void handleRemove(property.id)}
                        disabled={removingId === property.id}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8d0d0] bg-[#fff5f5] px-3 py-2 text-sm font-semibold text-[#c23d3d] transition hover:bg-[#ffecec] disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Remove from wishlist"
                      >
                        {removingId === property.id ? (
                          <>
                            <Heart className="h-4 w-4 animate-pulse" />
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
