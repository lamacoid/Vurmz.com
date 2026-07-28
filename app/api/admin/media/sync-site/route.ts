import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { createExternalMedia } from '@/lib/db/repos/media'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

/**
 * Known static assets shipped in /public. These get registered as `external_url`
 * media rows so they show up in the admin library and can be referenced in blocks,
 * product hero pickers, etc. — without copying them into R2.
 */
const SITE_PHOTOS: Array<{ url: string; filename: string; folder: string; alt?: string }> = [
  // Portfolio
  { url: '/portfolio/clga-faceplate-angled.jpg',     filename: 'CLGA faceplate (angled)',       folder: 'portfolio', alt: 'County Line Guitar Amps engraved faceplate — angled' },
  { url: '/portfolio/clga-faceplate-closeup.jpg',    filename: 'CLGA faceplate (closeup)',      folder: 'portfolio', alt: 'County Line Guitar Amps engraved faceplate — closeup' },
  { url: '/portfolio/clga-faceplate-standing.jpg',   filename: 'CLGA faceplate (standing)',     folder: 'portfolio', alt: 'County Line Guitar Amps engraved faceplate — standing' },
  { url: '/portfolio/columbine-macbook-engraving.jpg', filename: 'Columbine MacBook',           folder: 'portfolio', alt: 'MacBook engraved with columbine design' },
  { url: '/portfolio/culinary-cleaver-engraved.jpg', filename: 'Culinary cleaver',              folder: 'portfolio', alt: 'Engraved culinary cleaver' },
  { url: '/portfolio/denver-map-glass-coaster.jpg',  filename: 'Denver map glass coaster',      folder: 'portfolio', alt: 'Denver map engraved on glass coaster' },
  { url: '/portfolio/denver-map-mirror-closeup.jpg', filename: 'Denver map mirror',             folder: 'portfolio', alt: 'Denver map engraved on mirror — closeup' },
  { url: '/portfolio/engraved-hand-saw.jpg',         filename: 'Engraved hand saw',             folder: 'portfolio', alt: 'Hand saw with custom engraving' },
  { url: '/portfolio/eye-storm-hexagonal-mirror.jpg',filename: 'Hexagonal mirror',              folder: 'portfolio', alt: 'Eye-of-the-storm engraving on a hexagonal mirror' },
  { url: '/portfolio/laser-engraved-artwork.jpg',    filename: 'Laser engraved artwork',        folder: 'portfolio', alt: 'Custom laser engraved artwork' },
  { url: '/portfolio/macbook-engraving.jpg',         filename: 'MacBook engraving',             folder: 'portfolio', alt: 'MacBook with custom engraving' },
  { url: '/portfolio/metal-business-card-original.png', filename: 'Metal business card',        folder: 'portfolio', alt: 'Metal business card with engraved logo' },
  { url: '/portfolio/plastic-marking-charger.jpg',   filename: 'Plastic marking (charger)',     folder: 'portfolio', alt: 'Plastic marking on a phone charger' },
  { url: '/portfolio/pocket-knife-engraved.jpg',     filename: 'Engraved pocket knife',         folder: 'portfolio', alt: 'Pocket knife with engraved handle' },
  { url: '/portfolio/tumbler-cherry-creek-37.jpg',   filename: 'Tumbler — Cherry Creek 37',     folder: 'portfolio', alt: 'Engraved tumbler with Cherry Creek 37 design' },
  { url: '/portfolio/water-bottle-custom-engraved.jpg', filename: 'Water bottle (custom)',      folder: 'portfolio', alt: 'Custom engraved water bottle' },
  { url: '/portfolio/water-bottle-full-wrap.jpg',    filename: 'Water bottle (full wrap)',      folder: 'portfolio', alt: 'Full-wrap engraved water bottle' },
  // Brand & clients
  { url: '/images/vurmz-logo-full.svg',              filename: 'VURMZ logo (full)',             folder: 'brand' },
  { url: '/images/vurmz-logo-text.png',              filename: 'VURMZ logo (text)',             folder: 'brand' },
  { url: '/images/apple-touch-icon.png',             filename: 'Apple touch icon',              folder: 'brand' },
  { url: '/images/og-card.jpg',                      filename: 'OG image',                      folder: 'brand' },
  { url: '/images/wood-grain-bg.jpg',                filename: 'Wood grain background',         folder: 'brand' },
  { url: '/images/wood-grain-horizontal.jpg',        filename: 'Wood grain (horizontal)',       folder: 'brand' },
  { url: '/images/zach.jpeg',                        filename: 'Zach — founder portrait',       folder: 'brand', alt: 'Zach DeMillo, founder of VURMZ' },
  { url: '/images/clients/county-line-guitar-amps.svg', filename: 'County Line Guitar Amps',    folder: 'clients', alt: 'County Line Guitar Amps logo' },
]

function mimeFromUrl(url: string): string {
  const m = url.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase()
  if (!m) return 'application/octet-stream'
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
    pdf: 'application/pdf',
  }
  return map[m] ?? 'application/octet-stream'
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    await Promise.all(SITE_PHOTOS.map(photo =>
      createExternalMedia({
        externalUrl: photo.url,
        filename: photo.filename,
        mimeType: mimeFromUrl(photo.url),
        folder: photo.folder,
        altText: photo.alt ?? '',
      })
    ))
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'media.sync_site', targetType: 'media',
      diff: { total: SITE_PHOTOS.length },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { registered: SITE_PHOTOS.length } })
  })
}
