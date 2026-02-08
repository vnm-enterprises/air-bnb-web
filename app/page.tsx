import Header from "@/components/layout/Header";
import Hero from "@/components/hero-home/Hero";
import CuratedCollections from "@/components/listing/featured-listing";
import HostBanner from "@/components/cta/HostBanner";
import NewsletterSection from "@/components/newsletter/NewsletterSection";
import Footer from "@/components/layout/Footer";

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
