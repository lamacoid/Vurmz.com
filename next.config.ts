import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable Next.js image optimization for better performance
    // Images will be served in modern formats (WebP/AVIF) and properly sized
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  trailingSlash: true,

  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://vurmz.com',
  },
};

export default nextConfig;
