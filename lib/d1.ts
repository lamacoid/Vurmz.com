import { getRequestContext } from '@cloudflare/next-on-pages'

export function getD1() {
  const { env } = getRequestContext()
  return env.DB as D1Database
}

// Helper to generate unique IDs
export function generateId(): string {
  return crypto.randomUUID()
}

// Helper to get current timestamp
export function now(): string {
  return new Date().toISOString()
}
