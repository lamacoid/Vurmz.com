'use client'

import { useState, useEffect } from 'react'

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

function tc(level: string): string {
  if (level === 'Heavy') return 'text-red-400'
  if (level === 'Moderate') return 'text-yellow-400'
  return 'text-green-400'
}

export default function LocalTicker() {
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

  if (!mounted) return <div className="h-7" />

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#1a2e2c] border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4 sm:gap-6 py-1.5 text-[11px] font-mono tracking-wide text-gray-500">
        {dateStr && <span>{dateStr}</span>}
        {timeStr && <><span className="text-gray-700">·</span><span>{timeStr}</span></>}
        {weatherText && <><span className="text-gray-700">·</span><span>{weatherText}</span></>}
        {traffic && <>
          <span className="hidden sm:inline text-gray-700">·</span>
          <span className="hidden sm:inline">I-25 <span className={tc(traffic.i25)}>{traffic.i25}</span></span>
          <span className="hidden md:inline text-gray-700">·</span>
          <span className="hidden md:inline">C-470 <span className={tc(traffic.c470)}>{traffic.c470}</span></span>
          <span className="hidden md:inline text-gray-700">·</span>
          <span className="hidden md:inline">I-225 <span className={tc(traffic.i225)}>{traffic.i225}</span></span>
        </>}
      </div>
    </div>
  )
}
