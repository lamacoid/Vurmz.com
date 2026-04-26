'use client'
import { useEffect, useState } from 'react'

export interface NavLink {
  id: string
  label: string
  href: string
  opensNewTab?: boolean
  children?: NavLink[]
}

type Placement = 'header' | 'footer' | 'footer-legal' | 'mobile'

const CACHE_KEY = 'vurmz_nav_v1'
const CACHE_TTL_MS = 5 * 60 * 1000

interface Cached {
  fetchedAt: number
  data: Record<Placement, NavLink[]>
}

function loadCache(): Cached | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Cached
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function saveCache(data: Record<Placement, NavLink[]>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data }))
  } catch {}
}

export function usePublicNav(placement: Placement, fallback: NavLink[]): NavLink[] {
  const [nav, setNav] = useState<NavLink[]>(() => {
    const cached = typeof window !== 'undefined' ? loadCache() : null
    return cached?.data?.[placement] && cached.data[placement].length > 0 ? cached.data[placement] : fallback
  })

  useEffect(() => {
    fetch('/api/public/navigation')
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        const parsed = j as { ok?: boolean; data?: Record<Placement, NavLink[]> } | null
        if (parsed?.ok && parsed.data) {
          saveCache(parsed.data)
          const fresh = parsed.data[placement]
          if (fresh && fresh.length > 0) setNav(fresh)
        }
      })
      .catch(() => {})
  }, [placement])

  return nav
}
