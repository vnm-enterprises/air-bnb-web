"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumbs from "@/components/properties/Breadcrumbs";
import FilterBar from "@/components/properties/FilterBar";
import ResultsList from "@/components/properties/ResultsList";
import MapView, { type MapItem } from "@/components/properties/MapView";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getProperties,
  type GetPropertiesParams,
  type Property,
  type PropertiesResponse,
} from "@/lib/propertyApi";

const DEFAULT_CENTER = {
  lat: 6.9271,
  lng: 79.8612,
};

const RESULTS_PER_PAGE = 6;
const MAP_BATCH_SIZE = 50;

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

function parsePositiveInteger(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function parseNonNegativeNumber(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

function parseSort(value: string | null): GetPropertiesParams["sort"] | undefined {
  if (value === "price_asc" || value === "price_desc" || value === "created_desc") {
    return value;
  }

  return undefined;
}

function parseTextParam(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toFilterState(searchParams: { get(key: string): string | null }): GetPropertiesParams {
  return {
    search: parseTextParam(searchParams.get("search")),
    location: parseTextParam(searchParams.get("location")),
    min_price: parseNonNegativeNumber(searchParams.get("min_price")),
    max_price: parseNonNegativeNumber(searchParams.get("max_price")),
    bedrooms: parsePositiveInteger(searchParams.get("bedrooms")),
    guests: parsePositiveInteger(searchParams.get("guests")),
    sort: parseSort(searchParams.get("sort")),
    page: parsePositiveInteger(searchParams.get("page")) || 1,
  };
}

function applyFilterParams(params: URLSearchParams, filters: GetPropertiesParams, page = 1): void {
  const entries: Array<[keyof GetPropertiesParams, string | number | undefined]> = [
    ["search", filters.search],
    ["location", filters.location],
    ["min_price", filters.min_price],
    ["max_price", filters.max_price],
    ["bedrooms", filters.bedrooms],
    ["guests", filters.guests],
    ["sort", filters.sort],
  ];

  entries.forEach(([key, value]) => {
    if (value === undefined || value === "") {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return fallback;
}

export default function PropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const appliedFilters = useMemo(() => toFilterState(searchParams), [searchParams]);
  const currentPage = appliedFilters.page || 1;
  const baseFilters = useMemo<GetPropertiesParams>(
    () => ({
      search: appliedFilters.search,
      location: appliedFilters.location,
      min_price: appliedFilters.min_price,
      max_price: appliedFilters.max_price,
      bedrooms: appliedFilters.bedrooms,
      guests: appliedFilters.guests,
      sort: appliedFilters.sort,
    }),
    [
      appliedFilters.bedrooms,
      appliedFilters.guests,
      appliedFilters.location,
      appliedFilters.max_price,
      appliedFilters.min_price,
      appliedFilters.search,
      appliedFilters.sort,
    ]
  );

  const [mapEnabled, setMapEnabled] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getProperties({
          ...baseFilters,
          page: currentPage,
          per_page: RESULTS_PER_PAGE,
        });

        if (!active) {
          return;
        }

        setProperties(response.data.properties);
        setTotalPages(response.data.pagination.pages || 1);
        setTotalResults(response.data.pagination.total || 0);
      } catch (fetchError: unknown) {
        if (!active) {
          return;
        }

        setProperties([]);
        setTotalPages(1);
        setTotalResults(0);
        setError(getErrorMessage(fetchError, "Failed to load properties"));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProperties();

    return () => {
      active = false;
    };
  }, [baseFilters, currentPage]);

  useEffect(() => {
    if (!mapEnabled) {
      return;
    }

    let active = true;

    const fetchMapItems = async () => {
      setMapLoading(true);
      setMapError(null);
      setMapItems([]);

      try {
        const firstPage = await getProperties({
          ...baseFilters,
          page: 1,
          per_page: MAP_BATCH_SIZE,
        });
        const allProperties = [...firstPage.data.properties];
        const totalPages = firstPage.data.pagination.pages || 1;

        if (totalPages > 1) {
          const requests: Promise<PropertiesResponse>[] = [];

          for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
            requests.push(
              getProperties({
                ...baseFilters,
                page: currentPage,
                per_page: MAP_BATCH_SIZE,
              })
            );
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
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        setMapItems([]);
        setMapError(getErrorMessage(error, "Failed to load map properties"));
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
  }, [baseFilters, mapEnabled]);

  const navigateWithFilters = (filters: GetPropertiesParams, page = 1) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    applyFilterParams(nextParams, filters, page);

    const nextQuery = nextParams.toString();
    router.push(nextQuery ? `/properties?${nextQuery}` : "/properties");
  };

  const handleApplyFilters = (filters: GetPropertiesParams) => {
    navigateWithFilters(filters, 1);
  };

  const handleResetFilters = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    ["search", "location", "min_price", "max_price", "bedrooms", "guests", "sort", "page"].forEach(
      (key) => nextParams.delete(key)
    );

    const nextQuery = nextParams.toString();
    router.push(nextQuery ? `/properties?${nextQuery}` : "/properties");
  };

  const handlePageChange = (page: number) => {
    navigateWithFilters(baseFilters, page);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumbs />

          <FilterBar
            filters={baseFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            mapEnabled={mapEnabled}
            toggleMap={() => setMapEnabled((prev) => !prev)}
          />

          {!mapEnabled && (
            <div>
              <ResultsList
                properties={properties}
                loading={loading}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {mapEnabled && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="order-2 lg:order-1">
                <ResultsList
                  properties={properties}
                  loading={loading}
                  error={error}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalResults}
                  onPageChange={handlePageChange}
                />
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
