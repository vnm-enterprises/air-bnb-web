"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LayoutGrid,
  Home,
  CalendarDays,
  Wallet,
  Settings,
  Bell,
  Mail,
  Plus,
  Download,
  Pencil,
  Eye,
  Trash2,
  Search,
  MapPin,
} from "lucide-react";

type ListingStatus = "Active" | "Draft" | "Inactive";

type Listing = {
  id: string;
  title: string;
  location: string;
  image: string;
  status: ListingStatus;
  price: number;
  lastUpdated: string;
};

const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Azure Bay Modern Villa",
    location: "Malibu, California",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60",
    status: "Active",
    price: 450,
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    title: "Redwood Forest Cabin",
    location: "Big Sur, CA",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=60",
    status: "Draft",
    price: 185,
    lastUpdated: "Yesterday",
  },
  {
    id: "3",
    title: "Industrial Arts Loft",
    location: "Manhattan, NY",
    image:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=60",
    status: "Inactive",
    price: 320,
    lastUpdated: "3 days ago",
  },
  {
    id: "4",
    title: "Skyline Penthouse",
    location: "Chicago, IL",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=60",
    status: "Active",
    price: 890,
    lastUpdated: "5 days ago",
  },
];

function StatusPill({ status }: { status: ListingStatus }) {
  const cls =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Draft"
      ? "bg-slate-50 text-slate-600 border-slate-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${cls}`}>
      {status}
    </span>
  );
}

function TabChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition",
        active
          ? "bg-emerald-700 text-white border-emerald-700"
          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
      {typeof count === "number" && (
        <span
          className={[
            "inline-flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] px-1",
            active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600",
          ].join(" ")}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
        active ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      <span className="h-8 w-8 rounded-lg bg-white border border-slate-200 grid place-items-center">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function HostListingsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"All" | "Active" | "Draft" | "Inactive">("All");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = LISTINGS;

    if (tab !== "All") {
      rows = rows.filter((r) => r.status === tab);
    }

    if (q) {
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }

    return rows;
  }, [query, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

  const counts = useMemo(() => {
    return {
      Active: LISTINGS.filter((x) => x.status === "Active").length,
      Draft: LISTINGS.filter((x) => x.status === "Draft").length,
      Inactive: LISTINGS.filter((x) => x.status === "Inactive").length,
      All: LISTINGS.length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center">
        <div className="w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-700 grid place-items-center">
              <Home className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Host Portal</div>
              <div className="text-[11px] text-slate-500">Manage your stays</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 w-[520px]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 w-full">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search properties by name or location..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white grid place-items-center hover:bg-slate-50">
              <Mail className="h-4 w-4 text-slate-600" />
            </button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white grid place-items-center hover:bg-slate-50">
              <Bell className="h-4 w-4 text-slate-600" />
            </button>

            <Link
              href="/host/add-property/basics"
              className="ml-2 inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-sm shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add New Listing
            </Link>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="grid grid-cols-12">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white border-r border-slate-200 min-h-[calc(100vh-56px)]">
          <div className="p-4 space-y-2">
            <SidebarItem
              href="/host/dashboard"
              label="Dashboard"
              icon={<LayoutGrid className="h-4 w-4 text-slate-600" />}
            />
            <SidebarItem
              href="/host/listings"
              label="Listings"
              active
              icon={<Home className="h-4 w-4 text-emerald-700" />}
            />
            <SidebarItem
              href="/host/bookings"
              label="Bookings"
              icon={<CalendarDays className="h-4 w-4 text-slate-600" />}
            />
            <SidebarItem
              href="/host/earnings"
              label="Earnings"
              icon={<Wallet className="h-4 w-4 text-slate-600" />}
            />
            <SidebarItem
              href="/host/settings"
              label="Settings"
              icon={<Settings className="h-4 w-4 text-slate-600" />}
            />
          </div>

          <div className="mt-auto p-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-200" />
              <div className="leading-tight">
                <div className="text-sm font-medium text-slate-900">Julian Rossi</div>
                <div className="text-[11px] text-slate-500">Superhost</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
          <div className="max-w-5xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Manage Listings</h1>
                <p className="mt-1 text-sm text-slate-500">
                  You have <span className="font-medium text-slate-700">12</span> active listings across{" "}
                  <span className="font-medium text-slate-700">4</span> cities.
                </p>
              </div>

              <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm">
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <TabChip
                label="All Properties"
                count={counts.All}
                active={tab === "All"}
                onClick={() => {
                  setTab("All");
                  setPage(1);
                }}
              />
              <TabChip
                label="Active"
                count={counts.Active}
                active={tab === "Active"}
                onClick={() => {
                  setTab("Active");
                  setPage(1);
                }}
              />
              <TabChip
                label="Drafts"
                count={counts.Draft}
                active={tab === "Draft"}
                onClick={() => {
                  setTab("Draft");
                  setPage(1);
                }}
              />
              <TabChip
                label="Inactive"
                count={counts.Inactive}
                active={tab === "Inactive"}
                onClick={() => {
                  setTab("Inactive");
                  setPage(1);
                }}
              />
              <button
                type="button"
                className="ml-1 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
              >
                + More Filters
              </button>
            </div>

            {/* Table Card */}
            <section className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">{pageRows.length}</span> results
                </div>

                {/* Mobile search */}
                <div className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 w-full max-w-xs">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search..."
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="w-10 px-4 py-3">
                        <input type="checkbox" className="h-4 w-4" />
                      </th>
                      <th className="text-left px-4 py-3">Property</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Price</th>
                      <th className="text-left px-4 py-3">Last Updated</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pageRows.map((row) => (
                      <tr key={row.id} className="border-b border-slate-200 last:border-b-0">
                        <td className="px-4 py-4">
                          <input type="checkbox" className="h-4 w-4" />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={row.image} alt={row.title} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{row.title}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {row.location}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <StatusPill status={row.status} />
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-900">${row.price.toFixed(2)}</div>
                          <div className="text-[11px] text-slate-500 uppercase">Per night</div>
                        </td>

                        <td className="px-4 py-4 text-slate-600">{row.lastUpdated}</td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2 text-slate-600">
                            <button className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer pagination */}
              <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div>
                  Showing {start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length} results
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
                          ? "bg-emerald-700 border-emerald-700 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}