import { Verified } from "lucide-react";

// components/property/HostHeader.tsx
export default function HostHeader() {
  return (
    <div className="flex items-center justify-between pb-8 border-b border-slate-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 ">Entire villa hosted by Julian</h2>
        <p className="text-slate-600  mt-1">10 guests · 5 bedrooms · 6 beds · 5.5 baths</p>
      </div>
      <div className="relative">
        <img
          className="size-14 rounded-full object-cover border-2 border-[#2C5F5D]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsDcGKLFlgTKozoRC2xKRpuvimPC4lg_ZI_vgPVMe9nN218eu_RKREJm-t93hF3Domn8jglRMRAt3WcGRfYov3o7GqutIPectWgtwPLM-033c-KAqRhGYOgCLgTTopLQ0bNuNjgTfiaZwDreNcIeHLrLVt0zEQJaEBbdH0AwLNtw86wpeH-WU2wkLI6qS-HAKJhMB-I52X4P0RgtdukfnA1QlhHSgWPcV5fMImJJbAPAYU-IkHlpmb-6Z69dTHV--AiE2sztSmmkg-"
        />
        <div className="absolute -bottom-1 -right-1 bg-[#2C5F5D] text-white size-6 rounded-full flex items-center justify-center border-2 border-white">
          <span className="material-symbols-outlined text-[10px]" style={{fontVariationSettings: "'FILL' 1"}}>
            <Verified />
          </span>
        </div>
      </div>
    </div>
  )
}