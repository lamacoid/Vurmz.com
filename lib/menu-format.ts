// Menu typography helpers, shared by the shop menu (MenuShop) and the
// product detail page so the two surfaces read as one document.

// Menus say $38, not $38.00. Cents only appear when they're real.
export function menuPrice(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`
}

// Menu-case the subtext: all lowercase, sentence breaks become commas,
// no trailing period. "Jet-black slate. Cork feet." reads as
// "jet-black slate, cork feet" under the item name, like a menu.
export function menuCase(s: string): string {
  return s
    .replace(/\.(?=[”"'’])/g, '')
    .replace(/\.\s+/g, ', ')
    .replace(/[.]+\s*$/g, '')
    .toLowerCase()
    .trim()
}
