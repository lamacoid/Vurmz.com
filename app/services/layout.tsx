import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollGlare from '@/components/ScrollGlare'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Laser engraving for small business in Centennial, CO. Branded pen packs, metal service tags, custom engraving. Next-day turnaround, hand-delivered across South Denver.',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-vurmz-dark text-gray-100" data-theme="services">
      <SiteHeader variant="services" />
      <main className="min-h-screen">
        {children}
      </main>
      <SiteFooter />
      <ScrollGlare />
    </div>
  )
}
