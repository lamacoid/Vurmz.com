import type { Metadata } from 'next'

/**
 * One place that builds a page's search and share tags (2026-11-15).
 *
 * Before this, most pages set only a title and a description, so they
 * inherited the homepage's Open Graph block from the root layout: a link
 * shared from /engrave showed the homepage's title and pointed back at the
 * homepage. Descriptions also ran up to 700 characters. pageMeta() gives
 * every page its own title, description, canonical, og:* and twitter:* from
 * the same four inputs, so they can never disagree with each other.
 */
export const SITE_URL = 'https://www.vurmz.com'
export const SITE_NAME = 'VURMZ'

/**
 * The one business record lives in the root layout's structured data, under
 * this id. Every other block (a service, a product, a city page) points at
 * it with BUSINESS_REF instead of describing the business again. Several
 * slightly different copies of the same business on one page read to a
 * search engine as several businesses.
 */
export const BUSINESS_ID = `${SITE_URL}/#business`
export const BUSINESS_REF = { '@id': BUSINESS_ID }

/**
 * The date the site's static pages last changed in a way a crawler should
 * care about. The sitemap reports this as lastmod for every page that has
 * no timestamp of its own. Bump it when page content changes; a date that
 * moves on every request tells a search engine nothing.
 */
export const CONTENT_UPDATED = '2026-11-16'

/** The default share image: the stainless shop nameplate, 1200 x 630. */
export const OG_DEFAULT = {
  url: '/images/og-vurmz-nameplate.jpg',
  width: 1200,
  height: 630,
  alt: 'The VURMZ nameplate, laser engraved in brushed stainless steel',
}

const TITLE_MAX = 60
const DESC_MAX = 160

/** Trim to a limit at a word boundary. Never cuts a word, never ends on punctuation left hanging. */
export function clip(text: string, max: number): string {
  const s = text.replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  // One character is held back for the closing period, so the result
  // never runs past the limit.
  const room = max - 1
  const cut = s.slice(0, room + 1)
  const at = cut.lastIndexOf(' ')
  return cut.slice(0, at > 40 ? at : room).replace(/[\s,;:.]+$/, '') + '.'
}

/**
 * Join as many whole sentences as fit in the limit, in order. Used where a
 * description is assembled from parts (a product page), so it ends on a
 * complete sentence instead of being cut in the middle of one.
 */
export function fitSentences(parts: string[], max = DESC_MAX): string {
  let out = ''
  for (const part of parts) {
    const next = out ? `${out} ${part}` : part
    if (next.length > max) break
    out = next
  }
  // A first sentence longer than the limit still has to say something.
  return out || clip(parts[0] ?? '', max)
}

export interface PageMetaInput {
  /** The full title as it should appear. Kept under 60 characters. */
  title: string
  /** Kept under 160 characters. Longer text is trimmed at a word. */
  description: string
  /** Site-relative path, for example '/engrave'. '/' for the homepage. */
  path: string
  /** Share image. Site-relative or absolute. Defaults to the nameplate. */
  image?: { url: string; alt: string; width?: number; height?: number }
  type?: 'website' | 'article'
  /** True for pages that should stay out of search results. */
  noindex?: boolean
}

export function pageMeta({ title, description, path, image, type = 'website', noindex }: PageMetaInput): Metadata {
  const t = clip(title, TITLE_MAX).replace(/\.$/, '')
  const d = clip(description, DESC_MAX)
  const img = image
    ? { url: image.url, alt: image.alt, ...(image.width && image.height ? { width: image.width, height: image.height } : {}) }
    : OG_DEFAULT
  return {
    title: { absolute: t },
    description: d,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: 'en_US',
      siteName: SITE_NAME,
      url: path,
      title: t,
      description: d,
      images: [img],
    },
    twitter: {
      card: 'summary_large_image',
      title: t,
      description: d,
      images: [img.url],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  }
}
