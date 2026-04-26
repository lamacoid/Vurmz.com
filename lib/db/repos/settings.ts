import type { SiteSettingRow } from '../types'
import { getDb, nowIso } from '../client'

export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  try {
    const db = getDb()
    const row = await db
      .prepare('SELECT * FROM site_settings WHERE key = ? LIMIT 1')
      .bind(key)
      .first<SiteSettingRow>()
    if (!row) return null
    return JSON.parse(row.value) as T
  } catch {
    return null
  }
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = getDb()
  await db
    .prepare(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         updated_at = excluded.updated_at`
    )
    .bind(key, JSON.stringify(value), nowIso())
    .run()
}

export async function getAllSettings(): Promise<Record<string, unknown>> {
  const db = getDb()
  const { results } = await db.prepare('SELECT * FROM site_settings').all<SiteSettingRow>()
  const out: Record<string, unknown> = {}
  for (const row of results) {
    out[row.key] = JSON.parse(row.value)
  }
  return out
}
