'use client'

import { useEffect, useState } from 'react'

interface AnalyticsData {
  today: { views: number }
  period: { views: number; days: number }
  chart: Array<{ date: string; views: number }>
  paths: Array<{ path: string; views: number }>
  referrers: Array<{ referrer: string; views: number }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [days, setDays] = useState(7)

  useEffect(() => {
    fetch(`/api/admin/analytics/overview?days=${days}`)
      .then(r => r.json())
      .then(d => setData(d as AnalyticsData))
      .catch(() => {})
  }, [days])

  if (!data) return <div className="px-4 py-6 text-[var(--a-ink-faint)] text-sm">Loading...</div>

  const maxViews = Math.max(...data.chart.map(d => d.views), 1)

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-[var(--a-ink)] mb-1">Analytics</h1>
      <p className="text-xs text-[var(--a-ink-faint)] mb-6">Clean views (excludes your visits)</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[var(--a-panel)] rounded-xl p-4 border border-[var(--a-line)]">
          <p className="text-[10px] text-[var(--a-ink-faint)] uppercase">Today</p>
          <p className="text-2xl font-bold text-[var(--a-accent)] mt-1">{data.today.views}</p>
          <p className="text-[10px] text-[var(--a-ink-faint)]">views</p>
        </div>
        <div className="bg-[var(--a-panel)] rounded-xl p-4 border border-[var(--a-line)]">
          <p className="text-[10px] text-[var(--a-ink-faint)] uppercase">Last {data.period.days}d</p>
          <p className="text-2xl font-bold text-[var(--a-ink)] mt-1">{data.period.views.toLocaleString()}</p>
          <p className="text-[10px] text-[var(--a-ink-faint)]">avg {Math.round(data.period.views / data.period.days)}/day</p>
        </div>
      </div>

      {/* Period tabs */}
      <div className="flex gap-1 mb-4 bg-[#1d474e] rounded-lg p-1">
        {[7, 14, 30].map(d => (
          <button key={d} onClick={() => setDays(d)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${days === d ? 'bg-[var(--a-panel)] text-[var(--a-ink)]' : 'text-[var(--a-ink-faint)]'}`}>
            {d}d
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[var(--a-panel)] rounded-xl p-4 border border-[var(--a-line)] mb-4">
        <p className="text-xs text-[var(--a-ink-soft)] mb-3">Daily Views</p>
        <div className="flex items-end gap-[2px] h-24">
          {data.chart.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end" title={`${d.date}: ${d.views}`}>
              <div
                className="w-full bg-[var(--a-accent)] rounded-t-sm min-h-[2px] transition-all"
                style={{ height: `${(d.views / maxViews) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-[var(--a-ink-faint)]">{data.chart[0]?.date?.slice(5)}</span>
          <span className="text-[9px] text-[var(--a-ink-faint)]">{data.chart[data.chart.length - 1]?.date?.slice(5)}</span>
        </div>
      </div>

      {/* Top Pages */}
      {data.paths.length > 0 && (
        <div className="bg-[var(--a-panel)] rounded-xl p-4 border border-[var(--a-line)] mb-4">
          <p className="text-xs text-[var(--a-ink-soft)] mb-3">Top Pages</p>
          <div className="space-y-2">
            {data.paths.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-[var(--a-ink-soft)] font-mono flex-1 truncate">{p.path}</span>
                <span className="text-xs text-[var(--a-accent)] font-semibold">{p.views}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referrers */}
      {data.referrers.length > 0 && (
        <div className="bg-[var(--a-panel)] rounded-xl p-4 border border-[var(--a-line)]">
          <p className="text-xs text-[var(--a-ink-soft)] mb-3">Top Referrers</p>
          <div className="space-y-2">
            {data.referrers.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-[var(--a-ink-soft)] flex-1 truncate break-all">{r.referrer}</span>
                <span className="text-xs text-[var(--a-accent)] font-semibold">{r.views}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
