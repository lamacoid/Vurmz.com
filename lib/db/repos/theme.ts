import type { SiteThemeRow } from '../types'
import { getDb, nowIso } from '../client'

export interface ThemeColors {
  bg: string
  bg_alt: string
  teal_primary: string
  teal_muted: string
  coral_cta: string
  coral_accent: string
  cream: string
  cream_muted: string
  text_heading: string
  text_body: string
  text_muted: string
  border: string
  [key: string]: string
}

export interface ThemeFonts {
  heading: string
  body: string
  mono: string
}

export interface ThemeSpacing {
  container_max: string
  radius_sm: string
  radius_md: string
  radius_lg: string
}

export interface Theme {
  colors: ThemeColors
  fonts: ThemeFonts
  spacing: ThemeSpacing
  updatedAt: string
}

export const DEFAULT_THEME: Theme = {
  colors: {
    bg: '#1a2f2e',
    bg_alt: '#243B39',
    teal_primary: '#6BB8B2',
    teal_muted: '#3CB9B2',
    coral_cta: '#C46B4D',
    coral_accent: '#B16558',
    cream: '#F0E6D3',
    cream_muted: '#6B6259',
    text_heading: '#F0E6D3',
    text_body: '#9CA3AF',
    text_muted: '#6B7280',
    border: 'rgba(255,255,255,0.06)',
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  spacing: {
    container_max: '72rem',
    radius_sm: '2px',
    radius_md: '6px',
    radius_lg: '12px',
  },
  updatedAt: '',
}

function hydrate(row: SiteThemeRow): Theme {
  return {
    colors: { ...DEFAULT_THEME.colors, ...(JSON.parse(row.colors) as ThemeColors) },
    fonts: { ...DEFAULT_THEME.fonts, ...(JSON.parse(row.fonts) as ThemeFonts) },
    spacing: { ...DEFAULT_THEME.spacing, ...(JSON.parse(row.spacing) as ThemeSpacing) },
    updatedAt: row.updated_at,
  }
}

export async function getTheme(): Promise<Theme> {
  try {
    const db = getDb()
    const row = await db
      .prepare("SELECT * FROM site_theme WHERE id = 'default' LIMIT 1")
      .first<SiteThemeRow>()
    return row ? hydrate(row) : DEFAULT_THEME
  } catch {
    // Fallback during migration/seed — site must render even if D1 unavailable
    return DEFAULT_THEME
  }
}

export async function saveTheme(theme: Partial<Theme>): Promise<void> {
  const db = getDb()
  const current = await getTheme()
  const merged: Theme = {
    colors: { ...current.colors, ...(theme.colors ?? {}) },
    fonts: { ...current.fonts, ...(theme.fonts ?? {}) },
    spacing: { ...current.spacing, ...(theme.spacing ?? {}) },
    updatedAt: nowIso(),
  }
  await db
    .prepare(
      `INSERT INTO site_theme (id, colors, fonts, spacing, updated_at)
       VALUES ('default', ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         colors = excluded.colors,
         fonts = excluded.fonts,
         spacing = excluded.spacing,
         updated_at = excluded.updated_at`
    )
    .bind(
      JSON.stringify(merged.colors),
      JSON.stringify(merged.fonts),
      JSON.stringify(merged.spacing),
      merged.updatedAt
    )
    .run()
}
