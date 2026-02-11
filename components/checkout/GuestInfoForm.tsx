// components/checkout/GuestInfoForm.tsx
export default function GuestInfoForm() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Guest Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ">First Name</label>
          <input
            className="w-full bg-white  border border-slate-200  rounded-lg p-3 focus:ring-2 focus:ring-[#2C5F5D] focus:border-transparent outline-none transition-all"
            placeholder="John"
            type="text"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ">Last Name</label>
          <input
            className="w-full bg-white  border border-slate-200  rounded-lg p-3 focus:ring-2 focus:ring-[#2C5F5D] focus:border-transparent outline-none transition-all"
            placeholder="Doe"
            type="text"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-slate-700 ">Email Address</label>
          <input
            className="w-full bg-white  border border-slate-200  rounded-lg p-3 focus:ring-2 focus:ring-[#2C5F5D] focus:border-transparent outline-none transition-all"
            placeholder="john@example.com"
            type="email"
          />
        </div>
      </div>
    </div>
  )
}