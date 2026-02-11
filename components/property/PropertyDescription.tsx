import { ChevronRight } from "lucide-react";

// components/property/PropertyDescription.tsx
export default function PropertyDescription() {
  return (
    <div className="py-8 border-b border-slate-200  space-y-4">
      <p className="text-slate-700  leading-relaxed text-lg">
        Welcome to your private oasis in the heart of Malibu. This architectural masterpiece offers panoramic views of the Pacific Ocean through floor-to-ceiling glass walls. Designed with a focus on minimalism and natural materials, every corner of this villa exudes tranquility.
      </p>
      <button className="text-slate-900  font-bold underline flex items-center gap-1">
        Show more <span className="material-symbols-outlined text-lg"><ChevronRight /></span>
      </button>
    </div>
  )
}