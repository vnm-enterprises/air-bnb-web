"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdminBookings,
  updateAdminBookingStatus,
  type AdminBooking,
  type AdminPagination,
} from "@/lib/adminApi";
import Link from "next/link";
import { Search, Eye } from "lucide-react";

type BookingStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed" | "refunded" | "";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:   "bg-amber-900/50 text-amber-300 border-amber-700/40",
    approved:  "bg-blue-900/50 text-blue-300 border-blue-700/40",
    completed: "bg-emerald-900/50 text-emerald-300 border-emerald-700/40",
    rejected:  "bg-red-900/50 text-red-400 border-red-700/40",
    cancelled: "bg-slate-800 text-slate-400 border-slate-700",
    refunded:  "bg-violet-900/50 text-violet-300 border-violet-700/40",
  };
  const cls = map[status] ?? map.cancelled;
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [pagination, setPagination] = useState<AdminPagination>({ total: 0, pages: 1, current: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus>("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminBookings({
        page,
        per_page: 20,
        status: statusFilter || undefined,
      });
      setBookings(result.bookings);
      setPagination(result.pagination);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateAdminBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch {
      setError("Failed to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.property_title.toLowerCase().includes(q) ||
        b.traveler_name.toLowerCase().includes(q)
    );
  }, [bookings, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Bookings</h1>
          <p className="text-[12px] text-slate-400 mt-0.5">
            View and manage all platform bookings.
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
            placeholder="Search by property or traveler…"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-[12px] text-slate-200 placeholder-slate-500 outline-none focus:border-violet-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BookingStatus)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-[12px] text-slate-300 outline-none focus:border-violet-600"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-800">
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-5 py-3">Traveler</th>
                <th className="text-left px-5 py-3">Dates</th>
                <th className="text-left px-5 py-3">Guests</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Change</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {loading && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No bookings found.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-200 max-w-[200px] truncate">
                        {b.property_title}
                      </div>
                      <div className="text-[10px] text-slate-500">#{b.id}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{b.traveler_name}</td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(b.check_in)} → {formatDate(b.check_out)}
                    </td>
                    <td className="px-5 py-4 text-slate-400">{b.guest_count}</td>
                    <td className="px-5 py-4 text-slate-300 font-semibold">
                      ${Number(b.total_price).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        disabled={updatingId === b.id}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none focus:border-violet-600 disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        title="View booking details"
                        aria-label="View booking details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <div>Page {pagination.current} of {pagination.pages} &middot; {pagination.total} results</div>
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
