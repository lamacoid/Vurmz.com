'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/admin/icons'
import { money } from '@/lib/format'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  tags: string[]
  orderCount: number
  lifetimeValueCents: number
  createdAt: string
}

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const q = search ? `?q=${encodeURIComponent(search)}` : ''
    const res = await fetch(`/api/admin/customers${q}`)
    const json = (await res.json()) as { data?: { customers: Customer[] } }
    setCustomers(json.data?.customers ?? [])
    setLoading(false)
  }, [search])

  useEffect(() => {
    const t = setTimeout(() => load(), 200)
    return () => clearTimeout(t)
  }, [load])

  async function create() {
    if (!newEmail) return
    setBusy(true)
    const res = await fetch('/api/admin/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail, name: newName }),
    })
    const json = (await res.json()) as { ok?: boolean; data?: { customer: { id: string } } }
    setBusy(false)
    if (json.ok && json.data?.customer.id) {
      router.push(`/admin/customers/${json.data.customer.id}`)
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Everyone who&rsquo;s ordered, quoted, or signed up.</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="inline-flex items-center gap-2 px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] text-white text-sm font-semibold rounded-md"
        >
          <Icon name="plus" className="w-4 h-4" />
          New customer
        </button>
      </div>

      {creating && (
        <div className="bg-[#243B39] border border-white/5 rounded-xl p-4 mb-5">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">New customer</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
            <input
              type="email"
              placeholder="email@example.com"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
            />
            <input
              placeholder="Name (optional)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
            />
            <button
              onClick={create}
              disabled={!newEmail || busy}
              className="px-4 h-9 bg-[#6BB8B2] hover:bg-[#5aa49e] disabled:opacity-50 text-[#1a2f2e] text-sm font-semibold rounded-md"
            >
              {busy ? 'Saving…' : 'Create'}
            </button>
          </div>
        </div>
      )}

      <input
        placeholder="Search by name, email, or company…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-2 bg-[#243B39] border border-white/5 rounded-md text-sm text-cream placeholder:text-gray-500 outline-none focus:border-[#6BB8B2] mb-4"
      />

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : customers.length === 0 ? (
        <div className="bg-[#243B39] border border-white/5 rounded-xl p-10 text-center">
          <Icon name="users" className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-cream text-sm font-semibold mb-1">{search ? 'No matches' : 'No customers yet'}</p>
          <p className="text-gray-500 text-xs">{search ? 'Try a different search.' : 'They\'ll appear here automatically after the first order or sign-in.'}</p>
        </div>
      ) : (
        <div className="bg-[#243B39] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
          {customers.map(c => (
            <Link
              key={c.id}
              href={`/admin/customers/${c.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cream truncate">{c.name || c.email}</p>
                <p className="text-[11px] text-gray-500 truncate">{c.email}{c.company ? ` · ${c.company}` : ''}{c.phone ? ` · ${c.phone}` : ''}</p>
                {c.tags && c.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {c.tags.slice(0, 4).map(t => (
                      <span key={t} className="text-[9px] bg-[#6BB8B2]/10 text-[#6BB8B2] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-semibold text-cream">{money(c.lifetimeValueCents)}</p>
                <p className="text-[10px] text-gray-500">{c.orderCount} order{c.orderCount === 1 ? '' : 's'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
