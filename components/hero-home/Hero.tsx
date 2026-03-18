"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
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

  const totalGuests = useMemo(() => guests.adults + guests.children, [guests]);

  useEffect(() => {
    const closePanelsOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCalendar(false);
        setShowGuests(false);
      }
    };

    window.addEventListener("keydown", closePanelsOnEscape);
    return () => window.removeEventListener("keydown", closePanelsOnEscape);
  }, []);

  const formatDate = (date?: Date) => {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const updateGuest = (type: keyof typeof guests, value: number) => {
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
    if (totalGuests > 0) params.append("guests", totalGuests.toString());

    const query = params.toString();
    router.push(query ? `/properties?${query}` : "/properties");
    setShowCalendar(false);
    setShowGuests(false);
  };

  return (
    <section className="relative flex min-h-[640px] items-center justify-center px-4 py-16 text-white sm:px-6 md:min-h-[720px]">
      <Image
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop"
        alt="Scenic mountain destination"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-30 mx-auto w-full max-w-6xl">
        <h1 className="mb-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
          Experience the extraordinary
        </h1>
        <p className="mb-10 max-w-2xl text-base text-gray-200 sm:text-lg md:text-xl">
          Find unique spaces and connect with local hosts worldwide.
        </p>

        <form
          onSubmit={handleSearch}
          className="relative rounded-3xl bg-white p-2 text-black shadow-xl"
        >
          <div className="grid grid-cols-1 gap-1 md:grid-cols-12">
            <div className="rounded-2xl px-4 py-3 md:col-span-4 md:border-r">
              <label className="text-xs font-semibold">WHERE</label>
              <input
                type="text"
                placeholder="Search destinations"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setShowCalendar((prev) => !prev);
                setShowGuests(false);
              }}
              className="rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50 md:col-span-4 md:border-r"
            >
              <label className="pointer-events-none text-xs font-semibold">DATES</label>
              <div className="mt-1 text-sm text-gray-600">
                {range?.from
                  ? `${formatDate(range.from)} - ${range.to ? formatDate(range.to) : ""}`
                  : "Add dates"}
              </div>
            </button>

            <div className="flex items-center justify-between rounded-2xl px-4 py-3 md:col-span-4">
              <button
                type="button"
                onClick={() => {
                  setShowGuests((prev) => !prev);
                  setShowCalendar(false);
                }}
                className="text-left"
              >
                <label className="pointer-events-none text-xs font-semibold">WHO</label>
                <div className="mt-1 text-sm text-gray-600">
                  {totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
                </div>
              </button>

              <button
                type="submit"
                className="rounded-full bg-[#306966] p-3 text-white transition hover:bg-[#265451]"
                aria-label="Search properties"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {showCalendar && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-x-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:left-4 md:right-auto md:min-w-[640px]">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={2}
                className="text-sm"
              />
            </div>
          )}

          {showGuests && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-full rounded-2xl bg-white p-4 shadow-xl sm:w-80 sm:p-6">
              {(["adults", "children", "infants", "pets"] as Array<keyof typeof guests>).map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between border-b py-3 last:border-none"
                >
                  <div>
                    <p className="capitalize font-medium">{type}</p>
                    <p className="text-xs text-gray-500">
                      {type === "adults" && "Ages 13+"}
                      {type === "children" && "Ages 2-12"}
                      {type === "infants" && "Under 2"}
                      {type === "pets" && "Service animals only"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateGuest(type, -1)}
                      className="h-8 w-8 rounded-full border"
                    >
                      -
                    </button>
                    <span>{guests[type]}</span>
                    <button
                      type="button"
                      onClick={() => updateGuest(type, 1)}
                      className="h-8 w-8 rounded-full border"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

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
