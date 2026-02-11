export default function Breadcrumbs() {
  return (
    <div className="px-6 py-3 my-5 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      <span className="hover:text-[#2C5F5D] cursor-pointer">Home</span>
      <span>›</span>
      <span className="hover:text-[#2C5F5D] cursor-pointer">United Kingdom</span>
      <span>›</span>
      <span className="text-slate-700 ">London</span>
    </div>
  );
}
