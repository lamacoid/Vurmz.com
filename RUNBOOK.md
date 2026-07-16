# VURMZ Operations Runbook

Single-page reference for deploying, debugging, and maintaining vurmz.com.
Last updated: 2026-04-26 audit pass.

---

## Deploying

```bash
./deploy.sh
```

What it does:
1. Kills zombie `next-on-pages` / `vercel build` / `next build` processes
2. Cleans `.next` and `.vercel` artifacts
3. Recovers from corrupted `node_modules` (iCloud sync issue)
4. Runs `next-on-pages` to build for Cloudflare Pages
5. Runs `wrangler pages deploy ... --commit-dirty=true`

Always commit + push to GitHub *before* running this — the deploy is from local files, not from git.

---

## Rollback

The deploy history is at:
`https://dash.cloudflare.com/?to=/:account/workers/services/view/vurmz-website` → Pages → Deployments

Click the previous deploy → "Rollback to this deployment".

No CLI rollback script yet — manual via dashboard.

---

## Smoke test after deploy

```bash
# Check key pages return 200
for u in / /shop /services /services/pricing /services/contact /about; do
  echo "$u $(curl -sL -o /dev/null -w '%{http_code}' https://www.vurmz.com$u)"
done

# Check API health
curl https://www.vurmz.com/api/health | jq
```

---

## Secrets (Cloudflare Pages)

Bound via `wrangler pages secret put <KEY> --project-name=vurmz-website`:

| Secret | Purpose |
|---|---|
| `ADMIN_PASSWORD_HASH` | SHA-256 of admin password (used by /admin/login) |
| `RESEND_API_KEY` | Transactional + marketing email |
| `RESEND_AUDIENCE_ID` | Resend Audience for newsletter |
| `SQUARE_ACCESS_TOKEN` | Square API |
| `SQUARE_APPLICATION_ID` | Square app ID |
| `SQUARE_LOCATION_ID` | Square location |
| `SQUARE_ENVIRONMENT` | sandbox or production |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square webhook HMAC |
| `JDS_API_TOKEN` | JDS Industries catalog API |
| `OWNER_KEY` | Used by `/api/set-owner` to set the owner cookie |
| `SENTRY_DSN` | (Optional) — error reporter destination |

**To rotate the admin password:**
```bash
PASSWORD="your-new-strong-password"
echo -n "$PASSWORD" | shasum -a 256 | awk '{print $1}' | wrangler pages secret put ADMIN_PASSWORD_HASH --project-name=vurmz-website
```

---

## Bindings (defined in `wrangler.toml`)

| Binding | Type | Purpose |
|---|---|---|
| `DB` | D1 | vurmz-core: CMS, products, orders, customers, audit |
| `TRACK_DB` | D1 | vurmz-track: pageviews, jobs, analytics |
| `SESSIONS` | KV | Admin sessions |
| `CUSTOMER_SESSIONS` | KV | Customer-portal sessions |
| `RATE_LIMIT` | KV | Rate-limiter counters + inbox storage |
| `MEDIA` | R2 | Admin-uploaded media |

---

## Database

```bash
# Apply pending migrations
npm run db:migrate:remote

# List applied
npm run db:list:remote

# Tables
npm run db:tables

# Backup before risky migrations
npm run db:backup            # writes backups/vurmz-core-YYYY-MM-DD-HHMM.sql

# Cleanup old tokens / events
npm run db:cleanup            # remote, real
npm run db:cleanup -- --dry   # show counts only

# Regenerate TypeScript types from D1 schema
npm run db:types
```

Migrations are forward-only — never edit a numbered migration after it's been applied.

---

## Time Travel: restoring the database from a backup

Backups are full SQL exports in `backups/` (one file per run, named by
timestamp). They are made three ways: automatically every Sunday 3:15am
(launchd job `com.vurmz.dbbackup`, log at `backups/backup-cron.log`),
before every migration by hand (`npm run db:backup`), and any time you
ask Claude. The script retries and verifies; trust a backup only if
"backup OK" printed for it.

To restore (this REPLACES current data with the backup's data):

1. Pick the file: `ls -t backups/` (newest first). Open it and check the
   date in the filename is the moment you want to travel back to.
2. Take a backup of the CURRENT broken state first, so time travel is
   itself reversible: `npm run db:backup`.
3. Restore locally first and look at it:
   `npx wrangler d1 execute vurmz-core --local --file=backups/<file>.sql`
   then browse the local admin to confirm it looks right.
4. Restore remote (the live site):
   `npx wrangler d1 execute vurmz-core --remote --file=backups/<file>.sql`
5. Smoke test: `/shop`, one product page, `/admin` orders list.

Notes: exports contain full CREATE + INSERT statements, so they replace
tables wholesale. Orders placed AFTER the backup moment are lost from
the database (Square still has the payment records; recover those by
hand from the Square dashboard). If wrangler errors midway, run the
file again; it is safe to re-apply.

## Common issues

### "It built on my machine but failed on Pages"
Cloudflare Pages sometimes ships with a different node_modules than local. Try:
```bash
rm -rf node_modules .next .vercel
npm install
./deploy.sh
```

### Contact form returns 500
1. Check Resend API key is set: `wrangler pages secret list --project-name=vurmz-website`
2. Check rate limit isn't tripped (KV: `RATE_LIMIT`)
3. Check Sentry (if SENTRY_DSN set) for the actual error

### Admin login returns "Server misconfigured"
`ADMIN_PASSWORD_HASH` secret isn't set. See "Rotate the admin password" above.

### Square webhook events not processing
Check the `square_events` D1 table:
```bash
wrangler d1 execute vurmz-core --remote --command="SELECT id, event_type, signature_valid, processed_at FROM square_events ORDER BY received_at DESC LIMIT 20"
```
- `signature_valid = 0` → check `SQUARE_WEBHOOK_SIGNATURE_KEY` matches the Square dashboard
- `processed_at IS NULL` → handler crashed; check Sentry / Workers logs

### Image keeps showing the old version
Cloudflare CDN caches images. After replacing:
1. Bump the file path or query string, OR
2. Purge cache in Cloudflare dashboard

---

## Pages that might 404 after a deploy

- `/community/` — stale Google index, not a real route. Ignore.
- `/services/materials` — exists in `site-split` only; deploys with main merge

---

## Where things live

| What | Where |
|---|---|
| Live site | https://www.vurmz.com |
| GitHub repo | https://github.com/lamacoid/Vurmz.com |
| Active branch | `site-split` |
| Cloudflare Pages project | `vurmz-website` |
| D1 database | `vurmz-core` (id: `84be53e8-100d-41ef-927d-2719c89f0348`) |
| Analytics DB | `vurmz-track` (id: `2eadd359-67ca-447c-9f33-5ed533ea72f1`) |
| R2 bucket | `vurmz-media` |

---

## On-call / continuity

Single operator: Zach DeMillo. If unreachable:

1. **Customer-facing message:** site footer phone `(719) 257-3834` is SMS-capable; respond when able
2. **Production access:** Cloudflare account `zdem91@gmail.com`; GitHub `lamacoid`
3. **Critical secrets:** stored in macOS keychain; new device requires re-`wrangler login` + secret rotation

---

## What's documented elsewhere

- Audit findings: `audit-2026-04-26/SYNTHESIS.md`
- Memory: `~/.claude/projects/-Users-zacharydemillo/memory/MEMORY.md`
- Code-level docs: inline JSDoc comments in `lib/error.ts`, `lib/api/response.ts`, `lib/audit.ts`, `scripts/db-cleanup.ts`, `scripts/gen-db-types.ts`
