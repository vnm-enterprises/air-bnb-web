"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import AllFiltersModal from "./AllFiltersModal";

export default function FiltersBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 mb-2 px-6 pb-4 overflow-x-auto">

        <FilterPrimary label="Price" />

        <FilterChip label="Property" />
        <FilterChip label="Amenities" />
        <FilterChip label="Instant" />

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full
          bg-[#fafafa]
          border border-slate-200
          px-5 h-9 text-sm font-bold
          text-slate-700
          hover:bg-slate-100 transition"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

      </div>

      {open && <AllFiltersModal onClose={() => setOpen(false)} />}
    </>
  );
}

/* --- Small Subcomponents --- */

function FilterPrimary({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-full bg-[#2C5F5D] text-white px-5 h-9 text-sm font-bold shadow">
      {label}
      <ChevronDown size={16} />
    </button>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-full
      bg-slate-100
      border border-slate-200
      px-5 h-9 text-sm font-bold
      text-slate-700
      hover:bg-slate-200 transition"
    >
      {label}
      <ChevronDown size={16} />
    </button>
  );
}
