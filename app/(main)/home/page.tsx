import { Metadata } from 'next'
import HomePageContent from '@/components/HomePageContent'

export const metadata: Metadata = {
  title: 'VURMZ | Custom Laser Engraving in Centennial, Colorado',
  description: 'Local laser engraving for Denver metro businesses. Fast turnaround, no minimums, local delivery. Pens, knives, business cards, equipment marking, awards. Serving Centennial, Greenwood Village, Cherry Hills, Highlands Ranch.',
  keywords: [
    'laser engraving Centennial',
    'laser engraving Denver',
    'custom engraving Colorado',
    'fast turnaround engraving',
    'no minimum order engraving',
    'branded pens Denver',
    'equipment marking Colorado',
    'metal business cards',
    'corporate gifts Denver',
    'promotional products Centennial',
    'local engraving service',
    'Greenwood Village engraving',
    'Cherry Hills laser',
    'Highlands Ranch engraving',
  ],
}

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.vurmz.com/#business',
      name: 'VURMZ',
      description: 'Custom laser engraving for Denver metro businesses. Fast turnaround, no minimums, local pickup and delivery.',
      url: 'https://www.vurmz.com',
      telephone: '+1-719-257-3834',
      email: 'hello@vurmz.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Centennial',
        addressRegion: 'CO',
        postalCode: '80112',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 39.5807,
        longitude: -104.8772,
      },
      areaServed: [
        { '@type': 'City', name: 'Centennial' },
        { '@type': 'City', name: 'Denver' },
        { '@type': 'City', name: 'Greenwood Village' },
        { '@type': 'City', name: 'Cherry Hills Village' },
        { '@type': 'City', name: 'Highlands Ranch' },
        { '@type': 'City', name: 'Lone Tree' },
        { '@type': 'City', name: 'Parker' },
        { '@type': 'City', name: 'Littleton' },
        { '@type': 'City', name: 'Englewood' },
        { '@type': 'City', name: 'Aurora' },
      ],
      priceRange: '$$',
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageContent />
    </>
  )
}
