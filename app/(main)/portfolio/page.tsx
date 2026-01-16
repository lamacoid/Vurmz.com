import { Metadata } from 'next'
import PortfolioPageContent from '@/components/PortfolioPageContent'

export const metadata: Metadata = {
  title: 'Portfolio | Laser Engraving Examples Denver Metro',
  description: 'Laser engraving projects for Denver businesses. Chef knives, restaurant equipment, branded pens, metal business cards, awards, and custom work.',
  keywords: [
    'laser engraving examples',
    'Denver engraving portfolio',
    'custom knife engraving photos',
    'restaurant equipment marking',
    'branded pen examples',
    'metal business card samples',
    'Centennial laser work',
    'corporate gifts Denver',
  ],
  openGraph: {
    title: 'Portfolio | VURMZ Laser Engraving',
    description: 'Laser engraving projects for Denver metro businesses. Knives, pens, cards, equipment marking.',
    type: 'website',
    url: 'https://www.vurmz.com/portfolio',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/portfolio',
  },
}

export default function PortfolioPage() {
  return <PortfolioPageContent />
}
