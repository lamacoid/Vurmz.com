'use client'
export const runtime = 'edge'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Job {
  id: string; number: string; title: string; status: string; priority: number
  dueDate: string | null; notes: string; createdAt: string; updatedAt: string
  customerId: string | null; orderId: string | null; quoteId: string | null
}

const STATUS_LABEL: Record<string, string> = {
  intake: 'Intake', proofing: 'Proofing', approved: 'Approved', in_production: 'In production',
  qa: 'QA', ready: 'Ready', delivered: 'Delivered', cancelled: 'Cancelled',
}
function nextStep(status: string): string {
  switch (status) {
    case 'intake': return 'Review the request and start a proof.'
    case 'proofing': return 'Send the proof and get it approved.'
    case 'approved': return 'Approved. Start production.'
    case 'in_production': return 'In production. Engraving in progress.'
    case 'qa': return 'Quality-check it before it goes out.'
    case 'ready': return 'Ready. Deliver it, then mark Delivered.'
    case 'delivered': return 'Delivered. Done.'
    default: return ''
  }
}

export default function ServiceJobDetail() {
  const params = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!params?.id) return
    const res = await fetch(`/api/admin/service-jobs/${params.id}`)
    const json = (await res.json()) as { data?: { job: Job } }
    setJob(json.data?.job ?? null)
    setLoading(false)
  }, [params?.id])

  useEffect(() => { load() }, [load])

  async function patch(patch: Partial<Job>) {
    if (!job) return
    setSaving(true)
    await fetch(`/api/admin/service-jobs/${job.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    setSaving(false)
    load()
  }

  if (loading) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>
  if (!job) return <div className="p-8 text-[var(--a-ink-soft)] text-sm">Job not found.</div>

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <Link href="/admin/service-jobs" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)]">← Service jobs</Link>
      <div className="flex items-start justify-between mt-2 mb-6">
        <div>
          <p className="text-[11px] font-mono text-[var(--a-ink-faint)] mb-1">{job.number}</p>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">{job.title}</h1>
        </div>
        <select
          value={job.status}
          onChange={e => patch({ status: e.target.value })}
          className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2 text-xs text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
        >
          {['intake','proofing','approved','in_production','qa','ready','delivered','cancelled'].map(s => <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>)}
        </select>
      </div>

      {nextStep(job.status) && (
        <div className="mb-6 bg-white/[0.04] border-l-2 border-[var(--a-accent)] rounded-lg px-4 py-3">
          <p className="text-sm text-[var(--a-ink)]"><span className="font-semibold">Next step:</span> {nextStep(job.status)}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-lg px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-[var(--a-ink-faint)]">Priority</p>
          <select value={job.priority} onChange={e => patch({ priority: parseInt(e.target.value, 10) })} className="w-full bg-transparent text-sm text-[var(--a-ink)] outline-none">
            <option value={0}>Normal</option>
            <option value={1}>P1</option>
            <option value={2}>P2</option>
            <option value={3}>P3</option>
          </select>
        </div>
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-lg px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-[var(--a-ink-faint)]">Due</p>
          <input type="date" value={job.dueDate ?? ''} onChange={e => patch({ dueDate: e.target.value || null })} className="w-full bg-transparent text-sm text-[var(--a-ink)] outline-none" />
        </div>
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-lg px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-[var(--a-ink-faint)]">Created</p>
          <p className="text-sm text-[var(--a-ink)]">{new Date(job.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-lg px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-[var(--a-ink-faint)]">Updated</p>
          <p className="text-sm text-[var(--a-ink)]">{new Date(job.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
        <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-2 font-semibold">Notes</p>
        <textarea
          value={job.notes}
          onChange={e => setJob({ ...job, notes: e.target.value })}
          onBlur={() => patch({ notes: job.notes })}
          rows={10}
          className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
          placeholder="Production notes, specs, issues, anything useful…"
        />
        {saving && <p className="text-[10px] text-[var(--a-ink-faint)] mt-2">Saving…</p>}
      </div>

      {job.customerId && (
        <Link href={`/admin/customers/${job.customerId}`} className="text-xs text-[var(--a-accent)] hover:underline mt-4 inline-block">
          View customer →
        </Link>
      )}
    </div>
  )
}
