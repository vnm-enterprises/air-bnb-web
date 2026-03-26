"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getPropertyById,
  updateProperty,
  type Property,
} from "@/infrastructure/services/property-service";

type ListingStatus = "active" | "pending" | "hidden";

type EditFormState = {
  title: string;
  description: string;
  location: string;
  price: string;
  maxGuests: string;
  bedrooms: string;
  bathrooms: string;
  status: ListingStatus;
  amenities: string;
};

const INITIAL_FORM: EditFormState = {
  title: "",
  description: "",
  location: "",
  price: "",
  maxGuests: "1",
  bedrooms: "1",
  bathrooms: "1",
  status: "pending",
  amenities: "",
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return fallback;
}

function normalizeStatus(status: string | undefined): ListingStatus {
  const value = (status || "").toLowerCase();

  if (["active", "approved", "published"].includes(value)) {
    return "active";
  }

  if (["hidden", "inactive", "rejected", "suspended"].includes(value)) {
    return "hidden";
  }

  return "pending";
}

function mapPropertyToForm(property: Property): EditFormState {
  return {
    title: property.title || "",
    description: property.description || "",
    location: property.location || "",
    price: String(Number(property.price || 0)),
    maxGuests: String(Math.max(1, Number(property.max_guests || 1))),
    bedrooms: String(Math.max(1, Number(property.bedrooms || 1))),
    bathrooms: String(Math.max(1, Number(property.bathrooms || 1))),
    status: normalizeStatus(property.status),
    amenities: Array.isArray(property.amenities) ? property.amenities.join(", ") : "",
  };
}

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { loading: authLoading, isAuthenticated, isHost } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<EditFormState>(INITIAL_FORM);

  const propertyId = useMemo(() => {
    const raw = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const parsed = Number(raw);

    return Number.isFinite(parsed) ? parsed : NaN;
  }, [params]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !isHost()) {
      router.replace("/login?redirect=/host/listings");
      return;
    }

    if (!Number.isFinite(propertyId) || propertyId <= 0) {
      setError("Invalid listing ID.");
      setLoading(false);
      return;
    }

    let active = true;

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPropertyById(propertyId);

        if (!active) {
          return;
        }

        setForm(mapPropertyToForm(response.data));
      } catch (fetchError: unknown) {
        if (!active) {
          return;
        }

        setError(getErrorMessage(fetchError, "Failed to load property details."));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchProperty();

    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated, isHost, propertyId, router]);

  const handleChange = (field: keyof EditFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!Number.isFinite(propertyId) || propertyId <= 0) {
      setError("Invalid listing ID.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const amenities = form.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await updateProperty(propertyId, {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        price: Number(form.price || 0),
        max_guests: Math.max(1, Number(form.maxGuests || 1)),
        bedrooms: Math.max(1, Number(form.bedrooms || 1)),
        bathrooms: Math.max(1, Number(form.bathrooms || 1)),
        status: form.status,
        amenities,
      });

      setSuccess("Property updated successfully.");

      setTimeout(() => {
        router.push("/host/listings");
      }, 700);
    } catch (saveError: unknown) {
      setError(getErrorMessage(saveError, "Failed to update property."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading listing details...
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2C5F5D]">Listing Editor</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit Property</h1>
          </div>

          <Link
            href="/host/listings"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Listings
          </Link>
        </div>

        {error && (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Title</label>
              <input
                value={form.title}
                onChange={(event) => handleChange("title", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => handleChange("description", event.target.value)}
                rows={5}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Location</label>
              <input
                value={form.location}
                onChange={(event) => handleChange("location", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Price Per Night (USD)</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => handleChange("price", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={form.status}
                onChange={(event) => handleChange("status", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Max Guests</label>
              <input
                type="number"
                min="1"
                value={form.maxGuests}
                onChange={(event) => handleChange("maxGuests", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Bedrooms</label>
              <input
                type="number"
                min="1"
                value={form.bedrooms}
                onChange={(event) => handleChange("bedrooms", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Bathrooms</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={form.bathrooms}
                onChange={(event) => handleChange("bathrooms", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Amenities (comma separated)</label>
              <input
                value={form.amenities}
                onChange={(event) => handleChange("amenities", event.target.value)}
                placeholder="WiFi, Pool, Kitchen"
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="mt-7 flex items-center justify-end gap-3">
            <Link
              href="/host/listings"
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-[#2C5F5D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#244f4d] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
