import { Metadata } from 'next'
import PricingPageContent from '@/components/PricingPageContent'

export const metadata: Metadata = {
  title: 'Laser Engraving Pricing | No Hidden Fees | VURMZ',
  description: 'Transparent laser engraving prices for Denver metro. Pens from $3, equipment marking from $3, business cards from $5. No setup fees for repeat customers. No minimums.',
  keywords: [
    'laser engraving prices Denver',
    'engraving cost Centennial',
    'custom pen pricing',
    'equipment marking cost',
    'metal business card price',
    'knife engraving cost',
    'no minimum engraving',
    'affordable laser engraving Colorado',
    'transparent engraving pricing',
    'corporate gift pricing Denver',
  ],
  openGraph: {
    title: 'Pricing | VURMZ Laser Engraving',
    description: 'Transparent pricing. No hidden fees. Pens from $3, equipment marking from $3. Denver metro.',
    type: 'website',
    url: 'https://www.vurmz.com/pricing',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/pricing',
  },
}

export default function PricingPage() {
  return <PricingPageContent />
}
