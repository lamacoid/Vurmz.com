'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  inbox: { total: number; unread: number }
  jobs: { active: number; quoted: number; delivered: number; monthRevenue: number }
  analytics: { todayViews: number; periodViews: number; days: number }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/inbox?limit=0').then(r => r.json()),
      fetch('/api/admin/jobs/stats').then(r => r.json()),
      fetch('/api/admin/analytics/overview?days=7').then(r => r.json()),
    ]).then(([inbox, jobs, analytics]: any[]) => {
      setStats({
        inbox: { total: inbox.total || 0, unread: inbox.unread || 0 },
        jobs: jobs,
        analytics: { todayViews: analytics.today?.views || 0, periodViews: analytics.period?.views || 0, days: 7 },
      })
    }).catch(() => {})
  }, [])

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-cream mb-6">Dashboard</h1>

      {!stats ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="space-y-4">
          {/* Inbox */}
          <Link href="/admin/inbox" className="block bg-[#243B39] rounded-xl p-4 border border-white/5 hover:border-[#6BB8B2]/20 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Inbox</p>
                <p className="text-2xl font-bold text-cream mt-1">{stats.inbox.unread}</p>
                <p className="text-xs text-gray-500">unread messages</p>
              </div>
              {stats.inbox.unread > 0 && (
                <span className="bg-vurmz-cta text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {stats.inbox.unread}
                </span>
              )}
            </div>
          </Link>

          {/* Jobs */}
          <Link href="/admin/jobs" className="block bg-[#243B39] rounded-xl p-4 border border-white/5 hover:border-[#6BB8B2]/20 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Jobs</p>
                <p className="text-2xl font-bold text-cream mt-1">{stats.jobs.active}</p>
                <p className="text-xs text-gray-500">active · {stats.jobs.quoted} quoted</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#6BB8B2]">${stats.jobs.monthRevenue?.toLocaleString() || 0}</p>
                <p className="text-[10px] text-gray-500">this month</p>
              </div>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/admin/analytics" className="block bg-[#243B39] rounded-xl p-4 border border-white/5 hover:border-[#6BB8B2]/20 transition-colors">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Site Traffic (clean)</p>
              <div className="flex items-baseline gap-4 mt-1">
                <div>
                  <span className="text-2xl font-bold text-cream">{stats.analytics.todayViews}</span>
                  <span className="text-xs text-gray-500 ml-1">today</span>
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-300">{stats.analytics.periodViews}</span>
                  <span className="text-xs text-gray-500 ml-1">7 days</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a href="https://vurmz.com" target="_blank" rel="noreferrer" className="bg-[#243B39] rounded-xl p-3 text-center border border-white/5 hover:border-[#6BB8B2]/20 transition-colors">
              <p className="text-xs text-gray-400">View Site</p>
              <p className="text-sm text-cream font-medium mt-0.5">vurmz.com</p>
            </a>
            <Link href="/admin/customers" className="bg-[#243B39] rounded-xl p-3 text-center border border-white/5 hover:border-[#6BB8B2]/20 transition-colors">
              <p className="text-xs text-gray-400">Customers</p>
              <p className="text-sm text-cream font-medium mt-0.5">Manage</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
