"use client";

import { Mail, CheckCircle, X } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setOpen(true);
    setEmail("");

    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  return (
    <>
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center justify-center size-16 bg-[#2E5E59]/10 rounded-2xl mb-6">
            <Mail className="text-[#2E5E59] w-8 h-8" />
          </div>

          <h3 className="text-4xl font-black text-slate-900 mb-4">
            Your next journey begins here
          </h3>

          <p className="text-slate-500 mb-10 text-lg font-medium">
            Subscribe to receive exclusive offers and handpicked travel guides.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 p-1.5 bg-white rounded-2xl shadow-xl border border-slate-100"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border-none bg-transparent px-6 py-4 focus:ring-0 text-slate-900 font-medium outline-none"
              placeholder="Enter your email address"
              type="email"
              required
            />

            <button
              type="submit"
              className="bg-[#2E5E59] text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-[#2C5F5D]/20 hover:brightness-110 transition-all"
            >
              Join Now
            </button>
          </form>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => setOpen(false)}
          />

          {/* MODAL */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-[#2E5E59]" />
            </div>

            <h4 className="text-2xl font-bold text-slate-900 mb-3">
              You’re all set 🎉
            </h4>

            <p className="text-slate-500 text-sm">
              Thank you for joining!
              Please check your email to confirm your subscription.
            </p>

          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
