"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { deleteProperty, Property } from "@/infrastructure/services/property-service";
import { fetchHostProperties } from "@/infrastructure/services/host-dashboard-service";
import { resolveImageUrl } from "@/lib/image";

type ListingStatus = "Active" | "Pending" | "Hidden";

type Listing = {
  id: number;
  title: string;
  description: string;
  location: string;
  status: ListingStatus;
  price: number;
  performanceLabel: string;
  performancePct: number;
  thumb: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rawStatus: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80";

function getApiMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return fallback;
}

function toListingStatus(status: string | undefined): ListingStatus {
  const normalized = (status || "").toLowerCase();

  if (["pending", "draft"].includes(normalized)) {
    return "Pending";
  }

  if (["hidden", "inactive", "suspended", "rejected"].includes(normalized)) {
    return "Hidden";
  }

  return "Active";
}

function mapPropertyToListing(property: Property): Listing {
  const firstImage = Array.isArray(property.images) ? property.images[0] : "";

  return {
    id: property.id,
    title: property.title || `Property #${property.id}`,
    description: property.description || "",
    location: property.location || "Location unavailable",
    status: toListingStatus(property.status),
    price: Number(property.price || 0),
    performanceLabel: "Occupancy",
    performancePct: Math.max(0, Math.min(100, Math.round(Number(property.rating_average || 0) * 20))),
    thumb: resolveImageUrl(
      typeof firstImage === "string" && firstImage.trim() ? firstImage : "",
      FALLBACK_IMAGE
    ),
    maxGuests: Number(property.max_guests || 0),
    bedrooms: Number(property.bedrooms || 0),
    bathrooms: Number(property.bathrooms || 0),
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    rawStatus: property.status || "active",
  };
}

export default function HostListingsPage() {
  const router = useRouter();
  const { isAuthenticated, isHost, loading, user } = useAuth();
  const isHostUser = isHost();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ListingStatus>("All");
  const [listings, setListings] = useState<Listing[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchListings = useCallback(async () => {
    if (!user?.id) {
      setListings([]);
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    setDataError(null);

    try {
      const hostListings = (await fetchHostProperties(user.id, 50)).map(mapPropertyToListing);

      setListings(hostListings);
    } catch (error: unknown) {
      setDataError(getApiMessage(error, "Failed to load listings"));
    } finally {
      setDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !isHostUser) {
      setDataLoading(false);
      return;
    }

    fetchListings();
  }, [loading, isAuthenticated, isHostUser, fetchListings]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesQuery =
        !q ||
        listing.title.toLowerCase().includes(q) ||
        listing.location.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" ? true : listing.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, listings]);

  const stats = useMemo(() => {
    const total = listings.length;
    const active = listings.filter((listing) => listing.status === "Active").length;
    const pending = listings.filter((listing) => listing.status === "Pending").length;
    const averagePrice = total
      ? Math.round(listings.reduce((sum, listing) => sum + listing.price, 0) / total)
      : 0;

    return {
      total,
      active,
      pending,
      averagePrice,
    };
  }, [listings]);

  const handleEdit = (listing: Listing) => {
    router.push(`/host/listings/${listing.id}/edit`);
  };

  const handleDelete = async (listing: Listing) => {
    const confirmed = window.confirm(
      `Delete \"${listing.title}\"? This action can be undone from WordPress trash only.`
    );

    if (!confirmed) {
      return;
    }

    setActionLoadingId(listing.id);
    setDataError(null);

    try {
      await deleteProperty(listing.id);
      setListings((current) => current.filter((row) => row.id !== listing.id));
    } catch (error: unknown) {
      setDataError(getApiMessage(error, "Failed to delete listing"));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
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

            <Link
              href="/host/add-property/basics"
              className="inline-flex items-center gap-2 bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white text-[11px] font-semibold px-3 py-2 rounded-md"
            >
              <Plus className="w-4 h-4" />
              Create New Listing
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <MiniStat label="Total Listings" value={String(stats.total)} icon="🏠" />
            <MiniStat label="Active" value={String(stats.active)} icon="✅" />
            <MiniStat label="Pending" value={String(stats.pending)} icon="🟨" />
            <MiniStat label="Avg Nightly Rate" value={`$${stats.averagePrice}`} icon="💳" accent />
          </div>

          {/* Table Card */}
          <section className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Filters row */}
            <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="relative w-full sm:w-[360px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by property name or location..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-[12px] outline-none focus:bg-white focus:border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as "All" | ListingStatus)}
                  className="bg-white border border-slate-200 rounded-md px-3 py-2 text-[11px] font-semibold text-slate-600 outline-none focus:border-slate-300"
                  aria-label="Filter listings by status"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
            </div>

            {dataError && (
              <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-[12px] text-red-700">
                {dataError}
              </div>
            )}

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
                    {dataLoading && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-[12px] text-slate-500">
                          Loading listings...
                        </td>
                      </tr>
                    )}

                    {!dataLoading &&
                      visible.map((listing) => (
                        <tr key={listing.id} className="border-b border-slate-100 last:border-b-0">
                          {/* Listing details */}
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                <img src={listing.thumb} alt={listing.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{listing.title}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {listing.location}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4">
                            <StatusPill status={listing.status} />
                          </td>

                          {/* Price */}
                          <td className="py-4">
                            <div className="font-bold text-slate-900">${listing.price}</div>
                            <div className="text-[10px] text-slate-400">USD / NIGHT</div>
                          </td>

                          {/* Performance */}
                          <td className="py-4">
                            <div className="text-[10px] text-slate-400 font-semibold tracking-wide">
                              {listing.performanceLabel.toUpperCase()}
                            </div>

                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex-1 h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden max-w-[160px]">
                                <div
                                  className="h-full bg-[#2C5F5D]"
                                  style={{ width: `${listing.performancePct}%` }}
                                />
                              </div>
                              <div className="text-[11px] font-semibold text-slate-600">
                                {listing.performancePct}%
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-3 text-slate-600">
                              <button
                                className="p-1.5 rounded-md hover:bg-slate-100 transition disabled:opacity-50"
                                aria-label="Edit listing"
                                onClick={() => handleEdit(listing)}
                                disabled={actionLoadingId === listing.id}
                              >
                                <Pencil className="w-4 h-4 text-slate-500" />
                              </button>

                              <Link
                                href={`/properties/${listing.id}`}
                                className="p-1.5 rounded-md hover:bg-slate-100 transition"
                                aria-label="View listing"
                              >
                                <Eye className="w-4 h-4 text-slate-500" />
                              </Link>

                              <button
                                className="p-1.5 rounded-md hover:bg-slate-100 transition disabled:opacity-50"
                                aria-label="Delete listing"
                                onClick={() => handleDelete(listing)}
                                disabled={actionLoadingId === listing.id}
                              >
                                <Trash2 className="w-4 h-4 text-slate-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {!dataLoading && visible.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-[12px] text-slate-500">
                          No listings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between py-4 text-[11px] text-slate-500">
                <div>
                  Showing {visible.length} of {listings.length} results
                </div>
              </div>
            </div>
          </section>
    </div>
  );
}

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

