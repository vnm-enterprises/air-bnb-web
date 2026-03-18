"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumbs from "@/components/properties/Breadcrumbs";
import FilterBar from "@/components/properties/FilterBar";
import ResultsList from "@/components/properties/ResultsList";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getProperties,
  type GetPropertiesParams,
  type Property,
} from "@/lib/propertyApi";

export const dynamic = 'force-dynamic';

const RESULTS_PER_PAGE = 6;

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

function parseDateParam(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

function toFilterState(searchParams: { get(key: string): string | null }): GetPropertiesParams {
  return {
    search: parseTextParam(searchParams.get("search")),
    location: parseTextParam(searchParams.get("location")),
    check_in: parseDateParam(searchParams.get("check_in") ?? searchParams.get("checkin")),
    check_out: parseDateParam(searchParams.get("check_out") ?? searchParams.get("checkout")),
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
    ["check_in", filters.check_in],
    ["check_out", filters.check_out],
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

function PropertiesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const appliedFilters = useMemo(() => toFilterState(searchParams), [searchParams]);
  const currentPage = appliedFilters.page || 1;
  const baseFilters = useMemo<GetPropertiesParams>(
    () => ({
      search: appliedFilters.search,
      location: appliedFilters.location,
      check_in: appliedFilters.check_in,
      check_out: appliedFilters.check_out,
      min_price: appliedFilters.min_price,
      max_price: appliedFilters.max_price,
      bedrooms: appliedFilters.bedrooms,
      guests: appliedFilters.guests,
      sort: appliedFilters.sort,
    }),
    [
      appliedFilters.bedrooms,
      appliedFilters.check_in,
      appliedFilters.check_out,
      appliedFilters.guests,
      appliedFilters.location,
      appliedFilters.max_price,
      appliedFilters.min_price,
      appliedFilters.search,
      appliedFilters.sort,
    ]
  );

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

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
    ["search", "location", "check_in", "check_out", "checkin", "checkout", "min_price", "max_price", "bedrooms", "guests", "sort", "page"].forEach(
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
          <Breadcrumbs destination={appliedFilters.location || appliedFilters.search} />

          <FilterBar
            filters={baseFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

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
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PropertiesPageContent />
    </Suspense>
  );
}
