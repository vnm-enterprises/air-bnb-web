export default function AuthActions() {
  return (
    <>
      <button className="hidden sm:flex cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        Log In
      </button>
      <button className="hidden sm:flex bg-[#2C5F5D] text-white text-sm cursor-pointer font-bold px-6 py-2.5 rounded-full shadow-lg shadow-[#2C5F5D]/20 hover:shadow-[#2C5F5D]/30 transition-all active:scale-95">
        Sign Up
      </button>
    </>
  );
}
