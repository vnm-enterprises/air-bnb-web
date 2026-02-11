import { Heart, Map, Share } from "lucide-react";

// components/property/PropertyHero.tsx
export default function PropertyHero() {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900  mb-2">
          Modern Minimalist Villa with Ocean View
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 ">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#2C5F5D] text-base" style={{fontVariationSettings: "'FILL' 1"}}>
              star
            </span>
            <span className="font-bold text-slate-900">4.92</span>
            <span>(128 reviews)</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">
              <Map />
            </span>
            <span className="underline font-medium">Malibu, California</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors text-sm font-semibold">
          <span className="material-symbols-outlined text-lg"><Share /></span> Share
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100  border-slate-200 transition-colors text-sm font-semibold">
          <span className="material-symbols-outlined text-lg"><Heart /></span> Save
        </button>
      </div>
    </div>
  )
}