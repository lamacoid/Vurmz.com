import { Metadata } from 'next'
import AboutPageContent from '@/components/AboutPageContent'

export const metadata: Metadata = {
  title: 'About | VURMZ Laser Engraving',
  description: 'VURMZ laser engraving based in Centennial, Colorado. Local business serving Denver metro.',
  keywords: [
    'VURMZ',
    'Centennial laser engraving',
    'Denver engraver',
    'local business Centennial',
    'custom engraving Denver metro',
  ],
  openGraph: {
    title: 'About | VURMZ',
    description: 'Laser engraving based in Centennial, Colorado.',
    type: 'website',
    url: 'https://www.vurmz.com/about',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/about',
  },
}

export default function AboutPage() {
  return <AboutPageContent />
}
