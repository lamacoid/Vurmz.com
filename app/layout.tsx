import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import './fonts.css'
import LocalTicker from '@/components/LocalTicker'
import ShopNotice from '@/components/ShopNotice'
import LaserCursor from '@/components/LaserCursor'
import SunTracker from '@/components/SunTracker'
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
    default: 'VURMZ | Laser Engraving · Shop & Services',
    template: '%s | VURMZ Laser Engraving',
  },
  description: 'VURMZ precision laser engraving in Centennial, CO. Shop engraved products or get custom engraving services for your business. Next-day turnaround, hand-delivered in South Denver metro.',
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
    title: 'VURMZ | Laser Engraving · Shop & Services',
    description: 'VURMZ laser engraving in Centennial, CO. Shop engraved products or get custom services for your business.',
    images: [
      {
        // og-card.jpg is drawn by scripts/make-og-image.mjs. The old
        // og-image.jpg was a corrupted photo; new filename so scrapers
        // refetch instead of serving their cached copy.
        url: 'https://www.vurmz.com/images/og-card.jpg',
        width: 1200,
        height: 630,
        alt: 'VURMZ Laser Engraving. Centennial, Colorado. Hand-delivered.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VURMZ | Laser Engraving · Shop & Services',
    description: 'VURMZ laser engraving in Centennial, CO. Shop or get custom services.',
    images: ['https://www.vurmz.com/images/og-card.jpg'],
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
        {/* Theme: apply the saved choice (or system preference) before paint so
            there is no light/dark flash. The header toggle writes vurmz-theme. */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var saved = localStorage.getItem('vurmz-theme');
              var dark = saved ? saved === 'dark'
                : window.matchMedia('(prefers-color-scheme: dark)').matches;
              var root = document.documentElement;
              root.classList.toggle('dark', dark);
              root.style.colorScheme = dark ? 'dark' : 'light';
            } catch (e) {}
          })();
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "VURMZ LLC",
              "alternateName": "VURMZ Laser Engraving",
              "description": "Precision laser engraving services for businesses and individuals in the South Denver metro area. Branded pen packs, metal service tags, coasters, keychains, custom engraving, concierge sourcing. Next-day turnaround, hand-delivered.",
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
        {/* Announcement strip. Top of the fixed stack: this (h-11 / sm:h-8),
            then LocalTicker (h-7), then SiteHeader. Change the height here and
            the offsets in LocalTicker.tsx and SiteHeader.tsx move with it. */}
        <div className="fixed top-0 left-0 right-0 z-[70] h-11 sm:h-8 flex items-center justify-center bg-[#C67A6F] px-4">
          <p className="text-center text-[11px] sm:text-[12px] leading-tight tracking-wide text-[#0A2429]">
            Temporarily closed while we transition to a new space.
          </p>
        </div>
        <LocalTicker />
        <CartProvider>
          <main id="main-content">{children}</main>
        </CartProvider>
        <ShopNotice />
        <LaserCursor />
        <SunTracker />
      </body>
    </html>
  )
}
