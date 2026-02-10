export default function ResultsHeader() {
  return (
    <div className="px-6 py-4 flex mb-2 flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 ">
      <h1 className="text-xl font-extrabold">300+ stays in London</h1>

      <div className="flex items-center gap-6">
        <button className="text-sm font-bold text-[#2C5F5D] border-b-2 border-[#2C5F5D] pb-1">
          Recommended
        </button>
        <button className="text-sm font-bold text-slate-400 hover:text-slate-600">
          Price: Low to High
        </button>
      </div>
    </div>
  );
}
