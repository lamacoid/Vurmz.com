'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DndContext, PointerSensor, useSensor, useSensors,
  useDroppable, useDraggable, type DragEndEvent,
} from '@dnd-kit/core'
import { Icon } from '@/components/admin/icons'

type QuoteStatus = 'new' | 'drafting' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted'

interface Quote { id: string; number: string; email: string; status: QuoteStatus; totalCents: number; createdAt: string }

const COLUMNS: { key: QuoteStatus; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'drafting', label: 'Drafting' },
  { key: 'sent', label: 'Sent' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'converted', label: 'Converted' },
]

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

function Card({ quote }: { quote: Quote }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: quote.id })
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
      className="bg-[var(--a-bg)] rounded-md border border-[var(--a-line)] px-3 py-2.5 hover:border-[#7FCFD4]/30 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-1">
        <Link href={`/admin/quotes/${quote.id}`} className="text-xs font-mono text-[var(--a-ink)] hover:text-[var(--a-accent)]">{quote.number}</Link>
        <span className="text-xs font-semibold text-[var(--a-ink)]">{money(quote.totalCents)}</span>
      </div>
      <p className="text-[11px] text-[var(--a-ink-soft)] truncate">{quote.email}</p>
    </div>
  )
}

function Column({ status, label, quotes }: { status: QuoteStatus; label: string; quotes: Quote[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={`bg-[#16525C]/60 border rounded-lg p-3 min-h-[400px] transition-colors ${isOver ? 'border-[#7FCFD4]' : 'border-[var(--a-line)]'}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold text-[var(--a-ink)] uppercase tracking-wider">{label}</p>
        <span className="text-[10px] text-[var(--a-ink-faint)] font-mono">{quotes.length}</span>
      </div>
      <div className="space-y-2">
        {quotes.map(q => <Card key={q.id} quote={q} />)}
      </div>
    </div>
  )
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/quotes')
    const json = (await res.json()) as { data?: { quotes: Quote[] } }
    setQuotes(json.data?.quotes ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over) return
    const id = String(active.id)
    const status = String(over.id) as QuoteStatus
    const prev = quotes.find(q => q.id === id)
    if (!prev || prev.status === status) return
    setQuotes(list => list.map(q => q.id === id ? { ...q, status } : q))
    await fetch(`/api/admin/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  return (
    <div className="p-6 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Quotes</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">Drag cards to move through the pipeline.</p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] text-white text-sm font-semibold rounded-md"
        >
          <Icon name="plus" className="w-4 h-4" />
          New quote
        </Link>
      </div>

      {loading ? (
        <div className="text-[var(--a-ink-faint)] text-sm">Loading…</div>
      ) : quotes.length === 0 ? (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-10 text-center text-[var(--a-ink-soft)] text-sm">
          No quotes yet. Create your first quote to get started.
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {COLUMNS.map(col => (
              <Column key={col.key} status={col.key} label={col.label} quotes={quotes.filter(q => q.status === col.key)} />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  )
}
