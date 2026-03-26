"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdminUsers,
  updateAdminUserRole,
  deleteAdminUser,
  type AdminUser,
  type AdminPagination,
} from "@/lib/adminApi";
import { useAuth } from "@/context/AuthContext";
import { Search, Trash2 } from "lucide-react";

type RoleFilter = "" | "traveler" | "host" | "administrator";

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    administrator: "bg-violet-900/50 text-violet-300 border-violet-700/40",
    host:          "bg-blue-900/50 text-blue-300 border-blue-700/40",
    traveler:      "bg-slate-800 text-slate-400 border-slate-700",
  };
  const cls = map[role] ?? map.traveler;
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cls}`}>
      {role}
    </span>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<AdminPagination>({ total: 0, pages: 1, current: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminUsers({
        page,
        per_page: 20,
        role: roleFilter || undefined,
        search: search.trim() || undefined,
      });
      setUsers(result.users);
      setPagination(result.pagination);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, search]);

  const handleRoleChange = async (id: number, newRole: string) => {
    setUpdatingId(id);
    try {
      await updateAdminUserRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, roles: [newRole] } : u))
      );
    } catch {
      setError("Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    setUpdatingId(user.id);
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch {
      setError("Failed to delete user.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Users</h1>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Manage user accounts and roles.
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
            placeholder="Search by name or email…"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-[12px] text-slate-200 placeholder-slate-500 outline-none focus:border-violet-600"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-[12px] text-slate-300 outline-none focus:border-violet-600"
        >
          <option value="">All Roles</option>
          <option value="traveler">Traveler</option>
          <option value="host">Host</option>
          <option value="administrator">Administrator</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-800">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Registered</th>
                <th className="text-left px-5 py-3">Properties</th>
                <th className="text-left px-5 py-3">Bookings</th>
                <th className="text-left px-5 py-3">Change Role</th>
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
                    No users found.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  const primaryRole = u.roles[0] ?? "traveler";
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[11px] font-bold text-slate-300 shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-200">
                              {u.name}
                              {isSelf && (
                                <span className="ml-1.5 text-[9px] font-bold text-violet-400 bg-violet-900/40 px-1.5 py-0.5 rounded">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <RoleBadge role={primaryRole} />
                      </td>

                      {/* Registered */}
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                        {formatDate(u.registered)}
                      </td>

                      {/* Properties */}
                      <td className="px-5 py-4 text-slate-400">{u.property_count}</td>

                      {/* Bookings */}
                      <td className="px-5 py-4 text-slate-400">{u.booking_count}</td>

                      {/* Role change */}
                      <td className="px-5 py-4">
                        <select
                          value={primaryRole}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={updatingId === u.id || isSelf}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none focus:border-violet-600 disabled:opacity-40"
                        >
                          <option value="traveler">Traveler</option>
                          <option value="host">Host</option>
                          <option value="administrator">Administrator</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={updatingId === u.id || isSelf}
                          className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition disabled:opacity-30"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
