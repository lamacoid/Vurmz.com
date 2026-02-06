'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, PhoneIcon, SparklesIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { siteInfo, navigation, getSmsLink } from '@/lib/site-info'

const header = {
  logoUrl: '/images/vurmz-logo-full.svg',
  ctaText: 'Start Order',
  ctaLink: '/order',
}

const weatherIcons: Record<number, string> = {
  0: '☀️',
  1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌧️', 53: '🌧️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌧️', 81: '🌧️', 82: '🌧️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=39.58&longitude=-104.87&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America/Denver'
        )
        const data = await res.json() as { current?: { temperature_2m: number; weather_code: number } }
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
          })
        }
      } catch {
        // Weather fetch failed silently
      }
    }
    fetchWeather()
  }, [])

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <>
      {/* Top info bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-vurmz-dark text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden sm:flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-slate-300" />
                {siteInfo.city}, {siteInfo.state}
              </span>
              <span className="text-white/70">{dateStr}</span>
              {weather && (
                <span className="flex items-center gap-1">
                  <span>{weatherIcons[weather.code] || '🌤️'}</span>
                  <span>{weather.temp}°F</span>
                </span>
              )}
            </div>
            <a href={getSmsLink()} className="flex items-center gap-1.5 hover:text-slate-300 transition-colors font-medium">
              <PhoneIcon className="h-4 w-4" />
              Text: {siteInfo.phone}
            </a>
          </div>
          <div className="sm:hidden flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <span>{dateStr}</span>
              {weather && (
                <span className="flex items-center gap-1">
                  <span>{weatherIcons[weather.code] || '🌤️'}</span>
                  <span>{weather.temp}°</span>
                </span>
              )}
            </div>
            <a href={getSmsLink()} className="flex items-center gap-1">
              <PhoneIcon className="h-4 w-4" />
              {siteInfo.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="fixed top-[36px] left-0 right-0 z-50 bg-[#2c3533]/95 backdrop-blur-xl border-b border-vurmz-teal/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/">
              <Image
                src={header.logoUrl}
                alt="VURMZ LLC - Laser Engraving"
                width={160}
                height={45}
                className="h-10 w-auto brightness-0 invert"
                priority
              />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={header.ctaLink}
                className="ml-4 px-6 py-2.5 bg-vurmz-teal text-white font-semibold text-sm rounded-xl hover:bg-vurmz-teal/90 transition-colors flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                {header.ctaText}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-300" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-[116px] left-4 right-4 z-50 bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={header.ctaLink}
                className="mt-4 px-6 py-3 bg-vurmz-teal text-white font-semibold rounded-xl text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {header.ctaText}
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={getSmsLink()}
                className="flex items-center justify-center gap-2 text-vurmz-teal font-medium"
              >
                <PhoneIcon className="w-5 h-5" />
                Text: {siteInfo.phone}
              </a>
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-[116px]" />
    </>
  )
}
