// app/property/page.tsx
import Footer from '@/components/layout/Footer'
import PropertyHero from '@/components/property/PropertyHero'
import PropertyImages from '@/components/property/PropertyImages'
import HostHeader from '@/components/property/HostHeader'
import PropertyDescription from '@/components/property/PropertyDescription'
import PropertyAmenities from '@/components/property/PropertyAmenities'
import HostInfoCard from '@/components/property/HostInfoCard'
import BookingSidebar from '@/components/property/BookingSidebar'
import SearchPageHeader from '@/components/property/SearchPageHeader'

export default function PropertyPage() {
  return (
    <>
      <SearchPageHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <PropertyHero />
        <PropertyImages />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <HostHeader />
            <PropertyDescription />
            <PropertyAmenities />
            <HostInfoCard />
          </div>

          <div className="relative">
            <div className="sticky top-28">
              <BookingSidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}