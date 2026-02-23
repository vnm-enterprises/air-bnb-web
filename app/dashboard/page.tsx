"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isTraveler, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Redirect if not authenticated or not a traveler
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isTraveler())) {
      router.push('/login');
    }
  }, [isAuthenticated, isTraveler, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
      </div>
    );
  }

  /* ---------------- USER BOOKINGS DATA ---------------- */

  const bookings = [
    {
      id: "BK-9821",
      title: "Modern Beachside Villa",
      location: "Malibu, California",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      checkIn: "Oct 12, 2023",
      checkOut: "Oct 17, 2023",
      guests: 2,
      total: 750,
      status: "upcoming",
    },
    {
      id: "BK-8742",
      title: "Luxury Forest Retreat",
      location: "Aspen, Colorado",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop",
      checkIn: "Sep 02, 2023",
      checkOut: "Sep 06, 2023",
      guests: 4,
      total: 1120,
      status: "completed",
    },
    {
      id: "BK-7651",
      title: "City Skyline Apartment",
      location: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=800&auto=format&fit=crop",
      checkIn: "Aug 10, 2023",
      checkOut: "Aug 12, 2023",
      guests: 2,
      total: 420,
      status: "cancelled",
    },
  ];

  const filtered = bookings.filter(
    (b) => b.status === activeTab
  );

  /* ---------------- UI ---------------- */

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f8fafc] py-14">
        <div className="max-w-6xl mx-auto px-6">

          {/* PAGE HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-slate-900">
              My Bookings
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Manage and review your stays.
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b mb-8">
            {["upcoming", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? "border-b-2 border-[#2C5F5D] text-[#2C5F5D]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* BOOKINGS LIST */}
          {filtered.length === 0 ? (
            <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800">
                No {activeTab} bookings
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                You don't have any {activeTab} stays at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row gap-6"
                >
                  {/* IMAGE */}
                  <img
                    src={booking.image}
                    alt={booking.title}
                    className="w-full md:w-56 h-40 object-cover rounded-xl"
                  />

                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {booking.title}
                      </h2>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <MapPin size={14} />
                        {booking.location}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                        <Calendar size={14} />
                        {booking.checkIn} – {booking.checkOut}
                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        {booking.guests} guests
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="text-lg font-semibold text-slate-900">
                        ${booking.total}
                      </div>

                      <div className="flex items-center gap-4">
                        <StatusBadge status={booking.status} />

                        <Link
                          href={`/booking/${booking.id}`}
                          className="px-4 py-2 text-sm bg-[#2C5F5D] text-white rounded-lg hover:bg-[#244f4d] transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }: any) {
  const styles: any = {
    upcoming: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-slate-200 text-slate-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

  /* ---------------- USER BOOKINGS DATA ---------------- */

  const bookings = [
    {
      id: "BK-9821",
      title: "Modern Beachside Villa",
      location: "Malibu, California",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      checkIn: "Oct 12, 2023",
      checkOut: "Oct 17, 2023",
      guests: 2,
      total: 750,
      status: "upcoming",
    },
    {
      id: "BK-8742",
      title: "Luxury Forest Retreat",
      location: "Aspen, Colorado",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop",
      checkIn: "Sep 02, 2023",
      checkOut: "Sep 06, 2023",
      guests: 4,
      total: 1120,
      status: "completed",
    },
    {
      id: "BK-7651",
      title: "City Skyline Apartment",
      location: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=800&auto=format&fit=crop",
      checkIn: "Aug 10, 2023",
      checkOut: "Aug 12, 2023",
      guests: 2,
      total: 420,
      status: "cancelled",
    },
  ];

  const filtered = bookings.filter(
    (b) => b.status === activeTab
  );

  /* ---------------- UI ---------------- */

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f8fafc] py-14">
        <div className="max-w-6xl mx-auto px-6">

          {/* PAGE HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-slate-900">
              My Bookings
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Manage and review your stays.
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b mb-8">
            {["upcoming", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? "border-b-2 border-[#2C5F5D] text-[#2C5F5D]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* BOOKINGS LIST */}
          {filtered.length === 0 ? (
            <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800">
                No {activeTab} bookings
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                You don’t have any {activeTab} stays at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row gap-6"
                >
                  {/* IMAGE */}
                  <img
                    src={booking.image}
                    alt={booking.title}
                    className="w-full md:w-56 h-40 object-cover rounded-xl"
                  />

                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {booking.title}
                      </h2>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <MapPin size={14} />
                        {booking.location}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                        <Calendar size={14} />
                        {booking.checkIn} – {booking.checkOut}
                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        {booking.guests} guests
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="text-lg font-semibold text-slate-900">
                        ${booking.total}
                      </div>

                      <div className="flex items-center gap-4">
                        <StatusBadge status={booking.status} />

                        <Link
                          href={`/booking/${booking.id}`}
                          className="px-4 py-2 text-sm bg-[#2C5F5D] text-white rounded-lg hover:bg-[#244f4d] transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }: any) {
  const styles: any = {
    upcoming: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-slate-200 text-slate-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
