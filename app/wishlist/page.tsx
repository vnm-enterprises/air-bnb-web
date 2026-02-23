"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isTraveler, loading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Protect this route - only travelers can have wishlists
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isTraveler())) {
      router.push('/login');
    }
  }, [isAuthenticated, isTraveler, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    setTimeout(() => {
      setProperties([
        {
          id: 1,
          title: "Modern Lakefront Cabin",
          location: "Lake Tahoe, California",
          price: 345,
          rating: 4.98,
          image:
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: 2,
          title: "Urban Minimalist Studio",
          location: "Downtown Seattle, WA",
          price: 180,
          rating: 4.85,
          image:
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: 3,
          title: "Zen Beachside Retreat",
          location: "Uluwatu, Bali",
          price: 420,
          rating: 5.0,
          image:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: 4,
          title: "Historic Arts District Loft",
          location: "Brooklyn, New York",
          price: 295,
          rating: 4.72,
          image:
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: 5,
          title: "Joshua Tree Sanctuary",
          location: "Joshua Tree, CA",
          price: 380,
          rating: 4.91,
          image:
            "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: 6,
          title: "Alpine A-Frame Cabin",
          location: "Whistler, BC",
          price: 210,
          rating: 4.89,
          image:
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: 7,
          title: "Scandi Forest House",
          location: "Oslo, Norway",
          price: 155,
          rating: 4.96,
          image:
            "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: 8,
          title: "The Infinity Estate",
          location: "Santorini, Greece",
          price: 890,
          rating: 5.0,
          image:
            "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=1600&auto=format&fit=crop",
        },
      ]);
      setDataLoading(false);
    }, 800);
  }, [isAuthenticated]);

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

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Saved Properties</h1>
            <p className="text-sm text-gray-500 mt-1">
              You have {properties.length} properties saved across 3 collections.
            </p>
          </div>

          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition text-sm">
            <Share2 className="w-4 h-4" />
            Share List
          </button>
        </div>

        {/* FILTER BAR */}


        {/* GRID */}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                    <Heart className="w-4 h-4 fill-black text-black" />
                  </button>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{property.title}</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-black text-black" />
                      {property.rating}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    {property.location}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">
                      ${property.price}
                    </span>{" "}
                    / night
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RECENTLY VIEWED */}
        {/* <div className="mt-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recently Viewed</h2>
            <button className="text-sm text-black hover:underline">
              See all activity
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
              "https://images.unsplash.com/photo-1494526585095-c41746248156",
              "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
              "https://images.unsplash.com/photo-1505692794403-34d4982a9f9c",
              "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
              "https://images.unsplash.com/photo-1494526585095-c41746248156",
            ].map((img, i) => (
              <img
                key={i}
                src={`${img}?q=80&w=800&auto=format&fit=crop`}
                className="w-40 h-28 rounded-lg object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div> */}

      </div>
    </div>
    <Footer />
    </>
  );
}
