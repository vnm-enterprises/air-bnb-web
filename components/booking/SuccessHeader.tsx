import { CheckCircle } from "lucide-react";

// components/booking/SuccessHeader.tsx
export default function SuccessHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="bg-[#2C5F5D]/10 p-4 rounded-full mb-4">
        <span className="material-symbols-outlined text-[#2C5F5D] text-5xl"><CheckCircle /></span>
      </div>
      <h1 className="text-[#111717] tracking-tight text-3xl font-bold leading-tight pb-2">
        Booking Confirmed!
      </h1>
      <p className="text-[#628483] text-base font-normal leading-normal px-8">
        Pack your bags! Your stay at Seaside Modern Villa is confirmed. We&apos;ve sent the details to your email.
      </p>
    </div>
  )
}