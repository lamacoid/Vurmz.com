'use client'
/**
 * The delivery-zone map: a real street map (Leaflet + CartoDB Positron
 * tiles) with VURMZ's distance-based delivery zones drawn over it. Client
 * only — Leaflet touches window, so it lazy-imports itself in an effect
 * (same reason the Builder canvas does). Centered on Centennial generally,
 * NOT the shop's address; zones are approximate and distance-based.
 */
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

// Centennial city-center area (public landmark, not a home address).
const CENTER: [number, number] = [39.5807, -104.8772]
const MI = 1609.34

const ZONES = [
  { label: 'Next door', radius: 2 * MI, color: '#8A4943', fill: 0.34, dash: undefined },
  { label: 'Home zone', radius: 12 * MI, color: '#C67A6F', fill: 0.16, dash: undefined },
  { label: 'Greater metro', radius: 30 * MI, color: '#16525C', fill: 0.07, dash: '8 6' },
]

export default function DeliveryMap() {
  const ref = useRef<HTMLDivElement>(null)
  const madeRef = useRef(false)

  useEffect(() => {
    if (madeRef.current || !ref.current) return
    madeRef.current = true
    let cleanup = () => {}
    ;(async () => {
      const L = (await import('leaflet')).default
      const map = L.map(ref.current!, {
        center: CENTER,
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      // Zones, largest first so the small ones sit on top.
      for (const z of [...ZONES].reverse()) {
        L.circle(CENTER, {
          radius: z.radius,
          color: z.color,
          weight: 2,
          opacity: 0.9,
          fillColor: z.color,
          fillOpacity: z.fill,
          dashArray: z.dash,
        }).addTo(map)
      }

      // The shop: a laser-red dot, no default marker icon (avoids the
      // broken-icon-asset gotcha entirely).
      L.circleMarker(CENTER, {
        radius: 6,
        color: '#a01818',
        weight: 2,
        fillColor: '#FF2A2A',
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip('The shop', { permanent: false, direction: 'top' })

      // Frame the greater-metro circle nicely.
      map.fitBounds(L.latLng(CENTER).toBounds(30 * MI * 2.1), { padding: [10, 10] })

      cleanup = () => map.remove()
    })()
    return () => cleanup()
  }, [])

  return (
    <div
      ref={ref}
      className="w-full h-[420px] sm:h-[520px] rounded-sm border border-[var(--hairline)] overflow-hidden bg-[var(--surface)]"
      aria-label="Map of VURMZ delivery zones across the Denver metro"
    />
  )
}
