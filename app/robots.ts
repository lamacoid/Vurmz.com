import { MetadataRoute } from 'next'

// The private areas are closed to everyone. Everything public is open, and
// the search and AI crawlers are named so there is no doubt they are
// welcome: a customer found VURMZ through ChatGPT in 2026-11.
//
// /api/media/ is opened on purpose. Product photos are served from there,
// and with all of /api/ closed, no search engine could index them or show
// them in a result.
const PRIVATE = ['/api/', '/account/', '/checkout/', '/admin/']
const OPEN = ['/', '/api/media/']
const SEARCH_CRAWLERS = ['Googlebot', 'Googlebot-Image', 'Bingbot', 'DuckDuckBot', 'Applebot']
const AI_CRAWLERS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'Google-Extended', 'Applebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: OPEN, disallow: PRIVATE },
      { userAgent: SEARCH_CRAWLERS, allow: OPEN, disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: OPEN, disallow: PRIVATE },
    ],
    sitemap: 'https://www.vurmz.com/sitemap.xml',
  }
}
