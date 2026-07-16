#!/bin/bash
# Remote D1 backup that cannot silently no-op. wrangler d1 export fails
# quietly sometimes (proven repeatedly on 2026-07-13/15), so this retries
# up to 3 times and hard-verifies a plausibly-sized file landed. A real
# vurmz-core export runs ~150KB; anything under 50KB is treated as a
# failure, not a backup.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p backups
F="backups/vurmz-core-$(date +%Y-%m-%d-%H%M%S).sql"
for i in 1 2 3; do
  npx wrangler d1 export vurmz-core --remote --output="$F" >/dev/null 2>&1
  if [ -f "$F" ]; then
    SIZE=$(wc -c < "$F" | tr -d ' ')
    if [ "$SIZE" -gt 50000 ]; then
      echo "backup OK: $F (${SIZE} bytes)"
      exit 0
    fi
  fi
  echo "backup attempt $i failed, retrying..." >&2
  rm -f "$F"
  sleep 3
done
echo "BACKUP FAILED after 3 attempts. Do not write to remote D1." >&2
exit 1
