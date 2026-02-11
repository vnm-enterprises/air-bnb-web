// app/checkout/page.tsx
import Footer from '@/components/layout/Footer'
import CheckoutBreadcrumbs from '@/components/checkout/CheckoutBreadcrumbs'
import TripDetailsCard from '@/components/checkout/TripDetailsCard'
import GuestInfoForm from '@/components/checkout/GuestInfoForm'
import PaymentMethodForm from '@/components/checkout/PaymentMethodForm'
import PriceSummaryCard from '@/components/checkout/PriceSummaryCard'
import SecurityBadges from '@/components/checkout/SecurityBadges'
import SearchPageHeader from '@/components/property/SearchPageHeader'

export default function CheckoutPage() {
  return (
    <>
            <SearchPageHeader />

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <CheckoutBreadcrumbs />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Form Section */}
          <div className="lg:col-span-7 space-y-10">
            <section>
              <h2 className="text-3xl font-extrabold mb-6">Confirm and Book</h2>

              <TripDetailsCard />

              <GuestInfoForm />

              <PaymentMethodForm />
            </section>
          </div>

          {/* Right Column - Summary Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <PriceSummaryCard />
              <SecurityBadges />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}