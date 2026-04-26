import { getDb, newId, nowIso } from '../client'

export type JobStatus = 'intake' | 'proofing' | 'approved' | 'in_production' | 'qa' | 'ready' | 'delivered' | 'cancelled'

export interface Job {
  id: string
  number: string
  orderId: string | null
  quoteId: string | null
  customerId: string | null
  title: string
  status: JobStatus
  priority: number
  dueDate: string | null
  notes: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

interface JobRow {
  id: string; number: string; order_id: string | null; quote_id: string | null; customer_id: string | null
  title: string; status: JobStatus; priority: number; due_date: string | null; notes: string
  metadata: string; created_at: string; updated_at: string
}

function hydrate(row: JobRow): Job {
  return {
    id: row.id, number: row.number,
    orderId: row.order_id, quoteId: row.quote_id, customerId: row.customer_id,
    title: row.title, status: row.status, priority: row.priority,
    dueDate: row.due_date, notes: row.notes,
    metadata: JSON.parse(row.metadata) as Record<string, unknown>,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }
}

async function nextJobNumber(): Promise<string> {
  const db = getDb()
  const now = nowIso()
  await db.prepare(
    `INSERT INTO counters (key, value, updated_at) VALUES ('job_number', 1001, ?)
     ON CONFLICT(key) DO UPDATE SET value = value + 1, updated_at = excluded.updated_at`
  ).bind(now).run()
  const row = await db.prepare("SELECT value FROM counters WHERE key = 'job_number'").first<{ value: number }>()
  return `J-${row?.value ?? 1001}`
}

export interface CreateJobInput {
  title: string
  customerId?: string | null
  orderId?: string | null
  quoteId?: string | null
  priority?: number
  dueDate?: string | null
  notes?: string
}

export async function createJob(input: CreateJobInput): Promise<Job> {
  const db = getDb()
  const id = newId('job')
  const number = await nextJobNumber()
  const now = nowIso()
  await db.prepare(
    `INSERT INTO jobs (id, number, order_id, quote_id, customer_id, title, status, priority, due_date, notes, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'intake', ?, ?, ?, '{}', ?, ?)`
  ).bind(id, number, input.orderId ?? null, input.quoteId ?? null, input.customerId ?? null,
         input.title, input.priority ?? 0, input.dueDate ?? null, input.notes ?? '', now, now).run()
  const row = await db.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first<JobRow>()
  return hydrate(row!)
}

export async function listJobs(opts: { status?: JobStatus; limit?: number } = {}): Promise<Job[]> {
  const db = getDb()
  const limit = opts.limit ?? 500
  if (opts.status) {
    const { results } = await db.prepare('SELECT * FROM jobs WHERE status = ? ORDER BY priority DESC, created_at DESC LIMIT ?').bind(opts.status, limit).all<JobRow>()
    return results.map(hydrate)
  }
  const { results } = await db.prepare('SELECT * FROM jobs ORDER BY priority DESC, created_at DESC LIMIT ?').bind(limit).all<JobRow>()
  return results.map(hydrate)
}

export async function getJobById(id: string): Promise<Job | null> {
  const db = getDb()
  const row = await db.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first<JobRow>()
  return row ? hydrate(row) : null
}

export async function setJobStatus(id: string, status: JobStatus, actor: { type: 'admin' | 'customer' | 'system' | 'webhook'; id?: string | null; note?: string }): Promise<void> {
  const db = getDb()
  const before = await getJobById(id)
  if (!before) return
  const now = nowIso()
  await db.batch([
    db.prepare('UPDATE jobs SET status = ?, updated_at = ? WHERE id = ?').bind(status, now, id),
    db.prepare(
      `INSERT INTO job_events (id, job_id, type, from_status, to_status, actor_type, actor_id, note, created_at)
       VALUES (?, ?, 'status_change', ?, ?, ?, ?, ?, ?)`
    ).bind(newId('jev'), id, before.status, status, actor.type, actor.id ?? null, actor.note ?? null, now),
  ])
}

export async function updateJob(id: string, patch: Partial<CreateJobInput & { status: JobStatus }>): Promise<void> {
  const db = getDb()
  const sets: string[] = []
  const binds: unknown[] = []
  const map: Array<[keyof typeof patch, string]> = [
    ['title','title'], ['priority','priority'], ['dueDate','due_date'], ['notes','notes'], ['status','status'],
  ]
  for (const [k, col] of map) {
    if (patch[k] !== undefined) { sets.push(`${col} = ?`); binds.push(patch[k] as unknown) }
  }
  if (sets.length === 0) return
  sets.push('updated_at = ?'); binds.push(nowIso())
  binds.push(id)
  await db.prepare(`UPDATE jobs SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
}
