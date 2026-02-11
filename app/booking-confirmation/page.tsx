// app/booking-confirmation/page.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SuccessHeader from '@/components/booking/SuccessHeader'
import ReservationCard from '@/components/booking/ReservationCard'
import ActionButtons from '@/components/booking/ActionButtons'
import SupportNote from '@/components/booking/SupportNote'
import SearchPageHeader from '@/components/property/SearchPageHeader'

export default function BookingConfirmationPage() {
  return (
    <>
          <SearchPageHeader />

      <main className="flex flex-1 justify-center py-10 px-4 md:px-0">
        <div className="layout-content-container flex flex-col max-w-[600px] flex-1">
          <SuccessHeader />

          <ReservationCard />

          <ActionButtons />

          <SupportNote />
        </div>
      </main>

      <Footer />
    </>
  )
}