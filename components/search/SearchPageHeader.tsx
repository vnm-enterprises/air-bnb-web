"use client";

import { Search } from "lucide-react";

export default function SearchPageHeader() {
  return (
    <header
      className="sticky w-full border-b border-slate-200
                 bg-white "
    >
      <div className="mx-auto px-6 py-4 flex items-center justify-between gap-6">

        <div className="font-extrabold text-[#2C5F5D] tracking-tight">
          LOGO
        </div>

        <div
          className="hidden md:flex items-center
                     rounded-xl border border-slate-300
                     overflow-hidden bg-slate-50 "
        >

          <SearchField
            label="WHERE"
            value="Search destinations"
          />

          <Divider />

          <SearchField
            label="DATES"
            value="Add dates"
          />

          <Divider />

          <SearchField
            label="WHO"
            value="Add guests"
          />

          {/* SEARCH ICON */}
          <button
            className="p-2 mx-1 bg-[#2C5F5D] text-white
                       flex items-center justify-center rounded-full
                       hover:brightness-110"
          >
            <Search size={18} />
          </button>
        </div>

        {/* RIGHT */}
        <button
          className="bg-[#2C5F5D] text-white px-6 py-2.5 rounded-lg
                     font-semibold hover:brightness-110"
        >
          Become a host
        </button>

      </div>
    </header>
  );
}

/* Subcomponents */

function SearchField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-6 py-2 min-w-[180px]">
      <div className="text-[10px] font-bold tracking-widest text-slate-500">
        {label}
      </div>
      <div className="text-sm text-slate-500 font-medium">
        {value}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="w-px h-10 bg-slate-300 " />
  );
}
