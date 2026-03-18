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
      <main>
        <Hero />
        <CuratedCollections />
        <HostBanner />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
