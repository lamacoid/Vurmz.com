import { getDb, newId, nowIso } from '../client'

export interface Message {
  id: string
  customerId: string | null
  direction: 'inbound' | 'outbound'
  channel: 'web' | 'email' | 'admin' | 'sms'
  subject: string | null
  body: string
  attachments: string[]
  isRead: boolean
  metadata: Record<string, unknown>
  createdAt: string
}

interface MessageRow {
  id: string; customer_id: string | null; direction: 'inbound' | 'outbound'
  channel: 'web' | 'email' | 'admin' | 'sms'; subject: string | null; body: string
  attachments: string; is_read: 0 | 1; metadata: string; created_at: string
}

function hydrate(row: MessageRow): Message {
  return {
    id: row.id, customerId: row.customer_id,
    direction: row.direction, channel: row.channel,
    subject: row.subject, body: row.body,
    attachments: JSON.parse(row.attachments) as string[],
    isRead: row.is_read === 1,
    metadata: JSON.parse(row.metadata) as Record<string, unknown>,
    createdAt: row.created_at,
  }
}

export async function listThread(customerId: string, limit = 200): Promise<Message[]> {
  const db = getDb()
  const { results } = await db.prepare(
    'SELECT * FROM messages WHERE customer_id = ? ORDER BY created_at ASC LIMIT ?'
  ).bind(customerId, limit).all<MessageRow>()
  return results.map(hydrate)
}

export async function sendMessage(input: {
  customerId: string
  direction: 'inbound' | 'outbound'
  channel: 'web' | 'email' | 'admin' | 'sms'
  body: string
  subject?: string | null
  attachments?: string[]
  metadata?: Record<string, unknown>
}): Promise<Message> {
  const db = getDb()
  const id = newId('msg')
  await db.prepare(
    `INSERT INTO messages (id, customer_id, direction, channel, subject, body, attachments, is_read, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
  ).bind(
    id, input.customerId, input.direction, input.channel,
    input.subject ?? null, input.body,
    JSON.stringify(input.attachments ?? []),
    JSON.stringify(input.metadata ?? {}),
    nowIso()
  ).run()
  const row = await db.prepare('SELECT * FROM messages WHERE id = ?').bind(id).first<MessageRow>()
  return hydrate(row!)
}

export async function markThreadRead(customerId: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE messages SET is_read = 1 WHERE customer_id = ? AND is_read = 0').bind(customerId).run()
}

export async function countUnread(): Promise<{ total: number; byCustomer: Record<string, number> }> {
  const db = getDb()
  const { results } = await db.prepare(
    "SELECT customer_id, COUNT(*) as n FROM messages WHERE direction = 'inbound' AND is_read = 0 GROUP BY customer_id"
  ).all<{ customer_id: string | null; n: number }>()
  let total = 0
  const byCustomer: Record<string, number> = {}
  for (const r of results) {
    total += r.n
    if (r.customer_id) byCustomer[r.customer_id] = r.n
  }
  return { total, byCustomer }
}
