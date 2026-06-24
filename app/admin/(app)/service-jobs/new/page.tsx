'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Customer { id: string; name: string; email: string }

export default function NewServiceJobPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [title, setTitle] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [priority, setPriority] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/customers').then(r => r.json()).then(j => {
      const parsed = j as { data?: { customers: Customer[] } }
      setCustomers(parsed.data?.customers ?? [])
    })
  }, [])

  async function save() {
    if (!title) { alert('Title required'); return }
    setSaving(true)
    const res = await fetch('/api/admin/service-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        customerId: customerId || null,
        priority,
        dueDate: dueDate || null,
        notes: notes || undefined,
      }),
    })
    const json = (await res.json()) as { ok?: boolean; data?: { job: { id: string } } }
    if (!res.ok || !json.ok) { alert('Failed'); setSaving(false); return }
    router.push(`/admin/service-jobs/${json.data!.job.id}`)
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <Link href="/admin/service-jobs" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)]">← All jobs</Link>
      <h1 className="text-2xl font-bold text-[var(--a-ink)] mt-2 mb-6">New service job</h1>

      <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5 space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1 font-semibold">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. 50 engraved knives for Cherry Creek Kitchen"
            className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1 font-semibold">Customer</label>
          <select
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none"
          >
            <option value="">— none —</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name || c.email}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1 font-semibold">Priority</label>
            <select value={priority} onChange={e => setPriority(parseInt(e.target.value, 10))} className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none">
              <option value={0}>Normal</option>
              <option value={1}>P1 — urgent</option>
              <option value={2}>P2 — rush</option>
              <option value={3}>P3 — on fire</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1 font-semibold">Due date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]" />
          </div>
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1 font-semibold">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]" placeholder="Details, specs, production notes…" />
        </div>
        <button onClick={save} disabled={saving || !title} className="px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md">
          {saving ? 'Creating…' : 'Create job'}
        </button>
      </div>
    </div>
  )
}
