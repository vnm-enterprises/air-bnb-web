"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/properties/Breadcrumbs";
import FilterBar from "@/components/properties/FilterBar";
import ResultsList from "@/components/properties/ResultsList";
import MapView, { type MapItem } from "@/components/properties/MapView";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProperties, type Property } from "@/lib/propertyApi";

const DEFAULT_CENTER = {
  lat: 6.9271,
  lng: 79.8612,
};

function parseCoordinatesFromLocation(location: string): { lat: number; lng: number } | null {
  const coordinateMatch = location.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);

  if (!coordinateMatch) {
    return null;
  }

  const lat = Number(coordinateMatch[1]);
  const lng = Number(coordinateMatch[2]);

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  return { lat, lng };
}

function fallbackCoordinates(propertyId: number, index: number): { lat: number; lng: number } {
  const angleDegrees = (propertyId * 37 + index * 19) % 360;
  const angleRadians = (angleDegrees * Math.PI) / 180;
  const radius = 0.008 + (index % 5) * 0.004;

  return {
    lat: DEFAULT_CENTER.lat + Math.sin(angleRadians) * radius,
    lng: DEFAULT_CENTER.lng + Math.cos(angleRadians) * radius,
  };
}

function toMapItem(property: Property, index: number): MapItem {
  const parsed = parseCoordinatesFromLocation(property.location || "");
  const coords = parsed || fallbackCoordinates(property.id, index);

  return {
    id: property.id,
    title: property.title || `Property #${property.id}`,
    price: Number(property.price || 0),
    lat: coords.lat,
    lng: coords.lng,
  };
}

export default function PropertiesPage() {
  const [mapEnabled, setMapEnabled] = useState(false);
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapEnabled || mapLoaded) {
      return;
    }

    let active = true;

    const fetchMapItems = async () => {
      setMapLoading(true);
      setMapError(null);

      try {
        const firstPage = await getProperties({ page: 1, per_page: 50 });
        const allProperties = [...firstPage.data.properties];
        const totalPages = firstPage.data.pagination.pages || 1;

        if (totalPages > 1) {
          const requests: Promise<any>[] = [];

          for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
            requests.push(getProperties({ page: currentPage, per_page: 50 }));
          }

          const responses = await Promise.all(requests);
          responses.forEach((response) => {
            allProperties.push(...response.data.properties);
          });
        }

        const mapped = allProperties.map((property, index) => toMapItem(property, index));

        if (!active) {
          return;
        }

        setMapItems(mapped);
        setMapLoaded(true);
      } catch (error: any) {
        if (!active) {
          return;
        }

        setMapError(error?.response?.data?.message || "Failed to load map properties");
      } finally {
        if (active) {
          setMapLoading(false);
        }
      }
    };

    fetchMapItems();

    return () => {
      active = false;
    };
  }, [mapEnabled, mapLoaded]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumbs />

          <FilterBar toggleMap={() => setMapEnabled((prev) => !prev)} />

          {!mapEnabled && (
            <div>
              <ResultsList />
            </div>
          )}

          {mapEnabled && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="order-2 lg:order-1">
                <ResultsList />
              </div>

              <div className="order-1 lg:order-2 h-[70vh] lg:h-[80vh] sticky top-24 rounded-2xl overflow-hidden border bg-white">
                {mapLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
                  </div>
                ) : mapError ? (
                  <div className="h-full flex items-center justify-center px-4 text-center text-sm text-red-600">
                    {mapError}
                  </div>
                ) : mapItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center px-4 text-center text-sm text-slate-500">
                    No properties available to show on map.
                  </div>
                ) : (
                  <MapView items={mapItems} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
