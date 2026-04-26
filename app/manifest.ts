import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VURMZ',
    short_name: 'VURMZ',
    description: 'Laser engraving for small business — Centennial, CO',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a2f2e',
    theme_color: '#1a2f2e',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/images/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    categories: ['business', 'shopping', 'utilities'],
  }
}
