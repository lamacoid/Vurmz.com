import type { Metadata } from 'next'
import ServicesClient from '@/components/services/ServicesClient'

// No D1 read on this page anymore (the catalog lives on /shop), so it
// prerenders as static instead of running on the edge per request.

export const metadata: Metadata = {
  title: { absolute: 'Need something marked? Engraving for business | VURMZ' },
  description: 'Send a photo, how many, and your logo or the words. A price the same day. No setup fees, 72 hour turnaround, hand-delivered across the south Denver metro, small orders welcome, logo stays on file.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesClient />
}
