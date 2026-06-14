'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DndContext, PointerSensor, useSensor, useSensors,
  useDroppable, useDraggable, type DragEndEvent,
} from '@dnd-kit/core'
import { Icon } from '@/components/admin/icons'

type JobStatus = 'intake' | 'proofing' | 'approved' | 'in_production' | 'qa' | 'ready' | 'delivered' | 'cancelled'

interface Job { id: string; number: string; title: string; status: JobStatus; priority: number; dueDate: string | null; createdAt: string }

const COLUMNS: { key: JobStatus; label: string }[] = [
  { key: 'intake', label: 'Intake' },
  { key: 'proofing', label: 'Proofing' },
  { key: 'approved', label: 'Approved' },
  { key: 'in_production', label: 'In production' },
  { key: 'qa', label: 'QA' },
  { key: 'ready', label: 'Ready' },
  { key: 'delivered', label: 'Delivered' },
]

function Card({ job }: { job: Job }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: job.id })
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[#143E38] rounded-md border border-white/5 px-3 py-2.5 hover:border-[#6FB6AC]/30 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-1">
        <Link href={`/admin/service-jobs/${job.id}`} className="text-xs font-mono text-cream hover:text-[#6FB6AC]">{job.number}</Link>
        {job.priority > 0 && <span className="text-[10px] bg-[#C46B4D]/30 text-[#C46B4D] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">P{job.priority}</span>}
      </div>
      <p className="text-sm text-cream line-clamp-2">{job.title}</p>
      {job.dueDate && (
        <p className="text-[10px] text-gray-500 mt-1">Due {new Date(job.dueDate).toLocaleDateString()}</p>
      )}
    </div>
  )
}

function Column({ status, label, jobs }: { status: JobStatus; label: string; jobs: Job[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={`bg-[#1A4F48]/60 border rounded-lg p-3 min-h-[400px] transition-colors ${isOver ? 'border-[#6FB6AC]' : 'border-white/5'}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold text-cream uppercase tracking-wider">{label}</p>
        <span className="text-[10px] text-gray-500 font-mono">{jobs.length}</span>
      </div>
      <div className="space-y-2">
        {jobs.map(j => <Card key={j.id} job={j} />)}
      </div>
    </div>
  )
}

export default function ServiceJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/service-jobs')
    const json = (await res.json()) as { data?: { jobs: Job[] } }
    setJobs(json.data?.jobs ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over) return
    const id = String(active.id)
    const status = String(over.id) as JobStatus
    const prev = jobs.find(j => j.id === id)
    if (!prev || prev.status === status) return
    setJobs(list => list.map(j => j.id === id ? { ...j, status } : j))
    await fetch(`/api/admin/service-jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  return (
    <div className="p-6 sm:p-8 max-w-[1800px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream">Service jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Production pipeline. Drag cards to move through stages.</p>
        </div>
        <Link
          href="/admin/service-jobs/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] text-white text-sm font-semibold rounded-md"
        >
          <Icon name="plus" className="w-4 h-4" />
          New job
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : jobs.length === 0 ? (
        <div className="bg-[#1A4F48] border border-white/5 rounded-xl p-10 text-center text-gray-400 text-sm">
          No jobs yet. Create one to start tracking production.
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {COLUMNS.map(col => (
              <Column key={col.key} status={col.key} label={col.label} jobs={jobs.filter(j => j.status === col.key)} />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  )
}
