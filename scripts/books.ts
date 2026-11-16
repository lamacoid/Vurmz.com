/**
 * The books. Builds `VURMZ Books <year>.xlsx` from the ledger and the
 * order book, on the Mac, never in the worker.
 *
 *   npm run books                 remote, current year
 *   npm run books -- --year 2025
 *   npm run books -- --local      local D1 (dev)
 *   npm run books -- --no-upload  write the file only
 *
 * Tabs: Order book, Income, Expenses, Square, Customers, Sales tax, P&L.
 * The file lands in vurmz-control/BOOKS/, is uploaded to R2 (books/), and
 * site_settings.books_last tells the Money room where it is. Customer
 * lifetime value and order count are written back to `customers` so the
 * admin stops showing 0 (PIPELINE.md 7.9).
 *
 * The spreadsheet is generated, never edited. Fix the ledger, run again.
 */
import { execFileSync, execSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import ExcelJS from 'exceljs'

const args = process.argv.slice(2)
const isLocal = args.includes('--local')
const noUpload = args.includes('--no-upload')
const yearArg = args.indexOf('--year')
const YEAR = yearArg >= 0 ? Number(args[yearArg + 1]) : new Date().getFullYear()
const flag = isLocal ? '--local' : '--remote'
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'vurmz-control', 'BOOKS')
const FILE = `VURMZ Books ${YEAR}.xlsx`
const R2_KEY = `books/VURMZ-Books-${YEAR}.xlsx`

const workDir = mkdtempSync(join(tmpdir(), 'vurmz-books-'))
let qn = 0
function q<T>(sql: string): T[] {
  // Rows only come back from --command (remote --file returns stats). No shell,
  // so quotes in the SQL are safe.
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'vurmz-core', flag, '--json', '--command', sql], { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })
  // Remote runs print progress lines before the JSON; take it from the first '['.
  const parsed = JSON.parse(out.slice(out.indexOf('['))) as Array<{ results: Array<Record<string, unknown>> }>
  return (parsed[0]?.results ?? []).map(r => { for (const k of Object.keys(r)) if (r[k] === 'null') r[k] = null; return r as T })
}
function run(sql: string) {
  const f = join(workDir, `w${qn++}.sql`)
  writeFileSync(f, sql)
  execSync(`npx wrangler d1 execute vurmz-core ${flag} --file=${JSON.stringify(f)}`, { stdio: ['ignore', 'ignore', 'inherit'] })
}

const dollars = (c: number | null | undefined) => Math.round(c ?? 0) / 100
/** Formula injection guard: a cell starting with = + - @ is text, not a formula. */
const text = (v: unknown) => {
  const s = v == null ? '' : String(v)
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s
}
const from = `${YEAR}-01-01`, to = `${YEAR + 1}-01-01`

// ---- pull ----------------------------------------------------------------
interface OrderRow { number: string; created_at: string; status: string; channel: string; email: string; customer: string | null; company: string | null; items: string | null; qty: number | null; subtotal_cents: number; tax_cents: number; shipping_cents: number; total_cents: number; tax_status: string; paid_cents: number; refunded_cents: number; paid_on: string | null; methods: string | null }
const orders = q<OrderRow>(`
  SELECT o.number, o.created_at, o.status, o.channel, o.email, c.name AS customer, c.company,
    (SELECT group_concat(oi.qty || ' x ' || oi.name_snapshot, '; ') FROM order_items oi WHERE oi.order_id = o.id) AS items,
    (SELECT SUM(oi.qty) FROM order_items oi WHERE oi.order_id = o.id) AS qty,
    o.subtotal_cents, o.tax_cents, o.shipping_cents, o.total_cents, o.tax_status,
    COALESCE((SELECT SUM(l.amount_cents) FROM ledger l WHERE l.order_id = o.id AND l.kind = 'sale'),0) AS paid_cents,
    COALESCE((SELECT SUM(l.amount_cents) FROM ledger l WHERE l.order_id = o.id AND l.kind = 'refund'),0) AS refunded_cents,
    (SELECT MAX(l.occurred_at) FROM ledger l WHERE l.order_id = o.id AND l.kind = 'sale') AS paid_on,
    (SELECT group_concat(DISTINCT l.method) FROM ledger l WHERE l.order_id = o.id AND l.kind = 'sale') AS methods
  FROM orders o LEFT JOIN customers c ON c.id = o.customer_id
  WHERE o.created_at >= '${from}' AND o.created_at < '${to}'
  ORDER BY o.created_at`)

interface LedgerRow { occurred_at: string; kind: string; amount_cents: number; tax_cents: number; method: string; category: string; source: string; external_id: string | null; note: string; order_number: string | null; invoice_number: string | null; customer: string | null }
const ledger = q<LedgerRow>(`
  SELECT l.occurred_at, l.kind, l.amount_cents, l.tax_cents, l.method, l.category, l.source, l.external_id, l.note,
    o.number AS order_number, i.number AS invoice_number, c.name AS customer
  FROM ledger l LEFT JOIN orders o ON o.id = l.order_id LEFT JOIN invoices i ON i.id = l.invoice_id LEFT JOIN customers c ON c.id = l.customer_id
  WHERE l.occurred_at >= '${from}' AND l.occurred_at < '${to}'
  ORDER BY l.occurred_at`)

interface CustRow { id: string; name: string; email: string; company: string | null; phone: string | null; created_at: string; orders_n: number; lifetime_cents: number; last_order: string | null }
const customers = q<CustRow>(`
  SELECT c.id, c.name, c.email, c.company, c.phone, c.created_at,
    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id AND o.status NOT IN ('cancelled','refunded')) AS orders_n,
    COALESCE((SELECT SUM(l.amount_cents) FROM ledger l WHERE l.customer_id = c.id AND l.kind IN ('sale','refund')),0) AS lifetime_cents,
    (SELECT MAX(o.created_at) FROM orders o WHERE o.customer_id = c.id) AS last_order
  FROM customers c WHERE c.deleted_at IS NULL ORDER BY lifetime_cents DESC, c.name`)

// ---- build ---------------------------------------------------------------
const wb = new ExcelJS.Workbook()
wb.creator = 'VURMZ'
wb.created = new Date()
const money = '"$"#,##0.00;[Red]-"$"#,##0.00'
const head = (ws: ExcelJS.Worksheet) => {
  ws.getRow(1).font = { bold: true }
  ws.views = [{ state: 'frozen', ySplit: 1 }]
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: ws.columnCount } }
}

{
  const ws = wb.addWorksheet('Order book')
  ws.columns = [
    { header: 'Order', key: 'number', width: 16 }, { header: 'Date', key: 'date', width: 12 }, { header: 'Customer', key: 'customer', width: 24 },
    { header: 'Company', key: 'company', width: 20 }, { header: 'Email', key: 'email', width: 26 }, { header: 'What', key: 'items', width: 48 },
    { header: 'Qty', key: 'qty', width: 6 }, { header: 'Subtotal', key: 'subtotal', width: 11, style: { numFmt: money } },
    { header: 'Tax', key: 'tax', width: 9, style: { numFmt: money } }, { header: 'Delivery', key: 'delivery', width: 10, style: { numFmt: money } },
    { header: 'Total', key: 'total', width: 11, style: { numFmt: money } }, { header: 'Paid', key: 'paid', width: 11, style: { numFmt: money } },
    { header: 'Refunded', key: 'refunded', width: 11, style: { numFmt: money } }, { header: 'Owed', key: 'owed', width: 11, style: { numFmt: money } }, { header: 'Status', key: 'status', width: 12 },
    { header: 'Paid on', key: 'paid_on', width: 12 }, { header: 'Method', key: 'method', width: 12 }, { header: 'Channel', key: 'channel', width: 9 }, { header: 'Tax status', key: 'tax_status', width: 10 },
  ]
  for (const o of orders) {
    ws.addRow({
      number: text(o.number), date: o.created_at.slice(0, 10), customer: text(o.customer), company: text(o.company), email: text(o.email),
      items: text(o.items), qty: o.qty ?? 0, subtotal: dollars(o.subtotal_cents), tax: dollars(o.tax_cents), delivery: dollars(o.shipping_cents),
      total: dollars(o.total_cents), paid: dollars(o.paid_cents), refunded: dollars(o.refunded_cents), owed: dollars(Math.max(0, o.total_cents - o.paid_cents)),
      status: o.status, paid_on: o.paid_on?.slice(0, 10) ?? '', method: text(o.methods), channel: o.channel, tax_status: o.tax_status,
    })
  }
  head(ws)
}

const lineCols = [
  { header: 'Date', key: 'date', width: 12 }, { header: 'Kind', key: 'kind', width: 10 }, { header: 'Amount', key: 'amount', width: 11, style: { numFmt: money } },
  { header: 'Tax', key: 'tax', width: 9, style: { numFmt: money } }, { header: 'Method', key: 'method', width: 10 }, { header: 'Category', key: 'category', width: 12 },
  { header: 'Order', key: 'order', width: 16 }, { header: 'Invoice', key: 'invoice', width: 10 }, { header: 'Customer', key: 'customer', width: 22 },
  { header: 'Note', key: 'note', width: 40 }, { header: 'Source', key: 'source', width: 14 }, { header: 'Square id', key: 'ext', width: 24 },
]
const lineRow = (l: LedgerRow) => ({
  date: l.occurred_at.slice(0, 10), kind: l.kind, amount: dollars(l.amount_cents), tax: dollars(l.tax_cents), method: l.method, category: l.category,
  order: text(l.order_number), invoice: text(l.invoice_number), customer: text(l.customer), note: text(l.note), source: l.source, ext: text(l.external_id),
})
{
  const ws = wb.addWorksheet('Income'); ws.columns = lineCols
  for (const l of ledger.filter(l => l.kind === 'sale' || l.kind === 'refund')) ws.addRow(lineRow(l))
  head(ws)
}
{
  const ws = wb.addWorksheet('Expenses'); ws.columns = lineCols
  for (const l of ledger.filter(l => l.kind === 'expense' || l.kind === 'fee' || l.kind === 'adjustment')) ws.addRow(lineRow(l))
  head(ws)
}
{
  const ws = wb.addWorksheet('Square'); ws.columns = lineCols
  for (const l of ledger.filter(l => l.source.startsWith('square') || l.kind === 'payout' || l.kind === 'fee' || l.method === 'card')) ws.addRow(lineRow(l))
  head(ws)
}
{
  const ws = wb.addWorksheet('Customers')
  ws.columns = [
    { header: 'Name', key: 'name', width: 24 }, { header: 'Company', key: 'company', width: 20 }, { header: 'Email', key: 'email', width: 26 },
    { header: 'Phone', key: 'phone', width: 14 }, { header: 'Orders', key: 'orders', width: 8 }, { header: 'Lifetime', key: 'lifetime', width: 12, style: { numFmt: money } },
    { header: 'Last order', key: 'last', width: 12 }, { header: 'Since', key: 'since', width: 12 },
  ]
  for (const c of customers) ws.addRow({ name: text(c.name), company: text(c.company), email: text(c.email), phone: text(c.phone), orders: c.orders_n, lifetime: dollars(c.lifetime_cents), last: c.last_order?.slice(0, 10) ?? '', since: c.created_at.slice(0, 10) })
  head(ws)
}

// Month roll-ups for Sales tax and P&L
const months = new Map<string, { sales: number; refunds: number; fees: number; expenses: number; adjustments: number; payouts: number; tax: number; taxable: number }>()
for (const l of ledger) {
  const m = l.occurred_at.slice(0, 7)
  const row = months.get(m) ?? { sales: 0, refunds: 0, fees: 0, expenses: 0, adjustments: 0, payouts: 0, tax: 0, taxable: 0 }
  if (l.kind === 'sale') { row.sales += l.amount_cents; row.tax += l.tax_cents; row.taxable += l.amount_cents - l.tax_cents }
  else if (l.kind === 'refund') { row.refunds += l.amount_cents; row.tax -= l.tax_cents }
  else if (l.kind === 'fee') row.fees += l.amount_cents
  else if (l.kind === 'expense') row.expenses += l.amount_cents
  else if (l.kind === 'adjustment') row.adjustments += l.amount_cents
  else if (l.kind === 'payout') row.payouts += l.amount_cents
  months.set(m, row)
}
const monthKeys = [...months.keys()].sort()
{
  const ws = wb.addWorksheet('Sales tax')
  ws.columns = [
    { header: 'Month', key: 'month', width: 10 }, { header: 'Sales', key: 'sales', width: 12, style: { numFmt: money } },
    { header: 'Tax collected', key: 'tax', width: 13, style: { numFmt: money } }, { header: 'Orders, tax collected', key: 'collected', width: 18 },
    { header: 'Orders, no tax determined', key: 'none', width: 22 }, { header: 'Orders, exempt', key: 'exempt', width: 14 },
  ]
  for (const m of monthKeys) {
    const r = months.get(m)!
    const inMonth = orders.filter(o => o.created_at.startsWith(m))
    ws.addRow({ month: m, sales: dollars(r.sales + r.refunds), tax: dollars(r.tax), collected: inMonth.filter(o => o.tax_status === 'collected').length, none: inMonth.filter(o => o.tax_status === 'none').length, exempt: inMonth.filter(o => o.tax_status === 'exempt').length })
  }
  ws.addRow({})
  ws.addRow({ month: 'Note', sales: 'Rates are not applied by the site yet. "No tax determined" is the honest count until the accountant sets the rate (PLAYBOOK item 1).' })
  head(ws)
}
{
  const ws = wb.addWorksheet('P&L')
  ws.columns = [
    { header: 'Month', key: 'month', width: 10 }, { header: 'Sales', key: 'sales', width: 12, style: { numFmt: money } },
    { header: 'Refunds', key: 'refunds', width: 11, style: { numFmt: money } }, { header: 'Income', key: 'income', width: 12, style: { numFmt: money } },
    { header: 'Fees', key: 'fees', width: 10, style: { numFmt: money } }, { header: 'Expenses', key: 'expenses', width: 12, style: { numFmt: money } },
    { header: 'Adjustments', key: 'adj', width: 12, style: { numFmt: money } }, { header: 'Net', key: 'net', width: 12, style: { numFmt: money } },
    { header: 'Square payouts', key: 'payouts', width: 14, style: { numFmt: money } },
  ]
  const tot = { sales: 0, refunds: 0, fees: 0, expenses: 0, adjustments: 0, payouts: 0 }
  for (const m of monthKeys) {
    const r = months.get(m)!
    tot.sales += r.sales; tot.refunds += r.refunds; tot.fees += r.fees; tot.expenses += r.expenses; tot.adjustments += r.adjustments; tot.payouts += r.payouts
    ws.addRow({ month: m, sales: dollars(r.sales), refunds: dollars(r.refunds), income: dollars(r.sales + r.refunds), fees: dollars(r.fees), expenses: dollars(r.expenses), adj: dollars(r.adjustments), net: dollars(r.sales + r.refunds + r.fees + r.expenses + r.adjustments), payouts: dollars(r.payouts) })
  }
  const total = ws.addRow({ month: `${YEAR}`, sales: dollars(tot.sales), refunds: dollars(tot.refunds), income: dollars(tot.sales + tot.refunds), fees: dollars(tot.fees), expenses: dollars(tot.expenses), adj: dollars(tot.adjustments), net: dollars(tot.sales + tot.refunds + tot.fees + tot.expenses + tot.adjustments), payouts: dollars(tot.payouts) })
  total.font = { bold: true }
  ws.addRow({})
  ws.addRow({ month: 'Note', sales: 'Cash basis. Payouts are Square moving money to the bank, not income. Materials are an expense when bought.' })
  head(ws)
}

// ---- write, upload, record -----------------------------------------------
async function finish() {
mkdirSync(OUT_DIR, { recursive: true })
const outPath = join(OUT_DIR, FILE)
await wb.xlsx.writeFile(outPath)
console.log(`wrote ${outPath}  (${orders.length} orders, ${ledger.length} ledger lines, ${customers.length} customers)`)

// Customer stats back to the admin.
if (customers.length) {
  run(customers.map(c => `UPDATE customers SET lifetime_value_cents = ${c.lifetime_cents}, order_count = ${c.orders_n}, updated_at = '${new Date().toISOString()}' WHERE id = '${c.id}';`).join('\n'))
  console.log(`customer stats written back (${customers.length})`)
}

if (!noUpload) {
  const bucket = 'vurmz-media'
  execSync(`npx wrangler r2 object put ${JSON.stringify(`${bucket}/${R2_KEY}`)} --file=${JSON.stringify(outPath)} ${isLocal ? '--local' : '--remote'} --content-type application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, { stdio: ['ignore', 'ignore', 'inherit'] })
  const meta = JSON.stringify({ at: new Date().toISOString(), year: YEAR, key: R2_KEY, lines: ledger.length })
  run(`INSERT INTO site_settings (key, value, updated_at) VALUES ('books_last', '${meta.replace(/'/g, "''")}', '${new Date().toISOString()}')
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`)
  console.log(`uploaded to R2 ${R2_KEY} and recorded in site_settings.books_last`)
}
}
finish().catch(err => { console.error(err); process.exit(1) })
