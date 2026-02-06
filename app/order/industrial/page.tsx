import { Metadata } from 'next'
import IndustrialBuilder from '@/components/IndustrialBuilder'

export const metadata: Metadata = {
  title: 'Industrial Labels & Nameplates Builder | VURMZ',
  description: 'Build compliant industrial labels, equipment nameplates, arc flash labels, valve tags, pipe markers, and safety signage. OSHA, NFPA 70E, ANSI Z535, and ASME A13.1 compliant.',
  keywords: [
    'arc flash labels NFPA 70E',
    'equipment nameplates laser engraved',
    'valve tags ASME A13.1',
    'pipe markers Denver',
    'safety signage OSHA compliant',
    'industrial labels Colorado',
    'breaker schedule labels NEC',
    'control panel labels',
    'asset identification tags',
    'ABS panel labels',
  ],
  openGraph: {
    title: 'Industrial Labels & Nameplates Builder | VURMZ Laser Engraving',
    description: 'Build compliant industrial labels, equipment nameplates, valve tags, and safety signage. Same-day service in Denver metro.',
    type: 'website',
    url: 'https://www.vurmz.com/order/industrial',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/order/industrial',
  },
}

export default function IndustrialOrderPage() {
  return (
    <div data-order-page className="min-h-screen">
      <IndustrialBuilder />
    </div>
  )
}
