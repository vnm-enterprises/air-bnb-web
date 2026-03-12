"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import type { Property } from "@/lib/propertyApi";
import { getMyWishlist, removeFromWishlist } from "@/lib/wishlistApi";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isTraveler, loading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Protect this route - only travelers can have wishlists
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
      setDataError(null);

      try {
        const response = await getMyWishlist();

        if (!active) {
          return;
        }

        setProperties(response.data.properties || []);
      } catch (error: any) {
        if (!active) {
          return;
        }

        const apiMessage = error?.response?.data?.message;
        setDataError(apiMessage || "Failed to load wishlist");
        setProperties([]);
      } finally {
        if (active) {
          setDataLoading(false);
        }
      }
    };

    fetchWishlist();

    return () => {
      active = false;
    };
  }, [loading, isAuthenticated, isTraveler]);

  const handleRemove = async (propertyId: number) => {
    setDataError(null);
    setRemovingId(propertyId);

    try {
      await removeFromWishlist(propertyId);
      setProperties((current) => current.filter((property) => property.id !== propertyId));
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setDataError(apiMessage || "Failed to remove property from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f7f7f7] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Saved Properties</h1>
              <p className="text-sm text-gray-500 mt-1">
                You have {properties.length} saved {properties.length === 1 ? "property" : "properties"}.
              </p>
            </div>

            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition text-sm">
              <Share2 className="w-4 h-4" />
              Share List
            </button>
          </div>

          {dataError && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">
              {dataError}
            </div>
          )}

          {dataLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="h-48 bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="border border-slate-200 bg-white rounded-xl p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-900">Your wishlist is empty</h2>
              <p className="text-sm text-slate-500 mt-2">
                Browse properties and tap the heart icon to save your favorites.
              </p>
              <button
                onClick={() => router.push("/properties")}
                className="mt-5 px-5 py-2.5 rounded-lg bg-[#2C5F5D] text-white text-sm font-medium hover:bg-[#244f4d] transition"
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {properties.map((property) => {
                const image =
                  Array.isArray(property.images) && property.images.length > 0
                    ? property.images[0]
                    : FALLBACK_IMAGE;
                const ratingValue = Number(property.rating_average || 0);

                return (
                  <div
                    key={property.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/properties/${property.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={image}
                        alt={property.title}
                        className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleRemove(property.id);
                        }}
                        disabled={removingId === property.id}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow disabled:opacity-60"
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="w-4 h-4 fill-black text-black" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-sm font-medium gap-2">
                        <span className="line-clamp-1">{property.title}</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Star className="w-4 h-4 fill-black text-black" />
                          {ratingValue > 0 ? ratingValue.toFixed(1) : "New"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-1">{property.location}</p>

                      <p className="text-sm">
                        <span className="font-semibold">${Number(property.price || 0)}</span> / night
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
