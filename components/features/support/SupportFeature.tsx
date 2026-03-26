"use client";

import { LifeBuoy, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { useSupportForm } from "@/application/hooks/use-support-form";

export function SupportFeature() {
  const { form, submitting, banner, quickTips, handleChange, handleSubmit } = useSupportForm();
  const faqs = [
    {
      question: "How long does it take to receive a response?",
      answer: "Most requests receive a reply within 30 minutes. During peak hours, it may take up to 2 hours.",
    },
    {
      question: "How can I cancel or change a booking?",
      answer: "Open your booking confirmation, select Manage booking, and follow the cancellation or date-change flow.",
    },
    {
      question: "What details should I include in a support request?",
      answer: "Share your booking ID, property name, travel dates, and a short description of the issue for faster resolution.",
    },
    {
      question: "Where can I report a payment issue?",
      answer: "Use the form on this page and choose a clear payment-related subject so our billing team can prioritize it.",
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-linear-to-b from-[#eaf4f3] via-[#f6fbfb] to-white">
        <section className="relative overflow-hidden px-6 pb-20 pt-16">
          <div className="absolute -left-20 top-6 h-72 w-72 rounded-full bg-[#2C5F5D]/14 blur-[90px]" />
          <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#2C5F5D]/12 blur-[80px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C5F5D]">Customer Care</p>
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

              <Card className="rounded-3xl border border-[#d4e7e6] bg-white/95 p-6 backdrop-blur md:p-8">
                <h2 className="text-xl font-semibold text-slate-900">Quick Contact</h2>
                <p className="mt-2 text-sm text-slate-600">Reach us through your preferred channel.</p>

                <div className="mt-6 space-y-4">
                  {[
                    { icon: <Mail className="h-5 w-5" />, title: "Email", desc: "support@propbnb.com" },
                    { icon: <Phone className="h-5 w-5" />, title: "Phone", desc: "+94 77 123 4567" },
                    { icon: <MapPin className="h-5 w-5" />, title: "Office", desc: "45 Galle Road, Colombo" },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-[#deeceb] bg-[#f8fcfc] px-4 py-3">
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
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-16 lg:grid-cols-[1fr_320px]">
          <Card className="p-7 md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-600">Tell us what happened, and our team will follow up shortly.</p>

            {banner && (
              <Alert variant={banner.type} className="mt-5 font-medium">
                {banner.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />

              <Textarea
                name="message"
                placeholder="Describe your issue"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                className="resize-none"
              />

              <Button type="submit" disabled={submitting} className="rounded-full px-8 shadow-lg shadow-[#2C5F5D]/20">
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900">Tips for faster help</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {quickTips.map((tip) => (
                  <li key={tip} className="rounded-xl border border-[#e2efee] bg-[#f8fcfc] px-3 py-2">
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2C5F5D]">FAQ</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border border-[#d7e9e8] bg-white">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-slate-900">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
