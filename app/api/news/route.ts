export const runtime = 'edge'

import { NextResponse } from 'next/server'

interface NewsItem {
  title: string
  link: string
  pubDate: string
  source: string
}

interface EventItem {
  title: string
  date: string
  time: string
  source: string
  link: string
}

interface PhotoItem {
  title: string
  url: string
  author: string
  permalink: string
}

function stripHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, '').trim()
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, 's'))
  return match ? stripHtml(match[1].trim()) : ''
}

function extractSourceAttr(xml: string): string {
  const match = xml.match(/<source[^>]*url="[^"]*"[^>]*>(.*?)<\/source>/)
  return match ? stripHtml(match[1].trim()) : ''
}

const UA = 'VURMZ-Community/1.0'

async function fetchRSS(url: string, sourceName: string, maxItems = 8): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
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
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) return []
    const xml = await res.text()
    const items: NewsItem[] = []
    const chunks = xml.split('<item>').slice(1)
    for (const chunk of chunks.slice(0, 12)) {
      const title = extractTag(chunk, 'title')
      const link = extractTag(chunk, 'link')
      const pubDate = extractTag(chunk, 'pubDate')
      const source = extractSourceAttr(chunk)
      if (title && link) items.push({ title, link, pubDate, source: source || 'Local News' })
    }
    return items
  } catch { return [] }
}

// City of Centennial calendar — JSON API
async function fetchCentennialEvents(): Promise<EventItem[]> {
  try {
    const now = new Date()
    const start = now.toISOString().split('T')[0]
    const end = new Date(now.getTime() + 30 * 86400000).toISOString().split('T')[0]

    const res = await fetch('https://www.centennialco.gov/ocapi/calendars/getcalendaritems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify({
        Language: 'en-US',
        Ids: [
          '98b626d2-b900-44d0-945e-29c3258bd85e',
          '7d53bd41-50f8-4a8f-bf07-6df49d184905',
          'c55aa913-17c5-45cd-9734-32abf23a3e80',
          '969f9ef1-525c-4623-956c-d90b9d181dff',
          '613c83e1-b00c-4303-b732-f674592d0e1e',
          'ca1ab43a-3a9d-42cf-a79e-586fd381f997',
        ],
        StartDate: start,
        EndDate: end,
      }),
    })
    if (!res.ok) return []
    const data = await res.json() as Array<{ Title?: string; StartDate?: string; StartTime?: string; Url?: string; CalendarName?: string }>
    return data.slice(0, 10).map((e) => ({
      title: e.Title || '',
      date: e.StartDate || '',
      time: e.StartTime || '',
      source: 'City of Centennial',
      link: e.Url ? `https://www.centennialco.gov${e.Url}` : 'https://www.centennialco.gov/Calendar',
    })).filter(e => e.title)
  } catch { return [] }
}

// Arapahoe County calendar — JSON API
async function fetchArapahoeEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(
      'https://www.arapahoegov.com/_assets_/plugins/revizeCalendar/calendar_data_handler.php?webspace=arapahoe&relative_revize_url=//cms3.revize.com&protocol=https:',
      { headers: { 'User-Agent': UA } }
    )
    if (!res.ok) return []
    const data = await res.json() as Array<{ title?: string; start?: string; url?: string; primary_calendar_name?: string }>
    const now = Date.now()
    return data
      .filter(e => e.title && e.start && new Date(e.start).getTime() >= now)
      .slice(0, 8)
      .map(e => ({
        title: e.title || '',
        date: e.start ? new Date(e.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
        time: e.start ? new Date(e.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
        source: 'Arapahoe County',
        link: e.url || 'https://www.arapahoegov.com/calendar',
      }))
  } catch { return [] }
}

async function fetchColoradoPhotos(): Promise<PhotoItem[]> {
  try {
    const res = await fetch(
      'https://www.reddit.com/r/Colorado/top/.json?t=week&limit=20',
      { headers: { 'User-Agent': UA } }
    )
    if (!res.ok) return []
    const data = await res.json() as { data: { children: Array<{ data: Record<string, unknown> }> } }
    const photos: PhotoItem[] = []
    for (const post of data.data.children) {
      const p = post.data
      const url = p.url as string || ''
      if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('i.redd.it') || url.includes('i.imgur')) {
        photos.push({
          title: (p.title as string || '').slice(0, 80),
          url,
          author: `u/${p.author as string || 'unknown'}`,
          permalink: `https://reddit.com${p.permalink as string || ''}`,
        })
      }
    }
    return photos.slice(0, 8)
  } catch { return [] }
}

export async function GET() {
  try {
    const [
      googleNews, coloradoSun, denverite, nineNews, cpr, fiveTwoEighty, outThere,
      centennialCitizen, ssprd, chamber,
      centennialEvents, arapahoeEvents,
      photos,
    ] = await Promise.all([
      fetchGoogleNews(),
      fetchRSS('https://coloradosun.com/feed/', 'Colorado Sun', 8),
      fetchRSS('https://denverite.com/feed/', 'Denverite', 6),
      fetchRSS('https://www.9news.com/feeds/syndication/rss/news/local', '9NEWS', 6),
      fetchRSS('https://www.cpr.org/feed/', 'CPR News', 6),
      fetchRSS('https://5280.com/feed/', '5280 Magazine', 4),
      fetchRSS('https://www.outtherecolorado.com/feed/', 'OutThere Colorado', 4),
      fetchRSS('https://www.coloradocommunitymedia.com/search/?f=rss&t=article&l=25&s=start_time&sd=desc&q=centennial', 'Centennial Citizen', 6),
      fetchRSS('https://www.ssprd.org/DesktopModules/Blog/API/RSS/Get?tabid=469&moduleid=3670', 'Parks & Rec', 4),
      fetchRSS('https://www.bestchamber.com/1/feed', 'Denver Chamber', 4),
      fetchCentennialEvents(),
      fetchArapahoeEvents(),
      fetchColoradoPhotos(),
    ])

    // Combine all news
    const all = [...googleNews, ...coloradoSun, ...denverite, ...nineNews, ...cpr, ...fiveTwoEighty, ...outThere, ...centennialCitizen, ...ssprd, ...chamber]

    // Dedupe
    const seen = new Set<string>()
    const deduped = all.filter((item) => {
      const key = item.title.slice(0, 50).toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Sort newest first
    const sorted = deduped.sort((a, b) => {
      const da = new Date(a.pubDate).getTime()
      const db = new Date(b.pubDate).getTime()
      if (isNaN(da) && isNaN(db)) return 0
      if (isNaN(da)) return 1
      if (isNaN(db)) return -1
      return db - da
    })

    // Combine events, dedupe
    const allEvents = [...centennialEvents, ...arapahoeEvents]
    const seenEvents = new Set<string>()
    const dedupedEvents = allEvents.filter(e => {
      const key = e.title.slice(0, 40).toLowerCase()
      if (seenEvents.has(key)) return false
      seenEvents.add(key)
      return true
    })

    return NextResponse.json(
      {
        articles: sorted.slice(0, 20),
        events: dedupedEvents.slice(0, 12),
        photos,
        fetchedAt: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400' } }
    )
  } catch (error) {
    console.error('News fetch error:', error)
    return NextResponse.json({ articles: [], events: [], photos: [], fetchedAt: new Date().toISOString() }, { status: 500 })
  }
}
