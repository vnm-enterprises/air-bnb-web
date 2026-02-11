// components/booking/BookingDetails.tsx
export default function BookingDetails() {
  return (
    <div className="mt-8 border-t border-gray-100 pt-4">
      <div className="flex justify-between gap-x-6 py-3 border-b border-gray-50 ">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2C5F5D] text-sm">login</span>
          <p className="text-[#628483] text-sm font-normal">Check-in</p>
        </div>
        <p className="text-[#111717] text-sm font-semibold">3:00 PM</p>
      </div>
      <div className="flex justify-between gap-x-6 py-3 border-b border-gray-50 ">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2C5F5D] text-sm">logout</span>
          <p className="text-[#628483] text-sm font-normal">Check-out</p>
        </div>
        <p className="text-[#111717] text-sm font-semibold">11:00 AM</p>
      </div>
      <div className="flex justify-between gap-x-6 py-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2C5F5D] text-sm">payments</span>
          <p className="text-[#628483] text-sm font-normal">Total Paid</p>
        </div>
        <p className="text-[#111717] text-sm font-bold">$750.00</p>
      </div>
    </div>
  )
}