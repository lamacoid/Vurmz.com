/**
 * Theme resolver — converts a Theme row from D1 into a CSS custom-properties
 * string that gets injected into <head>. Used by the admin shell and any
 * new block-rendered page. Existing hardcoded pages keep their legacy vars
 * in globals.css; those remain untouched during Chunk 0 migration.
 */
import type { Theme } from '@/lib/db/repos/theme'
import { DEFAULT_THEME, getTheme } from '@/lib/db/repos/theme'

export function themeToCss(theme: Theme): string {
  const c = theme.colors
  const f = theme.fonts
  const s = theme.spacing
  const lines: string[] = [':root {']
  for (const [k, v] of Object.entries(c)) {
    lines.push(`  --t-${k.replace(/_/g, '-')}: ${v};`)
  }
  lines.push(`  --t-font-heading: ${f.heading};`)
  lines.push(`  --t-font-body: ${f.body};`)
  lines.push(`  --t-font-mono: ${f.mono};`)
  lines.push(`  --t-container-max: ${s.container_max};`)
  lines.push(`  --t-radius-sm: ${s.radius_sm};`)
  lines.push(`  --t-radius-md: ${s.radius_md};`)
  lines.push(`  --t-radius-lg: ${s.radius_lg};`)
  lines.push('}')
  return lines.join('\n')
}

export async function resolveThemeCss(): Promise<string> {
  try {
    const theme = await getTheme()
    return themeToCss(theme)
  } catch {
    return themeToCss(DEFAULT_THEME)
  }
}
