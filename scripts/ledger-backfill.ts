/**
 * Ledger backfill: one-time, restartable, dry-run first.
 *
 *   tsx scripts/ledger-backfill.ts --local --dry
 *   tsx scripts/ledger-backfill.ts --local
 *   tsx scripts/ledger-backfill.ts --remote --dry
 *   tsx scripts/ledger-backfill.ts --remote        (after npm run db:backup)
 *
 * Reads the three old settle paths and posts one ledger line per real
 * money event, keyed so a re-run inserts nothing new:
 *   1. payments rows (card via Square id, cash via method_brand)
 *   2. invoices marked paid by hand with no payments row behind them
 *   3. orders flagged metadata.payment.settled with no payments row
 * Prints before/after totals so the numbers can be checked by eye.
 */
import { execFileSync, execSync } from 'node:child_process'
import { writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const args = process.argv.slice(2)
const isLocal = args.includes('--local')
const isRemote = args.includes('--remote')
const isDry = args.includes('--dry')
if (isLocal === isRemote) { console.error('pass exactly one of --local / --remote'); process.exit(2) }
const flag = isLocal ? '--local' : '--remote'

const workDir = mkdtempSync(join(tmpdir(), 'vurmz-ledger-'))
let qn = 0
function q<T>(sql: string): T[] {
  // Rows only come back from --command (remote --file returns stats). No shell,
  // so quotes in the SQL are safe.
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'vurmz-core', flag, '--json', '--command', sql], { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })
  // Remote runs print progress lines before the JSON; take it from the first '['.
  const parsed = JSON.parse(out.slice(out.indexOf('['))) as Array<{ results: Array<Record<string, unknown>> }>
  // wrangler --json hands back SQL NULL as the string "null" in some
  // versions. Normalise so a null is a null.
  return (parsed[0]?.results ?? []).map(r => {
    for (const k of Object.keys(r)) if (r[k] === 'null') r[k] = null
    return r as T
  })
}

function id(): string {
  const alphabet = '0123456789abcdefghjkmnpqrstvwxyz'
  let s = ''
  for (let i = 0; i < 24; i++) s += alphabet[Math.floor(Math.random() * 32)]
  return `led_${s}`
}
const lit = (v: string | number | null) => v === null ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`

interface Line {
  key: string; at: string; kind: 'sale'; amount: number; tax: number; method: string
  orderId: string | null; invoiceId: string | null; paymentId: string | null; customerId: string | null
  note: string
}
const lines: Line[] = []

// 1. payments rows
interface Pay { id: string; invoice_id: string | null; customer_id: string | null; amount_cents: number; square_payment_id: string | null; method_brand: string | null; metadata: string; created_at: string; inv_order_id: string | null; inv_tax: number | null }
const pays = q<Pay>(`SELECT p.id, p.invoice_id, p.customer_id, p.amount_cents, p.square_payment_id, p.method_brand, p.metadata, p.created_at,
  i.order_id AS inv_order_id, i.tax_cents AS inv_tax FROM payments p LEFT JOIN invoices i ON i.id = p.invoice_id WHERE p.status IN ('succeeded','refunded','partially_refunded')`)
for (const p of pays) {
  let orderId: string | null = p.inv_order_id
  let orderNumber: string | null = null
  try { const m = JSON.parse(p.metadata || '{}') as { orderId?: string; orderNumber?: string }; orderId = orderId ?? m.orderId ?? null; orderNumber = m.orderNumber ?? null } catch { /* ignore */ }
  const sq = p.square_payment_id && p.square_payment_id !== 'null' ? p.square_payment_id : null
  const isCash = !sq && (p.method_brand === 'cash' || p.method_brand === 'venmo' || p.method_brand === 'other')
  const key = sq ? `square:${sq}` : isCash && orderId ? `cash:${orderId}` : `backfill_payment:${p.id}`
  lines.push({
    key, at: p.created_at, kind: 'sale', amount: p.amount_cents, tax: 0,
    method: sq ? 'card' : (p.method_brand ?? 'other'),
    orderId, invoiceId: p.invoice_id, paymentId: p.id, customerId: p.customer_id,
    note: orderNumber ? `Order ${orderNumber}` : p.invoice_id ? `Invoice ${p.invoice_id}` : 'backfill',
  })
}

// 2. invoices paid by hand (status paid, amount beyond what payments rows cover)
interface Inv { id: string; number: string; customer_id: string; order_id: string | null; total_cents: number; tax_cents: number; amount_paid_cents: number; paid_at: string | null; updated_at: string; covered: number }
const invs = q<Inv>(`SELECT i.id, i.number, i.customer_id, i.order_id, i.total_cents, i.tax_cents, i.amount_paid_cents, i.paid_at, i.updated_at,
  COALESCE((SELECT SUM(p.amount_cents) FROM payments p WHERE p.invoice_id = i.id AND p.status = 'succeeded'),0) AS covered
  FROM invoices i WHERE i.status IN ('paid','partially_paid')`)
for (const i of invs) {
  const claimed = i.amount_paid_cents > 0 ? i.amount_paid_cents : i.total_cents
  const gap = claimed - i.covered
  if (gap > 0) {
    lines.push({
      key: `invoice:${i.id}:manual`, at: i.paid_at ?? i.updated_at, kind: 'sale', amount: gap, tax: i.tax_cents,
      method: 'invoice', orderId: i.order_id, invoiceId: i.id, paymentId: null, customerId: i.customer_id,
      note: `Invoice ${i.number}, marked paid (backfill)`,
    })
  }
}

// 3. orders flagged settled with nothing behind them
interface Ord { id: string; number: string; customer_id: string | null; total_cents: number; tax_cents: number; settled_at: string | null; method: string | null; updated_at: string; covered: number }
const ords = q<Ord>(`SELECT o.id, o.number, o.customer_id, o.total_cents, o.tax_cents, o.updated_at,
  json_extract(o.metadata,'$.payment.settledAt') AS settled_at, json_extract(o.metadata,'$.payment.method') AS method,
  COALESCE((SELECT SUM(p.amount_cents) FROM payments p WHERE p.status='succeeded' AND json_extract(p.metadata,'$.orderId') = o.id),0)
  + COALESCE((SELECT SUM(p.amount_cents) FROM payments p JOIN invoices i ON i.id = p.invoice_id WHERE p.status='succeeded' AND i.order_id = o.id),0) AS covered
  FROM orders o WHERE COALESCE(json_extract(o.metadata,'$.payment.settled'),0) = 1`)
for (const o of ords) {
  const gap = o.total_cents - o.covered
  if (gap > 0 && !lines.some(l => l.key === `cash:${o.id}`)) {
    lines.push({
      key: `cash:${o.id}`, at: o.settled_at ?? o.updated_at, kind: 'sale', amount: gap, tax: o.tax_cents,
      method: o.method ?? 'cash', orderId: o.id, invoiceId: null, paymentId: null, customerId: o.customer_id,
      note: `Order ${o.number}, ${o.method ?? 'cash'} (backfill)`,
    })
  }
}

const before = q<{ n: number; c: number }>(`SELECT COUNT(*) AS n, COALESCE(SUM(amount_cents),0) AS c FROM ledger WHERE kind IN ('sale','refund')`)[0]
const total = lines.reduce((s, l) => s + l.amount, 0)
console.log(`ledger before: ${before.n} lines, $${(before.c / 100).toFixed(2)}`)
console.log(`candidates:    ${lines.length} lines, $${(total / 100).toFixed(2)}  (payments ${pays.length}, hand-paid invoices ${invs.length}, flagged orders ${ords.length})`)
for (const l of lines) console.log(`  ${l.key.padEnd(44)} ${String(l.amount).padStart(8)}  ${l.at.slice(0, 10)}  ${l.note}`)

if (isDry) { console.log('dry run, nothing written'); process.exit(0) }
if (lines.length === 0) { console.log('nothing to write'); process.exit(0) }

const now = new Date().toISOString()
const sql = lines.map(l =>
  `INSERT INTO ledger (id, posting_key, occurred_at, kind, amount_cents, tax_cents, method, category, order_id, invoice_id, payment_id, customer_id, source, external_id, note, created_by, created_at)
   VALUES (${lit(id())}, ${lit(l.key)}, ${lit(l.at)}, 'sale', ${l.amount}, ${l.tax}, ${lit(l.method)}, 'engraving', ${lit(l.orderId)}, ${lit(l.invoiceId)}, ${lit(l.paymentId)}, ${lit(l.customerId)}, 'backfill', ${lit(l.key.startsWith('square:') ? l.key.slice(7) : null)}, ${lit(l.note)}, 'backfill', ${lit(now)})
   ON CONFLICT(posting_key) DO NOTHING;`
).join('\n')
const file = join(workDir, 'backfill.sql')
writeFileSync(file, sql)
execSync(`npx wrangler d1 execute vurmz-core ${flag} --file=${JSON.stringify(file)}`, { stdio: ["ignore", "ignore", "inherit"] })
const after = q<{ n: number; c: number }>(`SELECT COUNT(*) AS n, COALESCE(SUM(amount_cents),0) AS c FROM ledger WHERE kind IN ('sale','refund')`)[0]
console.log(`ledger after:  ${after.n} lines, $${(after.c / 100).toFixed(2)}  (+${after.n - before.n})`)
