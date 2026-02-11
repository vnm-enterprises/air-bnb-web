// components/booking/ReservationCard.tsx
import { Calendar } from 'lucide-react'
import BookingDetails from './BookingDetails'

export default function ReservationCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[#2C5F5D] text-xs font-bold tracking-wider uppercase">BOOKING ID: #BK-9921</p>
              <h3 className="text-[#111717] text-xl font-bold leading-tight mt-1">
                Seaside Modern Villa
              </h3>
              <p className="text-[#628483]  text-sm font-normal flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm"><Calendar /></span>
                Oct 12 - Oct 15, 2023 • 2 Guests
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#2C5F5D]/10 text-[#2C5F5D] hover:bg-[#2C5F5D]/20 transition-colors text-sm font-semibold gap-2">
                <span className="material-symbols-outlined text-lg">download</span>
                Download Receipt
              </button>
              <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#2C5F5D]/10 text-[#2C5F5D] hover:bg-[#2C5F5D]/20 transition-colors text-sm font-semibold gap-2">
                <span className="material-symbols-outlined text-lg">share</span>
                Share Trip
              </button>
            </div>
          </div>
          <div
            className="w-full md:w-48 h-32 md:h-auto bg-center bg-no-repeat bg-cover rounded-lg shadow-inner"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPXjEB9ZPO_Zbbcci-Ez8PE1v6xhB513c5WboB_Vo7WciKko7pAsld0C3S5e3hMV5bC81RPln6hQocscVOn25kohMr31UWHvTxeBW3TjdTnmW5F8v8jzfS9mQ6Y6itHWSjGeKFflba2hwlgCzdH8XgOsLbwrRTYVAqpn5g0XpW5EKqQ4T6dle72CmsF-5-J62BFjWsN0Bhw-w6WkVpHO-yqN2K3wbd_XTvwYUGQXJrINInn3JS1yG9sgnAhisBiWO0SGmEHeqCVRVM")'
            }}
          ></div>
        </div>

        <BookingDetails />
      </div>
    </div>
  )
}