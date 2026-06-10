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

  // /shop/contact is a funnel into the single contact page. A framework-level
  // redirect is compiled into the next-on-pages worker (which owns all routing
  // via _routes.json "/*"), so it returns a real 308 — unlike a Server Component
  // redirect() or a public/_redirects rule, both of which the worker shadows.
  async redirects() {
    return [
      { source: '/shop/contact', destination: '/services/contact', permanent: true },
    ]
  },

  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://vurmz.com',
  },
};

async function buildConfig(): Promise<NextConfig> {
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }
  return nextConfig;
}

export default buildConfig();
