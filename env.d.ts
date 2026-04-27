/// <reference types="@cloudflare/workers-types" />
/// <reference types="@types/google.maps" />

interface CloudflareEnv {
  // D1 databases
  DB: D1Database
  TRACK_DB: D1Database

  // KV namespaces
  SESSIONS: KVNamespace
  CUSTOMER_SESSIONS: KVNamespace
  RATE_LIMIT: KVNamespace

  // R2 buckets
  MEDIA: R2Bucket

  // Environment variables
  SITE_URL: string
  RESEND_API_KEY: string

  // Admin auth
  ADMIN_PASSWORD_HASH: string

  // Error reporting (Sentry)
  SENTRY_DSN?: string

  // JDS Industries API
  JDS_API_TOKEN?: string

  // Square (provisioned in Chunk 5)
  SQUARE_ACCESS_TOKEN?: string
  SQUARE_APPLICATION_ID?: string
  SQUARE_LOCATION_ID?: string
  SQUARE_ENVIRONMENT?: string
  SQUARE_WEBHOOK_SIGNATURE_KEY?: string
}
