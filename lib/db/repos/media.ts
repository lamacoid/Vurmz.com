import type { MediaRow } from '../types'
import { getDb, newId, nowIso } from '../client'

export interface MediaItem {
  id: string
  r2Key: string
  filename: string
  mimeType: string
  sizeBytes: number
  width: number | null
  height: number | null
  altText: string
  folder: string
  tags: string[]
  uploadedAt: string
  uploadedBy: string | null
  url: string
}

function mediaUrl(row: MediaRow): string {
  if (row.external_url) return row.external_url
  return `/api/media/${encodeURIComponent(row.r2_key)}`
}

function hydrate(row: MediaRow): MediaItem {
  return {
    id: row.id,
    r2Key: row.r2_key,
    filename: row.filename,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    width: row.width,
    height: row.height,
    altText: row.alt_text,
    folder: row.folder,
    tags: JSON.parse(row.tags) as string[],
    uploadedAt: row.uploaded_at,
    uploadedBy: row.uploaded_by,
    url: mediaUrl(row),
  }
}

export async function listMedia(opts: { folder?: string; limit?: number; offset?: number } = {}): Promise<MediaItem[]> {
  const db = getDb()
  const limit = opts.limit ?? 100
  const offset = opts.offset ?? 0
  const where = opts.folder != null ? 'AND folder = ?' : ''
  const sql = `SELECT * FROM media WHERE deleted_at IS NULL ${where} ORDER BY uploaded_at DESC LIMIT ? OFFSET ?`
  const stmt = db.prepare(sql)
  const { results } = await (opts.folder != null
    ? stmt.bind(opts.folder, limit, offset).all<MediaRow>()
    : stmt.bind(limit, offset).all<MediaRow>())
  return results.map(hydrate)
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM media WHERE id = ? AND deleted_at IS NULL LIMIT 1')
    .bind(id)
    .first<MediaRow>()
  return row ? hydrate(row) : null
}

export async function createExternalMedia(input: {
  externalUrl: string
  filename: string
  mimeType: string
  folder?: string
  altText?: string
}): Promise<MediaItem> {
  const db = getDb()
  const id = newId('med')
  // Use external url as the "key" so dedup works if called twice
  const r2Key = `external:${input.externalUrl}`
  await db
    .prepare(
      `INSERT INTO media (id, r2_key, filename, mime_type, size_bytes, alt_text, folder, tags, uploaded_at, external_url)
       VALUES (?, ?, ?, ?, 0, ?, ?, '[]', ?, ?)
       ON CONFLICT(r2_key) DO NOTHING`
    )
    .bind(
      id,
      r2Key,
      input.filename,
      input.mimeType,
      input.altText ?? '',
      input.folder ?? 'site',
      nowIso(),
      input.externalUrl
    )
    .run()
  const existing = await db
    .prepare('SELECT * FROM media WHERE r2_key = ? LIMIT 1')
    .bind(r2Key)
    .first<MediaRow>()
  return hydrate(existing!)
}

export async function getMediaByIds(ids: string[]): Promise<Map<string, MediaItem>> {
  const out = new Map<string, MediaItem>()
  if (ids.length === 0) return out
  const db = getDb()
  const placeholders = ids.map(() => '?').join(',')
  const { results } = await db
    .prepare(`SELECT * FROM media WHERE id IN (${placeholders}) AND deleted_at IS NULL`)
    .bind(...ids)
    .all<MediaRow>()
  for (const row of results) out.set(row.id, hydrate(row))
  return out
}

export async function getMediaByKey(r2Key: string): Promise<MediaItem | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM media WHERE r2_key = ? AND deleted_at IS NULL LIMIT 1')
    .bind(r2Key)
    .first<MediaRow>()
  return row ? hydrate(row) : null
}

export async function createMedia(input: {
  r2Key: string
  filename: string
  mimeType: string
  sizeBytes: number
  width?: number | null
  height?: number | null
  altText?: string
  folder?: string
  tags?: string[]
  uploadedBy?: string | null
}): Promise<MediaItem> {
  const db = getDb()
  const id = newId('med')
  await db
    .prepare(
      `INSERT INTO media (id, r2_key, filename, mime_type, size_bytes, width, height, alt_text, folder, tags, uploaded_at, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.r2Key,
      input.filename,
      input.mimeType,
      input.sizeBytes,
      input.width ?? null,
      input.height ?? null,
      input.altText ?? '',
      input.folder ?? '',
      JSON.stringify(input.tags ?? []),
      nowIso(),
      input.uploadedBy ?? null
    )
    .run()
  const created = await getMediaById(id)
  if (!created) throw new Error('Failed to create media')
  return created
}

export async function updateMediaAltText(id: string, altText: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE media SET alt_text = ? WHERE id = ?').bind(altText, id).run()
}

export async function softDeleteMedia(id: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE media SET deleted_at = ? WHERE id = ?').bind(nowIso(), id).run()
}
