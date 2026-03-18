"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, MessageCircle, LifeBuoy, ShieldCheck, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { submitSupportRequest } from "@/lib/supportApi";

type BannerState = {
  type: "success" | "error";
  message: string;
} | null;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<BannerState>(null);

  const quickTips = useMemo(
    () => [
      "Include booking ID for faster support.",
      "Describe the issue in one short paragraph.",
      "Attach dates and property details when possible.",
    ],
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBanner(null);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setBanner({ type: "error", message: "Please complete all required fields." });
      return;
    }

    if (!isValidEmail(payload.email)) {
      setBanner({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitSupportRequest(payload);

      if (!result.success) {
        setBanner({ type: "error", message: result.message });
        return;
      }

      setBanner({ type: "success", message: result.message });
      setForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#eaf4f3] via-[#f6fbfb] to-white">
        <section className="relative overflow-hidden px-6 pt-16 pb-20">
          <div className="absolute -left-20 top-6 h-72 w-72 rounded-full bg-[#2C5F5D]/14 blur-[90px]" />
          <div className="absolute right-[-80px] top-10 h-64 w-64 rounded-full bg-[#2C5F5D]/12 blur-[80px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C5F5D]">
                  Customer Care
                </p>
                <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                  Real help from real humans, whenever you need it.
                </h1>
                <p className="mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
                  From booking questions to host support, we are here to guide you quickly and clearly.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: <MessageCircle className="h-5 w-5" />, text: "Fast response time" },
                    { icon: <LifeBuoy className="h-5 w-5" />, text: "24/7 assistance" },
                    { icon: <ShieldCheck className="h-5 w-5" />, text: "Secure support handling" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="inline-flex items-center gap-3 rounded-2xl border border-[#d2e5e4] bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                    >
                      <span className="text-[#2C5F5D]">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#d4e7e6] bg-white/95 p-6 shadow-sm backdrop-blur md:p-8">
                <h2 className="text-xl font-semibold text-slate-900">Quick Contact</h2>
                <p className="mt-2 text-sm text-slate-600">Reach us through your preferred channel.</p>

                <div className="mt-6 space-y-4">
                  {[
                    { icon: <Mail className="h-5 w-5" />, title: "Email", desc: "support@propbnb.com" },
                    { icon: <Phone className="h-5 w-5" />, title: "Phone", desc: "+94 77 123 4567" },
                    { icon: <MapPin className="h-5 w-5" />, title: "Office", desc: "45 Galle Road, Colombo" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#deeceb] bg-[#f8fcfc] px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-[#2C5F5D]">{item.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                          <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-16 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-[#d4e7e6] bg-white p-7 shadow-sm md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-600">Tell us what happened, and our team will follow up shortly.</p>

            {banner && (
              <div
                className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                  banner.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {banner.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-[#cfe3e2] px-4 py-3 text-sm outline-none focus:border-[#2C5F5D]"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-[#cfe3e2] px-4 py-3 text-sm outline-none focus:border-[#2C5F5D]"
                />
              </div>

              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#cfe3e2] px-4 py-3 text-sm outline-none focus:border-[#2C5F5D]"
              />

              <textarea
                name="message"
                placeholder="Describe your issue"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full resize-none rounded-xl border border-[#cfe3e2] px-4 py-3 text-sm outline-none focus:border-[#2C5F5D]"
              />

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#2C5F5D] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2C5F5D]/20 transition hover:bg-[#244f4d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <aside className="rounded-3xl border border-[#d4e7e6] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Tips for faster help</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {quickTips.map((tip) => (
                <li key={tip} className="rounded-xl border border-[#e2efee] bg-[#f8fcfc] px-3 py-2">
                  {tip}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
