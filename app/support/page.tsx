"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message submitted (UI only demo)");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#f4f7f7] to-white">

        {/* HERO */}
        <section className="relative py-24 text-center px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900">
              We’re here to help.
            </h1>
            <p className="text-lg text-gray-600 mt-6">
              Whether you&apos;re booking your next stay or hosting
              your first property, our team is ready to assist.
            </p>
          </div>

          {/* Decorative blur */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#306966]/10 blur-[120px] rounded-full pointer-events-none" />
        </section>

        {/* CONTENT */}
        <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* FORM */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl p-10">

            <h2 className="text-2xl font-semibold mb-8">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="border rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#306966] outline-none transition"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="border rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#306966] outline-none transition"
                />
              </div>

              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#306966] outline-none transition"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#306966] outline-none transition resize-none"
              />

              <button
                type="submit"
                className="bg-[#306966] hover:bg-[#255a58] text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* CONTACT CARDS */}
          <div className="space-y-8">

            {[
              {
                icon: <Mail size={22} />,
                title: "Email Support",
                desc: "support@propbnb.com",
              },
              {
                icon: <Phone size={22} />,
                title: "Call Us",
                desc: "+94 77 123 4567",
              },
              {
                icon: <MapPin size={22} />,
                title: "Office",
                desc: "45 Galle Road, Colombo",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all"
              >
                <div className="text-[#306966] mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="bg-white py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6 text-left">

              {[
                {
                  q: "How do I cancel a booking?",
                  a: "You can cancel bookings from your profile dashboard. Cancellation policies will apply depending on the property.",
                },
                {
                  q: "How do I become a host?",
                  a: "Click on 'Become a Host' and complete the onboarding steps to list your property.",
                },
                {
                  q: "When will I be charged?",
                  a: "Payments are processed securely at the time of booking confirmation.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="border rounded-2xl p-6 hover:shadow-md transition"
                >
                  <h3 className="font-medium text-lg">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                    {faq.a}
                  </p>
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
