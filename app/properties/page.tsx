"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/properties/Breadcrumbs";
import FilterBar from "@/components/properties/FilterBar";
import ResultsList, {
  dummyData,
} from "@/components/properties/ResultsList";
import MapView from "@/components/properties/MapView";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PropertiesPage() {
  const [mapEnabled, setMapEnabled] =
    useState(false);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <Breadcrumbs />

          <FilterBar
            toggleMap={() =>
              setMapEnabled((prev) => !prev)
            }
          />

          {/* LAYOUT SWITCH */}
          {!mapEnabled && (
            <div>
              <ResultsList />
            </div>
          )}

          {mapEnabled && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* RESULTS */}
              <div className="order-2 lg:order-1">
                <ResultsList />
              </div>

              {/* MAP */}
              <div className="order-1 lg:order-2 h-[70vh] lg:h-[80vh] sticky top-24 rounded-2xl overflow-hidden border">
                <MapView items={dummyData} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
