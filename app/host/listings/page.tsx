"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  Eye,
  BarChart3,
} from "lucide-react";

type ListingStatus = "Active" | "Pending" | "Hidden";

type Listing = {
  id: string;
  title: string;
  location: string;
  status: ListingStatus;
  price: number;
  performanceLabel: string;
  performancePct: number; // 0-100
  thumb: string; // image url
};

const ALL_COUNT = 12;

const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Azure Waves Villa",
    location: "Malibu, California",
    status: "Active",
    price: 450,
    performanceLabel: "Occupancy",
    performancePct: 88,
    thumb:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    title: "Rustic Peak Cabin",
    location: "Aspen, Colorado",
    status: "Pending",
    price: 285,
    performanceLabel: "Awaiting verification",
    performancePct: 40,
    thumb:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    title: "Downtown Loft",
    location: "New York, NY",
    status: "Hidden",
    price: 320,
    performanceLabel: "Occupancy",
    performancePct: 0,
    thumb:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  },
];

export default function HostListingsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ListingStatus>("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LISTINGS.filter((l) => {
      const matchesQ =
        !q || l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" ? true : l.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [query, statusFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f4f4] text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 min-w-[140px]">
            <div className="text-slate-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold">StayManager</span>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-[520px]">
            <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-9 flex items-center px-3 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                className="w-full bg-transparent outline-none text-[12px] text-slate-600 placeholder:text-slate-400"
                placeholder="Quick find..."
              />
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-5 text-[11px] font-semibold text-slate-600">
              <Link href="/host/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>

              <Link
                href="/host/listings"
                className="text-slate-900 font-semibold relative"
              >
                Listings
                <span className="absolute left-0 -bottom-[6px] h-[2px] w-full bg-[#2C5F5D]" />
              </Link>

              <Link href="/host/bookings" className="hover:text-slate-900">
                Bookings
              </Link>
              <Link href="/host/earnings" className="hover:text-slate-900">
                Earnings
              </Link>
            </nav>

            <button className="bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white text-[11px] font-semibold px-3 py-1.5 rounded-md">
              Add New Listing
            </button>

            <div className="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
              🙂
            </div>
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Breadcrumb + title + create */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-[11px] text-slate-400">
                Dashboard <span className="mx-1">›</span> Manage Listings
              </div>
              <h1 className="mt-2 text-2xl font-bold">Manage My Listings</h1>
              <p className="text-[12px] text-slate-500 mt-1 max-w-[520px]">
                Oversee your property portfolio, update pricing, and track status.
              </p>
            </div>

            <button className="inline-flex items-center gap-2 bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white text-[11px] font-semibold px-3 py-2 rounded-md">
              <Plus className="w-4 h-4" />
              Create New Listing
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <MiniStat label="Total Listings" value="12" icon="🏠" />
            <MiniStat label="Active" value="8" icon="✅" />
            <MiniStat label="Pending" value="3" icon="🟨" />
            <MiniStat label="Revenue (MTD)" value="$14,250" icon="💳" accent />
          </div>

          {/* Table Card */}
          <section className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Filters row */}
            <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="relative w-full sm:w-[360px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by property name or location..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-[12px] outline-none focus:bg-white focus:border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() =>
                    setStatusFilter((s) =>
                      s === "All" ? "Active" : s === "Active" ? "Pending" : s === "Pending" ? "Hidden" : "All"
                    )
                  }
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 transition text-[11px] font-semibold px-3 py-2 rounded-md text-slate-600"
                >
                  {statusFilter === "All" ? "All Status" : statusFilter}
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 transition text-[11px] font-semibold px-3 py-2 rounded-md text-slate-600">
                  More Filters
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="px-5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] tracking-wide text-slate-400 border-b border-slate-200">
                      <th className="text-left font-semibold py-3">LISTING DETAILS</th>
                      <th className="text-left font-semibold py-3">STATUS</th>
                      <th className="text-left font-semibold py-3">PRICE PER NIGHT</th>
                      <th className="text-left font-semibold py-3">PERFORMANCE</th>
                      <th className="text-right font-semibold py-3">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody className="text-[12px]">
                    {visible.map((l) => (
                      <tr key={l.id} className="border-b border-slate-100 last:border-b-0">
                        {/* Listing details */}
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                              <img src={l.thumb} alt={l.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{l.title}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {l.location}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4">
                          <StatusPill status={l.status} />
                        </td>

                        {/* Price */}
                        <td className="py-4">
                          <div className="font-bold text-slate-900">${l.price}</div>
                          <div className="text-[10px] text-slate-400">USD / NIGHT</div>
                        </td>

                        {/* Performance */}
                        <td className="py-4">
                          <div className="text-[10px] text-slate-400 font-semibold tracking-wide">
                            {l.performanceLabel.toUpperCase()}
                          </div>

                          {l.performanceLabel.toLowerCase().includes("occupancy") ? (
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex-1 h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden max-w-[160px]">
                                <div
                                  className="h-full bg-[#2C5F5D]"
                                  style={{ width: `${l.performancePct}%` }}
                                />
                              </div>
                              <div className="text-[11px] font-semibold text-slate-600">
                                {l.performancePct}%
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2 text-[11px] text-slate-500">
                              {l.performanceLabel}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4">
                          <div className="flex items-center justify-end gap-3 text-slate-600">
                            <button
                              className="p-1.5 rounded-md hover:bg-slate-100 transition"
                              aria-label="Edit listing"
                            >
                              <Pencil className="w-4 h-4 text-slate-500" />
                            </button>
                            <button
                              className="p-1.5 rounded-md hover:bg-slate-100 transition"
                              aria-label="View listing"
                            >
                              <Eye className="w-4 h-4 text-slate-500" />
                            </button>
                            <button
                              className="p-1.5 rounded-md hover:bg-slate-100 transition"
                              aria-label="Analytics"
                            >
                              <BarChart3 className="w-4 h-4 text-slate-500" />
                            </button>
                            <button
                              className="p-1.5 rounded-md hover:bg-slate-100 transition"
                              aria-label="Delete listing"
                            >
                              <Trash2 className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {visible.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-[12px] text-slate-500">
                          No listings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between py-4 text-[11px] text-slate-500">
                <div>Showing 1 to {Math.min(visible.length, 3)} of {ALL_COUNT} results</div>
                <div className="flex items-center gap-2">
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 transition px-3 py-1.5 rounded-md">
                    Previous
                  </button>
                  <button className="bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white px-3 py-1.5 rounded-md">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f4a47] text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-white">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold">RealEstate</h3>
            </div>
            <p className="text-white/75 text-[12px] leading-relaxed mt-3">
              Your trusted partner in finding the perfect home. We make real estate simple.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-[13px]">Quick Links</h4>
            <FooterLink>Buy Property</FooterLink>
            <FooterLink>Sell Property</FooterLink>
            <FooterLink>Rent Property</FooterLink>
            <FooterLink>About Us</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-[13px]">Property Types</h4>
            <FooterLink>Houses</FooterLink>
            <FooterLink>Apartments</FooterLink>
            <FooterLink>Condos</FooterLink>
            <FooterLink>Villas</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-[13px]">Contact Us</h4>
            <div className="space-y-2 text-white/75 text-[12px]">
              <p>(555) 123-4567</p>
              <p>info@realestate.com</p>
              <p>123 Main St, City, State</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-5 text-center text-[11px] text-white/60">
            © {new Date().getFullYear()} RealEstate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Small components */
function MiniStat({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[12px]">
          {icon}
        </span>
        <div className="text-[10px] text-slate-400 font-semibold">{label}</div>
      </div>

      <div className={["mt-2 text-lg font-bold", accent ? "text-[#2C5F5D]" : "text-slate-900"].join(" ")}>
        {value}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ListingStatus }) {
  const styles =
    status === "Active"
      ? "bg-slate-900 text-white"
      : status === "Pending"
      ? "bg-[#F7E7B7] text-[#7A5A00] border border-[#F0D98B]"
      : "bg-slate-100 text-slate-600";

  return (
    <span className={["inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-semibold", styles].join(" ")}>
      {status}
    </span>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-white/75 hover:text-white transition cursor-pointer text-[12px] mb-2">
      {children}
    </div>
  );
}