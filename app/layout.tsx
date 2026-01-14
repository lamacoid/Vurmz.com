import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BurnEffect from '@/components/BurnEffect'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'VURMZ | Laser Engraving in Centennial, Colorado',
    template: '%s | VURMZ'
  },
  description: 'Professional laser engraving services for businesses in Denver metro area. Custom awards, signage, name plates, and promotional products. Fast local delivery in Centennial, Cherry Hills, Greenwood Village, and Highlands Ranch.',
  keywords: [
    'laser engraving',
    'Centennial Colorado',
    'Denver metro',
    'custom engraving',
    'corporate awards',
    'name plates',
    'signage',
    'promotional products',
    'Cherry Hills',
    'Greenwood Village',
    'Highlands Ranch'
  ],
  authors: [{ name: 'VURMZ' }],
  creator: 'VURMZ',
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
      <body className={`${inter.className} bg-white text-gray-900`}>
        <BurnEffect />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
