import { NextRequest, NextResponse } from 'next/server'
import { getEnv } from '@/lib/db/client'

export const runtime = 'edge'

const JDS_API = 'https://api.jdsapp.com/get-product-details-by-skus'

// Lightweight in-memory search index — loaded once per cold start
let searchIndex: { sku: string; name: string }[] | null = null

async function getSearchIndex(reqUrl: string): Promise<{ sku: string; name: string }[]> {
  if (searchIndex) return searchIndex

  // Derive origin from the request URL for local dev compatibility
  const origin = new URL(reqUrl).origin
  const res = await fetch(`${origin}/data/material-search-index.json`)
  if (!res.ok) return []
  searchIndex = (await res.json()) as { sku: string; name: string }[]
  return searchIndex
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()

  if (q.length < 2) {
    return NextResponse.json({ ok: true, data: { results: [] } })
  }

  const index = await getSearchIndex(req.url)

  // Search by name or SKU
  const terms = q.split(/\s+/)
  const matches = index.filter(item => {
    const haystack = `${item.sku} ${item.name}`.toLowerCase()
    return terms.every(t => haystack.includes(t))
  }).slice(0, 24)

  if (matches.length === 0) {
    return NextResponse.json({ ok: true, data: { results: [] } })
  }

  // Pull images from JDS API
  const env = getEnv()
  const token = (env as Record<string, string>).JDS_API_TOKEN

  if (token) {
    try {
      const res = await fetch(JDS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, skus: matches.map(m => m.sku) }),
      })
      if (res.ok) {
        const jdsData = (await res.json()) as Record<string, unknown>[]
        const jdsMap = Object.fromEntries(
          jdsData
            .filter(d => d.name !== 'unavailable')
            .map(d => [d.sku as string, d])
        )

        const results = matches.map(m => {
          const jds = jdsMap[m.sku]
          return {
            sku: m.sku,
            name: jds ? (jds.name as string) : m.name,
            thumbnail: jds ? (jds.thumbnail as string) : '',
            inStock: jds ? (jds.availableQuantity as number) > 0 : true,
          }
        })

        return NextResponse.json(
          { ok: true, data: { results, total: results.length } },
          { headers: { 'Cache-Control': 'public, max-age=300' } }
        )
      }
    } catch {
      // Fall through to basic results
    }
  }

  // Fallback without images
  return NextResponse.json({
    ok: true,
    data: {
      results: matches.map(m => ({ sku: m.sku, name: m.name, thumbnail: '', inStock: true })),
      total: matches.length,
    },
  })
}
