"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function FilterBar({
  toggleMap,
}: {
  toggleMap: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOP FILTER ROW */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        {["All", "Apartment", "Villa", "House", "Office"].map((f) => (
          <button
            key={f}
            className="px-4 py-2 border rounded-full text-sm hover:bg-gray-100"
          >
            {f}
          </button>
        ))}

        <button
          onClick={() => setOpen(true)}
          className="ml-auto border px-4 py-2 rounded-full text-sm hover:bg-gray-100"
        >
          Filters
        </button>

        <button
          onClick={toggleMap}
          className="border px-4 py-2 rounded-full text-sm hover:bg-gray-100"
        >
          Toggle Map
        </button>
      </div>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* SLIDING SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Filters
            </h2>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          <div className="space-y-8">

            {/* Price */}
            <div>
              <h3 className="font-medium mb-3">
                Price range
              </h3>
              <input type="range" className="w-full" />
            </div>

            {/* Bedrooms */}
            <div>
              <h3 className="font-medium mb-3">
                Bedrooms
              </h3>
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className="border px-4 py-2 rounded-full"
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>

            {/* Property type */}
            <div>
              <h3 className="font-medium mb-3">
                Property type
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Apartment",
                  "Villa",
                  "House",
                  "Cabin",
                ].map((type) => (
                  <button
                    key={type}
                    className="border p-3 rounded-xl text-sm"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-medium mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Wifi",
                  "Pool",
                  "Parking",
                  "Kitchen",
                  "Air conditioning",
                  "Washer",
                  "TV",
                  "Gym",
                ].map((a) => (
                  <label
                    key={a}
                    className="flex items-center gap-2"
                  >
                    <input type="checkbox" />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            {/* Booking */}
            <div>
              <h3 className="font-medium mb-3">
                Booking options
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Instant Book
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Free Cancellation
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Superhost
                </label>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-10 flex justify-between">
            <button className="text-sm underline">
              Reset
            </button>
            <button className="bg-black text-white px-6 py-2 rounded-full">
              Show results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
