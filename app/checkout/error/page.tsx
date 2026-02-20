"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-center py-24 px-6 text-center">

        <XCircle size={64} className="text-red-500 mb-6" />

        <h1 className="text-3xl font-semibold mb-4">
          Payment Failed
        </h1>

        <p className="text-gray-600 mb-10 max-w-md">
          Something went wrong while processing your payment.
          Please check your card details and try again.
        </p>

        <div className="flex gap-4">

          <button
            onClick={() => router.push("/checkout")}
            className="bg-[#306966] text-white px-6 py-3 rounded-xl font-medium"
          >
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="border px-6 py-3 rounded-xl font-medium"
          >
            Back to Home
          </button>

        </div>

      </main>

      <Footer />
    </>
  );
}
