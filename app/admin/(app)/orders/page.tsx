'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
} from '@dnd-kit/core'

type OrderStatus = 'new' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled' | 'refunded'

interface Order {
  id: string
  number: string
  email: string
  customerId: string | null
  status: OrderStatus
  totalCents: number
  fulfillmentMethod: string
  createdAt: string
  hasText?: boolean
  hasElement?: boolean
  attachmentCount?: number
  proofStatus?: 'needed' | 'sent' | 'approved' | null
}

const PROOF_DOT: Record<string, string> = {
  needed: 'bg-amber-400',
  sent: 'bg-sky-400',
  approved: 'bg-[var(--a-accent)]',
}

const COLUMNS: { key: OrderStatus; label: string }[] = [
  { key: 'new',         label: 'New' },
  { key: 'confirmed',   label: 'Confirmed' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'ready',       label: 'Ready' },
  { key: 'delivered',   label: 'Delivered' },
]

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

function Card({ order }: { order: Order }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: order.id })
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
      className="bg-[var(--a-bg)] rounded-md border border-[var(--a-line)] px-3 py-2.5 hover:border-[var(--a-accent)]/30 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-1">
        <Link href={`/admin/orders/${order.id}`} className="text-xs font-mono text-[var(--a-ink)] hover:text-[var(--a-accent)]">{order.number}</Link>
        <span className="text-xs font-semibold text-[var(--a-ink)]">{money(order.totalCents)}</span>
      </div>
      <p className="text-[11px] text-[var(--a-ink-soft)] truncate">{order.email}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[10px] text-[var(--a-ink-faint)]">{order.fulfillmentMethod.replace('_', ' ')}</p>
        <span className="flex items-center gap-1">
          {order.hasText && <span title="Engraving text" className="text-[10px]">✎</span>}
          {order.hasElement && <span title="Design element" className="text-[10px]">🎨</span>}
          {(order.attachmentCount ?? 0) > 0 && <span title={`${order.attachmentCount} customer file(s)`} className="text-[10px]">📎</span>}
          {order.proofStatus && (
            <span title={`Proof ${order.proofStatus}`} className={`inline-block w-2 h-2 rounded-full ${PROOF_DOT[order.proofStatus]}`} />
          )}
        </span>
      </div>
    </div>
  )
}

function Column({ status, label, orders }: { status: OrderStatus; label: string; orders: Order[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={`bg-[var(--a-panel)]/60 border rounded-lg p-3 min-h-[400px] transition-colors ${isOver ? 'border-[var(--a-accent)]' : 'border-[var(--a-line)]'}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold text-[var(--a-ink)] uppercase tracking-wider">{label}</p>
        <span className="text-[10px] text-[var(--a-ink-faint)] font-mono">{orders.length}</span>
      </div>
      <div className="space-y-2">
        {orders.map(o => <Card key={o.id} order={o} />)}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/orders?limit=500')
    const json = (await res.json()) as { data?: { orders: Order[] } }
    setOrders(json.data?.orders ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over) return
    const id = String(active.id)
    const status = String(over.id) as OrderStatus
    const prev = orders.find(o => o.id === id)
    if (!prev || prev.status === status) return
    setOrders(list => list.map(o => o.id === id ? { ...o, status } : o))
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  return (
    <div className="p-6 sm:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Orders</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">Drag cards between columns to update status.</p>
        </div>
        <Link
          href="/admin/orders/new"
          className="shrink-0 px-4 py-2 rounded-md bg-[var(--a-accent)] text-[#10282c] font-bold text-sm"
        >
          + New order
        </Link>
      </div>

      {loading ? (
        <div className="text-[var(--a-ink-faint)] text-sm">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-10 text-center text-[var(--a-ink-soft)] text-sm">
          No orders yet. Your first order will appear here.
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          {/* Legend so the card symbols are self-explanatory */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-[11px] text-[var(--a-ink-faint)]">
            <span>✎ engraving text</span>
            <span>🎨 design element</span>
            <span>📎 customer files</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> proof needed</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-sky-400" /> proof sent</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-[var(--a-accent)]" /> proof approved</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {COLUMNS.map(col => (
              <Column
                key={col.key}
                status={col.key}
                label={col.label}
                orders={orders.filter(o => o.status === col.key)}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  )
}
