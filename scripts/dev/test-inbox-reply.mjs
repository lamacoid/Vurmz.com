// Local check of the admin inbox reply route with attachments.
// Usage: node scripts/dev/test-inbox-reply.mjs <session-token> [image-path]
// Needs `npm run dev` running and a message named "Attach Test" in the local inbox.
import { readFileSync } from 'node:fs'

const [token, imagePath] = process.argv.slice(2)
if (!token) { console.error('session token required'); process.exit(1) }
const base = 'http://localhost:3000'
const cookie = { Cookie: `vurmz_admin=${token}` }

const list = await fetch(`${base}/api/admin/inbox/?filter=all`, { headers: cookie }).then(r => r.json())
const msgs = list.messages || list.data?.messages || []
const target = msgs.find(m => m.name === 'Attach Test')
if (!target) { console.error('no "Attach Test" message in the local inbox'); process.exit(1) }
const url = `${base}/api/admin/inbox/${target.id}/reply/`

async function post(label, form, extraHeaders = {}) {
  const res = await fetch(url, { method: 'POST', body: form, headers: { ...cookie, ...extraHeaders } })
  const text = await res.text()
  console.log(`-- ${label}: [${res.status}] ${text.slice(0, 160)}`)
}

const img = imagePath ? new Blob([readFileSync(imagePath)], { type: 'image/jpeg' }) : new Blob([new Uint8Array(2000)], { type: 'image/png' })
const tiny = () => new Blob([new Uint8Array(10)], { type: 'image/png' })

let f = new FormData(); f.set('body', 'hello with a file'); f.append('files', img, 'artwork.jpg')
await post('good file (expect 503 EMAIL_OFF locally, no Resend key)', f)

f = new FormData(); f.set('body', 'hi'); f.append('files', new Blob([new Uint8Array(10)], { type: 'application/x-msdownload' }), 'program.exe')
await post('bad type (expect 400 BAD_TYPE)', f)

f = new FormData(); f.set('body', 'hi'); f.append('files', new Blob([new Uint8Array(11 * 1024 * 1024)], { type: 'image/png' }), 'huge.png')
await post('too big (expect 400 TOO_BIG)', f)

f = new FormData(); f.set('body', 'hi'); for (const n of 'abcdef') f.append('files', tiny(), `${n}.png`)
await post('six files (expect 400 TOO_MANY_FILES)', f)

await post('json path (expect 503 EMAIL_OFF)', JSON.stringify({ body: 'plain' }), { 'Content-Type': 'application/json' })

f = new FormData(); f.set('body', '')
await post('empty (expect 400 EMPTY)', f)

const res = await fetch(url, { method: 'POST', body: JSON.stringify({ body: 'hi' }), headers: { 'Content-Type': 'application/json' } })
console.log(`-- no auth (expect 401): [${res.status}]`)
