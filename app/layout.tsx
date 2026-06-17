import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import './fonts.css'
import LocalTicker from '@/components/LocalTicker'
import LaserCursor from '@/components/LaserCursor'
import { CartProvider } from '@/lib/cart/store'

const inter = Inter({ subsets: ['latin'] })

// Display serif for hero headlines — clean, sophisticated, with a real italic.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vurmz.com'),
  title: {
    default: 'VURMZ | Laser Engraving — Shop & Services',
    template: '%s | VURMZ Laser Engraving',
  },
  description: 'VURMZ laser engraving in Centennial, CO. Shop engraved products or get custom engraving services for your business. Next-day turnaround, hand-delivered in South Denver metro.',
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
    title: 'VURMZ | Laser Engraving — Shop & Services',
    description: 'VURMZ laser engraving in Centennial, CO. Shop engraved products or get custom services for your business.',
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
    title: 'VURMZ | Laser Engraving — Shop & Services',
    description: 'VURMZ laser engraving in Centennial, CO. Shop or get custom services.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        {/* Lightweight pageview tracker — skips if owner cookie is set, skips local dev */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            if (document.cookie.indexOf('vurmz_owner=1') !== -1) return;
            if (location.pathname.startsWith('/admin')) return;
            var h = location.hostname;
            if (h === 'localhost' || h === '127.0.0.1' || h.endsWith('.local')) return;
            var b = new Blob([JSON.stringify({path: location.pathname, referrer: document.referrer || ''})], {type: 'application/json'});
            navigator.sendBeacon('/api/track', b);
          })();
        `}} />
      </head>
      <body className={`${inter.className} ${fraunces.variable} relative`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-vurmz-cta focus:text-white focus:rounded-sm focus:shadow-lg"
        >
          Skip to main content
        </a>
        <LocalTicker />
        <CartProvider>
          <main id="main-content">{children}</main>
        </CartProvider>
        <LaserCursor />
      </body>
    </html>
  )
}
