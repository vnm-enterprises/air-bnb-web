// app/explore/page.tsx
import Footer from '@/components/layout/Footer'
import Header from '@/components/search/SearchPageHeader'
import SearchLayout from '@/components/search/SearchLayout'

export default function ExplorePage() {
  return (
    <>
      <Header />
      <SearchLayout />
      <Footer />
    </>
  )
}