import { MoreVertical } from "lucide-react";

// components/property/BookingSidebar.tsx
export default function BookingSidebar() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 ">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-2xl font-bold text-slate-900 ">$1,250</span>
          <span className="text-slate-500"> / night</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold">
          <span className="material-symbols-outlined text-[#2C5F5D] text-base" style={{fontVariationSettings: "'FILL' 1"}}>
            star
          </span>
          <span>4.92</span>
          <span className="text-slate-400 font-normal underline">(128)</span>
        </div>
      </div>

      <div className="border border-slate-300  rounded-xl overflow-hidden mb-6">
        <div className="grid grid-cols-2 border-b border-slate-300 ">
          <div className="p-3 border-r border-slate-300  hover:bg-slate-50 cursor-pointer transition-colors bg-[#2C5F5D]/5">
            <label className="block text-[10px] font-extrabold uppercase text-[#2C5F5D]">Check-in</label>
            <p className="text-sm">Dec 12, 2023</p>
          </div>
          <div className="p-3 hover:bg-slate-50  cursor-pointer transition-colors">
            <label className="block text-[10px] font-extrabold uppercase text-slate-900 ">Checkout</label>
            <p className="text-sm">Dec 17, 2023</p>
          </div>
        </div>
        <div className="p-3 hover:bg-slate-50 cursor-pointer transition-colors">
          <label className="block text-[10px] font-extrabold uppercase text-slate-900 ">Guests</label>
          <div className="flex items-center justify-between">
            <p className="text-sm">4 guests</p>
            <span className="material-symbols-outlined text-slate-400"><MoreVertical /></span>
          </div>
        </div>
      </div>

      <div className="mb-6 p-2 bg-slate-50  rounded-lg">
        <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 px-1">Selected Dates</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          <span className="text-[10px] text-slate-400">M</span>
          <span className="text-[10px] text-slate-400">T</span>
          <span className="text-[10px] text-slate-400">W</span>
          <span className="text-[10px] text-slate-400">T</span>
          <span className="text-[10px] text-slate-400">F</span>
          <span className="text-[10px] text-slate-400">S</span>
          <span className="text-[10px] text-slate-400">S</span>
          <span className="text-[10px]">10</span>
          <span className="text-[10px]">11</span>
          <span className="text-[10px] calendar-selected">12</span>
          <span className="text-[10px] bg-[#2C5F5D]/20">13</span>
          <span className="text-[10px] bg-[#2C5F5D]/20">14</span>
          <span className="text-[10px] bg-[#2C5F5D]/20">15</span>
          <span className="text-[10px] bg-[#2C5F5D]/20">16</span>
          <span className="text-[10px] calendar-selected">17</span>
          <span className="text-[10px]">18</span>
          <span className="text-[10px]">19</span>
        </div>
      </div>

      <button className="w-full bg-[#2C5F5D] hover:bg-[#234b4a] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#2C5F5D]/20 transition-all active:scale-95 mb-4">
        Reserve Now
      </button>
      <p className="text-center text-sm text-slate-500 mb-6">You won&apos;t be charged yet</p>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-slate-600 ">
          <span className="underline">$1,250 x 5 nights</span>
          <span>$6,250</span>
        </div>
        <div className="flex justify-between text-slate-600 ">
          <span className="underline">Cleaning fee</span>
          <span>$350</span>
        </div>
        <div className="flex justify-between text-slate-600 ">
          <span className="underline">StayHub service fee</span>
          <span>$845</span>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200  flex justify-between font-bold text-lg text-slate-900 ">
        <span>Total before taxes</span>
        <span>$7,445</span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
        <span className="material-symbols-outlined text-sm">flag</span>
        <a className="underline hover:text-slate-600 transition-colors" href="#">
          Report this listing
        </a>
      </div>
    </div>
  )
}