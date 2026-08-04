import type { Metadata } from 'next'
import ServicesClient from '@/components/services/ServicesClient'
import BusinessMenu from '@/components/services/BusinessMenu'

// The business menu reads live D1 at request time; the rest of the page
// is the existing client experience, receiving the menu as a slot.
export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Business Engraving | VURMZ',
  description: 'Branded coasters, metal business cards, equipment labels, and custom engraving for South Denver businesses. Posted prices, volume tiers at 50 units, hand-delivered, most jobs in 24 to 72 hours.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesClient businessMenu={<BusinessMenu />} />
}
