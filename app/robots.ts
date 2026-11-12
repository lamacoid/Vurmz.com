import { MetadataRoute } from 'next'

// The private areas are closed to everyone. Everything public is open,
// and the AI search crawlers are named so there is no doubt they are
// welcome: a customer found VURMZ through ChatGPT in 2026-11.
const PRIVATE = ['/api/', '/account/', '/checkout/', '/admin/']
const AI_CRAWLERS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'Google-Extended', 'Applebot-Extended', 'Bingbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE },
    ],
    sitemap: 'https://www.vurmz.com/sitemap.xml',
  }
}
