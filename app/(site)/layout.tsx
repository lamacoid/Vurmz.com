import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LocalTicker from '@/components/LocalTicker'
import ScrollGlare from '@/components/ScrollGlare'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocalTicker />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ScrollGlare />
    </>
  )
}
