import type { PageRow } from '../types'
import { getDb, newId, nowIso } from '../client'

export interface Block {
  type: string
  id: string
  props: Record<string, unknown>
}

export interface Page {
  id: string
  slug: string
  title: string
  metaDescription: string | null
  ogImageId: string | null
  publishedBlocks: Block[]
  draftBlocks: Block[]
  version: number
  isPublished: boolean
  noindex: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

function hydrate(row: PageRow): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaDescription: row.meta_description,
    ogImageId: row.og_image_id,
    publishedBlocks: JSON.parse(row.published_blocks) as Block[],
    draftBlocks: JSON.parse(row.draft_blocks) as Block[],
    version: row.version,
    isPublished: row.is_published === 1,
    noindex: row.noindex === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM pages WHERE slug = ? AND deleted_at IS NULL LIMIT 1')
    .bind(slug)
    .first<PageRow>()
  return row ? hydrate(row) : null
}

export async function listPages(opts: { includeUnpublished?: boolean } = {}): Promise<Page[]> {
  const db = getDb()
  const sql = opts.includeUnpublished
    ? 'SELECT * FROM pages WHERE deleted_at IS NULL ORDER BY slug'
    : 'SELECT * FROM pages WHERE deleted_at IS NULL AND is_published = 1 ORDER BY slug'
  const { results } = await db.prepare(sql).all<PageRow>()
  return results.map(hydrate)
}

export async function createPage(input: {
  slug: string
  title: string
  metaDescription?: string
  blocks?: Block[]
}): Promise<Page> {
  const db = getDb()
  const id = newId('pg')
  const now = nowIso()
  const blocks = JSON.stringify(input.blocks ?? [])
  await db
    .prepare(
      `INSERT INTO pages (id, slug, title, meta_description, published_blocks, draft_blocks, version, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?, ?)`
    )
    .bind(id, input.slug, input.title, input.metaDescription ?? null, blocks, blocks, now, now)
    .run()
  const created = await getPageById(id)
  if (!created) throw new Error('Failed to create page')
  return created
}

export async function getPageById(id: string): Promise<Page | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM pages WHERE id = ? AND deleted_at IS NULL LIMIT 1')
    .bind(id)
    .first<PageRow>()
  return row ? hydrate(row) : null
}

export async function saveDraft(id: string, blocks: Block[]): Promise<void> {
  const db = getDb()
  await db
    .prepare('UPDATE pages SET draft_blocks = ?, updated_at = ? WHERE id = ?')
    .bind(JSON.stringify(blocks), nowIso(), id)
    .run()
}

export async function publishPage(id: string, actorEmail?: string): Promise<void> {
  const db = getDb()
  const now = nowIso()
  // Fetch current draft to snapshot
  const before = await db.prepare('SELECT draft_blocks, published_blocks FROM pages WHERE id = ?').bind(id).first<{ draft_blocks: string; published_blocks: string }>()
  await db
    .prepare(
      `UPDATE pages
       SET published_blocks = draft_blocks,
           version = version + 1,
           is_published = 1,
           published_at = ?,
           updated_at = ?
       WHERE id = ?`
    )
    .bind(now, now, id)
    .run()
  // Create a snapshot of the newly-published state (so we can roll back to previous publishes)
  if (before?.draft_blocks) {
    await db.prepare(
      `INSERT INTO page_snapshots (id, page_id, blocks, created_at, created_by) VALUES (?, ?, ?, ?, ?)`
    ).bind(newId('snp'), id, before.draft_blocks, now, actorEmail ?? null).run()
    // Prune to last 50
    await db.prepare(
      `DELETE FROM page_snapshots WHERE page_id = ? AND id NOT IN (
        SELECT id FROM page_snapshots WHERE page_id = ? ORDER BY created_at DESC LIMIT 50
      )`
    ).bind(id, id).run()
  }
}

export async function listPageSnapshots(pageId: string, limit = 50): Promise<Array<{ id: string; createdAt: string; createdBy: string | null; blockCount: number }>> {
  const db = getDb()
  const { results } = await db.prepare(
    'SELECT id, blocks, created_at, created_by FROM page_snapshots WHERE page_id = ? ORDER BY created_at DESC LIMIT ?'
  ).bind(pageId, limit).all<{ id: string; blocks: string; created_at: string; created_by: string | null }>()
  return results.map(r => {
    let count = 0
    try { count = (JSON.parse(r.blocks) as unknown[]).length } catch { count = 0 }
    return { id: r.id, createdAt: r.created_at, createdBy: r.created_by, blockCount: count }
  })
}

export async function restoreSnapshotToDraft(pageId: string, snapshotId: string): Promise<boolean> {
  const db = getDb()
  const row = await db.prepare('SELECT blocks FROM page_snapshots WHERE id = ? AND page_id = ? LIMIT 1').bind(snapshotId, pageId).first<{ blocks: string }>()
  if (!row) return false
  await db.prepare('UPDATE pages SET draft_blocks = ?, updated_at = ? WHERE id = ?').bind(row.blocks, nowIso(), pageId).run()
  return true
}

export async function softDeletePage(id: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE pages SET deleted_at = ? WHERE id = ?').bind(nowIso(), id).run()
}
