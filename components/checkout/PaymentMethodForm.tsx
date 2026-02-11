import { CreditCard, Info, Wallet } from "lucide-react";

// components/checkout/PaymentMethodForm.tsx
export default function PaymentMethodForm() {
  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Payment Method</h3>
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-slate-400"><CreditCard /></span>
          <span className="material-symbols-outlined text-slate-400"><Wallet /></span>
        </div>
      </div>

      <div className="bg-white  border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="relative">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 absolute top-2 left-3">Card Number</label>
          <input
            className="w-full pt-8 pb-3 px-3 bg-slate-50  border-none rounded-lg focus:ring-2 focus:ring-[#2C5F5D] outline-none"
            placeholder="0000 0000 0000 0000"
            type="text"
          />
          <span className="material-symbols-outlined absolute right-3 bottom-3 text-slate-400">credit_card</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 absolute top-2 left-3">Expiry Date</label>
            <input
              className="w-full pt-8 pb-3 px-3 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#2C5F5D] outline-none"
              placeholder="MM/YY"
              type="text"
            />
          </div>
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 absolute top-2 left-3">CVV</label>
            <input
              className="w-full pt-8 pb-3 px-3 bg-slate-50  border-none rounded-lg focus:ring-2 focus:ring-[#2C5F5D] outline-none"
              placeholder="123"
              type="text"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-[#2C5F5D]/10 border border-[#2C5F5D]/20 rounded-lg flex gap-3">
        <span className="material-symbols-outlined text-[#2C5F5D]"><Info /></span>
        <p className="text-sm text-slate-600 ">
          Your card will be charged once the host accepts the booking.
        </p>
      </div>

      <button className="w-full bg-[#2C5F5D] hover:bg-[#234b4a] text-white font-bold py-4 rounded-xl text-lg transition-transform active:scale-[0.98] shadow-lg shadow-[#2C5F5D]/25">
        Confirm and Pay
      </button>

      <p className="text-center text-xs text-slate-500 px-8 leading-relaxed">
        By selecting the button above, you agree to the <a className="underline" href="#">Property Rules</a>, <a className="underline" href="#">Guest Refund Policy</a>, and the <a className="underline" href="#">Terms of Service</a>.
      </p>
    </div>
  )
}