import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import ServicesClient from '@/components/services/ServicesClient'

// No D1 read on this page anymore (the catalog lives on /shop), so it
// prerenders as static instead of running on the edge per request.

export const metadata: Metadata = pageMeta({
  title: 'Laser Engraving for Business | VURMZ, Centennial CO',
  description: 'Laser engraving and marking for businesses in the south Denver metro. Metal tags, cards, pens, knives, plates. Posted prices, no setup fees, small runs welcome.',
  path: '/services',
  image: { url: '/images/portfolio/holographic-metal-cards.jpg', alt: 'Mirror stainless metal cards marked in color by VURMZ' },
})

export default function ServicesPage() {
  return <ServicesClient />
}
