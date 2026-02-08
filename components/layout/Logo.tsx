export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div style={{ color: "#EAF2F1" }}>
        <svg
          className="w-9 h-9"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <h1
        className="text-xl font-semibold tracking-tight"
        style={{ color: "#FFFFFF" }}
      >
        Stay Found
      </h1>
    </div>
  );
}
