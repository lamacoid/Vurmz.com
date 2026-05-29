'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/admin/icons'

interface Stats {
  inbox: { total: number; unread: number }
  jobs: { active: number; quoted: number; delivered: number; monthRevenue: number }
  analytics: { todayViews: number; periodViews: number; days: number }
}

function StatCard({
  title,
  value,
  sub,
  accent,
  href,
  icon,
}: {
  title: string
  value: string | number
  sub?: string
  accent?: 'teal' | 'coral' | 'cream'
  href: string
  icon: string
}) {
  const border = accent === 'coral' ? 'hover:border-[#C46B4D]/30' : 'hover:border-[#6BB8B2]/30'
  const ring = accent === 'coral' ? 'text-[#C46B4D]' : 'text-[#6BB8B2]'
  return (
    <Link
      href={href}
      className={`group bg-[#235158] rounded-xl p-5 border border-white/5 ${border} transition-colors`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">{title}</p>
        <Icon name={icon} className={`w-4 h-4 ${ring} opacity-70`} />
      </div>
      <p className="text-3xl font-bold text-cream mb-1">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </Link>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/inbox?limit=0').then(r => r.json()),
      fetch('/api/admin/jobs/stats').then(r => r.json()),
      fetch('/api/admin/analytics/overview?days=7').then(r => r.json()),
    ])
      .then(results => {
        const [inbox, jobs, analytics] = results as [
          { total?: number; unread?: number },
          Stats['jobs'],
          { today?: { views?: number }; period?: { views?: number } }
        ]
        setStats({
          inbox: { total: inbox.total || 0, unread: inbox.unread || 0 },
          jobs: jobs,
          analytics: { todayViews: analytics.today?.views || 0, periodViews: analytics.period?.views || 0, days: 7 },
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cream">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Everything at a glance.</p>
      </div>

      {!stats ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Unread inbox"
              value={stats.inbox.unread}
              sub={`${stats.inbox.total} total messages`}
              accent="coral"
              href="/admin/inbox"
              icon="inbox"
            />
            <StatCard
              title="Active jobs"
              value={stats.jobs.active}
              sub={`${stats.jobs.quoted} quoted · ${stats.jobs.delivered} delivered`}
              href="/admin/jobs"
              icon="briefcase"
            />
            <StatCard
              title="Revenue (30d)"
              value={`$${(stats.jobs.monthRevenue || 0).toLocaleString()}`}
              sub="This month"
              href="/admin/revenue"
              icon="dollar"
            />
            <StatCard
              title="Site traffic"
              value={stats.analytics.todayViews}
              sub={`${stats.analytics.periodViews} over ${stats.analytics.days} days`}
              href="/admin/analytics"
              icon="chart"
            />
          </div>

          <section>
            <h2 className="text-sm font-semibold text-cream mb-3">Quick actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <QuickAction href="/admin/content/media" icon="image" label="Media library" />
              <QuickAction href="/admin/customers" icon="users" label="Customers" />
              <QuickAction href="/admin/content/settings" icon="settings" label="Site settings" />
              <QuickAction href="https://vurmz.com" external icon="chevron" label="View site" />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function QuickAction({ href, icon, label, external }: { href: string; icon: string; label: string; external?: boolean }) {
  const Component = external ? 'a' : Link
  return (
    <Component
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="flex items-center gap-3 bg-[#235158] hover:bg-[#2a4441] rounded-xl p-3 border border-white/5 hover:border-[#6BB8B2]/20 transition-all"
    >
      <Icon name={icon} className="w-4 h-4 text-[#6BB8B2]" />
      <span className="text-sm text-cream">{label}</span>
    </Component>
  )
}
