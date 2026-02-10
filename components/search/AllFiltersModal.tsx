"use client";

import { X } from "lucide-react";

export default function AllFiltersModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-2xl w-[700px] max-h-[80vh] overflow-y-auto shadow-2xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold">All Filters</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Example Filter Sections */}

        <Section title="Price Range">
          <input type="range" className="w-full" />
        </Section>

        <Section title="Property Type">
          <Checkbox label="Apartment" />
          <Checkbox label="House" />
          <Checkbox label="Villa" />
        </Section>

        <Section title="Amenities">
          <Checkbox label="Wifi" />
          <Checkbox label="Kitchen" />
          <Checkbox label="Parking" />
        </Section>

        {/* Footer */}
        <div className="flex justify-between mt-8">
          <button className="font-semibold underline">Clear all</button>

          <button
            onClick={onClose}
            className="bg-[#2C5F5D] text-white px-6 py-3 rounded-xl font-bold"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="font-bold mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Checkbox({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" />
      {label}
    </label>
  );
}
