import { Verified } from "lucide-react";

// components/property/HostInfoCard.tsx
export default function HostInfoCard() {
  return (
    <div className="py-8">
      <div className="bg-slate-50  p-6 rounded-2xl border border-slate-200 ">
        <div className="flex items-start gap-4 mb-4">
          <img
            className="size-12 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA21Krhb8RE-L67errRNzWdXBzijRsfHjFGpv-uuaUBhvBOjvnJSXR3yYVYaBldi8j_VZFV0wpBgWwgshovZTUohpPvQLsVyAVqbA4oObqH7KoVBlNQ5wfQaW4eYYrASfhjEJS690gld3tZ4fD5OS7JRT_sXksJdM5LBhzvcgqGX28-BNO5mkNbYzXjycfsXhgAeu_9YqdTBDzkvh5CzUIc3wWPNPpqa15cd_NiE50_m4MDVT_sKvNz6CoMFuVYP-3EqYsEZnk3Ktho"
          />
          <div>
            <h4 className="font-bold text-lg flex items-center gap-1">
              Hosted by Julian
              <span className="material-symbols-outlined text-[#2C5F5D] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>
                <Verified />
              </span>
            </h4>
            <p className="text-sm text-slate-500">Joined in May 2018</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Reviews</p>
            <p className="text-lg font-bold">482</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Rating</p>
            <p className="text-lg font-bold">4.9 ★</p>
          </div>
        </div>
        <button className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-lg font-bold">
          Contact Host
        </button>
      </div>
    </div>
  )
}