"use client";

import { useState } from "react";
import SearchHeaderBar from "./SearchResultsPanel";
import PropertyList from "./PropertyList";
import MapView from "./MapView";
import MobileMapViewButton from "./MobileMapViewButton";
import { Property } from "@/types/Property";

export default function SearchLayout() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);

  return (
    <>
      <main className="flex relative flex-col lg:flex-row  mx-auto">

        {/* LEFT LIST (NO INNER SCROLL — industrial UX) */}
        <section className="w-full lg:w-[55%] bg-slate-100">
          <SearchHeaderBar />

          <PropertyList
            onViewMap={(p) => {
              setSelectedProperty(p);
              setMobileMapOpen(true);
            }}
          />
        </section>

        {/* RIGHT MAP (DESKTOP STICKY) */}
        <section className="hidden lg:block w-[45%]">
          <div className="sticky top-[80px] h-[calc(100vh-80px)]">
            <MapView selected={selectedProperty} />
          </div>
        </section>
      </main>

      {/* MOBILE MAP OVERLAY */}
      {mobileMapOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <button
            onClick={() => setMobileMapOpen(false)}
            className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded-xl shadow"
          >
            Close Map
          </button>

          <MapView selected={selectedProperty} />
        </div>
      )}

      <MobileMapViewButton onOpen={() => setMobileMapOpen(!mobileMapOpen)} />
    </>
  );
}
