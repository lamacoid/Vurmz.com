import type { Metadata } from 'next'
import { Inter, EB_Garamond } from 'next/font/google'
import './globals.css'
import './fonts.css'
import LocalTicker from '@/components/LocalTicker'
import LaserCursor from '@/components/LaserCursor'
import SunTracker from '@/components/SunTracker'
import BackRoomDoor from '@/components/BackRoomDoor'
import { CartProvider } from '@/lib/cart/store'
import { SIGNATURE, CATALOG } from '@/lib/pricing'
import { OG_DEFAULT } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

// Display serif for hero headlines, with a real italic. Variable weight
// 400 to 800, so the kit's 600 headings come straight from the family.
const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vurmz.com'),
  title: {
    default: 'VURMZ | Custom Laser Engraving in Centennial, Colorado',
    template: '%s | VURMZ Laser Engraving',
  },
  description: 'Custom laser engraving in Centennial, Colorado. Bring your own knife, tool, or tumbler, or order metal cards, tags, and pens for your business. Hand-delivered.',
  authors: [{ name: 'VURMZ' }],
  creator: 'VURMZ',
  icons: {
    icon: '/favicon.svg',
    apple: '/images/apple-touch-icon.png',
  },
  // The defaults below are for any page that does not set its own. Every
  // real page builds its own block with pageMeta() in lib/seo.ts.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.vurmz.com',
    siteName: 'VURMZ',
    title: 'VURMZ | Custom Laser Engraving in Centennial, Colorado',
    description: 'Custom laser engraving in Centennial, Colorado. Bring your own knife, tool, or tumbler, or order metal cards, tags, and pens for your business. Hand-delivered.',
    // The stainless shop nameplate (2026-11-15). Earlier cards: og-demon.jpg,
    // og-card.jpg, og-image.jpg. A new filename each time, so scrapers
    // refetch instead of serving a cached copy.
    images: [OG_DEFAULT],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VURMZ | Custom Laser Engraving in Centennial, Colorado',
    description: 'Custom laser engraving in Centennial, Colorado. Bring your own knife, tool, or tumbler, or order for your business. Hand-delivered.',
    images: [OG_DEFAULT.url],
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
              "@id": "https://www.vurmz.com/#business",
              "name": "VURMZ",
              "legalName": "VURMZ LLC",
              "alternateName": "VURMZ Laser Engraving",
              "image": `https://www.vurmz.com${OG_DEFAULT.url}`,
              "logo": "https://www.vurmz.com/images/apple-touch-icon.png",
              "description": `Laser engraving in Centennial, Colorado for the south Denver metro. Engraving on items you already own (knives, tools, tumblers, laptops) from $${SIGNATURE.startingAt}, and marked goods for local businesses: equipment labels, knife crews, metal cards, branded pens, plates and panels. Posted prices, a quote the same day, most work in 24 to 72 hours, hand-delivered.`,
              "url": "https://www.vurmz.com",
              "telephone": "(720) 468-0138",
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
                // What VURMZ actually sells, with the posted prices read
                // from lib/pricing so this never disagrees with the pages.
                "itemListElement": [
                  { name: 'Engraving on items you already own', description: 'Knives, tools, tumblers, laptops, flasks, cutting boards, and other solid items. One piece, one placement.', price: SIGNATURE.startingAt },
                  { name: 'Knife engraving', description: `Names and marks on pocket knives and kitchen knives. ${CATALOG.knife.crew.minQty} or more at $${CATALOG.knife.crew.perKnife} each.`, price: CATALOG.knife.base },
                  { name: 'Tool and gear marking', description: 'Names and ID marks on hand tools and jobsite gear.', price: CATALOG.tool.base },
                  { name: 'Custom metal tags', description: 'Small custom tags in steel and aluminum, made to order.', price: CATALOG.serviceTags.aluminumBase },
                  { name: 'Metal business cards', description: `Anodized aluminum cards engraved with a logo and details, packs of ${CATALOG.cards.pack}.`, price: CATALOG.cards.matteBlackBase * CATALOG.cards.pack },
                  { name: 'Branded pens', description: `Soft-touch stylus pens engraved with a name or logo, packs of ${CATALOG.pens.pack}.`, price: CATALOG.pens.packPrice[0] },
                ].map(o => ({
                  "@type": "Offer",
                  "priceCurrency": "USD",
                  "price": String(o.price),
                  "itemOffered": { "@type": "Service", "name": o.name, "description": o.description },
                }))
              },
              "sameAs": []
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.vurmz.com/#website",
              "url": "https://www.vurmz.com/",
              "name": "VURMZ",
              "alternateName": "VURMZ Laser Engraving",
              "inLanguage": "en-US",
              "publisher": { "@id": "https://www.vurmz.com/#business" },
            })
          }}
        />
        {/* Lightweight pageview tracker, skips if owner cookie is set, skips local dev */}
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
      <body className={`${inter.className} ${garamond.variable} relative`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--coral)] focus:text-white focus:rounded-[var(--r-control)] focus:shadow-lg"
        >
          Skip to main content
        </a>
        <LocalTicker />
        <CartProvider>
          <main id="main-content">{children}</main>
        </CartProvider>
        <LaserCursor />
        <SunTracker />
        <BackRoomDoor />
      </body>
    </html>
  )
}
