import type { Metadata } from 'next'
import ServicesClient from '@/components/services/ServicesClient'

// No D1 read on this page anymore (the catalog lives on /shop), so it
// prerenders as static instead of running on the edge per request.

export const metadata: Metadata = {
  title: 'Business Engraving | VURMZ',
  description: 'Branded coasters, metal business cards, equipment labels, and custom engraving for South Denver businesses. Posted prices, volume tiers at 50 units, hand-delivered, most jobs in 24 to 72 hours.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesClient />
}
