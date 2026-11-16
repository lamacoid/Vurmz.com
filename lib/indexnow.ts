/**
 * IndexNow (2026-11-16): tell Bing a page changed so it re-crawls now
 * instead of whenever it next comes around. Yandex, Naver, and Seznam read
 * the same feed. Google does not take part.
 *
 * The key is not a secret. It is published at /<key>.txt (the file in
 * public/), and that file is how the search engine confirms the request
 * came from this site. If the key ever changes, rename that file, change
 * its contents to match, and deploy before pinging.
 */
export const INDEXNOW_KEY = '86135e4c-b9a2-442c-bf5f-b192bc1afd7d'
export const INDEXNOW_HOST = 'www.vurmz.com'
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

/** The protocol's limit for one request. */
const MAX_URLS = 10000

export interface IndexNowResult {
  ok: boolean
  /** The status IndexNow answered with. 0 when the request never got there. */
  status: number
  submitted: number
  /** Addresses that were dropped because they are not pages on this site. */
  rejected: string[]
  message: string
}

/** What each answer means, in the protocol's own terms. */
function explain(status: number): string {
  if (status === 200) return 'Received.'
  if (status === 202) return 'Received. The key file is still being checked.'
  if (status === 400) return 'Rejected: the request was malformed.'
  if (status === 403) return 'Rejected: the key file was not found at /<key>.txt or does not match.'
  if (status === 422) return 'Rejected: an address does not belong to this site, or the key does not match.'
  if (status === 429) return 'Rejected: too many requests. Try again later.'
  return `Unexpected answer (${status}).`
}

/** Keep only https pages on this host, without duplicates. */
export function sortUrls(input: unknown): { urls: string[]; rejected: string[] } {
  const urls = new Set<string>()
  const rejected: string[] = []
  for (const raw of Array.isArray(input) ? input : []) {
    if (typeof raw !== 'string') continue
    try {
      const u = new URL(raw)
      if (u.protocol === 'https:' && u.hostname === INDEXNOW_HOST) urls.add(u.toString())
      else rejected.push(raw)
    } catch {
      rejected.push(raw)
    }
  }
  return { urls: [...urls].slice(0, MAX_URLS), rejected }
}

/** Submit a list of this site's addresses. Never throws. */
export async function submitToIndexNow(input: unknown): Promise<IndexNowResult> {
  const { urls, rejected } = sortUrls(input)
  if (urls.length === 0) {
    return { ok: false, status: 0, submitted: 0, rejected, message: 'No addresses on this site to submit.' }
  }
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    })
    const ok = res.status === 200 || res.status === 202
    return { ok, status: res.status, submitted: ok ? urls.length : 0, rejected, message: explain(res.status) }
  } catch {
    return { ok: false, status: 0, submitted: 0, rejected, message: 'Could not reach IndexNow.' }
  }
}
