import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './fonts.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LocalTicker from '@/components/LocalTicker'
import ScrollGlare from '@/components/ScrollGlare'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'VURMZ | Laser Engraving in Centennial, Colorado',
    template: '%s | VURMZ'
  },
  description: 'Professional laser engraving in Centennial, CO. Branded pen packs, metal service tags, custom engraving starting at $50. Next-day turnaround. Hand-delivered in South Denver metro.',
  keywords: [
    'laser engraving Centennial CO',
    'laser engraving near me',
    'custom engraving Denver metro',
    'branded pens Colorado',
    'metal business cards',
    'equipment nameplates',
    'ABS panel labels',
    'laser engraving Highlands Ranch',
    'laser engraving Greenwood Village',
    'laser engraving Cherry Hills',
    'laser engraving Lone Tree',
    'laser engraving Littleton',
    'custom gifts Centennial',
    'engraved trophies Denver',
    'small business engraving',
  ],
  authors: [{ name: 'VURMZ' }],
  creator: 'VURMZ',
  icons: {
    icon: '/favicon.svg',
    apple: '/images/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.vurmz.com',
    siteName: 'VURMZ',
    title: 'VURMZ | Laser Engraving in Centennial, Colorado',
    description: 'Professional laser engraving for local businesses. Branded pen packs, metal service tags, custom engraving. Next-day turnaround. Hand-delivered in South Denver metro.',
    images: [
      {
        url: 'https://www.vurmz.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VURMZ Laser Engraving — Metal business card engraved with logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VURMZ | Laser Engraving in Centennial, Colorado',
    description: 'Professional laser engraving for local businesses. Next-day turnaround, hand-delivered in South Denver metro.',
    images: ['https://www.vurmz.com/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'kdFagQeB5Nkh4pa0AjopDD1V9hNOkGza-XMb4y9w9T8',
  },
  alternates: {
    canonical: 'https://www.vurmz.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "VURMZ LLC",
              "alternateName": "VURMZ Laser Engraving",
              "description": "Professional laser engraving services for businesses and individuals in the South Denver metro area. Branded pen packs, metal service tags, coasters, keychains, custom engraving, concierge sourcing. Next-day turnaround, hand-delivered.",
              "url": "https://www.vurmz.com",
              "telephone": "(719) 257-3834",
              "email": "zach@vurmz.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Centennial",
                "addressRegion": "CO",
                "postalCode": "80112",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 39.58,
                "longitude": -104.87
              },
              "areaServed": [
                { "@type": "City", "name": "Centennial", "sameAs": "https://en.wikipedia.org/wiki/Centennial,_Colorado" },
                { "@type": "City", "name": "Littleton" },
                { "@type": "City", "name": "Lone Tree" },
                { "@type": "City", "name": "Parker" },
                { "@type": "City", "name": "Highlands Ranch" },
                { "@type": "City", "name": "Englewood" },
                { "@type": "City", "name": "Castle Rock" },
                { "@type": "City", "name": "Aurora" },
                { "@type": "City", "name": "Greenwood Village" },
                { "@type": "City", "name": "Cherry Hills Village" },
                { "@type": "City", "name": "Denver" }
              ],
              "priceRange": "$$",
              "openingHours": "Mo-Sa 08:00-18:00",
              "paymentAccepted": ["Cash", "Credit Card", "Square Invoice"],
              "currenciesAccepted": "USD",
              "founder": {
                "@type": "Person",
                "name": "Zach DeMillo"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Laser Engraving Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Branded Pens",
                      "description": "Metal stylus pens with custom logo engraving for businesses"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Metal Business Cards",
                      "description": "Anodized aluminum business cards with laser engraved text and logos"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Equipment Labels & Nameplates",
                      "description": "ABS plastic signs and labels for electrical panels, control boxes, and equipment"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Custom Gifts & Awards",
                      "description": "Personalized trophies, cutting boards, plaques, and keepsake gifts"
                    }
                  }
                ]
              },
              "sameAs": []
            })
          }}
        />
        {/* Lightweight pageview tracker — skips if owner cookie is set */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            if (document.cookie.indexOf('vurmz_owner=1') !== -1) return;
            var b = new Blob([JSON.stringify({path: location.pathname, referrer: document.referrer || ''})], {type: 'application/json'});
            navigator.sendBeacon('/api/track', b);
          })();
        `}} />
      </head>
      <body className={`${inter.className} bg-vurmz-dark text-gray-100 relative`}>

        <LocalTicker />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ScrollGlare />
      </body>
    </html>
  )
}
