import { siteInfo } from '@/lib/site-info'

/**
 * JSON-LD Structured Data for SEO
 * Includes LocalBusiness, Organization, and WebSite schemas
 */
export default function StructuredData() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteInfo.url}/#business`,
    name: siteInfo.name,
    description: siteInfo.description,
    url: siteInfo.url,
    telephone: siteInfo.phone,
    email: siteInfo.email,
    founder: {
      '@type': 'Person',
      name: siteInfo.founder.fullName,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteInfo.city,
      addressRegion: siteInfo.stateAbbr,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteInfo.coordinates.lat,
      longitude: siteInfo.coordinates.lng,
    },
    areaServed: siteInfo.serviceAreas.map((area) => ({
      '@type': 'City',
      name: `${area}, Colorado`,
    })),
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    sameAs: [
      siteInfo.social.instagram,
      siteInfo.social.facebook,
      siteInfo.social.linkedin,
    ].filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Laser Engraving Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Branded Pens',
            description: 'Custom engraved metal stylus pens with your logo',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Metal Business Cards',
            description: 'Premium anodized aluminum business cards',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Industrial Labels',
            description: 'Equipment nameplates, arc flash labels, valve tags',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Knife Engraving',
            description: 'Custom engraving for chef and pocket knives',
          },
        },
      ],
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteInfo.url}/#website`,
    url: siteInfo.url,
    name: siteInfo.name,
    description: siteInfo.description,
    publisher: {
      '@id': `${siteInfo.url}/#business`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  )
}
