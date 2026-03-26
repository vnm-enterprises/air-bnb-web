"use client";
import Link from "next/link";

export default function HostMediaPricingPage() {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#d4e6e5] bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2C5F5D]">Listing Flow Updated</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Media and pricing are now in one place</h1>
        <p className="mt-3 text-sm text-slate-600">
          To keep publishing simple, we merged the multi-step flow into the main listing form.
        </p>

        <Link
          href="/host/add-property/basics"
          className="mt-6 inline-flex rounded-full bg-[#2C5F5D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#244f4d]"
        >
          Continue to Create Listing
        </Link>
      </div>
    </div>
  );
}