'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { siteInfo } from '@/lib/site-info'

/**
 * The local bar. One line across the top that says: a real person is in
 * Centennial right now, and he is driving to you.
 *
 * Two rules it lives by.
 *
 * Honesty: the road conditions are NOT live. They are a typical-for-this-hour
 * model, so the bar says "usually" out loud rather than implying a live feed.
 * The weather IS live (Open-Meteo, the shop's own coordinates).
 *
 * Surface: this is the deep-teal band from the kit, sitting on the paper
 * ground. That means it takes the --feature-* tokens, never the page ink,
 * which reads as dark slate on a dark bar now that the second theme is gone.
 */

const ICON = 'h-3 w-3 flex-shrink-0'

function WeatherGlyph({ code }: { code: number }) {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  const cloud = <path d="M7 18h9a3.4 3.4 0 0 0 .4-6.8 5 5 0 0 0-9.5-1.3A3.6 3.6 0 0 0 7 18Z" {...stroke} />

  // Clear
  if (code === 0 || code === 1)
    return (
      <svg className={ICON} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="4.4" {...stroke} />
        <path d="M12 3.2v2M12 18.8v2M3.2 12h2M18.8 12h2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M18.2 5.8l-1.4 1.4M7.2 16.8l-1.4 1.4" {...stroke} />
      </svg>
    )
  // Partly cloudy
  if (code === 2)
    return (
      <svg className={ICON} viewBox="0 0 24 24" aria-hidden>
        <circle cx="9" cy="8" r="3.2" {...stroke} />
        {cloud}
      </svg>
    )
  // Overcast
  if (code === 3)
    return <svg className={ICON} viewBox="0 0 24 24" aria-hidden>{cloud}</svg>
  // Fog
  if (code >= 45 && code <= 48)
    return (
      <svg className={ICON} viewBox="0 0 24 24" aria-hidden>
        <path d="M4 8h16M4 12h16M4 16h16M4 20h16" {...stroke} />
      </svg>
    )
  // Snow
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return (
      <svg className={ICON} viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3v18M4 7.5l16 9M20 7.5l-16 9" {...stroke} />
      </svg>
    )
  // Thunderstorm
  if (code >= 95)
    return (
      <svg className={ICON} viewBox="0 0 24 24" aria-hidden>
        {cloud}
        <path d="M13 14l-2.5 4h3L11 22.5" {...stroke} />
      </svg>
    )
  // Rain, everything remaining
  return (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden>
      {cloud}
      <path d="M9 20.5l-.7 1.6M13 20.5l-.7 1.6M17 20.5l-.7 1.6" {...stroke} />
    </svg>
  )
}

type Level = 'light' | 'moderate' | 'heavy'
type Roads = { i25: Level; c470: Level; i225: Level }

/**
 * Typical congestion for the hour, not a live feed. A real feed needs a paid
 * traffic API; until there is one the bar says "usually" and means it.
 */
function typicalRoads(): Roads {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()

  if (day === 0 || day === 6) return { i25: 'light', c470: 'light', i225: 'light' }
  if (hour >= 21 || hour < 6) return { i25: 'light', c470: 'light', i225: 'light' }
  if (hour >= 7 && hour <= 9) return { i25: 'heavy', c470: 'moderate', i225: 'moderate' }
  if (hour >= 16 && hour <= 18) return { i25: 'heavy', c470: 'heavy', i225: 'moderate' }
  if (hour >= 9 && hour <= 10) return { i25: 'moderate', c470: 'moderate', i225: 'light' }
  if (hour >= 18 && hour <= 19) return { i25: 'moderate', c470: 'moderate', i225: 'light' }
  if (hour >= 6 && hour < 7) return { i25: 'moderate', c470: 'light', i225: 'light' }
  if (hour >= 15 && hour < 16) return { i25: 'moderate', c470: 'light', i225: 'light' }
  return { i25: 'moderate', c470: 'light', i225: 'light' }
}

// Brand status colours, not the framework's default traffic-light set.
const LEVEL_COLOR: Record<Level, string> = {
  light: 'var(--success)',
  moderate: 'var(--warning)',
  heavy: 'var(--error)',
}

function Road({ label, level }: { label: string; level: Level }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={`${label}, usually ${level} at this hour`}>
      <span>{label}</span>
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: LEVEL_COLOR[level] }}
        aria-hidden
      />
      <span className="sr-only">usually {level}</span>
    </span>
  )
}

// Routes where the marketing info bar does not belong.
const HIDDEN_PREFIXES = ['/account', '/checkout', '/admin']

export default function LocalTicker() {
  const pathname = usePathname()
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [roads, setRoads] = useState<Roads | null>(null)
  const [weather, setWeather] = useState<{ code: number; temp: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const tick = () => {
      const now = new Date()
      setDateStr(now.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Denver',
      }))
      setTimeStr(now.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver',
      }))
      setRoads(typicalRoads())
    }
    tick()
    const clock = setInterval(tick, 60000)

    ;(async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${siteInfo.coordinates.lat}&longitude=${siteInfo.coordinates.lng}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America/Denver`
        )
        const json = await res.json() as { current?: { weather_code: number; temperature_2m: number } }
        if (json.current) setWeather({ code: json.current.weather_code, temp: Math.round(json.current.temperature_2m) })
      } catch {
        // The bar reads fine without it.
      }
    })()

    return () => clearInterval(clock)
  }, [])

  if (pathname && HIDDEN_PREFIXES.some(p => pathname.startsWith(p))) return null

  const divider = <span className="text-[var(--feature-ink)]/25" aria-hidden>&middot;</span>

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-7 bg-[var(--feature-deep)] border-b border-white/10">
      <div className="max-w-[1280px] mx-auto h-full px-5 sm:px-11 flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.04em] text-[var(--feature-soft)]">
        {/* He is actually here. */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--feature-accent)] opacity-60 animate-ping motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--feature-accent)]" />
          </span>
          <span className="text-[var(--feature-ink)]">{siteInfo.city}, {siteInfo.stateAbbr}</span>
          {mounted && weather && (
            <span className="flex items-center gap-1.5 sm:hidden">
              <WeatherGlyph code={weather.code} />
              <span>{weather.temp}&deg;</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {mounted && dateStr && <span className="hidden md:inline">{dateStr}</span>}
          {mounted && timeStr && <span className="hidden sm:inline tabular-nums">{timeStr}</span>}

          {mounted && weather && (
            <span className="hidden sm:flex items-center gap-1.5">
              <WeatherGlyph code={weather.code} />
              <span className="tabular-nums">{weather.temp}&deg;</span>
            </span>
          )}

          {/* The roads. "Usually" is doing real work: this is a model of a
              normal week, not a live feed, and the bar should not imply one. */}
          {mounted && roads && (
            <span className="hidden lg:flex items-center gap-3 pl-4 border-l border-white/10">
              <span className="text-[var(--feature-ink)]/45">usually</span>
              <Road label="I-25" level={roads.i25} />
              <Road label="C-470" level={roads.c470} />
              <Road label="I-225" level={roads.i225} />
            </span>
          )}

          {/* The reason the bar exists: he drives it to you. */}
          <span className="hidden xl:flex items-center gap-3 pl-4 border-l border-white/10">
            {divider}
            <span className="text-[var(--feature-ink)]">Next run {siteInfo.deliveryRunDay}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
