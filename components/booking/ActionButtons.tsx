import { ArrowBigLeft } from "lucide-react";

// components/booking/ActionButtons.tsx
export default function ActionButtons() {
  return (
    <div className="flex flex-col gap-4 px-4 items-center">
      <button className="w-full max-w-sm flex items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#2C5F5D] text-white text-base font-bold leading-normal hover:opacity-90 transition-opacity">
        View My Trip
      </button>
      <a className="text-[#2C5F5D] text-sm font-semibold hover:underline flex items-center gap-1" href="#">
        <span className="material-symbols-outlined text-sm"><ArrowBigLeft /></span>
        Back to Home
      </a>
    </div>
  )
}