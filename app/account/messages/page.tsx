'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Message {
  id: string; direction: 'inbound' | 'outbound'; body: string; createdAt: string
}

function when(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/account/messages')
    const json = (await res.json()) as { data?: { messages: Message[] } }
    setMessages(json.data?.messages ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  async function send() {
    if (!draft.trim() || sending) return
    setSending(true)
    const res = await fetch('/api/account/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: draft.trim() }),
    })
    if (res.ok) {
      setDraft('')
      load()
    }
    setSending(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 flex flex-col h-[calc(100vh-70px)]">
      <Link href="/account" className="text-xs text-gray-500 hover:text-cream mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold text-cream mb-4">Messages with Zach</h1>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#1A4F48] border border-white/5 rounded-xl p-4 space-y-3 mb-3"
      >
        {loading ? (
          <p className="text-gray-500 text-sm text-center py-10">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">No messages yet — send one below.</p>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.direction === 'inbound' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                m.direction === 'inbound'
                  ? 'bg-[#C46B4D] text-white rounded-br-sm'
                  : 'bg-[#143E38] text-cream border border-white/5 rounded-bl-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{m.body}</p>
                <p className={`text-[10px] mt-1 ${m.direction === 'inbound' ? 'text-white/70' : 'text-gray-500'}`}>
                  {when(m.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send() }
          }}
          rows={2}
          placeholder="Type a message… (⌘↵ to send)"
          className="flex-1 bg-[#1A4F48] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-cream outline-none focus:border-[#6FB6AC] resize-none"
        />
        <button
          onClick={send}
          disabled={!draft.trim() || sending}
          className="px-5 bg-[#C46B4D] hover:bg-[#AD5D42] disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  )
}
