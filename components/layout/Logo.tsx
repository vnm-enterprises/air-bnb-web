export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[#2C5F5D]">
        <svg
          className="w-9 h-9"
          fill="none"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        StayFound
      </h1>
    </div>
  );
}
