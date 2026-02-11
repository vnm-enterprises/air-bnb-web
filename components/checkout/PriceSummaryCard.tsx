import { Shield, Verified } from "lucide-react";

// components/checkout/PriceSummaryCard.tsx
export default function PriceSummaryCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <div
            className="size-24 rounded-lg bg-center bg-cover flex-shrink-0"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiq_wwGMgV0wYSrWnG4x831LLvUK04CxQaHh1Z9fTkg-ms1JT1yQWD2K5KwC-M_CS_HmV5WLZwBAVQaZUP6VYW7OmxrjkbgOlkpvmU_nDlaQVw9ojzP03CDulchCQhGqdinTBzAGhlTGldDwRDQfmLardyXqJPXlzhHhZpdTsKy0E1pwf5dQavrGIpyXYGt5JzFRLNcIBVbCKA0Ud2WClOHU69g1pFdM0rJyR3pFwOJDLZ0eg3kJ5SCafb3MDrqVdG91hES-6157kq')"
            }}
          ></div>
          <div className="flex flex-col justify-between py-1">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Entire Villa</p>
              <h4 className="font-bold text-lg leading-snug">Modern Beachside Villa</h4>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold">
              <span className="material-symbols-outlined text-yellow-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>
                star
              </span>
              <span>4.95</span>
              <span className="text-slate-400 font-normal ml-1">(128 reviews)</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-100  mb-6"/>

        <h4 className="font-bold text-lg mb-4">Price Details</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-slate-600 ">
            <span>£120 x 5 nights</span>
            <span>£600.00</span>
          </div>
          <div className="flex justify-between text-slate-600 ">
            <span className="flex items-center gap-1 underline decoration-dotted">
              Service fee
              <span className="material-symbols-outlined text-xs">help</span>
            </span>
            <span>£45.00</span>
          </div>
          <div className="flex justify-between text-slate-600 ">
            <span>Cleaning fee</span>
            <span>£25.00</span>
          </div>
        </div>

        <hr className="border-slate-100  my-6"/>

        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-extrabold text-slate-900 ">Total (GBP)</span>
          <span className="text-2xl font-extrabold text-slate-900 ">£670.00</span>
        </div>

        <div className="p-4 bg-slate-50  rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600"><Verified /></span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Price Guarantee</span>
          </div>
          <span className="material-symbols-outlined text-slate-300"><Shield /></span>
        </div>
      </div>
    </div>
  )
}