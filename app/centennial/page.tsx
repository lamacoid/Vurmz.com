'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowTopRightOnSquareIcon,
  NewspaperIcon,
  CloudIcon,
  MapPinIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'

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

interface WeatherData {
  temp: number
  icon: string
  desc: string
  high: number
  low: number
  wind: number
  humidity: number
}

function wmoIcon(code: number): string {
  if (code === 0 || code === 1) return '\u2600\uFE0F'
  if (code === 2) return '\u26C5'
  if (code === 3) return '\u2601\uFE0F'
  if (code >= 45 && code <= 48) return '\uD83C\uDF2B\uFE0F'
  if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return '\uD83C\uDF27\uFE0F'
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return '\u2744\uFE0F'
  if (code >= 95) return '\u26C8\uFE0F'
  return '\u2600\uFE0F'
}

function wmoDesc(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code >= 45 && code <= 48) return 'Foggy'
  if (code >= 51 && code <= 55) return 'Drizzle'
  if (code >= 61 && code <= 65) return 'Rain'
  if (code >= 71 && code <= 77) return 'Snow'
  if (code >= 80 && code <= 82) return 'Showers'
  if (code >= 85 && code <= 86) return 'Snow showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Clear'
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  if (isNaN(then)) return ''
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}

function Widget({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.06] transition-all duration-300 ${className}`}>
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </div>
  )
}

function WHeader({ icon: Icon, label, color = 'text-vurmz-teal', live = false }: { icon: React.ComponentType<{ className?: string }>; label: string; color?: string; live?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="text-[11px] font-mono text-gray-400 tracking-[0.15em] uppercase">{label}</span>
      {live && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-auto" />}
    </div>
  )
}

export default function CentennialPage() {
  const [articles, setArticles] = useState<NewsItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [photoIdx, setPhotoIdx] = useState(0)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json() as Promise<{ articles?: NewsItem[]; events?: EventItem[]; photos?: PhotoItem[] }>)
      .then((data) => {
        setArticles(data.articles || [])
        setEvents(data.events || [])
        setPhotos(data.photos || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch('https://api.open-meteo.com/v1/forecast?latitude=39.58&longitude=-104.87&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Denver&forecast_days=1')
      .then((r) => r.json() as Promise<{
        current?: { temperature_2m: number; weather_code: number; relative_humidity_2m: number; wind_speed_10m: number }
        daily?: { temperature_2m_max: number[]; temperature_2m_min: number[] }
      }>)
      .then((data) => {
        const c = data.current; const d = data.daily
        if (c) setWeather({ temp: Math.round(c.temperature_2m), icon: wmoIcon(c.weather_code), desc: wmoDesc(c.weather_code), high: d ? Math.round(d.temperature_2m_max[0]) : 0, low: d ? Math.round(d.temperature_2m_min[0]) : 0, wind: Math.round(c.wind_speed_10m), humidity: Math.round(c.relative_humidity_2m) })
      })
      .catch(() => {})
  }, [])

  // Cycle photos
  useEffect(() => {
    if (photos.length < 2) return
    const interval = setInterval(() => setPhotoIdx((i) => (i + 1) % photos.length), 8000)
    return () => clearInterval(interval)
  }, [photos])

  return (
    <div className="bg-vurmz-dark min-h-screen relative">
      {/* Cycling Colorado photo background */}
      {photos.length > 0 && photos.map((photo, i) => (
        <div
          key={photo.url}
          className="fixed inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{
            opacity: i === photoIdx ? 0.12 : 0,
            backgroundImage: `url(${photo.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(1px)',
            zIndex: 0,
          }}
        />
      ))}
      <div className="fixed inset-0 bg-vurmz-dark/75 z-0" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-10 sm:pt-14 pb-4 sm:pb-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-3">
              <MapPinIcon className="w-4 h-4 text-vurmz-cta" />
              <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase">Community Board</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-2">
              Centennial, CO
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
              Local news, weather, traffic, and community resources from the South Denver metro.
            </p>
          </div>
        </section>

        {/* Dashboard */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">

            {/* Row 1: Weather + Traffic */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <Widget className="sm:col-span-2">
                <WHeader icon={CloudIcon} label="Weather" live />
                {weather ? (
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-cream">{weather.temp}&deg;</span>
                          <span className="text-2xl">{weather.icon}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{weather.desc}</p>
                      </div>
                      <div className="text-right text-xs text-gray-500 space-y-0.5">
                        <p>High <span className="text-cream">{weather.high}&deg;</span></p>
                        <p>Low <span className="text-cream">{weather.low}&deg;</span></p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-xs text-gray-500 pt-3 border-t border-white/[0.06]">
                      <span>Wind <span className="text-gray-300">{weather.wind} mph</span></span>
                      <span>Humidity <span className="text-gray-300">{weather.humidity}%</span></span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 animate-pulse">
                    <div className="h-10 bg-white/[0.06] rounded w-1/2 mb-3" />
                    <div className="h-4 bg-white/[0.04] rounded w-2/3" />
                  </div>
                )}
              </Widget>

              <Widget className="sm:col-span-3">
                <WHeader icon={() => <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />} label="Live Traffic" live />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d49200!2d-104.87!3d39.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1&layer=traffic"
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Centennial CO Live Traffic"
                />
              </Widget>
            </div>

            {/* Row 2: News (2-col cards) */}
            <Widget>
              <WHeader icon={NewspaperIcon} label="Local News" />
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-vurmz-dark p-4 animate-pulse">
                      <div className="h-4 bg-white/[0.06] rounded w-4/5 mb-2" />
                      <div className="h-3 bg-white/[0.04] rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
                  {articles.slice(0, 8).map((article, idx) => (
                    <a
                      key={idx}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-vurmz-dark/80 hover:bg-white/[0.03] p-4 transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-medium text-cream leading-snug mb-1 group-hover:text-vurmz-cta transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span className="text-gray-400">{article.source}</span>
                          {article.pubDate && timeAgo(article.pubDate) && (
                            <><span>&middot;</span><span>{timeAgo(article.pubDate)}</span></>
                          )}
                        </div>
                      </div>
                      <ArrowTopRightOnSquareIcon className="w-3 h-3 text-gray-600 group-hover:text-vurmz-cta flex-shrink-0 mt-1 transition-colors" />
                    </a>
                  ))}
                </div>
              )}
            </Widget>

            {/* Row 3: Events */}
            {events.length > 0 && (
              <Widget>
                <WHeader icon={() => (
                  <svg className="w-3.5 h-3.5 text-vurmz-cta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                )} label="Upcoming Events" color="text-vurmz-cta" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
                  {events.slice(0, 6).map((event, idx) => (
                    <a
                      key={idx}
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-vurmz-dark/80 hover:bg-white/[0.03] p-4 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 text-center">
                          <p className="text-[11px] font-mono text-vurmz-cta uppercase">{event.date}</p>
                          {event.time && <p className="text-[10px] text-gray-500">{event.time}</p>}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-medium text-cream leading-snug group-hover:text-vurmz-cta transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-[10px] text-gray-500 mt-0.5">{event.source}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </Widget>
            )}

            {/* Row 4: Colorado Photos */}
            {photos.length > 0 && (
              <Widget>
                <WHeader icon={CameraIcon} label="Colorado This Week" color="text-vurmz-cta" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04]">
                  {photos.slice(0, 4).map((photo, idx) => (
                    <a
                      key={idx}
                      href={photo.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative bg-vurmz-dark overflow-hidden"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-[10px] text-white/80 line-clamp-1">{photo.title}</p>
                        <p className="text-[9px] text-white/50">{photo.author}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </Widget>
            )}

            {/* Row 4: Community Resources */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'City of Centennial', href: 'https://www.centennialco.gov', desc: 'City services & info' },
                { label: 'Arapahoe County', href: 'https://www.arapahoegov.com', desc: 'County government' },
                { label: 'Parks & Trails', href: 'https://www.sspr.org', desc: 'South Suburban Parks & Rec' },
                { label: 'Arapahoe Libraries', href: 'https://arapahoelibraries.org', desc: 'Events & programs' },
                { label: 'CDOT Traffic', href: 'https://www.cotrip.org/map', desc: 'Live cameras & road info' },
                { label: 'Cherry Creek Schools', href: 'https://www.cherrycreekschools.org', desc: 'School district' },
                { label: 'South Metro Fire', href: 'https://www.southmetro.org', desc: 'Fire & rescue' },
                { label: 'Denver Chamber', href: 'https://www.southmetrodenver.com', desc: 'Business community' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-lg bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-vurmz-cta/30 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <p className="text-xs font-medium text-gray-300 group-hover:text-vurmz-cta transition-colors mb-0.5">{link.label}</p>
                  <p className="text-[10px] text-gray-500">{link.desc}</p>
                </a>
              ))}
            </div>

            {/* Sources */}
            <p className="text-gray-600 text-[11px] text-center pt-3">
              City of Centennial &middot; Arapahoe County &middot; Google News &middot; Colorado Sun &middot; Denverite &middot; 9NEWS &middot; CPR &middot; Centennial Citizen &middot; Parks &amp; Rec &middot; r/Colorado &middot; Open-Meteo
            </p>
          </div>
        </section>

        {/* Photo credit */}
        {photos.length > 0 && photos[photoIdx] && (
          <div className="fixed bottom-4 right-4 z-20">
            <a
              href={photos[photoIdx].permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-white/30 hover:text-white/60 transition-colors bg-black/30 backdrop-blur-sm px-2 py-1 rounded"
            >
              {photos[photoIdx].author} via r/Colorado
            </a>
          </div>
        )}

        {/* VURMZ */}
        <section className="py-8 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm">
              Brought to you by <Link href="/" className="text-vurmz-teal font-medium">VURMZ</Link> &mdash; laser engraving in Centennial, CO.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
