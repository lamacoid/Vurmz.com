'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// WMO weather code → emoji
function wmoIcon(code: number): string {
  if (code === 0 || code === 1) return '☀️'
  if (code === 2) return '⛅'
  if (code === 3) return '☁️'
  if (code >= 45 && code <= 48) return '🌫️'
  if (code >= 51 && code <= 55) return '🌧️'
  if (code >= 61 && code <= 65) return '🌧️'
  if (code >= 71 && code <= 77) return '❄️'
  if (code >= 80 && code <= 82) return '🌧️'
  if (code >= 85 && code <= 86) return '❄️'
  if (code >= 95) return '⛈️'
  return '☀️'
}

type TrafficLevels = { i25: string; c470: string; i225: string }

function getTraffic(): TrafficLevels {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()

  if (day === 0 || day === 6) return { i25: 'Light', c470: 'Light', i225: 'Light' }
  if (hour >= 21 || hour < 6) return { i25: 'Light', c470: 'Light', i225: 'Light' }

  if (hour >= 7 && hour <= 9) return { i25: 'Heavy', c470: 'Moderate', i225: 'Moderate' }
  if (hour >= 16 && hour <= 18) return { i25: 'Heavy', c470: 'Heavy', i225: 'Moderate' }
  if (hour >= 6 && hour < 7) return { i25: 'Moderate', c470: 'Light', i225: 'Light' }
  if (hour >= 9 && hour <= 10) return { i25: 'Moderate', c470: 'Moderate', i225: 'Light' }
  if (hour >= 15 && hour < 16) return { i25: 'Moderate', c470: 'Light', i225: 'Light' }
  if (hour >= 18 && hour <= 19) return { i25: 'Moderate', c470: 'Moderate', i225: 'Light' }

  return { i25: 'Moderate', c470: 'Light', i225: 'Light' }
}

function dotBg(level: string): string {
  if (level === 'Heavy') return 'bg-red-400'
  if (level === 'Moderate') return 'bg-amber-400'
  return 'bg-emerald-400'
}

function TrafficDot({ label, level }: { label: string; level: string }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={`${label}: ${level} traffic`}>
      <span className="text-[var(--ink-soft)]">{label}</span>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotBg(level)}`} />
    </span>
  )
}

// Routes where the marketing info bar doesn't belong.
const HIDDEN_PREFIXES = ['/account', '/checkout', '/admin']

export default function LocalTicker() {
  const pathname = usePathname()
  const [weatherText, setWeatherText] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [traffic, setTraffic] = useState<TrafficLevels | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateClock = () => {
      const now = new Date()
      setDateStr(now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'America/Denver',
      }))
      setTimeStr(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Denver',
      }))
      setTraffic(getTraffic())
    }
    updateClock()
    const clockInterval = setInterval(updateClock, 60000)

    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=39.58&longitude=-104.87&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America/Denver'
        )
        const json = await res.json() as { current?: { weather_code: number; temperature_2m: number } }
        const c = json.current
        if (c) {
          setWeatherText(`${wmoIcon(c.weather_code)} ${Math.round(c.temperature_2m)}°`)
        }
      } catch {
        // silently fail
      }
    }
    fetchWeather()

    return () => clearInterval(clockInterval)
  }, [])

  // Not on the customer portal, checkout, or admin back-office.
  if (pathname && HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-7 bg-[#15363b]/95 backdrop-blur-sm border-b border-[var(--hairline)]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-mono tracking-wide text-[var(--ink-soft)]">
        {/* Left — live local anchor */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#7FCFD4] opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7FCFD4]" />
          </span>
          <span className="text-[var(--ink-soft)]">Centennial, CO</span>
        </div>

        {/* Right — date / time / weather / traffic */}
        <div className="flex items-center gap-3 sm:gap-4 mx-auto sm:mx-0">
          {mounted && dateStr && <span className="hidden sm:inline">{dateStr}</span>}
          {mounted && timeStr && <span>{timeStr}</span>}
          {mounted && weatherText && <><span className="text-gray-600" aria-hidden>·</span><span>{weatherText}</span></>}
          {mounted && traffic && (
            <span className="hidden md:flex items-center gap-3 pl-1 border-l border-[var(--hairline)] ml-1">
              <TrafficDot label="I-25" level={traffic.i25} />
              <TrafficDot label="C-470" level={traffic.c470} />
              <TrafficDot label="I-225" level={traffic.i225} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
