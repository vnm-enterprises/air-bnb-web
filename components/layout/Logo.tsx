/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Logo(path: any) {
  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">

      {/* Icon */}
      <div className="relative w-9 h-9">
        <svg
          viewBox="0 0 24 24"
          className={`w-9 h-9  ${path !== '/' ? ' text-black' : 'text-white' }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Location Pin */}
          <path
            d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
            fill="currentColor"
            opacity="0.25"
          />

          {/* House inside pin */}
          <path
            d="M9 13v-3l3-2 3 2v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="10.5"
            y="12"
            width="3"
            height="3"
            rx="0.5"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Text */}
      <h1 className={`text-xl font-semibold tracking-tight  ${path !== '/' ? ' text-black' : 'text-white' }`}>
        Stay <span className="text-[#2C5F5D] font-extrabold">Found</span>
      </h1>
    </div>
  );
}
