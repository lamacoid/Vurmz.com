/**
 * Generate TypeScript types from D1 schema.
 *
 * Reads PRAGMA table_info(...) for every table in vurmz-core and emits
 * lib/db/generated-types.ts. Run after every migration to keep TS in
 * sync with SQL.
 *
 * Usage:
 *   npm run db:types          # remote
 *   npm run db:types -- --local
 *
 * This closes the schema-to-TypeScript drift risk flagged by the DB
 * Engineer audit (role-14).
 */

import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const isLocal = args.includes('--local')
const flag = isLocal ? '--local' : '--remote'

interface ColumnInfo {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: string | null
  pk: number
}

function exec(sql: string): unknown[] {
  const cmd = `wrangler d1 execute vurmz-core ${flag} --json --command="${sql.replace(/"/g, '\\"')}"`
  const raw = execSync(cmd, { encoding: 'utf-8' })
  // wrangler outputs an array of result objects; we want the first one's results
  const wrapper = JSON.parse(raw) as Array<{ results: unknown[] }>
  return wrapper[0]?.results ?? []
}

function listTables(): string[] {
  const rows = exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_%' ORDER BY name",
  ) as Array<{ name: string }>
  return rows.map((r) => r.name)
}

function columnsOf(table: string): ColumnInfo[] {
  return exec(`PRAGMA table_info(${table})`) as ColumnInfo[]
}

function pascal(s: string): string {
  return s.replace(/(^|_)([a-z])/g, (_, _u, c: string) => c.toUpperCase())
}

function tsType(sqliteType: string, notnull: number): string {
  const base = sqliteType.toUpperCase()
  let t: string
  if (base.startsWith('INT') || base === 'INTEGER' || base === 'BIGINT' || base.startsWith('NUMERIC') || base === 'REAL' || base === 'FLOAT' || base === 'DOUBLE') {
    t = 'number'
  } else if (base === 'BLOB') {
    t = 'ArrayBuffer'
  } else if (base === 'BOOLEAN') {
    t = 'number /* boolean as 0|1 */'
  } else {
    t = 'string'
  }
  return notnull ? t : `${t} | null`
}

const tables = listTables()
const out: string[] = []

out.push('/**')
out.push(' * AUTO-GENERATED — do not edit by hand.')
out.push(' * Regenerate via `npm run db:types` after every migration.')
out.push(` * Source: vurmz-core (${isLocal ? 'local' : 'remote'}) — generated ${new Date().toISOString()}`)
out.push(' */')
out.push('')

for (const table of tables) {
  const cols = columnsOf(table)
  const interfaceName = pascal(table) + 'Row'
  out.push(`export interface ${interfaceName} {`)
  for (const c of cols) {
    out.push(`  ${c.name}: ${tsType(c.type, c.notnull)}`)
  }
  out.push('}')
  out.push('')
}

out.push(`export const TABLE_NAMES = [`)
for (const t of tables) out.push(`  '${t}',`)
out.push('] as const')
out.push('')
out.push('export type TableName = typeof TABLE_NAMES[number]')

const outPath = 'lib/db/generated-types.ts'
writeFileSync(outPath, out.join('\n'))
console.log(`✓ wrote ${outPath} (${tables.length} tables)`)
