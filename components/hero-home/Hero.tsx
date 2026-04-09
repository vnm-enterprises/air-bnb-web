"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import "react-day-picker/dist/style.css";

export default function Hero() {
  const router = useRouter();
  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);

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

  const hasOpenPanel = showCalendar || showGuests;

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
      [type]: Math.max(type === "adults" ? 1 : 0, prev[type] + value),
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
    <section
      className={`relative z-20 flex min-h-176 items-center justify-center overflow-x-hidden overflow-y-visible px-4 py-20 text-white sm:px-6 md:min-h-screen md:py-24 ${hasOpenPanel ? "pb-120 md:pb-96" : ""}`}
    >
      <Image
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop"
        alt="Scenic mountain destination"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/52" />
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/20 via-transparent to-slate-950/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_36%)]" />
      <div className="absolute -left-20 top-28 h-64 w-64 rounded-full bg-[#8ec5bb]/12 blur-3xl" />
      <div className="hero-orb absolute right-[8%] top-20 h-40 w-40 rounded-full border border-white/14 bg-white/6 backdrop-blur-sm" />
      <div className="absolute bottom-28 right-[12%] h-64 w-64 rounded-full bg-[#2C5F5D]/18 blur-3xl" />
      <div className="absolute left-1/2 top-24 h-28 w-28 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 blur-md" />
      <div className="absolute left-[6%] top-[22%] h-48 w-px bg-linear-to-b from-transparent via-white/30 to-transparent" />
      <div className="absolute right-[10%] top-[18%] h-60 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#0f2625]/55 via-[#0f2625]/15 to-transparent" />

      <div className="hero-float absolute left-[9%] top-[30%] hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 shadow-lg shadow-slate-950/10 backdrop-blur md:block">
        Curated escapes
      </div>
      <div className="hero-float hero-float-delay absolute right-[11%] top-[58%] hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 shadow-lg shadow-slate-950/10 backdrop-blur xl:block">
        Handpicked hosts
      </div>

      <div className="relative z-30 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <div className="mb-5 rounded-full border border-white/14 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur-md shadow-lg shadow-slate-950/10">
          Stay beautifully, book confidently
        </div>

        <h1 className="mb-5 max-w-4xl bg-[linear-gradient(96deg,#ffffff_8%,#d7fff4_52%,#4ec6af_100%)] bg-clip-text text-4xl font-semibold leading-[0.96] text-transparent [text-shadow:0_1px_18px_rgba(7,18,18,0.22)] sm:text-5xl md:text-7xl">
          Experience the extraordinary
        </h1>
        <p className="mb-6 max-w-3xl text-base text-gray-100/90 sm:text-lg md:text-[22px] md:leading-8">
          Find unique spaces and connect with local hosts worldwide.
        </p>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/84 md:text-[15px]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#8de0cf]" />
            2,000+ verified stays
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#8de0cf]" />
            Real-time availability
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#8de0cf]" />
            No hidden fees
          </span>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative w-full max-w-5xl rounded-[30px] border border-white/80 bg-white/96 p-2 text-black shadow-[0_24px_64px_rgba(15,23,42,0.22)] backdrop-blur"
        >
          <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0">
            <div className="flex-1 rounded-3xl px-4 py-2.5 transition md:rounded-none md:px-5 md:py-3 md:hover:bg-slate-50/75">
              <label className="block text-left text-[11px] font-bold tracking-[0.22em] text-slate-800">WHERE</label>
              <input
                type="text"
                placeholder="Search destinations"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full bg-transparent text-left text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mx-3 h-px bg-slate-200 md:mx-0 md:h-9 md:w-px md:bg-slate-200" />

            <button
              type="button"
              onClick={() => {
                setShowCalendar((prev) => !prev);
                setShowGuests(false);
              }}
              className="flex-1 rounded-3xl px-4 py-2.5 text-left transition md:rounded-none md:px-5 md:py-3 md:hover:bg-slate-50/75"
            >
              <label className="pointer-events-none block text-[11px] font-bold tracking-[0.22em] text-slate-800">DATES</label>
              <div className="mt-1 text-[15px] font-medium text-slate-600">
                {range?.from
                  ? `${formatDate(range.from)} - ${range.to ? formatDate(range.to) : ""}`
                  : "Add dates"}
              </div>
            </button>

            <div className="mx-3 h-px bg-slate-200 md:mx-0 md:h-9 md:w-px md:bg-slate-200" />

            <div className="flex flex-1 items-center justify-between rounded-3xl px-4 py-2.5 md:rounded-none md:px-5 md:py-3 md:hover:bg-slate-50/75">
              <button
                type="button"
                onClick={() => {
                  setShowGuests((prev) => !prev);
                  setShowCalendar(false);
                }}
                className="text-left"
              >
                <label className="pointer-events-none block text-[11px] font-bold tracking-[0.22em] text-slate-800">WHO</label>
                <div className="mt-1 text-[15px] font-medium text-slate-600">
                  {totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
                </div>
              </button>

              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#3b7a74] to-[#245955] text-white shadow-[0_10px_20px_rgba(44,95,93,0.28)] transition hover:scale-[1.02] hover:from-[#306966] hover:to-[#1f4d4a]"
                aria-label="Search properties"
              >
                <Search size={17} />
              </button>
            </div>
          </div>

          {showCalendar && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-x-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:left-4 md:right-auto md:min-w-160">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={2}
                disabled={{ before: today }}
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
          className="fixed inset-0 z-50"
          onClick={() => {
            setShowCalendar(false);
            setShowGuests(false);
          }}
        />
      )}
    </section>
  );
}
