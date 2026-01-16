import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'VURMZ | Laser Engraving in Centennial, Colorado',
    template: '%s | VURMZ'
  },
  description: 'Professional laser engraving services for businesses in Denver metro area.',
  keywords: [
    'laser engraving',
    'Centennial Colorado',
    'Denver metro',
    'custom engraving',
  ],
  authors: [{ name: 'VURMZ' }],
  creator: 'VURMZ',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.vurmz.com',
    siteName: 'VURMZ',
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
        {children}
      </body>
    </html>
  )
}
