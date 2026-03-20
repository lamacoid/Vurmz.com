'use client'

import { useMemo } from 'react'

const LINES = [
  {
    // Business & Branding
    items: [
      'Pens', 'Business Cards', 'Nameplates', 'Badges', 'Lanyards', 'USB Drives',
      'Padfolios', 'Clipboards', 'Binders', 'Folders', 'Letterheads', 'Stamps',
      'Card Holders', 'Desk Signs', 'Door Plates', 'Office Signs', 'Lobby Signs',
      'Trade Show Giveaways', 'Conference Swag', 'Employee Kits', 'Onboarding Gifts',
      'Client Gifts', 'Thank You Gifts', 'Promo Items', 'Branded Merch',
      'Corporate Gifts', 'Vendor Gifts', 'Sales Awards', 'Team Awards',
      'VIP Passes', 'Membership Cards', 'Loyalty Cards', 'Gift Cards',
      'Menus', 'Table Tents', 'Counter Signs', 'Window Signs',
    ],
    speed: 450,
    direction: 'left' as const,
    opacity: 0.45,
    size: 'text-2xl sm:text-3xl',
  },
  {
    // Restaurants, Bars & Hospitality
    items: [
      'Coasters', 'Menu Boards', 'Table Numbers', 'Wine Labels', 'Tap Handles',
      'Bottle Openers', 'Pint Glasses', 'Shot Glasses', 'Growlers', 'Flasks',
      'Tumblers', 'Coffee Mugs', 'Espresso Cups', 'Beer Flights', 'Serving Trays',
      'Charcuterie Boards', 'Cutting Boards', 'Cheese Boards', 'Trivets',
      'Chef Knives', 'Cleavers', 'Bar Signs', 'Specials Boards', 'Host Stands',
      'Tip Jars', 'Receipt Holders', 'Reservation Signs', 'Staff Nameplates',
      'Aprons', 'Server Books', 'Check Presenters', 'Wooden Spoons',
      'Whiskey Barrel Heads', 'Wine Boxes', 'Corkscrews', 'Decanters',
    ],
    speed: 380,
    direction: 'right' as const,
    opacity: 0.55,
    size: 'text-3xl sm:text-4xl',
  },
  {
    // Contractors, Trades & Industrial
    items: [
      'Tool Tags', 'Equipment Labels', 'Hard Hat Tags', 'Safety Signs',
      'Panel Labels', 'Electrical Labels', 'Valve Tags', 'Pipe Markers',
      'Asset Tags', 'Serial Plates', 'Rating Plates', 'VIN Plates',
      'Lockout Tags', 'Inspection Tags', 'QC Tags', 'Inventory Tags',
      'Bin Labels', 'Shelf Labels', 'Rack Labels', 'Floor Markers',
      'Toolbox Plates', 'Workbench Signs', 'Parking Signs', 'Warning Signs',
      'ADA Signs', 'Wayfinding Signs', 'Exit Signs', 'Room Numbers',
      'Wrenches', 'Hammers', 'Tape Measures', 'Levels', 'Hard Hats',
      'Helmets', 'Flashlights', 'Multi-Tools', 'Pocket Knives',
    ],
    speed: 550,
    direction: 'left' as const,
    opacity: 0.4,
    size: 'text-2xl sm:text-3xl',
  },
  {
    // Gifts, Events & Personal
    items: [
      'Wedding Favors', 'Groomsmen Gifts', 'Bridesmaid Gifts', 'Ring Boxes',
      'Anniversary Gifts', 'Graduation Gifts', 'Retirement Gifts', 'Baby Gifts',
      'Housewarming Gifts', 'Christmas Ornaments', 'Stockings', 'Pet Tags',
      'Dog Bowls', 'Jewelry', 'Rings', 'Bracelets', 'Necklaces', 'Watches',
      'Wallets', 'Money Clips', 'Cuff Links', 'Belt Buckles', 'Lighters',
      'Flasks', 'Cigar Boxes', 'Keychains', 'Luggage Tags', 'Journals',
      'Picture Frames', 'Keepsake Boxes', 'Music Boxes', 'Shadow Boxes',
      'Memorial Plaques', 'Urns', 'Garden Stones', 'Bench Plaques',
      'Trophies', 'Medals', 'Award Plaques', 'Recognition Pins',
      'Cake Toppers', 'Guest Books', 'Place Cards', 'Gift Boxes',
    ],
    speed: 300,
    direction: 'right' as const,
    opacity: 0.5,
    size: 'text-3xl sm:text-4xl',
  },
]

// Shuffle array deterministically per line
function shuffle(arr: string[], seed: number): string[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1) * 9301 + 49297) % copy.length)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function ItemScroller() {
  const lines = useMemo(() =>
    LINES.map((line, i) => ({
      ...line,
      items: shuffle(line.items, i + 1),
    })),
  [])

  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, i) => {
        const content = line.items.join('       ·       ')
        const animName = line.direction === 'left' ? 'scroll-left' : 'scroll-right'

        return (
          <div key={i} className="overflow-hidden whitespace-nowrap">
            <div
              className={`inline-flex gap-0 ${line.size} font-light text-cream`}
              style={{
                opacity: line.opacity,
                animation: `${animName} ${line.speed}s linear infinite`,
              }}
            >
              <span className="inline-block px-8">{content}       ·       </span>
              <span className="inline-block px-8">{content}       ·       </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
