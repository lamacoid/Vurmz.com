'use client'

import { useEffect, useState } from 'react'

interface Job {
  id: string
  customer_id: string | null
  title: string
  type: string
  description: string
  price: number
  items: string
  notes: string
  status: string
  created_at: string
  updated_at: string
  delivered_at: string | null
}

const STATUS_COLORS: Record<string, string> = {
  quoted: 'bg-yellow-500/20 text-yellow-400',
  accepted: 'bg-blue-500/20 text-blue-400',
  'in-progress': 'bg-purple-500/20 text-purple-400',
  done: 'bg-green-500/20 text-green-400',
  delivered: 'bg-[#6BB8B2]/20 text-[#6BB8B2]',
  cancelled: 'bg-red-500/20 text-red-400',
}

const STATUS_FLOW = ['quoted', 'accepted', 'in-progress', 'done', 'delivered']

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState<string>('active')
  const [selected, setSelected] = useState<Job | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    const url = filter === 'active' ? '/api/admin/jobs' : `/api/admin/jobs?status=${filter}`
    const res = await fetch(url)
    const data = await res.json() as any
    let list = data.jobs || []
    if (filter === 'active') {
      list = list.filter((j: Job) => !['delivered', 'cancelled'].includes(j.status))
    }
    setJobs(list)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function updateStatus(job: Job, newStatus: string) {
    await fetch('/api/admin/jobs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: job.id, status: newStatus }),
    })
    setSelected(null)
    load()
  }

  async function createJob(form: any) {
    await fetch('/api/admin/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowNew(false)
    load()
  }

  if (showNew) return <NewJobForm onSave={createJob} onCancel={() => setShowNew(false)} />

  if (selected) {
    const currentIdx = STATUS_FLOW.indexOf(selected.status)
    const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null

    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={() => { setSelected(null); load() }} className="text-xs text-[#6BB8B2] mb-4 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back
        </button>

        <div className="bg-[#243B39] rounded-xl p-4 border border-white/5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold text-cream">{selected.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selected.type}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[selected.status] || ''}`}>
              {selected.status}
            </span>
          </div>

          {selected.description && (
            <p className="text-sm text-gray-300">{selected.description}</p>
          )}

          <div className="flex gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Price</p>
              <p className="text-sm font-semibold text-cream">${selected.price}</p>
            </div>
            {selected.items && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Items</p>
                <p className="text-sm text-gray-300">{selected.items}</p>
              </div>
            )}
          </div>

          {selected.notes && (
            <div className="bg-[#1a2926] rounded-lg p-3">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Notes</p>
              <p className="text-xs text-gray-300 whitespace-pre-wrap">{selected.notes}</p>
            </div>
          )}

          {nextStatus && (
            <button
              onClick={() => updateStatus(selected, nextStatus)}
              className="w-full py-2.5 bg-vurmz-cta text-white text-sm font-semibold rounded-lg"
            >
              Move to {nextStatus}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-cream">Jobs</h1>
        <button onClick={() => setShowNew(true)} className="text-xs bg-vurmz-cta text-white px-3 py-1.5 rounded-lg font-semibold">
          + New
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-[#1a2926] rounded-lg p-1 overflow-x-auto">
        {['active', 'quoted', 'accepted', 'in-progress', 'done', 'delivered'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`py-1.5 px-2.5 text-[10px] font-medium rounded-md capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-[#243B39] text-cream' : 'text-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No jobs</p>
      ) : (
        <div className="space-y-2">
          {jobs.map(job => (
            <button
              key={job.id}
              onClick={() => setSelected(job)}
              className="w-full text-left bg-[#243B39] rounded-xl p-3.5 border border-white/5 hover:border-[#6BB8B2]/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-cream truncate">{job.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{job.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[job.status] || ''}`}>
                    {job.status}
                  </span>
                  <p className="text-xs font-semibold text-cream mt-1">${job.price}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function NewJobForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ title: '', type: 'custom', price: '', description: '', notes: '' })

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onCancel} className="text-xs text-[#6BB8B2] mb-4 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Cancel
      </button>

      <h2 className="text-lg font-bold text-cream mb-4">New Job</h2>

      <div className="space-y-3">
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50"
        />
        <select
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream focus:outline-none focus:border-[#6BB8B2]/50"
        >
          {['custom', 'pens', 'cards', 'coasters', 'keychains', 'knife', 'tool', 'labels', 'other'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50 resize-none"
        />
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2.5 bg-[#243B39] border border-[#2d4a47] rounded-lg text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-[#6BB8B2]/50 resize-none"
        />
        <button
          onClick={() => onSave({ ...form, price: parseFloat(form.price) || 0 })}
          disabled={!form.title}
          className="w-full py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-lg disabled:opacity-40"
        >
          Create Job
        </button>
      </div>
    </div>
  )
}
