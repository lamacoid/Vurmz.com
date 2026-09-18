import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Baked in at build time so the footer can say exactly which build is
// live (ends the "is prod actually updated or am I seeing edge cache"
// guessing game).
const pkgVersion = (() => {
  try { return (JSON.parse(readFileSync("./package.json", "utf8")) as { version?: string }).version ?? "0.0.0"; } catch { return "0.0.0"; }
})();
const commit = (() => {
  try { return execSync("git rev-parse --short HEAD").toString().trim(); } catch { return "dev"; }
})();

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
      // The reserve was one page per maker for a day (2026-09-16); it is by kind of thing now.
      { source: '/shop/reserve/ridge-wallet-aluminum', destination: '/shop/reserve/wallet', permanent: true },
      { source: '/shop/reserve/ridge-wallet-titanium', destination: '/shop/reserve/wallet', permanent: true },
      { source: '/shop/reserve/yeti-rambler-20', destination: '/shop/reserve/cooler', permanent: true },
      { source: '/shop/reserve/stanley-quencher-40', destination: '/shop/reserve/cooler', permanent: true },
      { source: '/shop/reserve/snow-peak-titanium-cup', destination: '/shop/reserve/cooler', permanent: true },
      { source: '/shop/reserve/leatherman-wave-plus', destination: '/shop/reserve/multitool', permanent: true },
      { source: '/shop/reserve/victorinox-huntsman', destination: '/shop/reserve/pocket-knife', permanent: true },
      { source: '/shop/reserve/zippo-brushed-chrome', destination: '/shop/reserve/pen', permanent: true },
      { source: '/shop/reserve/fisher-bullet-space-pen', destination: '/shop/reserve/pen', permanent: true },
      { source: '/shop/reserve/tactile-turn-bolt-action', destination: '/shop/reserve/pen', permanent: true },
      { source: '/shop/reserve/buck-110-folding-hunter', destination: '/shop/reserve/pocket-knife', permanent: true },
      { source: '/shop/reserve/opinel-no-08', destination: '/shop/reserve/pocket-knife', permanent: true },
      { source: '/shop/reserve/spyderco-delica-4', destination: '/shop/reserve/pocket-knife', permanent: true },
      { source: '/shop/reserve/benchmade-bugout', destination: '/shop/reserve/pocket-knife', permanent: true },
      { source: '/shop/reserve/shun-classic-8-chef', destination: '/shop/reserve/chef-knife', permanent: true },
      { source: '/shop/reserve/smithey-no-10-skillet', destination: '/shop/reserve/skillet', permanent: true },
      { source: '/shop/reserve/john-boos-maple-board', destination: '/shop/reserve/board', permanent: true },
      { source: '/shop/reserve/bellroy-slim-sleeve', destination: '/shop/reserve/wallet', permanent: true },
      { source: '/shop/reserve/moleskine-classic', destination: '/shop/reserve/pen', permanent: true },
      { source: '/shop/reserve/shun-premier-8-chef', destination: '/shop/reserve/chef-knife', permanent: true },
      { source: '/shop/reserve/miyabi-birchwood-8-chef', destination: '/shop/reserve/chef-knife', permanent: true },
      { source: '/shop/reserve/wusthof-classic-ikon-8-chef', destination: '/shop/reserve/chef-knife', permanent: true },
      { source: '/shop/reserve/benchmade-940-osborne', destination: '/shop/reserve/pocket-knife', permanent: true },
      { source: '/shop/reserve/chris-reeve-small-sebenza-31', destination: '/shop/reserve/pocket-knife', permanent: true },
      { source: '/shop/reserve/spyderco-paramilitary-2', destination: '/shop/reserve/pocket-knife', permanent: true },
      { source: '/shop/reserve/smithey-no-12-skillet', destination: '/shop/reserve/skillet', permanent: true },
      { source: '/shop/reserve/john-boos-reversible-maple-24x18', destination: '/shop/reserve/board', permanent: true },
      { source: '/shop/reserve/yeti-tundra-45', destination: '/shop/reserve/cooler', permanent: true },
      { source: '/shop/reserve/ridge-wallet-carbon-fiber', destination: '/shop/reserve/wallet', permanent: true },
      { source: '/shop/contact', destination: '/services/contact', permanent: true },
      { source: '/contact', destination: '/services/contact', permanent: true },
      // Pricing merged into the services page (2026-06-13).
      { source: '/pricing', destination: '/services', permanent: true },
      { source: '/services/pricing', destination: '/services', permanent: true },
      { source: '/portfolio', destination: '/services/portfolio', permanent: true },
      // /centennial and the old /services/centennial hop both land on the city page.
      // Skip the Server Component redirect() (shadowed by the worker in prod) and 308
      // straight to the destination.
      { source: '/centennial', destination: '/services/laser-engraving/centennial', permanent: true },
      { source: '/services/centennial', destination: '/services/laser-engraving/centennial', permanent: true },
      { source: '/gifts', destination: '/shop', permanent: true },
      // Retired consumer categories folded into Bring Your Own (2026-06-12).
      { source: '/shop/knives', destination: '/shop/bring-your-own', permanent: true },
      { source: '/shop/devices', destination: '/shop/bring-your-own', permanent: true },
      { source: '/laser-engraving/:city*', destination: '/services/laser-engraving/:city*', permanent: true },
    ]
  },

  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vurmz.com',
    NEXT_PUBLIC_VERSION: pkgVersion,
    NEXT_PUBLIC_COMMIT: commit,
  },
};

async function buildConfig(): Promise<NextConfig> {
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }
  return nextConfig;
}

export default buildConfig();
