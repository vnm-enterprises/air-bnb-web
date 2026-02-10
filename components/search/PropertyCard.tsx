import { Heart } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function PropertyCard({ property, onViewMap }: any){
  return (
    <div
      className="group flex flex-col md:flex-row gap-6
      bg-white
      rounded-2xl border border-slate-200
      p-3 hover:shadow-2xl hover:shadow-[#2C5F5D]/5
      transition-all duration-300 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative w-full md:w-72 h-52 rounded-xl overflow-hidden shrink-0">

        <img
          src={property.image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Superhost */}
        {property.superhost && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#2C5F5D] shadow-sm">
            SUPERHOST
          </div>
        )}

        {/* Favorite */}
        <button className="absolute top-3 right-3 p-2.5 bg-black/20 hover:bg-[#2C5F5D]/90 backdrop-blur-md rounded-full text-white transition-all">
          <Heart />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col justify-between py-2 pr-2">

        <div>
          {/* TOP ROW */}
          <div className="flex items-center justify-between mb-2">

            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {property.type}
            </span>

            <div className="flex items-center gap-1.5 text-sm font-bold bg-slate-50  px-2 py-1 rounded-lg">
              ⭐ {property.rating}
              <span className="text-slate-400 font-medium text-xs">
                ({property.reviews})
              </span>
            </div>
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-extrabold text-slate-800  group-hover:text-[#2C5F5D] transition-colors">
            {property.title}
          </h3>

          {/* DETAILS */}
          <p className="text-sm font-medium text-slate-500 mt-2">
            {property.details}
          </p>

          {/* AMENITIES */}
          <div className="mt-4 flex flex-wrap gap-2">
            {property.amenities?.map((a: string) => (
              <span
                key={a}
                className="bg-slate-100  text-[11px] font-bold text-slate-600 px-3 py-1 rounded-full"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* PRICE + BUTTON */}
        <div className="flex items-end justify-between mt-6">
          <div>
            <p className="text-2xl font-extrabold text-slate-900 ">
              ${property.price}
              <span className="text-sm font-bold text-slate-400">
                {" "} / night
              </span>
            </p>

            {property.total && (
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight underline underline-offset-4 mt-0.5">
                ${property.total} total
              </p>
            )}
          </div>

          <button className="bg-[#2C5F5D] hover:bg-[#234b4a] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#2C5F5D]/20">
            View Details
          </button>

        </div>
      </div>
    </div>
  );
}
