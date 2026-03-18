"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, MessageCircle, LifeBuoy, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3500);

    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#edf5f5] via-white to-white">
        <section className="relative overflow-hidden border-b border-[#d8e8e7] px-6 py-20">
          <div className="absolute -left-20 top-8 h-80 w-80 rounded-full bg-[#2C5F5D]/12 blur-[90px]" />
          <div className="absolute -right-20 bottom-4 h-72 w-72 rounded-full bg-[#2C5F5D]/10 blur-[90px]" />

          <div className="relative mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2C5F5D]">Support</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold text-slate-900 md:text-5xl">
              Friendly help whenever you need it
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-600">
              Our team can guide you through bookings, payments, hosting, and account issues quickly.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: <MessageCircle className="h-5 w-5" />, text: "Fast responses" },
                { icon: <LifeBuoy className="h-5 w-5" />, text: "24/7 assistance" },
                { icon: <ShieldCheck className="h-5 w-5" />, text: "Secure support" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl border border-[#d7e8e7] bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                >
                  <span className="text-[#2C5F5D]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-[#d7e8e7] bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-600">Tell us what happened and we will get back to you.</p>

            {success && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                Message sent successfully. Our support team will contact you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-[#d0e4e4] px-4 py-3 text-sm outline-none focus:border-[#2C5F5D]"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-[#d0e4e4] px-4 py-3 text-sm outline-none focus:border-[#2C5F5D]"
                />
              </div>

              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#d0e4e4] px-4 py-3 text-sm outline-none focus:border-[#2C5F5D]"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full resize-none rounded-xl border border-[#d0e4e4] px-4 py-3 text-sm outline-none focus:border-[#2C5F5D]"
              />

              <button
                type="submit"
                className="rounded-full bg-[#2C5F5D] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2C5F5D]/20 transition hover:bg-[#244f4d]"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-5">
            {[
              {
                icon: <Mail className="h-5 w-5" />, title: "Email Support", desc: "support@propbnb.com",
              },
              {
                icon: <Phone className="h-5 w-5" />, title: "Call Us", desc: "+94 77 123 4567",
              },
              {
                icon: <MapPin className="h-5 w-5" />, title: "Office", desc: "45 Galle Road, Colombo",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#d7e8e7] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 text-[#2C5F5D]">{item.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[#e1efee] bg-white py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-center text-3xl font-semibold text-slate-900">Frequently Asked Questions</h2>

            <div className="mt-10 space-y-4">
              {[
                {
                  q: "How do I cancel a booking?",
                  a: "Open your dashboard, select the booking, and choose cancel. Policy terms may apply depending on the listing.",
                },
                {
                  q: "How can I become a host?",
                  a: "Go to host onboarding from your dashboard and complete property details, pricing, and verification.",
                },
                {
                  q: "When do payments get processed?",
                  a: "Payments are securely processed when the booking is confirmed and reflected in your booking history.",
                },
              ].map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-[#dcebea] bg-[#f8fcfc] p-5">
                  <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
