/**
 * DB cleanup tasks. Run periodically to prevent unbounded growth.
 *
 * Usage:
 *   tsx scripts/db-cleanup.ts          # remote (default)
 *   tsx scripts/db-cleanup.ts --local
 *   tsx scripts/db-cleanup.ts --dry    # show counts without deleting
 *
 * What it cleans (per Database Engineer audit, role-14):
 *   - Expired magic-link tokens (customer_auth_tokens) older than 30 days
 *   - Square webhook events (square_events) older than 90 days
 *   - Audit log rows older than 365 days (optional — keep generous)
 */

import { execSync } from 'node:child_process'

const args = process.argv.slice(2)
const isLocal = args.includes('--local')
const isDry = args.includes('--dry')
const flag = isLocal ? '--local' : '--remote'

function exec(sql: string): string {
  const cmd = `wrangler d1 execute vurmz-core ${flag} --json --command="${sql.replace(/"/g, '\\"')}"`
  try {
    return execSync(cmd, { encoding: 'utf-8' })
  } catch (err) {
    console.error('exec failed:', cmd)
    throw err
  }
}

function count(table: string, where: string): number {
  const out = exec(`SELECT COUNT(*) as c FROM ${table} WHERE ${where}`)
  const match = out.match(/"c":\s*(\d+)/)
  return match ? Number(match[1]) : 0
}

function deleteRows(table: string, where: string): void {
  if (isDry) return
  exec(`DELETE FROM ${table} WHERE ${where}`)
}

const tasks: Array<{ name: string; table: string; where: string }> = [
  {
    name: 'Expired magic-link tokens (>30 days)',
    table: 'customer_auth_tokens',
    where: "datetime(expires_at) < datetime('now', '-30 days')",
  },
  {
    name: 'Old Square webhook events (>90 days)',
    table: 'square_events',
    where: "datetime(received_at) < datetime('now', '-90 days')",
  },
  {
    name: 'Old audit log rows (>365 days)',
    table: 'audit_log',
    where: "datetime(created_at) < datetime('now', '-365 days')",
  },
]

console.log(`DB cleanup — ${isLocal ? 'LOCAL' : 'REMOTE'}${isDry ? ' (DRY RUN)' : ''}`)
console.log('─'.repeat(60))

let totalDeleted = 0
for (const task of tasks) {
  try {
    const before = count(task.table, task.where)
    if (before === 0) {
      console.log(`  ${task.name}: 0 rows`)
      continue
    }
    deleteRows(task.table, task.where)
    console.log(`  ${task.name}: ${isDry ? 'would delete' : 'deleted'} ${before} rows`)
    totalDeleted += before
  } catch (err) {
    console.warn(`  ${task.name}: SKIPPED (table may not exist) — ${(err as Error).message.split('\n')[0]}`)
  }
}

console.log('─'.repeat(60))
console.log(`Total: ${isDry ? 'would delete' : 'deleted'} ${totalDeleted} rows`)
