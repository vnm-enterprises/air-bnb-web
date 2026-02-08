export default function AuthActions() {
  return (
    <>
    <button className="hidden sm:flex border border-[#2C5F5D] text-[#ffffff] text-sm cursor-pointer font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-[#2C5F5D]/20 hover:shadow-[#2C5F5D]/30 transition-all active:scale-95">
        Log In
      </button>
      <button
        className="hidden sm:flex text-sm font-semibold px-6 py-2.5 rounded-lg"
        style={{
          backgroundColor: "#2E5E59",
          color: "#FFFFFF",
        }}
      >
        Sign Up

      </button>

    </>
  );
}
