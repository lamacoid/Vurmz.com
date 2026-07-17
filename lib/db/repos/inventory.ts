import { getDb, newId, nowIso } from '../client'

/**
 * Rail Phase E: inventory as a side effect of the READY bump, the moment
 * material is truly consumed. Opt-in per product: no inventory row, no
 * effect, never a blocker. Exactly-once via the same CAS discipline as
 * the rail (I4): each order item carries an inventoryApplied flag whose
 * conditional set IS the lock; the decrement only follows a flag we won.
 * Undo (I7) mirrors it: only items whose flag we clear get restocked.
 * Every change lands in inventory_movements (I6), the ledger.
 */

type ItemRow = {
  id: string
  product_id: string | null
  variant_id: string | null
  qty: number
  metadata: string | null
}

/**
 * Finishes the shop may offer for a product: exactly the finish-level
 * inventory rows with stock on hand. No row, no offer. This is the
 * honesty contract behind the product page's finish chips (2026-07-16):
 * the site never claims a color Zach has not entered in the inventory.
 */
export async function listStockedFinishes(productId: string): Promise<string[]> {
  const db = getDb()
  const { results } = await db
    .prepare("SELECT finish FROM inventory WHERE product_id = ? AND finish IS NOT NULL AND finish != '' AND qty_on_hand > 0 ORDER BY finish")
    .bind(productId)
    .all<{ finish: string }>()
  return results.map(r => r.finish)
}

async function moveInventory(orderId: string, actorId: string | null, direction: 'consume' | 'restock'): Promise<number> {
  const db = getDb()
  const { results: items } = await db
    .prepare('SELECT id, product_id, variant_id, qty, metadata FROM order_items WHERE order_id = ?')
    .bind(orderId)
    .all<ItemRow>()

  let moved = 0
  for (const it of items) {
    if (!it.product_id) continue
    // The flag flip is the lock: whoever wins it owns the movement.
    const guard = direction === 'consume'
      ? `UPDATE order_items SET metadata = json_set(COALESCE(metadata,'{}'), '$.inventoryApplied', 1)
         WHERE id = ? AND COALESCE(json_extract(metadata,'$.inventoryApplied'), 0) = 0`
      : `UPDATE order_items SET metadata = json_set(COALESCE(metadata,'{}'), '$.inventoryApplied', 0)
         WHERE id = ? AND COALESCE(json_extract(metadata,'$.inventoryApplied'), 0) = 1`
    const won = await db.prepare(guard).bind(it.id).run()
    if (!won.meta.changes) continue

    // A line that carries a chosen finish decrements that finish's row when
    // one exists; otherwise it falls back to the whole-product row. Opt-in
    // either way: no row at all, no effect.
    let finish: string | null = null
    try {
      const meta = JSON.parse(it.metadata ?? '{}') as { options?: { finish?: string } }
      finish = meta.options?.finish?.trim() || null
    } catch {}
    let inv = finish
      ? await db
          .prepare('SELECT id FROM inventory WHERE product_id = ? AND variant_id IS ? AND finish = ?')
          .bind(it.product_id, it.variant_id, finish)
          .first<{ id: string }>()
      : null
    if (!inv) {
      inv = await db
        .prepare('SELECT id FROM inventory WHERE product_id = ? AND variant_id IS ? AND finish IS NULL')
        .bind(it.product_id, it.variant_id)
        .first<{ id: string }>()
    }
    if (!inv) continue // opt-in: flag still recorded, nothing to move

    const delta = direction === 'consume' ? -it.qty : it.qty
    await db.batch([
      db.prepare('UPDATE inventory SET qty_on_hand = qty_on_hand + ?, updated_at = ? WHERE id = ?')
        .bind(delta, nowIso(), inv.id),
      db.prepare('INSERT INTO inventory_movements (id, inventory_id, change, reason, actor_type, actor_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(newId('mov'), inv.id, delta, `${direction === 'consume' ? 'order_ready' : 'order_ready_undo'}:${orderId}`, 'admin', actorId, nowIso()),
    ])
    moved++
  }
  return moved
}

/** Called when an order lands on READY. Returns how many lines moved stock. */
export function applyOrderInventory(orderId: string, actorId: string | null): Promise<number> {
  return moveInventory(orderId, actorId, 'consume')
}

/** Called when an order backs out of READY (undo). Restocks what was taken. */
export function reverseOrderInventory(orderId: string, actorId: string | null): Promise<number> {
  return moveInventory(orderId, actorId, 'restock')
}
