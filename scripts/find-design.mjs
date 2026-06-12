// Resolve a design-element id (shown on the admin order page, e.g. de_42946ff3...)
// to the source vector file on this machine, so you can engrave it.
// Usage: node scripts/find-design.mjs de_42946ff39b341d0b
import { readFileSync } from 'node:fs'
const id = process.argv[2]
if (!id) { console.error('Usage: node scripts/find-design.mjs <de_id>'); process.exit(1) }
try {
  const map = JSON.parse(readFileSync(new URL('../vurmz-control/design-sources.json', import.meta.url)))
  const path = map[id]
  if (path) {
    console.log(path)
  } else {
    console.error(`No source on file for ${id}. (Re-run scripts/build-design-catalog.mjs if the catalog changed.)`)
    process.exit(2)
  }
} catch {
  console.error('vurmz-control/design-sources.json not found — run scripts/build-design-catalog.mjs first.')
  process.exit(2)
}
