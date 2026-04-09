"use client";

import { Mail, CheckCircle, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import api from "@/infrastructure/http/api-client";

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/api/v1/newsletter/subscribe", { email: email.trim() });
      setOpen(true);
      setEmail("");

      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } catch (err: unknown) {
      const apiError = err as ApiErrorShape;
      const message =
        apiError.response?.data?.message ||
        "Subscription failed. Please try again in a moment.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative py-22 sm:py-26">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-[#d6ece9]/70 to-transparent" />

        <div className="mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-[34px] border border-[#d2e5e3] bg-linear-to-br from-[#f7fcfb] via-[#f2faf8] to-[#edf6f3] px-6 py-10 shadow-[0_24px_54px_rgba(15,23,42,0.1)] sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-[#a9ded5]/28 blur-3xl" />
            <div className="pointer-events-none absolute -right-12 bottom-8 h-40 w-40 rounded-full bg-[#d7ebe6]/60 blur-3xl" />

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfe4e2] bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2E5E59]">
                <Mail className="h-4 w-4" />
                Travel updates
              </div>

              <h3 className="mb-4 text-4xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-5xl">
                Your next journey begins here
              </h3>

              <p className="mb-9 text-base font-medium leading-relaxed text-slate-600 sm:mb-10 sm:text-xl">
                Subscribe to receive exclusive offers, insider city picks, and handpicked travel guides.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-[#d5e6e4] bg-white/92 p-2 shadow-lg shadow-slate-900/8 sm:flex-row"
              >
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border-none bg-transparent px-5 py-3.5 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:px-6"
                  placeholder="Enter your email address"
                  type="email"
                  autoComplete="email"
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-linear-to-r from-[#2E5E59] to-[#255451] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#2C5F5D]/25 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:px-10"
                >
                  {submitting ? "Joining..." : "Join Now"}
                </button>
              </form>

              {error && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl animate-scaleIn">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              aria-label="Close success message"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-[#2E5E59]" />
            </div>

            <h4 className="mb-3 text-2xl font-bold text-slate-900">You are all set</h4>

            <p className="text-sm text-slate-500">
              Thank you for joining. Please check your email to confirm your subscription.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
