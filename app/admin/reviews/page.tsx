"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAdminReviews,
  updateAdminReviewStatus,
  type AdminReview,
  type AdminPagination,
} from "@/lib/adminApi";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";

type ReviewStatus = "" | "pending" | "approved" | "rejected";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-900/50 text-emerald-300 border-emerald-700/40",
    pending:  "bg-amber-900/50 text-amber-300 border-amber-700/40",
    rejected: "bg-red-900/50 text-red-400 border-red-700/40",
  };
  const cls = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= rating ? "text-amber-400" : "text-slate-700"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-[11px] text-slate-500">{rating}/5</span>
    </div>
  );
}

export default function AdminReviewsPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as ReviewStatus) ?? "";

  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [pagination, setPagination] = useState<AdminPagination>({ total: 0, pages: 1, current: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>(initialStatus);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminReviews({
        page,
        per_page: 20,
        status: statusFilter || undefined,
      });
      setReviews(result.reviews);
      setPagination(result.pagination);
    } catch {
      setError("Failed to load reviews.");
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
      await updateAdminReviewStatus(id, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch {
      setError("Failed to update review status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.property_title.toLowerCase().includes(q) ||
        r.reviewer_name.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
    );
  }, [reviews, search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Reviews</h1>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Moderate guest reviews before they appear publicly.
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
            placeholder="Search by property or reviewer…"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-[12px] text-slate-200 placeholder-slate-500 outline-none focus:border-violet-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReviewStatus)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-[12px] text-slate-300 outline-none focus:border-violet-600"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Review cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-[12px]">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-[12px]">No reviews found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left: review content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <StatusBadge status={r.status} />
                    <StarRating rating={r.rating} />
                  </div>

                  <div className="text-[13px] font-semibold text-slate-200 mb-0.5">
                    {r.property_title}
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">
                    by {r.reviewer_name} &middot; #{r.id}
                  </div>

                  {r.comment && (
                    <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-3">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  )}

                  {r.host_reply && (
                    <div className="mt-2 pl-3 border-l-2 border-slate-700">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                        Host reply
                      </div>
                      <p className="text-[11px] text-slate-500">{r.host_reply}</p>
                    </div>
                  )}
                </div>

                {/* Right: actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleStatusChange(r.id, "approved")}
                    disabled={updatingId === r.id || r.status === "approved"}
                    className={[
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition",
                      r.status === "approved"
                        ? "bg-emerald-900/30 text-emerald-400 border border-emerald-700/40 cursor-default"
                        : "bg-slate-800 hover:bg-emerald-900/40 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-700/40 disabled:opacity-50",
                    ].join(" ")}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleStatusChange(r.id, "pending")}
                    disabled={updatingId === r.id || r.status === "pending"}
                    className={[
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition",
                      r.status === "pending"
                        ? "bg-amber-900/30 text-amber-400 border border-amber-700/40 cursor-default"
                        : "bg-slate-800 hover:bg-amber-900/30 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-700/40 disabled:opacity-50",
                    ].join(" ")}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Pending
                  </button>

                  <button
                    onClick={() => handleStatusChange(r.id, "rejected")}
                    disabled={updatingId === r.id || r.status === "rejected"}
                    className={[
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition",
                      r.status === "rejected"
                        ? "bg-red-900/30 text-red-400 border border-red-700/40 cursor-default"
                        : "bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-700/40 disabled:opacity-50",
                    ].join(" ")}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500">
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
  );
}
