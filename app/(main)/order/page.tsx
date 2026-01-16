import { Metadata } from 'next'
import PremiumBuilder from '@/components/PremiumBuilder'

export const metadata: Metadata = {
  title: 'Start Your Order | Custom Laser Engraving Quote',
  description: 'Get a quick quote for laser engraving in Denver metro. No minimums, no setup fees, local pickup or delivery. Pens, knives, business cards, equipment marking.',
  keywords: [
    'laser engraving quote Denver',
    'custom engraving order',
    'no minimum engraving',
    'fast engraving quote',
    'Centennial laser engraving order',
    'Denver metro custom engraving',
    'branded pens order',
    'equipment marking quote',
  ],
  openGraph: {
    title: 'Start Your Order | VURMZ Laser Engraving',
    description: 'Quick quotes for custom laser engraving. No minimums. Local Denver metro service.',
    type: 'website',
    url: 'https://www.vurmz.com/order',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/order',
  },
}

export default function OrderPage() {
  return <PremiumBuilder />
}
