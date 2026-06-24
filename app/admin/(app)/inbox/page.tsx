'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { money } from '@/lib/format'

interface Reply { body: string; sentAt: string; by: string }
interface CustomerCtx { id: string; email: string; name: string; orderCount: number; lifetimeValueCents: number; createdAt: string }
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
  replies?: Reply[]
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

  // Reply composer state
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [justSent, setJustSent] = useState(false)
  const [ctx, setCtx] = useState<CustomerCtx | 'none' | null>(null)

  async function load() {
    const res = await fetch(`/api/admin/inbox?filter=${filter}`)
    const data = await res.json() as { messages?: Message[]; unread?: number }
    setMessages(data.messages || [])
    setUnread(data.unread || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  function open(msg: Message) {
    setReply(''); setSendError(''); setJustSent(false)
    setSelected(msg)
    setCtx(null)
    if (msg.email) {
      const email = msg.email
      fetch(`/api/admin/customers?q=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then((j) => {
          const list = (j as { data?: { customers: CustomerCtx[] } }).data?.customers || []
          const match = list.find(c => c.email.toLowerCase() === email.toLowerCase())
          setCtx(match || 'none')
        })
        .catch(() => setCtx('none'))
    } else {
      setCtx('none')
    }
    if (!msg.read) {
      fetch('/api/admin/inbox', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, read: true }),
      }).catch(() => {})
    }
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

  async function sendReply(msg: Message) {
    const text = reply.trim()
    if (!text) return
    setSending(true); setSendError('')
    try {
      const res = await fetch(`/api/admin/inbox/${msg.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      })
      const data = await res.json() as { ok?: boolean; message?: Message; error?: { message?: string } }
      if (!res.ok || !data.ok) throw new Error(data.error?.message || 'Could not send. Please try again.')
      setSelected(data.message || msg)
      setReply('')
      setJustSent(true)
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Could not send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  // ── Detail / conversation view ───────────────────────────────
  if (selected) {
    const firstName = (selected.name || '').split(' ')[0] || 'them'
    return (
      <div className="px-4 py-6 max-w-xl mx-auto">
        <button
          onClick={() => { setSelected(null); load() }}
          className="text-sm text-[var(--a-accent)] mb-4 flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          All messages
        </button>

        <div className="bg-[var(--a-panel)] rounded-xl p-5 border border-[var(--a-line)] space-y-5">
          {/* Who + when */}
          <div>
            <p className="text-xl font-semibold text-[var(--a-ink)]">{selected.name}</p>
            <p className="text-xs text-[var(--a-ink-faint)] mt-1">{timeAgo(selected.receivedAt)}</p>
          </div>

          {/* Contact + interest */}
          <div className="flex flex-wrap items-center gap-2">
            {selected.email && (
              <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full text-[var(--a-ink-soft)]">{selected.email}</span>
            )}
            {selected.phone && (
              <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full text-[var(--a-ink-soft)]">{selected.phone}</span>
            )}
            {selected.productInterest && (
              <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full text-[var(--a-accent)]">{selected.productInterest}</span>
            )}
          </div>

          {/* Who is this? — returning customer vs new contact */}
          {ctx && ctx !== 'none' && (
            <Link href={`/admin/customers/${ctx.id}`} className="block bg-white/[0.04] border-l-2 border-[var(--a-accent)] rounded-lg p-3 hover:bg-white/[0.07] transition-colors">
              <p className="text-sm text-[var(--a-ink)] font-medium">{ctx.orderCount > 0 ? 'Returning customer' : 'Known contact'}</p>
              <p className="text-xs text-[var(--a-ink-soft)] mt-0.5">
                {ctx.orderCount > 0 ? `${ctx.orderCount} order${ctx.orderCount === 1 ? '' : 's'} · ${money(ctx.lifetimeValueCents)} lifetime · ` : 'No orders yet · '}View profile →
              </p>
            </Link>
          )}
          {ctx === 'none' && (
            <div className="bg-white/[0.03] rounded-lg p-3">
              <p className="text-sm text-[var(--a-ink-soft)]">New contact — first time reaching out.</p>
            </div>
          )}

          {/* Their message */}
          <div className="bg-black/15 rounded-lg p-4">
            <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1.5">{firstName} wrote</p>
            <p className="text-[15px] text-[var(--a-ink)] whitespace-pre-wrap leading-relaxed">{selected.message}</p>
          </div>

          {/* Your past replies */}
          {(selected.replies || []).map((r, i) => (
            <div key={i} className="bg-white/[0.04] border-l-2 border-[var(--a-accent)] rounded-lg p-4">
              <p className="text-[11px] uppercase tracking-wider text-[var(--a-accent)] mb-1.5">You replied &middot; {timeAgo(r.sentAt)}</p>
              <p className="text-[15px] text-[var(--a-ink)] whitespace-pre-wrap leading-relaxed">{r.body}</p>
            </div>
          ))}

          {/* Reply composer */}
          {selected.email ? (
            <div className="pt-1">
              <label className="block text-sm font-medium text-[var(--a-ink)] mb-2">Reply to {firstName}</label>
              <textarea
                value={reply}
                onChange={e => { setReply(e.target.value); setJustSent(false); setSendError('') }}
                rows={5}
                placeholder={`Write your reply… it emails ${firstName} from VURMZ.`}
                className="w-full rounded-lg bg-black/15 border border-[var(--a-line)] p-3 text-[15px] text-[var(--a-ink)] placeholder:text-[var(--a-ink-faint)] focus:outline-none focus:border-[var(--a-accent)] resize-y"
              />
              {sendError && <p className="text-sm text-[#E89B8F] mt-2">{sendError}</p>}
              {justSent && <p className="text-sm text-[var(--a-accent)] mt-2">✓ Sent to {selected.email}</p>}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => sendReply(selected)}
                  disabled={sending || !reply.trim()}
                  className="px-5 py-2.5 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {sending ? 'Sending…' : 'Send reply'}
                </button>
                {selected.phone && (
                  <a href={`sms:${selected.phone}`} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[var(--a-ink-soft)] text-sm font-medium rounded-lg transition-colors">
                    Text instead
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--a-ink-faint)]">No email on this message{selected.phone ? ' — text them instead.' : '.'}</p>
          )}

          {/* Footer actions */}
          <div className="pt-2 border-t border-[var(--a-line)]">
            <button onClick={() => toggleArchive(selected)} className="text-sm text-[var(--a-ink-faint)] hover:text-[var(--a-ink-soft)] transition-colors">
              {selected.archived ? 'Move back to inbox' : 'Archive this message'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div className="px-4 py-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[var(--a-ink)]">Messages</h1>
        {unread > 0 && <span className="bg-[var(--a-cta)] text-white text-xs font-bold px-2.5 py-1 rounded-full">{unread} new</span>}
      </div>

      <div className="flex gap-1 mb-4 bg-black/15 rounded-lg p-1">
        {(['all', 'unread', 'archived'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
              filter === f ? 'bg-[var(--a-panel)] text-[var(--a-ink)]' : 'text-[var(--a-ink-faint)] hover:text-[var(--a-ink-soft)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--a-ink-faint)] text-sm py-8 text-center">Loading…</p>
      ) : messages.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--a-ink-soft)] text-sm">No messages here yet.</p>
          <p className="text-[var(--a-ink-faint)] text-xs mt-1">When someone contacts you through the site, it shows up here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <button
              key={msg.id}
              onClick={() => open(msg)}
              className="w-full text-left bg-[var(--a-panel)] rounded-xl p-4 border border-[var(--a-line)] hover:border-[var(--a-accent)] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!msg.read && !msg.archived && <span className="w-2 h-2 bg-[var(--a-cta)] rounded-full flex-shrink-0" />}
                    <p className={`text-sm font-semibold truncate ${msg.read ? 'text-[var(--a-ink-soft)]' : 'text-[var(--a-ink)]'}`}>
                      {msg.name}
                    </p>
                    {(msg.replies?.length ?? 0) > 0 && (
                      <span className="text-[10px] text-[var(--a-accent)] flex-shrink-0">replied</span>
                    )}
                  </div>
                  {msg.productInterest && (
                    <p className="text-[10px] text-[var(--a-accent)] mt-0.5">{msg.productInterest}</p>
                  )}
                  <p className="text-xs text-[var(--a-ink-faint)] mt-1 line-clamp-2">{msg.message}</p>
                </div>
                <span className="text-[10px] text-[var(--a-ink-faint)] flex-shrink-0">{timeAgo(msg.receivedAt)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
