"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import "react-day-picker/dist/style.css";

export default function Hero() {
  const router = useRouter();

  const [range, setRange] = useState<DateRange | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [location, setLocation] = useState("");

  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const totalGuests = guests.adults + guests.children;

  const formatDate = (date?: Date) => {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const updateGuest = (
    type: keyof typeof guests,
    value: number
  ) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value),
    }));
  };

  const handleSearch = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const params = new URLSearchParams();
    const normalizedLocation = location.trim();

    if (normalizedLocation) params.append("location", normalizedLocation);
    if (range?.from) params.append("check_in", formatDate(range.from));
    if (range?.to) params.append("check_out", formatDate(range.to));
    if (totalGuests > 0)
      params.append("guests", totalGuests.toString());

    const query = params.toString();
    router.push(query ? `/properties?${query}` : "/properties");
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-white">

      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-30 max-w-6xl w-full px-6">

        <h1 className="text-4xl md:text-6xl font-semibold mb-4">
          Experience the extraordinary
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10">
          Find unique spaces and connect with local hosts worldwide.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-full shadow-lg flex flex-col md:flex-row overflow-hidden text-black relative"
        >

          {/* WHERE */}
          <div className="flex-1 px-6 py-4 border-b md:border-b-0 md:border-r">
            <label className="text-xs font-semibold">WHERE</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full outline-none text-sm mt-1"
            />
          </div>

          {/* DATES */}
          <div
            onClick={() => {
              setShowCalendar(true);
              setShowGuests(false);
            }}
            className="flex-1 px-6 py-4 border-b md:border-b-0 md:border-r cursor-pointer"
          >
            <label className="text-xs font-semibold">DATES</label>
            <div className="text-sm mt-1 text-gray-600">
              {range?.from
                ? `${formatDate(range.from)} - ${
                    range.to ? formatDate(range.to) : ""
                  }`
                : "Add dates"}
            </div>
          </div>

          {/* WHO */}
          <div
            onClick={() => {
              setShowGuests(true);
              setShowCalendar(false);
            }}
            className="flex-1 px-6 py-4 cursor-pointer flex justify-between items-center"
          >
            <div>
              <label className="text-xs font-semibold">WHO</label>
              <div className="text-sm mt-1 text-gray-600">
                {totalGuests > 0
                  ? `${totalGuests} guests`
                  : "Add guests"}
              </div>
            </div>

            <button
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="bg-[#306966] text-white p-3 rounded-full"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* CALENDAR POPUP */}
        {showCalendar && (
          <div
            className="absolute mt-4 bg-white rounded-xl shadow-xl p-6 text-black z-40"
            onClick={(e) => e.stopPropagation()}
          >
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
            />
          </div>
        )}

        {/* GUEST POPUP */}
        {showGuests && (
          <div
            className="absolute mt-4 right-6 bg-white rounded-xl shadow-xl p-6 text-black w-80 z-40"
            onClick={(e) => e.stopPropagation()}
          >
            {(
              ["adults", "children", "infants", "pets"] as Array<
                keyof typeof guests
              >
            ).map((type) => (
              <div
                key={type}
                className="flex justify-between items-center py-3 border-b last:border-none"
              >
                <div>
                  <p className="capitalize font-medium">{type}</p>
                  <p className="text-xs text-gray-500">
                    {type === "adults" && "Ages 13+"}
                    {type === "children" && "Ages 2–12"}
                    {type === "infants" && "Under 2"}
                    {type === "pets" && "Service animals only"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateGuest(type, -1)}
                    className="w-8 h-8 border rounded-full"
                  >
                    -
                  </button>
                  <span>{guests[type]}</span>
                  <button
                    onClick={() => updateGuest(type, 1)}
                    className="w-8 h-8 border rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OUTSIDE CLICK LAYER (BEHIND POPUPS) */}
      {(showCalendar || showGuests) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowCalendar(false);
            setShowGuests(false);
          }}
        />
      )}
    </section>
  );
}
