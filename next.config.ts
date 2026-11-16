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
    // The built-in optimizer does nothing on Cloudflare Pages (it returned
    // the original file at every width), so photos are sized ahead of time
    // by scripts/optimize-images.mjs and picked by lib/image-loader.ts.
    // These widths must match WIDTHS in that script.
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    deviceSizes: [640, 1080, 1920],
    imageSizes: [128, 256, 384],
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
      // Streamlined 2026-11-11: the shop is one short list of items at /shop.
      // The category doors, the reserve, and the design wall are gone, so
      // every old address lands on the closest page that stays.
      { source: '/shop/bring-your-own', destination: '/engrave', permanent: true },
      { source: '/shop/devices', destination: '/engrave', permanent: true },
      { source: '/shop/reserve', destination: '/engrave', permanent: true },
      { source: '/shop/reserve/:slug', destination: '/engrave', permanent: true },
      { source: '/designs', destination: '/engrave', permanent: true },
      { source: '/shop/:door(shelf|knives|table|drink|carry|walls|business|more|gifts|coasters|tumblers|keychains|decor|pens|metal-cards)', destination: '/shop', permanent: true },
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
      // Addresses that appear in older notes and drafts (2026-11-15). They
      // never existed here; each lands on the page that does the job.
      { source: '/products', destination: '/shop', permanent: true },
      { source: '/products/metal-business-cards', destination: '/services/metal-business-cards', permanent: true },
      { source: '/metal-business-cards', destination: '/services/metal-business-cards', permanent: true },
      { source: '/quote', destination: '/services/contact', permanent: true },
      { source: '/faq', destination: '/services/contact', permanent: true },
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
