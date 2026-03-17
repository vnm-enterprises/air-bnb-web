"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { GetPropertiesParams } from "@/lib/propertyApi";

function toFilterState(filters: GetPropertiesParams): GetPropertiesParams {
  return {
    search: filters.search,
    location: filters.location,
    check_in: filters.check_in,
    check_out: filters.check_out,
    min_price: filters.min_price,
    max_price: filters.max_price,
    bedrooms: filters.bedrooms,
    guests: filters.guests,
    sort: filters.sort,
  };
}

const EMPTY_FILTERS: GetPropertiesParams = {
  search: undefined,
  location: undefined,
  check_in: undefined,
  check_out: undefined,
  min_price: undefined,
  max_price: undefined,
  bedrooms: undefined,
  guests: undefined,
  sort: undefined,
};

export default function FilterBar({
  filters,
  onApply,
  onReset,
  mapEnabled,
  toggleMap,
}: {
  filters: GetPropertiesParams;
  onApply: (filters: GetPropertiesParams) => void;
  onReset: () => void;
  mapEnabled: boolean;
  toggleMap: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<GetPropertiesParams>(toFilterState(filters));

  useEffect(() => {
    setDraftFilters(toFilterState(filters));
  }, [filters]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.search ||
          filters.location ||
          filters.min_price ||
          filters.max_price ||
          filters.bedrooms ||
          filters.guests ||
          filters.sort
      ),
    [filters]
  );

  const activeFilterCount = useMemo(
    () =>
      [
        filters.search,
        filters.location,
        filters.min_price,
        filters.max_price,
        filters.bedrooms,
        filters.guests,
        filters.sort,
      ].filter(Boolean).length,
    [filters]
  );

  const closeDrawer = () => {
    setDraftFilters(toFilterState(filters));
    setOpen(false);
  };

  const openDrawer = () => {
    setDraftFilters(toFilterState(filters));
    setOpen(true);
  };

  const applyQuickFilter = (patch: GetPropertiesParams) => {
    onApply({
      ...toFilterState(filters),
      ...patch,
    });
  };

  const submitFilters = () => {
    onApply(toFilterState(draftFilters));
    setOpen(false);
  };

  return (
    <>
      {/* TOP FILTER ROW */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        <button
          onClick={onReset}
          className={`px-4 py-2 border rounded-full text-sm transition ${
            !hasActiveFilters ? "bg-black text-white border-black" : "hover:bg-gray-100"
          }`}
        >
          All stays
        </button>

        <button
          onClick={() =>
            applyQuickFilter({ bedrooms: filters.bedrooms === 2 ? undefined : 2 })
          }
          className={`px-4 py-2 border rounded-full text-sm transition ${
            filters.bedrooms === 2 ? "bg-black text-white border-black" : "hover:bg-gray-100"
          }`}
        >
          2+ bedrooms
        </button>

        <button
          onClick={() =>
            applyQuickFilter({ guests: filters.guests === 4 ? undefined : 4 })
          }
          className={`px-4 py-2 border rounded-full text-sm transition ${
            filters.guests === 4 ? "bg-black text-white border-black" : "hover:bg-gray-100"
          }`}
        >
          4+ guests
        </button>

        <button
          onClick={() =>
            applyQuickFilter({ sort: filters.sort === "price_asc" ? undefined : "price_asc" })
          }
          className={`px-4 py-2 border rounded-full text-sm transition ${
            filters.sort === "price_asc" ? "bg-black text-white border-black" : "hover:bg-gray-100"
          }`}
        >
          Price low-high
        </button>

        <button
          onClick={openDrawer}
          className="ml-auto border px-4 py-2 rounded-full text-sm hover:bg-gray-100"
        >
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>

        <button
          onClick={toggleMap}
          className="border px-4 py-2 rounded-full text-sm hover:bg-gray-100"
        >
          {mapEnabled ? "Hide Map" : "Show Map"}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm underline underline-offset-4"
          >
            Reset
          </button>
        )}
      </div>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeDrawer}
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
            <button onClick={closeDrawer}>
              <X />
            </button>
          </div>

          <div className="space-y-8">

            <div>
              <label className="font-medium mb-3 block">Keyword</label>
              <input
                type="text"
                value={draftFilters.search || ""}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    search: event.target.value || undefined,
                  }))
                }
                placeholder="Search by title or description"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="font-medium mb-3 block">Destination</label>
              <input
                type="text"
                value={draftFilters.location || ""}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    location: event.target.value || undefined,
                  }))
                }
                placeholder="Colombo, Kandy, Galle..."
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Price */}
            <div>
              <h3 className="font-medium mb-3">
                Price range
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  value={draftFilters.min_price ?? ""}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      min_price: event.target.value ? Number(event.target.value) : undefined,
                    }))
                  }
                  placeholder="Min"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
                />
                <input
                  type="number"
                  min="0"
                  value={draftFilters.max_price ?? ""}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      max_price: event.target.value ? Number(event.target.value) : undefined,
                    }))
                  }
                  placeholder="Max"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>
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
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        bedrooms: current.bedrooms === n ? undefined : n,
                      }))
                    }
                    className={`border px-4 py-2 rounded-full transition ${
                      draftFilters.bedrooms === n ? "bg-black text-white border-black" : "hover:bg-gray-100"
                    }`}
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>

            {/* Guests */}
            <div>
              <h3 className="font-medium mb-3">
                Guests
              </h3>
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 8].map((count) => (
                  <button
                    key={count}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        guests: current.guests === count ? undefined : count,
                      }))
                    }
                    className={`border px-4 py-2 rounded-full text-sm transition ${
                      draftFilters.guests === count ? "bg-black text-white border-black" : "hover:bg-gray-100"
                    }`}
                  >
                    {count}+
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-medium mb-3">
                Sort by
              </h3>
              <select
                value={draftFilters.sort || "created_desc"}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    sort:
                      event.target.value === "created_desc"
                        ? undefined
                        : (event.target.value as GetPropertiesParams["sort"]),
                  }))
                }
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
              >
                <option value="created_desc">Newest first</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => setDraftFilters(EMPTY_FILTERS)}
              className="text-sm underline"
            >
              Reset
            </button>
            <button
              onClick={submitFilters}
              className="bg-black text-white px-6 py-2 rounded-full"
            >
              Show results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
