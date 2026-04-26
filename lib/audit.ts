import { getDb, newId, nowIso } from './db/client'

export interface AuditInput {
  actorType: 'admin' | 'customer' | 'system' | 'webhook'
  actorId?: string | null
  impersonatorId?: string | null
  action: string
  targetType: string
  targetId?: string | null
  diff?: Record<string, unknown>
  ip?: string | null
  userAgent?: string | null
}

/**
 * Write an audit log entry. Called by every admin mutation endpoint.
 * Failures are swallowed — we never want the audit log to break a mutation.
 */
export async function audit(input: AuditInput): Promise<void> {
  try {
    const db = getDb()
    await db
      .prepare(
        `INSERT INTO audit_log
           (id, actor_type, actor_id, impersonator_id, action, target_type, target_id, diff, ip, user_agent, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        newId('aud'),
        input.actorType,
        input.actorId ?? null,
        input.impersonatorId ?? null,
        input.action,
        input.targetType,
        input.targetId ?? null,
        JSON.stringify(input.diff ?? {}),
        input.ip ?? null,
        input.userAgent ?? null,
        nowIso()
      )
      .run()
  } catch (err) {
    console.error('[audit] write failed', err)
  }
}
