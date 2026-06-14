'use client'

import { useEffect, useState } from 'react'

interface Message {
  id: string
  name: string
  email: string
  phone: string
  productInterest: string
  message: string
  read: boolean
  archived: boolean
  receivedAt: string
  notes?: string
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [unread, setUnread] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all')
  const [selected, setSelected] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch(`/api/admin/inbox?filter=${filter}`)
    const data = await res.json() as any
    setMessages(data.messages || [])
    setUnread(data.unread || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function markRead(msg: Message) {
    if (!msg.read) {
      await fetch('/api/admin/inbox', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, read: true }),
      })
    }
    setSelected(msg)
  }

  async function toggleArchive(msg: Message) {
    await fetch('/api/admin/inbox', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: msg.id, archived: !msg.archived }),
    })
    setSelected(null)
    load()
  }

  if (selected) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={() => { setSelected(null); load() }} className="text-xs text-[#6FB6AC] mb-4 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back
        </button>

        <div className="bg-[#1A4F48] rounded-xl p-4 border border-white/5 space-y-4">
          <div>
            <p className="text-lg font-semibold text-cream">{selected.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{timeAgo(selected.receivedAt)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {selected.email && (
              <a href={`mailto:${selected.email}`} className="text-xs bg-[#1d474e] px-2.5 py-1 rounded-full text-[#6FB6AC]">
                {selected.email}
              </a>
            )}
            {selected.phone && (
              <a href={`sms:${selected.phone}`} className="text-xs bg-[#1d474e] px-2.5 py-1 rounded-full text-[#6FB6AC]">
                {selected.phone}
              </a>
            )}
          </div>

          {selected.productInterest && (
            <p className="text-xs text-gray-400">
              Interested in: <span className="text-cream">{selected.productInterest}</span>
            </p>
          )}

          <div className="bg-[#1d474e] rounded-lg p-3">
            <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <a href={`sms:${selected.phone}`} className="flex-1 py-2.5 bg-vurmz-cta text-white text-xs font-semibold rounded-lg text-center">
              Text
            </a>
            <a href={`mailto:${selected.email}`} className="flex-1 py-2.5 bg-[#1d474e] text-cream text-xs font-semibold rounded-lg text-center border border-white/10">
              Email
            </a>
            <button onClick={() => toggleArchive(selected)} className="py-2.5 px-3 bg-[#1d474e] text-gray-400 text-xs rounded-lg border border-white/10">
              {selected.archived ? 'Unarchive' : 'Archive'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-cream">Inbox</h1>
        {unread > 0 && <span className="bg-vurmz-cta text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-[#1d474e] rounded-lg p-1">
        {(['all', 'unread', 'archived'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
              filter === f ? 'bg-[#1A4F48] text-cream' : 'text-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No messages</p>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <button
              key={msg.id}
              onClick={() => markRead(msg)}
              className="w-full text-left bg-[#1A4F48] rounded-xl p-3.5 border border-white/5 hover:border-[#6FB6AC]/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!msg.read && !msg.archived && <span className="w-2 h-2 bg-vurmz-cta rounded-full flex-shrink-0" />}
                    <p className={`text-sm font-medium truncate ${msg.read ? 'text-gray-300' : 'text-cream'}`}>
                      {msg.name}
                    </p>
                  </div>
                  {msg.productInterest && (
                    <p className="text-[10px] text-[#6FB6AC] mt-0.5">{msg.productInterest}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{msg.message}</p>
                </div>
                <span className="text-[10px] text-gray-500 flex-shrink-0">{timeAgo(msg.receivedAt)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
