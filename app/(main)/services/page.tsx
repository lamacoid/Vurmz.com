import { Metadata } from 'next'
import ServicesPageContent from '@/components/ServicesPageContent'

export const metadata: Metadata = {
  title: 'Laser Engraving Services Denver Metro | VURMZ',
  description: 'Professional laser engraving services in Centennial, CO. Branded pens, custom knives, metal business cards, equipment marking, cutting boards, awards. Fast turnaround.',
  keywords: [
    'laser engraving services Denver',
    'custom engraving Centennial',
    'branded pens service',
    'knife engraving Colorado',
    'metal business card engraving',
    'equipment marking service',
    'cutting board engraving',
    'corporate awards Denver',
    'promotional products engraving',
    'tool marking service',
    'restaurant equipment engraving',
  ],
  openGraph: {
    title: 'Laser Engraving Services | VURMZ',
    description: 'Professional laser engraving in Centennial. Pens, knives, cards, equipment marking, awards. Fast turnaround.',
    type: 'website',
    url: 'https://www.vurmz.com/services',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/services',
  },
}

export default function ServicesPage() {
  return <ServicesPageContent />
}
