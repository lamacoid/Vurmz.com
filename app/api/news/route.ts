export const runtime = 'edge'

import { NextResponse } from 'next/server'

interface NewsItem {
  title: string
  link: string
  pubDate: string
  source: string
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
}

function stripHtml(str: string): string {
  return decodeEntities(str.replace(/<[^>]*>/g, '').trim())
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, 's'))
  return match ? stripHtml(match[1].trim()) : ''
}

function extractSourceAttr(xml: string): string {
  const match = xml.match(/<source[^>]*url="[^"]*"[^>]*>(.*?)<\/source>/)
  return match ? stripHtml(match[1].trim()) : ''
}

async function fetchRSS(url: string, sourceName: string, maxItems = 8): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'VURMZ-Community/1.0' } })
    if (!res.ok) return []
    const xml = await res.text()
    const items: NewsItem[] = []
    const chunks = xml.split('<item>').slice(1)
    for (const chunk of chunks.slice(0, maxItems)) {
      const title = extractTag(chunk, 'title')
      const link = extractTag(chunk, 'link')
      const pubDate = extractTag(chunk, 'pubDate')
      if (title && link) items.push({ title, link, pubDate, source: sourceName })
    }
    return items
  } catch { return [] }
}

async function fetchGoogleNews(): Promise<NewsItem[]> {
  const query = 'Centennial Colorado OR "South Denver" OR "Arapahoe County" -crime -accident'
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'VURMZ-Community/1.0' } })
    if (!res.ok) return []
    const xml = await res.text()
    const items: NewsItem[] = []
    const chunks = xml.split('<item>').slice(1)
    for (const chunk of chunks.slice(0, 15)) {
      const title = extractTag(chunk, 'title')
      const link = extractTag(chunk, 'link')
      const pubDate = extractTag(chunk, 'pubDate')
      const source = extractSourceAttr(chunk)
      if (title && link) items.push({ title, link, pubDate, source: source || 'Local News' })
    }
    return items
  } catch { return [] }
}

export async function GET() {
  try {
    const [googleNews, coloradoSun, denverPost] = await Promise.all([
      fetchGoogleNews(),
      fetchRSS('https://coloradosun.com/feed/', 'Colorado Sun'),
      fetchRSS('https://www.denverpost.com/feed/', 'Denver Post'),
    ])

    // Combine, dedupe, sort
    const all = [...googleNews, ...coloradoSun, ...denverPost]
    const seen = new Set<string>()
    const deduped = all.filter((item) => {
      const key = item.title.slice(0, 50).toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    const sorted = deduped.sort((a, b) => {
      const da = new Date(a.pubDate).getTime()
      const db = new Date(b.pubDate).getTime()
      if (isNaN(da) && isNaN(db)) return 0
      if (isNaN(da)) return 1
      if (isNaN(db)) return -1
      return db - da
    })

    return NextResponse.json(
      { articles: sorted.slice(0, 20), fetchedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400' } }
    )
  } catch (error) {
    console.error('News fetch error:', error)
    return NextResponse.json({ articles: [], fetchedAt: new Date().toISOString() }, { status: 500 })
  }
}
