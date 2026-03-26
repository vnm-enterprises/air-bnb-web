"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Home,
  Bell,
  Settings,
  Search,
  MoreHorizontal,
  Calendar,
} from "lucide-react";

type BookingStatus = "Upcoming" | "Completed" | "Cancelled";

type BookingRow = {
  id: string;
  guestName: string;
  guestId: string;
  avatar: string;
  dates: string;
  property: string;
  payout: number;
  status: BookingStatus;
};

const BOOKINGS: BookingRow[] = [
  {
    id: "BK-92831",
    guestName: "Alex Johnson",
    guestId: "#BK-92831",
    avatar: "https://i.pravatar.cc/80?img=12",
    dates: "Oct 12 - Oct 15",
    property: "Coastal Retreat",
    payout: 450,
    status: "Upcoming",
  },
  {
    id: "BK-92750",
    guestName: "Maria Garcia",
    guestId: "#BK-92750",
    avatar: "https://i.pravatar.cc/80?img=48",
    dates: "Sep 28 - Oct 02",
    property: "Urban Loft",
    payout: 620,
    status: "Completed",
  },
  {
    id: "BK-92644",
    guestName: "James Smith",
    guestId: "#BK-92644",
    avatar: "https://i.pravatar.cc/80?img=33",
    dates: "Oct 20 - Oct 22",
    property: "Mountain Cabin",
    payout: 310,
    status: "Upcoming",
  },
  {
    id: "BK-92510",
    guestName: "Sarah Lee",
    guestId: "#BK-92510",
    avatar: "https://i.pravatar.cc/80?img=16",
    dates: "Sep 15 - Sep 17",
    property: "Coastal Retreat",
    payout: 280,
    status: "Cancelled",
  },
];

function StatusPill({ status }: { status: BookingStatus }) {
  const cls =
    status === "Upcoming"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Completed"
      ? "bg-slate-50 text-slate-600 border-slate-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${cls}`}>
      {status}
    </span>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full text-xs border transition",
        active ? "bg-emerald-800 text-white border-emerald-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function TopIcon({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white grid place-items-center hover:bg-slate-50">
      {children}
    </button>
  );
}

export default function BookingManagementUI() {
  const [tab, setTab] = useState<"All" | "Upcoming" | "Completed" | "Cancelled">("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = BOOKINGS;

    if (tab !== "All") rows = rows.filter((r) => r.status === tab);

    if (q) {
      rows = rows.filter(
        (r) =>
          r.guestName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [tab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center">
        <div className="w-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="h-9 w-9 rounded-lg bg-emerald-700 grid place-items-center">
              <Home className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Host Portal</div>
              <div className="text-[11px] text-slate-500">Manage your stays</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>

            <Link href="/host" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/host/listings" className="hover:text-slate-900">
              Listings
            </Link>
            <span className="text-emerald-800 font-medium">Bookings</span>
            <Link href="/host/earnings" className="hover:text-slate-900">
              Earnings
            </Link>
            <Link href="/host/messages" className="hover:text-slate-900">
              Messages
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <TopIcon>
              <Bell className="h-4 w-4 text-slate-600" />
            </TopIcon>
            <TopIcon>
              <Settings className="h-4 w-4 text-slate-600" />
            </TopIcon>
            <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/80?img=5" alt="me" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Booking Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track all guest reservations in one place.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-sm shadow-sm">
            <Calendar className="h-4 w-4" />
            View Calendar
          </button>
        </div>

        {/* Filters row */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Tab label="All" active={tab === "All"} onClick={() => { setTab("All"); setPage(1); }} />
            <Tab label="Upcoming" active={tab === "Upcoming"} onClick={() => { setTab("Upcoming"); setPage(1); }} />
            <Tab label="Completed" active={tab === "Completed"} onClick={() => { setTab("Completed"); setPage(1); }} />
            <Tab label="Cancelled" active={tab === "Cancelled"} onClick={() => { setTab("Cancelled"); setPage(1); }} />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white w-full sm:w-[360px]">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by guest name or booking ID"
              className="outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Table card */}
        <section className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="text-left px-4 py-3">Guest</th>
                  <th className="text-left px-4 py-3">Dates</th>
                  <th className="text-left px-4 py-3">Property</th>
                  <th className="text-left px-4 py-3">Payout</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-200 last:border-b-0">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.avatar} alt={row.guestName} className="h-full w-full object-cover" />
                        </div>
                        <div className="leading-tight">
                          <div className="font-medium text-slate-900">{row.guestName}</div>
                          <div className="text-[11px] text-slate-500">{row.guestId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-600">{row.dates}</td>
                    <td className="px-4 py-4 text-slate-600">{row.property}</td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">${row.payout.toFixed(2)}</div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusPill status={row.status} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        <button className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center">
                          <MoreHorizontal className="h-4 w-4 text-slate-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length} bookings
            </div>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    "h-7 w-7 rounded border text-xs",
                    p === page
                      ? "bg-emerald-800 border-emerald-800 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer section like screenshot */}
      <footer className="mt-10 bg-emerald-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="h-7 w-7 rounded bg-emerald-700 inline-block" />
              RealEstate
            </div>
            <p className="mt-3 text-sm text-emerald-100/80 leading-relaxed">
              Your trusted partner in finding the perfect home. We make real estate simple.
            </p>
          </div>

          <div>
            <div className="font-semibold">Quick Links</div>
            <ul className="mt-3 space-y-2 text-sm text-emerald-100/80">
              <li>Buy Property</li>
              <li>Sell Property</li>
              <li>Rent Property</li>
              <li>About Us</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Property Types</div>
            <ul className="mt-3 space-y-2 text-sm text-emerald-100/80">
              <li>Houses</li>
              <li>Apartments</li>
              <li>Condos</li>
              <li>Villas</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Contact Us</div>
            <ul className="mt-3 space-y-2 text-sm text-emerald-100/80">
              <li>(555) 123-4567</li>
              <li>info@realestate.com</li>
              <li>123 Main St, City, State</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-900/60">
          <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-emerald-100/70">
            © 2026 RealEstate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}