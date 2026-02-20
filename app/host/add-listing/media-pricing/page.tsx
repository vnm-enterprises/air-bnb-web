"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CloudUpload, ChevronLeft, ChevronRight, Plus, Camera } from "lucide-react";

type DayCell = { day: number; inMonth: boolean };

export default function HostMediaPricingPage() {
  // Pricing
  const [baseRate, setBaseRate] = useState(0);
  const [weekendRate, setWeekendRate] = useState(0);
  const [cleaning, setCleaning] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [instantBooking, setInstantBooking] = useState(true);

  // Calendar (October 2024)
  const [monthIndex, setMonthIndex] = useState(9); // 0=Jan, 9=Oct
  const [year, setYear] = useState(2024);

  // Selected days (looks like your UI)
  const [selected, setSelected] = useState<number[]>([10, 11, 12, 13, 14, 15, 16]);

  const monthName = useMemo(() => {
    const d = new Date(year, monthIndex, 1);
    return d.toLocaleString("en-US", { month: "long" });
  }, [year, monthIndex]);

  const grid = useMemo(() => buildMonthGrid(year, monthIndex), [year, monthIndex]);

  return (
    <div className="min-h-screen bg-[#f6f4f4] text-slate-900">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-slate-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold">HostStay</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-[11px] font-semibold text-slate-600">
            <Link href="/host/dashboard" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/host/listings" className="hover:text-slate-900">
              Listings
            </Link>
            <Link href="/host/bookings" className="hover:text-slate-900">
              Bookings
            </Link>
            <Link href="/host/messages" className="hover:text-slate-900">
              Messages
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center"
              aria-label="Notifications"
            >
              🔔
            </button>
            <button
              className="w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center"
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Page */}
      <main>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Add Property</h1>
              <p className="text-[12px] text-slate-500 mt-1">
                Step 2: Media &amp; Pricing. Let&apos;s make your listing shine.
              </p>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-600">
                Step 2 of 3: Media &amp; Pricing
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-[#2C5F5D]" style={{ width: "66%" }} />
          </div>

          {/* Layout */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Photos */}
              <section className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[12px] font-bold text-slate-900">Property Photos</h2>
                  <span className="text-[10px] text-slate-400 font-semibold">Min 5 Photos</span>
                </div>

                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                  <div className="relative h-[150px] bg-gradient-to-r from-[#2C5F5D]/40 via-[#d8eadf] to-[#2C5F5D]/50">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                      <div className="w-10 h-10 rounded-full bg-white/85 border border-white/70 flex items-center justify-center">
                        <CloudUpload className="w-5 h-5 text-slate-700" />
                      </div>
                      <div className="mt-3 text-[12px] font-bold text-slate-900">
                        Drag and drop photos here
                      </div>
                      <div className="mt-1 text-[10px] text-slate-600">
                        or browse files from your computer
                      </div>
                      <div className="mt-2 text-[9px] text-slate-500">JPG, PNG, HEIC Max 10MB</div>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-4 gap-3 bg-white">
                    <Thumb
                      filled
                      img="https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=800&q=80"
                      badge="COVER PHOTO"
                    />
                    <Thumb
                      filled
                      img="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
                    />
                    <Thumb />
                    <Thumb />
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-[12px] font-bold text-slate-900">Pricing Details</h2>

                <div className="mt-4 space-y-4">
                  <MoneyField label="Base Nightly Rate" value={baseRate} onChange={setBaseRate} />

                  <div className="grid grid-cols-2 gap-3">
                    <MoneyField label="Weekend Rate" value={weekendRate} onChange={setWeekendRate} />
                    <MoneyField label="Cleaning Fee" value={cleaning} onChange={setCleaning} />
                  </div>

                  <MoneyField
                    label="Security Deposit (Optional)"
                    value={securityDeposit}
                    onChange={setSecurityDeposit}
                  />

                  <div className="pt-1 flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-slate-700">
                      Allow instant booking
                    </div>
                    <Toggle checked={instantBooking} onChange={setInstantBooking} />
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <div>
              <section className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[12px] font-bold text-slate-900">Availability</h2>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goPrev(setMonthIndex, setYear)}
                      className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => goNext(setMonthIndex, setYear)}
                      className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-center text-[12px] font-semibold text-slate-700">
                  {monthName} {year}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2 text-[10px] text-slate-400 font-semibold">
                  {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
                    <div key={d} className="text-center">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-7 gap-2">
                  {grid.map((cell, idx) => {
                    const isSel = cell.inMonth && selected.includes(cell.day);
                    const isDark = isSel && [10, 11, 12].includes(cell.day);

                    return (
                      <button
                        key={idx}
                        disabled={!cell.inMonth}
                        onClick={() => cell.inMonth && toggleDay(cell.day, selected, setSelected)}
                        className={[
                          "h-9 rounded-md text-[11px] font-semibold transition flex items-center justify-center",
                          cell.inMonth
                            ? "border border-slate-200 hover:bg-slate-50"
                            : "border border-transparent text-slate-300 cursor-default",
                          isSel
                            ? isDark
                              ? "bg-[#1f4f4d] text-white border-[#1f4f4d]"
                              : "bg-[#2C5F5D] text-white border-[#2C5F5D]"
                            : "bg-white text-slate-700",
                        ].join(" ")}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 text-[10px] text-slate-500 leading-relaxed flex gap-2">
                  <span>💡</span>
                  <span>
                    Tip: Block out dates when it&apos;s unavailable to avoid double bookings.
                  </span>
                </div>
              </section>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-8 border-t border-slate-200 pt-6 flex items-center justify-between">
            <Link
              href="/host/add-property/basics"
              className="inline-flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 transition text-[11px] font-semibold px-4 py-2 rounded-md text-slate-700"
            >
              Back
            </Link>

            <div className="flex items-center gap-4">
              <button className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition">
                Save Draft
              </button>

              <Link
                href="/host/add-property/review"
                className="bg-[#2C5F5D] hover:bg-[#244f4d] transition text-white text-[11px] font-semibold px-4 py-2 rounded-md"
              >
                Complete Listing
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Components */
function Thumb({
  filled,
  img,
  badge,
}: {
  filled?: boolean;
  img?: string;
  badge?: string;
}) {
  return (
    <div className="relative h-[56px] rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
      {filled && img ? (
        <img src={img} alt="Photo" className="w-full h-full object-cover" />
      ) : (
        <Camera className="w-4 h-4 text-slate-400" />
      )}

      {badge && (
        <span className="absolute left-2 bottom-2 text-[8px] font-bold tracking-widest bg-white/90 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      {filled && (
        <button
          className="absolute right-2 top-2 w-5 h-5 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center"
          aria-label="Add"
        >
          <Plus className="w-3 h-3 text-slate-600" />
        </button>
      )}
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-slate-700">{label}</label>
      <div className="mt-2 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-slate-400">
          $
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          className="w-full h-10 pl-7 pr-3 rounded-md border border-slate-200 bg-white text-[12px] outline-none focus:border-slate-300"
        />
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "w-11 h-6 rounded-full border transition flex items-center px-1",
        checked ? "bg-[#2C5F5D] border-[#2C5F5D]" : "bg-slate-200 border-slate-200",
      ].join(" ")}
      aria-label="Toggle"
    >
      <span
        className={[
          "w-4 h-4 rounded-full bg-white shadow-sm transition",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

/* Calendar helpers */
function buildMonthGrid(year: number, monthIndex: number): DayCell[] {
  const first = new Date(year, monthIndex, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - startWeekday + 1;
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;

    cells.push({
      day: inMonth
        ? dayNum
        : dayNum < 1
        ? prevMonthDay(year, monthIndex, dayNum)
        : dayNum - daysInMonth,
      inMonth,
    });
  }
  return cells;
}

function prevMonthDay(year: number, monthIndex: number, dayNum: number) {
  const prevDays = new Date(year, monthIndex, 0).getDate();
  return prevDays + dayNum;
}

function toggleDay(day: number, selected: number[], setSelected: (v: number[]) => void) {
  if (selected.includes(day)) setSelected(selected.filter((d) => d !== day));
  else setSelected([...selected, day].sort((a, b) => a - b));
}

function goPrev(
  setMonthIndex: React.Dispatch<React.SetStateAction<number>>,
  setYear: React.Dispatch<React.SetStateAction<number>>
) {
  setMonthIndex((m) => {
    if (m === 0) {
      setYear((y) => y - 1);
      return 11;
    }
    return m - 1;
  });
}

function goNext(
  setMonthIndex: React.Dispatch<React.SetStateAction<number>>,
  setYear: React.Dispatch<React.SetStateAction<number>>
) {
  setMonthIndex((m) => {
    if (m === 11) {
      setYear((y) => y + 1);
      return 0;
    }
    return m + 1;
  });
}