import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollGlare from '@/components/ScrollGlare'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Laser engraving for small business in Centennial, CO. Branded pen packs, metal service tags, custom engraving. Next-day turnaround, hand-delivered across South Denver.',
  // /services itself is a client component and can't export metadata, so its
  // canonical lives here. Child routes (pricing, portfolio, contact, etc.)
  // override this with their own canonical.
  alternates: { canonical: '/services' },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--page)] text-[var(--ink)]" data-theme="services">
      <SiteHeader variant="services" />
      <div className="min-h-screen">
        {children}
      </div>
      <SiteFooter />
      <ScrollGlare />
    </div>
  )
}
