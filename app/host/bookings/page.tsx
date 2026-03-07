"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, FileDown, FileText, Pencil } from "lucide-react";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

type Booking = {
  id: string;
  guestName: string;
  guestMeta: string;
  property: string;
  dateRange: string;
  nights: string;
  total: string;
  status: BookingStatus;
};

const ALL_COUNT = 128;

const BOOKINGS: Booking[] = [
  {
    id: "1",
    guestName: "Sarah Jenkins",
    guestMeta: "Joined 2021",
    property: "ModernDowntownLoft",
    dateRange: "Oct 12 - Oct 15",
    nights: "3 nights",
    total: "$450.00",
    status: "Confirmed",
  },
  {
    id: "2",
    guestName: "Michael Chen",
    guestMeta: "New Member",
    property: "Oceanview Terrace",
    dateRange: "Oct 20 - Oct 22",
    nights: "2 nights",
    total: "$320.00",
    status: "Pending",
  },
  {
    id: "3",
    guestName: "James Wilson",
    guestMeta: "Joined 2022",
    property: "Rustic Forest Cabin",
    dateRange: "Nov 05 - Nov 10",
    nights: "5 nights",
    total: "$750.00",
    status: "Cancelled",
  },
  {
    id: "4",
    guestName: "Emily Rodriguez",
    guestMeta: "Frequent Traveler",
    property: "DowntownStudio",
    dateRange: "Dec 12 - Dec 15",
    nights: "3 nights",
    total: "$390.00",
    status: "Confirmed",
  },
];

const TABS: { label: string; value: "All" | BookingStatus }[] = [
  { label: "All Bookings", value: "All" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Pending", value: "Pending" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function HostBookingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOOKINGS.filter((b) => {
      const matchesTab = tab === "All" ? true : b.status === tab;
      const matchesQuery =
        !q ||
        b.guestName.toLowerCase().includes(q) ||
        b.property.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f4f4] text-slate-900">
      {/* Top Host Nav */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-slate-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold">StayTeal Host</span>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-5 text-[11px] font-medium text-slate-600">
              <Link href="/host/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>

              <Link
                href="/host/bookings"
                className="text-slate-900 font-semibold relative"
              >
                Bookings
                <span className="absolute left-0 -bottom-[6px] h-[2px] w-full bg-[#2C5F5D]" />
              </Link>

              <Link href="/host/listings" className="hover:text-slate-900">
                Listings
              </Link>
              <Link href="/host/inbox" className="hover:text-slate-900">
                Inbox
              </Link>
            </nav>

            <Link
              href="/host/add-property/basics"
              className="bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white text-[11px] font-semibold px-3 py-1.5 rounded-md"
            >
              Add Listing
            </Link>

            <div className="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
              🙂
            </div>
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Title + Export */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                Booking Management
              </h1>
              <p className="text-[12px] text-slate-500 mt-1">
                You have 12 pending requests that need your attention.
              </p>
            </div>

            <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 transition text-[11px] font-semibold px-3 py-2 rounded-md">
              <FileDown className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <StatCard label="Total Bookings" value="128" />
            <StatCard label="Active Guests" value="14" />
            <StatCard label="Monthly Revenue" value="$12,450" accent />
          </div>

          {/* Table Card */}
          <section className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="px-5 pt-4">
              <div className="flex items-center gap-5 border-b border-slate-200">
                {TABS.map((t) => {
                  const active = t.value === tab;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTab(t.value)}
                      className={[
                        "text-[11px] font-semibold pb-3",
                        active
                          ? "text-slate-900 border-b-2 border-[#2C5F5D]"
                          : "text-slate-500 hover:text-slate-800",
                      ].join(" ")}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="px-5 py-3">
              <div className="relative w-full sm:w-[340px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by guest name or property..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-[12px] outline-none focus:bg-white focus:border-slate-300"
                />
              </div>
            </div>

            {/* Table */}
            <div className="px-5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] tracking-wide text-slate-400 border-b border-slate-200">
                      <th className="text-left font-semibold py-3">GUEST</th>
                      <th className="text-left font-semibold py-3">PROPERTY</th>
                      <th className="text-left font-semibold py-3">DATES</th>
                      <th className="text-left font-semibold py-3">TOTAL</th>
                      <th className="text-left font-semibold py-3">STATUS</th>
                      <th className="text-right font-semibold py-3">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody className="text-[12px]">
                    {filtered.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
                              🙂
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {b.guestName}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {b.guestMeta}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 text-slate-800">{b.property}</td>

                        <td className="py-4">
                          <div className="text-slate-800">{b.dateRange}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {b.nights}
                          </div>
                        </td>

                        <td className="py-4 font-semibold text-slate-900">
                          {b.total}
                        </td>

                        <td className="py-4">
                          <StatusPill status={b.status} />
                        </td>

                        <td className="py-4">
                          <div className="flex items-center justify-end gap-3 text-slate-600">
                            <button
                              className="p-1.5 rounded-md hover:bg-slate-100 transition"
                              aria-label="View booking"
                            >
                              <FileText className="w-4 h-4 text-[#2C5F5D]" />
                            </button>
                            <button
                              className="p-1.5 rounded-md hover:bg-slate-100 transition"
                              aria-label="Edit booking"
                            >
                              <Pencil className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-[12px] text-slate-500"
                        >
                          No bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between py-4 text-[11px] text-slate-500">
                <div>Showing 1 - 4 of {ALL_COUNT} bookings</div>
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

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="text-[10px] text-slate-400 font-semibold">{label}</div>
      <div className={["mt-2 text-lg font-bold", accent ? "text-[#2C5F5D]" : "text-slate-900"].join(" ")}>
        {value}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const styles =
    status === "Confirmed"
      ? "bg-[#2C5F5D] text-white"
      : status === "Pending"
      ? "bg-slate-100 text-slate-600"
      : "bg-slate-100 text-slate-500";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "px-3 py-1 rounded-full",
        "text-[10px] font-semibold",
        styles,
      ].join(" ")}
    >
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