// components/checkout/TripDetailsCard.tsx
export default function TripDetailsCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2C5F5D]">event</span>
          Your Trip
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dates</span>
            <p className="font-medium">Oct 12 – Oct 17, 2023</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Guests</span>
            <p className="font-medium">2 guests</p>
          </div>
        </div>
      </div>
    </div>
  )
}