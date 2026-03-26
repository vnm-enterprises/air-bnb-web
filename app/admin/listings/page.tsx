"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  getAdminProperties,
  updateAdminPropertyStatus,
  deleteAdminProperty,
  type AdminProperty,
  type AdminPagination,
} from "@/lib/adminApi";
import { resolveImageUrl } from "@/lib/image";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=60";

type StatusFilter = "" | "pending" | "active" | "hidden";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:  "bg-emerald-900/50 text-emerald-300 border-emerald-700/40",
    pending: "bg-amber-900/50 text-amber-300 border-amber-700/40",
    hidden:  "bg-slate-800 text-slate-400 border-slate-700",
  };
  const cls = map[status] ?? map.hidden;
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

export default function AdminListingsPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as StatusFilter) ?? "";

  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [pagination, setPagination] = useState<AdminPagination>({ total: 0, pages: 1, current: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminProperties({
        page,
        per_page: 20,
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });
      setProperties(result.properties);
      setPagination(result.pagination);
    } catch {
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    void load();
  }, [load]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateAdminPropertyStatus(id, newStatus);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (property: AdminProperty) => {
    if (!confirm(`Delete "${property.title}"? This is permanent.`)) return;
    setUpdatingId(property.id);
    try {
      await deleteAdminProperty(property.id);
      setProperties((prev) => prev.filter((p) => p.id !== property.id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch {
      setError("Failed to delete property.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => properties, [properties]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Listings</h1>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Manage and moderate all property listings.
          </p>
        </div>
        <div className="text-[11px] text-slate-500 font-medium self-end">
          {pagination.total} total
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-800 text-red-400 rounded-xl text-[12px]">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-[12px] text-slate-200 placeholder-slate-500 outline-none focus:border-violet-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-[12px] text-slate-300 outline-none focus:border-violet-600"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-800">
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-5 py-3">Host</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Change Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {loading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No listings found.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition"
                  >
                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveImageUrl(p.images?.[0] ?? "", FALLBACK_IMAGE)}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 max-w-[200px] truncate">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ⭐ {p.rating_average.toFixed(1)} ({p.rating_count})
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Host */}
                    <td className="px-5 py-4 text-slate-400">{p.host_name}</td>

                    {/* Location */}
                    <td className="px-5 py-4 text-slate-400 max-w-[120px] truncate">
                      {p.location || "—"}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-slate-300 font-semibold">
                      ${p.price}<span className="text-[10px] font-normal text-slate-500">/night</span>
                    </td>

                    {/* Current status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Status selector */}
                    <td className="px-5 py-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        disabled={updatingId === p.id}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none focus:border-violet-600 disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/properties/${p.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                          title="View listing"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={updatingId === p.id}
                          className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition disabled:opacity-50"
                          title="Delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              Page {pagination.current} of {pagination.pages} &nbsp;&middot;&nbsp; {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages || loading}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
