'use client'

import { useEffect, useState } from 'react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  notes: string
  job_count: number
  total_revenue: number
  created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Customer | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    const q = search ? `?q=${encodeURIComponent(search)}` : ''
    const res = await fetch(`/api/admin/customers${q}`)
    const data = await res.json() as any
    setCustomers(data.customers || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [search])

  async function createCustomer(form: any) {
    await fetch('/api/admin/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowNew(false)
    load()
  }

  async function deleteCustomer(id: string) {
    if (!confirm('Delete this customer?')) return
    await fetch('/api/admin/customers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSelected(null)
    load()
  }

  if (showNew) return <CustomerForm onSave={createCustomer} onCancel={() => setShowNew(false)} />

  if (selected) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={() => { setSelected(null); load() }} className="text-xs text-[#6BB8B2] mb-4 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back
        </button>

        <div className="bg-[#243B39] rounded-xl p-4 border border-white/5 space-y-4">
          <div>
            <p className="text-lg font-semibold text-cream">{selected.name}</p>
            {selected.company && <p className="text-xs text-gray-400">{selected.company}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {selected.email && (
              <a href={`mailto:${selected.email}`} className="text-xs bg-[#1a2926] px-2.5 py-1 rounded-full text-[#6BB8B2]">{selected.email}</a>
            )}
            {selected.phone && (
              <a href={`tel:${selected.phone}`} className="text-xs bg-[#1a2926] px-2.5 py-1 rounded-full text-[#6BB8B2]">{selected.phone}</a>
            )}
          </div>

          <div className="flex gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Jobs</p>
              <p className="text-sm font-semibold text-cream">{selected.job_count}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Revenue</p>
              <p className="text-sm font-semibold text-[#6BB8B2]">${selected.total_revenue.toLocaleString()}</p>
            </div>
          </div>

          {selected.notes && (
            <div className="bg-[#1a2926] rounded-lg p-3">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Notes</p>
              <p className="text-xs text-gray-300 whitespace-pre-wrap">{selected.notes}</p>
            </div>
          )}

          <button onClick={() => deleteCustomer(selected.id)} className="text-xs text-red-400 hover:text-red-300">
            Delete customer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-cream">Customers</h1>
        <button onClick={() => setShowNew(true)} className="text-xs bg-vurmz-cta text-white px-3 py-1.5 rounded-lg font-semibold">
          + New
        </button>
      </div>

      <input
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50 mb-4"
      />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">{search ? 'No results' : 'No customers yet'}</p>
      ) : (
        <div className="space-y-2">
          {customers.map(c => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="w-full text-left bg-[#243B39] rounded-xl p-3.5 border border-white/5 hover:border-[#6BB8B2]/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-cream truncate">{c.name}</p>
                  {c.company && <p className="text-[10px] text-gray-400 mt-0.5">{c.company}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{c.job_count} job{c.job_count !== 1 ? 's' : ''}</p>
                  {c.total_revenue > 0 && <p className="text-xs font-semibold text-[#6BB8B2]">${c.total_revenue.toLocaleString()}</p>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CustomerForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' })

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onCancel} className="text-xs text-[#6BB8B2] mb-4 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Cancel
      </button>

      <h2 className="text-lg font-bold text-cream mb-4">New Customer</h2>

      <div className="space-y-3">
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50" />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50" />
        <input placeholder="Phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50" />
        <input placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50" />
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50 resize-none" />
        <button onClick={() => onSave(form)} disabled={!form.name} className="w-full py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-lg disabled:opacity-40">
          Add Customer
        </button>
      </div>
    </div>
  )
}
