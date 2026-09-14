import type { Metadata } from 'next'
import ServicesClient from '@/components/services/ServicesClient'

// No D1 read on this page anymore (the catalog lives on /shop), so it
// prerenders as static instead of running on the edge per request.

export const metadata: Metadata = {
  title: 'Precision Laser Engraving and Marking for Business | VURMZ',
  description: 'Equipment labels, knife crews, metal cards, branded packs, plates and panels for South Denver businesses. Posted prices, a proof before every run, standing accounts with weekly delivery and NET-30.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesClient />
}
