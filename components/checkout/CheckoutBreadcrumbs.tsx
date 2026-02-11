import { ChevronRight } from "lucide-react";

// components/checkout/CheckoutBreadcrumbs.tsx
export default function CheckoutBreadcrumbs() {
  return (
    <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
      <a className="hover:text-[#2C5F5D] transition-colors flex items-center gap-1" href="#">
        Search Results
      </a>
      <span className="material-symbols-outlined text-xs"><ChevronRight /></span>
      <a className="hover:text-[#2C5F5D] transition-colors" href="#">Property Details</a>
      <span className="material-symbols-outlined text-xs"><ChevronRight /></span>
      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2C5F5D]/10 text-[#2C5F5D] rounded-full">
        <span className="size-1.5 rounded-full bg-[#2C5F5D]"></span>
        <span className="font-bold">Checkout</span>
      </div>
    </nav>
  )
}