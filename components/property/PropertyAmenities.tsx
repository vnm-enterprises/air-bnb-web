import { Cookie, SwissFrancIcon, Waves, Wifi } from "lucide-react";

// components/property/PropertyAmenities.tsx
export default function PropertyAmenities() {
  return (
    <div className="py-8 border-b border-slate-200 ">
      <h3 className="text-xl font-bold mb-6">What this place offers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        <div className="flex items-center gap-4 text-slate-700 ">
          <span className="material-symbols-outlined text-2xl text-slate-500"><Waves /></span>
          <span>Ocean view</span>
        </div>
        <div className="flex items-center gap-4 text-slate-700 ">
          <span className="material-symbols-outlined text-2xl text-slate-500"><Wifi /></span>
          <span>High-speed Wi-Fi</span>
        </div>
        <div className="flex items-center gap-4 text-slate-700 ">
          <span className="material-symbols-outlined text-2xl text-slate-500"><SwissFrancIcon /></span>
          <span>Private infinity pool</span>
        </div>
        <div className="flex items-center gap-4 text-slate-700 ">
          <span className="material-symbols-outlined text-2xl text-slate-500"><Cookie /></span>
          <span>Chef&apos;s kitchen</span>
        </div>
      </div>
      <button className="mt-8 border border-slate-900  px-6 py-3 rounded-lg font-bold hover:bg-slate-100  transition-colors">
        Show all 45 amenities
      </button>
    </div>
  )
}