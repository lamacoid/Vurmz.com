import type { NavigationRow } from '../types'
import { getDb, newId, nowIso } from '../client'

export type NavPlacement = 'header' | 'footer' | 'footer-legal' | 'mobile'

export interface NavItem {
  id: string
  placement: NavPlacement
  position: number
  label: string
  href: string
  parentId: string | null
  opensNewTab: boolean
  children: NavItem[]
}

function hydrate(row: NavigationRow): Omit<NavItem, 'children'> {
  return {
    id: row.id,
    placement: row.placement,
    position: row.position,
    label: row.label,
    href: row.href,
    parentId: row.parent_id,
    opensNewTab: row.opens_new_tab === 1,
  }
}

export async function listNav(placement: NavPlacement): Promise<NavItem[]> {
  const db = getDb()
  const { results } = await db
    .prepare('SELECT * FROM navigation WHERE placement = ? ORDER BY position')
    .bind(placement)
    .all<NavigationRow>()
  const flat = results.map(hydrate)
  const byId = new Map<string, NavItem>()
  const roots: NavItem[] = []
  for (const item of flat) {
    byId.set(item.id, { ...item, children: [] })
  }
  for (const item of byId.values()) {
    if (item.parentId && byId.has(item.parentId)) {
      byId.get(item.parentId)!.children.push(item)
    } else {
      roots.push(item)
    }
  }
  return roots
}

export async function createNavItem(input: {
  placement: NavPlacement
  label: string
  href: string
  position?: number
  parentId?: string | null
  opensNewTab?: boolean
}): Promise<string> {
  const db = getDb()
  const id = newId('nav')
  const now = nowIso()
  await db
    .prepare(
      `INSERT INTO navigation (id, placement, position, label, href, parent_id, opens_new_tab, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.placement,
      input.position ?? 0,
      input.label,
      input.href,
      input.parentId ?? null,
      input.opensNewTab ? 1 : 0,
      now,
      now
    )
    .run()
  return id
}
