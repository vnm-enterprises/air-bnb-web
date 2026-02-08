"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto text-center px-4">
        <div className="inline-flex items-center justify-center size-16 bg-[#2E5E59]/10  rounded-2xl mb-6">
          <span className="material-symbols-outlined text-[#2E5E59]  text-3xl">
            <Mail />
          </span>
        </div>
        <h3 className="text-4xl font-black text-slate-900  mb-4">
          Your next journey begins here
        </h3>
        <p className="text-slate-500 mb-10 text-lg font-medium">
          Subscribe to receive exclusive offers and handpicked travel guides.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-white  rounded-2xl shadow-xl border border-slate-100 ">
          <input
            className="flex-1 rounded-xl border-none bg-transparent px-6 py-4 focus:ring-0 text-slate-900 font-medium"
            placeholder="Enter your email address"
            type="email"
          />
          <button className="bg-[#2E5E59] text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all" onClick={handleSubmit}>
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
}
