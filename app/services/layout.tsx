import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LocalTicker from '@/components/LocalTicker'
import ScrollGlare from '@/components/ScrollGlare'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Services | VURMZ',
    template: '%s | VURMZ Services',
  },
  description: 'Professional laser engraving services in Centennial, CO. Branded pen packs, metal service tags, custom engraving. Next-day turnaround, hand-delivered in South Denver metro.',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-vurmz-dark text-gray-100" data-theme="services">
      <LocalTicker />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ScrollGlare />
    </div>
  )
}
