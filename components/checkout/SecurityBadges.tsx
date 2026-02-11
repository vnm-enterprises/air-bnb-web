import { CreditCard, GoalIcon, Lock, Verified } from "lucide-react";

// components/checkout/SecurityBadges.tsx
export default function SecurityBadges() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-6 opacity-60">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-xl"><Lock /></span>
        <span className="text-xs font-bold uppercase tracking-tighter">SSL Secured</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-xl"><Verified /></span>
        <span className="text-xs font-bold uppercase tracking-tighter">Verified Host</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-xl"><CreditCard /></span>
        <span className="text-xs font-bold uppercase tracking-tighter">No Hidden Fees</span>
      </div>
    </div>
  )
}