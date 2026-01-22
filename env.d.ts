/// <reference types="@cloudflare/workers-types" />
/// <reference types="@types/google.maps" />

interface CloudflareEnv {
  DB: D1Database
  FILES: R2Bucket
  SITE_URL: string
  SQUARE_ACCESS_TOKEN: string
  SQUARE_APPLICATION_ID: string
  SQUARE_ENVIRONMENT: string
  RESEND_API_KEY: string
}
