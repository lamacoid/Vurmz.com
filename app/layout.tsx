import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import TrippyEffects from '@/components/TrippyEffects'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'VURMZ | Laser Engraving in Centennial, Colorado',
    template: '%s | VURMZ'
  },
  description: 'Professional laser engraving services for businesses in Denver metro. Equipment nameplates, ABS panel labels, metal business cards, and custom engraving. Same-day turnaround.',
  keywords: [
    'laser engraving',
    'Centennial Colorado',
    'Denver metro',
    'custom engraving',
    'equipment nameplates',
    'panel labels',
    'metal business cards',
    'Cherry Hills',
    'Greenwood Village',
    'Highlands Ranch'
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
    description: 'Professional laser engraving services for businesses in Denver metro area.',
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "VURMZ LLC",
              "description": "Professional laser engraving services for businesses in the Denver metro area. Same-day turnaround, no minimums, hand-delivered.",
              "url": "https://www.vurmz.com",
              "telephone": "(719) 257-3834",
              "email": "zach@vurmz.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Centennial",
                "addressRegion": "CO",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 39.58,
                "longitude": -104.87
              },
              "areaServed": [
                "Centennial", "Littleton", "Lone Tree", "Parker", "Highlands Ranch",
                "Englewood", "Castle Rock", "Aurora", "Greenwood Village", "Cherry Hills", "Denver"
              ],
              "priceRange": "$$",
              "openingHours": "Mo-Fr 08:00-18:00",
              "founder": {
                "@type": "Person",
                "name": "Zach DeMillo"
              },
              "sameAs": []
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ThemeSwitcher />
        <TrippyEffects />
      </body>
    </html>
  )
}
