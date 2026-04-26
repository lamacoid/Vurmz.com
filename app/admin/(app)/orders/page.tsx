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
      className="bg-[#1a2f2e] rounded-md border border-white/5 px-3 py-2.5 hover:border-[#6BB8B2]/30 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-1">
        <Link href={`/admin/orders/${order.id}`} className="text-xs font-mono text-cream hover:text-[#6BB8B2]">{order.number}</Link>
        <span className="text-xs font-semibold text-cream">{money(order.totalCents)}</span>
      </div>
      <p className="text-[11px] text-gray-400 truncate">{order.email}</p>
      <p className="text-[10px] text-gray-500 mt-1">{order.fulfillmentMethod.replace('_', ' ')}</p>
    </div>
  )
}

function Column({ status, label, orders }: { status: OrderStatus; label: string; orders: Order[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={`bg-[#243B39]/60 border rounded-lg p-3 min-h-[400px] transition-colors ${isOver ? 'border-[#6BB8B2]' : 'border-white/5'}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold text-cream uppercase tracking-wider">{label}</p>
        <span className="text-[10px] text-gray-500 font-mono">{orders.length}</span>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cream">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Drag cards between columns to update status.</p>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="bg-[#243B39] border border-white/5 rounded-xl p-10 text-center text-gray-400 text-sm">
          No orders yet. Your first order will appear here.
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
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
