/**
 * Row types — mirror the D1 schema exactly.
 * JSON columns arrive as strings; repos parse them.
 */

export interface PageRow {
  id: string
  slug: string
  title: string
  meta_description: string | null
  og_image_id: string | null
  published_blocks: string
  draft_blocks: string
  version: number
  is_published: 0 | 1
  noindex: 0 | 1
  created_at: string
  updated_at: string
  published_at: string | null
  deleted_at: string | null
}

export interface SiteThemeRow {
  id: string
  colors: string
  fonts: string
  spacing: string
  updated_at: string
}

export interface SiteSettingRow {
  key: string
  value: string
  updated_at: string
}

export interface NavigationRow {
  id: string
  placement: 'header' | 'footer' | 'footer-legal' | 'mobile'
  position: number
  label: string
  href: string
  parent_id: string | null
  opens_new_tab: 0 | 1
  created_at: string
  updated_at: string
}

export interface RedirectRow {
  id: string
  from_path: string
  to_path: string
  status_code: 301 | 302 | 307 | 308
  created_at: string
}

export interface MediaRow {
  id: string
  r2_key: string
  filename: string
  mime_type: string
  size_bytes: number
  width: number | null
  height: number | null
  alt_text: string
  folder: string
  tags: string
  uploaded_at: string
  uploaded_by: string | null
  deleted_at: string | null
  external_url: string | null
}

export interface CategoryRow {
  id: string
  slug: string
  name: string
  description: string | null
  hero_media_id: string | null
  position: number
  is_published: 0 | 1
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductRow {
  id: string
  slug: string
  name: string
  description: string
  category_id: string | null
  price_cents: number
  pack_size: number
  position: number
  is_published: 0 | 1
  metadata: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CustomerRow {
  id: string
  email: string
  name: string
  phone: string | null
  company: string | null
  square_customer_id: string | null
  tags: string
  notes: string
  lifetime_value_cents: number
  order_count: number
  email_verified_at: string | null
  created_at: string
  updated_at: string
  last_seen_at: string | null
  deleted_at: string | null
}

export interface MessageRow {
  id: string
  customer_id: string | null
  direction: 'inbound' | 'outbound'
  channel: 'web' | 'email' | 'admin' | 'sms'
  subject: string | null
  body: string
  attachments: string
  is_read: 0 | 1
  metadata: string
  created_at: string
}

export interface AuditLogRow {
  id: string
  actor_type: 'admin' | 'customer' | 'system' | 'webhook'
  actor_id: string | null
  impersonator_id: string | null
  action: string
  target_type: string
  target_id: string | null
  diff: string
  ip: string | null
  user_agent: string | null
  created_at: string
}
