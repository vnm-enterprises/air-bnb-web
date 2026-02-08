/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";


type ActiveField = "where" | "dates" | "guests" | null;
type Mode = "dates" | "months" | "flexible";

export default function HeroSearchBar() {
  const [active, setActive] = useState<ActiveField>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const datePanelRef = useRef<HTMLDivElement>(null);
  const guestPanelRef = useRef<HTMLDivElement>(null);
  const whereInputRef = useRef<HTMLInputElement>(null);

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });

  const totalGuests = guests.adults + guests.children + guests.infants;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        barRef.current?.contains(target) ||
        datePanelRef.current?.contains(target) ||
        guestPanelRef.current?.contains(target)
      ) {
        return;
      }
      setActive(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        ref={barRef}
        className="relative z-20 w-full max-w-4xl
          bg-white
          rounded-2xl md:rounded-full
          shadow-2xl p-2
          flex flex-col md:flex-row items-stretch md:items-center"
      >
        <SearchField
          label="Where"
          active={active === "where"}
          onClick={() => {
            setActive("where");
            whereInputRef.current?.focus();
          }}
        >
          <input
            ref={whereInputRef}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search destinations"
            className="w-full bg-transparent outline-none
              text-sm font-semibold
              text-slate-900
              placeholder:text-slate-400"
          />
        </SearchField>

        <Divider active={active !== null} />

        <SearchField
          label="Dates"
          active={active === "dates"}
          onClick={() => setActive("dates")}
        >
          <span className="text-sm font-medium text-slate-500">
            {checkIn && checkOut
              ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
              : "Add dates"}
          </span>
        </SearchField>

        <Divider active={active !== null} />

        <SearchField
          label="Who"
          active={active === "guests"}
          onClick={() => setActive("guests")}
        >
          <span className="text-sm font-medium text-slate-500">
            {totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
          </span>
        </SearchField>

        <button
          className="ml-0 md:ml-2 mt-2 md:mt-0
            flex items-center justify-center gap-2
            rounded-full px-5 py-4
            font-bold text-white
            bg-[#2C5F5D]
            hover:brightness-110 active:scale-95"
        >
          <Search size={18} />
          <span className="md:hidden">Search</span>
        </button>
      </div>

      {active === "dates" && (
        <FloatingPanel ref={datePanelRef} align="center">
          <Calendar
            checkIn={checkIn}
            checkOut={checkOut}
            onSelect={(start, end) => {
              setCheckIn(start);
              setCheckOut(end);
            }}
          />
        </FloatingPanel>
      )}

      {active === "guests" && (
        <FloatingPanel ref={guestPanelRef} align="right">
          <GuestRow
            label="Adults"
            sub="Ages 13+"
            value={guests.adults}
            onChange={(v) => setGuests({ ...guests, adults: v })}
          />
          <GuestRow
            label="Children"
            sub="Ages 2–12"
            value={guests.children}
            onChange={(v) => setGuests({ ...guests, children: v })}
          />
          <GuestRow
            label="Infants"
            sub="Under 2"
            value={guests.infants}
            onChange={(v) => setGuests({ ...guests, infants: v })}
          />
        </FloatingPanel>
      )}
    </>
  );
}


function Calendar({
  checkIn,
  checkOut,
  onSelect,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (start: Date, end: Date | null) => void;
}) {
  const [mode, setMode] = useState<Mode>("dates");
  const currentDate = new Date(2026, 1, 8);

  return (
    <div className="w-full min-h-[460px]">

      <div className="flex justify-center mb-8">
        <div className="flex rounded-full bg-slate-100  p-1">
          <Tab active={mode === "dates"} onClick={() => setMode("dates")}>
            Dates
          </Tab>
          <Tab active={mode === "months"} onClick={() => setMode("months")}>
            Months
          </Tab>
          <Tab active={mode === "flexible"} onClick={() => setMode("flexible")}>
            Flexible
          </Tab>
        </div>
      </div>

      {mode === "dates" && (
        <DateGrid checkIn={checkIn} checkOut={checkOut} onSelect={onSelect} />
      )}
      {mode === "months" && (
        <MonthPicker
          currentDate={currentDate}
          onSelect={onSelect}
          checkIn={checkIn}
          checkOut={checkOut}
        />
      )}
      {mode === "flexible" && (
        <FlexiblePicker
          currentDate={currentDate}
          onSelect={onSelect}
          checkIn={checkIn}
          checkOut={checkOut}
        />
      )}
    </div>
  );
}


function DateGrid({
  checkIn,
  checkOut,
  onSelect,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (start: Date, end: Date | null) => void;
}) {
  const today = new Date(2026, 1, 8);
  const months = [0, 1].map((offset) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + offset);
    return d;
  });

  const handleFlexibility = (days: number) => {
    if (!checkIn || !checkOut) return;

    const newCheckIn = new Date(checkIn);
    newCheckIn.setDate(newCheckIn.getDate() - days);

    const newCheckOut = new Date(checkOut);
    newCheckOut.setDate(newCheckOut.getDate() + days);

    onSelect(newCheckIn, newCheckOut);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {months.map((month) => (
        <MonthView
          key={month.toISOString()}
          month={month}
          checkIn={checkIn}
          checkOut={checkOut}
          onSelect={onSelect}
        />
      ))}
      <div className="col-span-2 mt-6 flex flex-wrap justify-center gap-2">
        <FlexButton onClick={() => handleFlexibility(0)}>Exact dates</FlexButton>
        <FlexButton onClick={() => handleFlexibility(1)}>± 1 day</FlexButton>
        <FlexButton onClick={() => handleFlexibility(2)}>± 2 days</FlexButton>
        <FlexButton onClick={() => handleFlexibility(3)}>± 3 days</FlexButton>
        <FlexButton onClick={() => handleFlexibility(7)}>± 7 days</FlexButton>
        <FlexButton onClick={() => handleFlexibility(14)}>± 14 days</FlexButton>
      </div>
    </div>
  );
}

function MonthView({
  month,
  checkIn,
  checkOut,
  onSelect,
}: {
  month: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (start: Date, end: Date | null) => void;
}) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, monthIndex, d));
  }

  const isSame = (a?: Date | null, b?: Date | null) =>
    a && b && a.toDateString() === b.toDateString();

  const inRange = (d: Date) =>
    checkIn && checkOut && d > checkIn && d < checkOut;

  return (
    <div>
      <h4 className="text-center font-semibold mb-4">
        {month.toLocaleString("default", { month: "long" })} {year}
      </h4>

      <div className="grid grid-cols-7 text-xs text-slate-500 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`day-${i}`} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2">
        {days.map((date, i) =>
          date ? (
            <button
              key={i}
              onClick={() => {
                if (!checkIn) {
                  onSelect(date, null);
                } else if (!checkOut) {
                  if (date < checkIn) {
                    onSelect(date, checkIn);
                  } else if (date.toDateString() === checkIn.toDateString()) {
                    onSelect(date, null);
                  } else {
                    onSelect(checkIn, date);
                  }
                } else {
                  onSelect(date, null);
                }
              }}
              className={`
                h-10 w-10 mx-auto rounded-full text-sm
                transition
                ${
                  isSame(date, checkIn) || isSame(date, checkOut)
                    ? "bg-[#2C5F5D] text-white"
                    : inRange(date)
                    ? "bg-[#2C5F5D]/15"
                    : "hover:bg-slate-100 "
                }
              `}
            >
              {date.getDate()}
            </button>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  );
}

function MonthPicker({
  currentDate,
  onSelect,
  checkIn,
  checkOut,
}: {
  currentDate: Date;
  onSelect: (start: Date, end: Date) => void;
  checkIn: Date | null;
  checkOut: Date | null;
}) {
  const [monthsCount, setMonthsCount] = useState(1);
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const startDate = new Date(currentDate);
  const endDate = new Date(currentDate);
  endDate.setMonth(currentDate.getMonth() + monthsCount);

  const rangeText = `${formatDate(startDate)} to ${formatDate(endDate)}`;

  const handleSliderMove = (e: MouseEvent) => {
    if (!sliderRef.current || !dragging) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    let percent = (x / width) * 100;
    percent = Math.max(0, Math.min(100, percent));

    const months = Math.round((percent / 100) * 11) + 1;
    setMonthsCount(months);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (dragging) handleSliderMove(e);
    };

    const handleEnd = () => {
      setDragging(false);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [dragging]);

  useEffect(() => {
    onSelect(startDate, endDate);
  }, [monthsCount]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium mb-2">When&apos;s your trip?</h3>
        <div className="text-4xl font-bold">{monthsCount} {monthsCount === 1 ? 'month' : 'months'}</div>
      </div>

      <div className="relative w-full h-64 mb-8">
        <div
          ref={sliderRef}
          className="absolute inset-0 rounded-full border-2 border-[#2C5F5D]/20"
        >
          <div className="absolute inset-0 rounded-full border-2 border-[#2C5F5D]/20" />

          <div
            className="absolute inset-0 rounded-full border-2 border-[#2C5F5D] transition-all duration-300"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.sin((monthsCount / 12) * Math.PI * 2) * 45}% ${50 - Math.cos((monthsCount / 12) * Math.PI * 2) * 45}%, 50% 50%)`,
              transform: `rotate(${(monthsCount / 12) * 360 - 90}deg)`
            }}
          />

          <div
            ref={handleRef}
            className="absolute w-8 h-8 bg-[#2C5F5D] rounded-full shadow-lg cursor-pointer transition-transform"
            style={{
              left: `calc(50% + ${Math.sin((monthsCount / 12) * Math.PI * 2) * 40}px)`,
              top: `calc(50% - ${Math.cos((monthsCount / 12) * Math.PI * 2) * 40}px)`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseDown={(e: any) => {
              e.preventDefault();
              setDragging(true);
              document.body.style.cursor = 'grabbing';
              handleSliderMove(e);
            }}
          />
        </div>

        {[...Array(12)].map((_, i) => (
          <div
            key={`month-marker-${i}`}
            className="absolute w-2 h-2 bg-slate-300 rounded-full"
            style={{
              left: `calc(50% + ${Math.sin((i / 12) * Math.PI * 2) * 45}px)`,
              top: `calc(50% - ${Math.cos((i / 12) * Math.PI * 2) * 45}px)`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      <div className="text-center text-sm text-slate-500">
        {rangeText}
      </div>
    </div>
  );
}



function FlexiblePicker({
  currentDate,
  onSelect,
  checkIn,
  checkOut,
}: {
  currentDate: Date;
  onSelect: (start: Date, end: Date) => void;
  checkIn: Date | null;
  checkOut: Date | null;
}) {
  const [stayLength, setStayLength] = useState<"weekend" | "week" | "month" | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showMonths, setShowMonths] = useState(false);

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(2026, 1 + i, 1);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      label: date.toLocaleString('default', { month: 'long' }),
      full: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
    };
  });

  const handleStayLength = (length: "weekend" | "week" | "month") => {
    setStayLength(length);
    setShowMonths(true);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);

    const start = new Date(2026, 1 + monthIndex, 1);
    const end = new Date(2026, 2 + monthIndex, 0);

    onSelect(start, end);
  };

  const getRangeText = () => {
    if (!stayLength || selectedMonth === null) return "";

    const start = new Date(2026, 1 + selectedMonth, 1);
    const end = new Date(2026, 2 + selectedMonth, 0);

    return `${formatDate(start)} to ${formatDate(end)}`;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">

      <div className="mb-8">
        <h3 className="text-center text-lg font-medium mb-4">How long would you like to stay?</h3>
        <div className="flex justify-center gap-3">
          {["Weekend", "Week", "Month"].map((length) => (
            <button
              key={length}
              onClick={() => handleStayLength(length.toLowerCase() as any)}
              className={`px-5 py-3 rounded-full border font-medium transition-all ${
                stayLength === length.toLowerCase()
                  ? "bg-[#2C5F5D] text-white border-[#2C5F5D]"
                  : "border-slate-300 hover:border-[#2C5F5D] "
              }`}
            >
              {length}
            </button>
          ))}
        </div>
      </div>

      {showMonths && (
        <div>
          <h3 className="text-center text-lg font-medium mb-4">Go anytime</h3>
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory">
            {months.map((month, index) => (
              <button
                key={month.full}
                onClick={() => handleMonthSelect(index)}
                className={`flex-shrink-0 snap-center w-40 h-32 rounded-xl border-2 p-4 transition-all ${
                  selectedMonth === index
                    ? "border-[#2C5F5D] bg-[#2C5F5D]/5"
                    : "border-slate-200 hover:border-[#2C5F5D] "
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="font-medium text-center">{month.label}</div>
                  <div className="text-sm text-slate-500">{month.year}</div>
                </div>
              </button>
            ))}
          </div>

          {selectedMonth !== null && (
            <div className="text-center text-sm text-slate-500 mt-4">
              {getRangeText()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}



function GuestRow({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div>
        <div className="font-medium">{label}</div>
        {sub && <div className="text-xs text-slate-500">{sub}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-8 w-8 rounded-full border flex items-center justify-center"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="h-8 w-8 rounded-full border flex items-center justify-center"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}


const SearchField = ({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <div
    onClick={onClick}
    className={`flex-1 flex flex-col items-start
      px-8 py-3 rounded-full cursor-pointer transition-all
      ${
        active
          ? "bg-slate-100  shadow-md"
          : "hover:bg-slate-100 "
      }`}
  >
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
      {label}
    </span>
    {children}
  </div>
);

const Divider = ({ active }: { active: boolean }) => (
  <div
    className={`hidden md:block w-px h-8 ${
      active ? "bg-transparent" : "bg-slate-200 "
    }`}
  />
);

const FloatingPanel = ({
  children,
  align,
  ref,
}: {
  children: React.ReactNode;
  align: "center" | "right";
  ref?: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={ref as any}
    className={`fixed top-[140px] z-[9999]
      bg-white
      rounded-2xl shadow-2xl p-6
      ${
        align === "center"
          ? "left-1/2 -translate-x-1/2 w-[760px]"
          : "right-[max(2rem,10vw)] w-[360px]"
      }`}
  >
    {children}
  </div>
);

const Tab = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium ${
      active ? "bg-white shadow" : "text-slate-500"
    }`}
  >
    {children}
  </button>
);

const FlexButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-full border border-slate-300
      text-sm hover:bg-slate-100
      transition-colors"
  >
    {children}
  </button>
);



function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}