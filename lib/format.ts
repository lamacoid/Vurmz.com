/**
 * Display formatters. Cents are the canonical money representation throughout
 * the app — use money() everywhere a price shows up.
 */

export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function moneyNoCents(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString('en-US')}`
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2)
}

export function dollarsToCents(input: string): number {
  const n = parseFloat(input.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
