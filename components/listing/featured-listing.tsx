"use client";

import { useState } from "react";
import { Star, Heart, ChevronRight } from "lucide-react";
import { properties } from "@/dummy-data/featured-properties";

export default function CuratedCollections() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);



  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-extrabold text-slate-900  flex items-center">
            <Star className="mr-2 h-6 w-6 text-yellow-500" />
            Curated Collections
          </h3>
          <p className="text-slate-500  font-medium mt-2">
            Discover our most exceptional retreats and urban escapes.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-[#2C5F5D] font-bold hover:gap-3 transition-all">
          Explore all collections
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property, index) => (
          <div
            key={property.id}
            className="group relative cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${property.image})`,
                }}
              ></div>

              {property.badge && (
                <div className="absolute top-4 right-4 bg-white/90  backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-[#2C5F5D] tracking-widest uppercase shadow-lg">
                  {property.badge}
                </div>
              )}

              <button className="absolute top-4 left-4 p-2 bg-white/90  rounded-full hover:scale-110 transition-transform">
                <Heart className="h-4 w-4 text-slate-700 " />
              </button>

              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-900  text-lg line-clamp-1">
                {property.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-1">
                {property.location}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs font-bold">
                    {property.rating}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#2C5F5D]">
                  {property.price}
                </div>
              </div>

              <button className="w-full border border-slate-300  text-slate-700  py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}