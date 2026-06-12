import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig: NextConfig = {
  images: {
    // Enable Next.js image optimization for better performance
    // Images will be served in modern formats (WebP/AVIF) and properly sized
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  trailingSlash: true,

  // These redirects are compiled into the next-on-pages worker (which owns all
  // routing via _routes.json "/*"), so they return a real 308. A Server Component
  // redirect() or a public/_redirects rule would both be shadowed by the worker
  // and 404 in production — which is exactly why the legacy /_redirects rules for
  // /contact, /pricing, /portfolio, /centennial, /gifts, and /laser-engraving/*
  // were dead and had to move here.
  async redirects() {
    return [
      { source: '/shop/contact', destination: '/services/contact', permanent: true },
      { source: '/contact', destination: '/services/contact', permanent: true },
      { source: '/pricing', destination: '/services/pricing', permanent: true },
      { source: '/portfolio', destination: '/services/portfolio', permanent: true },
      // /centennial and the old /services/centennial hop both land on the city page.
      // Skip the Server Component redirect() (shadowed by the worker in prod) and 308
      // straight to the destination.
      { source: '/centennial', destination: '/services/laser-engraving/centennial', permanent: true },
      { source: '/services/centennial', destination: '/services/laser-engraving/centennial', permanent: true },
      { source: '/gifts', destination: '/shop', permanent: true },
      { source: '/laser-engraving/:city*', destination: '/services/laser-engraving/:city*', permanent: true },
    ]
  },

  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vurmz.com',
  },
};

async function buildConfig(): Promise<NextConfig> {
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }
  return nextConfig;
}

export default buildConfig();
