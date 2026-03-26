import Header from "@/components/layout/Header";
import Hero from "@/components/hero-home/Hero";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const CuratedCollections = dynamic(
  () => import("@/components/listing/featured-listing"),
  {
    loading: () => <div className="mx-auto h-80 w-full max-w-7xl animate-pulse rounded-xl bg-slate-200" />,
  }
);

const HostBanner = dynamic(() => import("@/components/cta/HostBanner"), {
  loading: () => <div className="mx-auto h-96 w-full max-w-7xl animate-pulse rounded-xl bg-slate-300" />,
});

const NewsletterSection = dynamic(
  () => import("@/components/newsletter/NewsletterSection"),
  {
    loading: () => <div className="mx-auto h-72 w-full max-w-3xl animate-pulse rounded-xl bg-slate-100" />,
  }
);

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-[#f3f8f8] via-white to-[#f8fbfb]">
        <Hero />

        <section className="mx-auto -mt-8 mb-8 grid max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-4">
          {[
            { label: "Verified Properties", value: "2,000+" },
            { label: "Average Rating", value: "4.8/5" },
            { label: "Cities Covered", value: "120+" },
            { label: "Support", value: "24/7" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#d6e7e6] bg-white/95 p-4 text-center shadow-sm backdrop-blur"
            >
              <p className="text-xl font-bold text-[#2C5F5D] sm:text-2xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <CuratedCollections />
        <HostBanner />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
