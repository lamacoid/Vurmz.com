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
      'Founder\'s Coins', 'Office Plaques', 'Year-End Gifts', 'Intern Awards',
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
      'Your Grandma\'s Recipe', 'Your Signature Drink', 'Your Opening Date',
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
      'Your Crew\'s Names', 'Truck Plates', 'Job Site Signs',
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
  {
    // Makers, Hobbies & Sports
    items: [
      'Guitar Picks', 'Guitar Straps', 'Drum Sticks', 'Amp Faceplates',
      'Skateboards', 'Surfboards', 'Snowboards', 'Skis', 'Longboards',
      'Golf Ball Markers', 'Golf Tees', 'Divot Tools', 'Yardage Books',
      'Fishing Lures', 'Tackle Boxes', 'Rod Handles', 'Reel Plates',
      'Hunting Knives', 'Rifle Stocks', 'Bow Risers', 'Ammo Boxes',
      'Climbing Carabiners', 'Trekking Poles', 'Bike Frames', 'Bike Bells',
      'Helmets', 'Jerseys', 'Helmet Plates', 'Pedal Plates',
      'Paddle Boards', 'Kayak Paddles', 'Ski Poles', 'Sled Plates',
      'Race Bibs', 'Finisher Plaques', 'Coaches\' Whistles',
    ],
    speed: 420,
    direction: 'left' as const,
    opacity: 0.38,
    size: 'text-2xl sm:text-3xl',
  },
  {
    // Kids, pets, family
    items: [
      'Your Kid\'s Drawing', 'Baby\'s Handprint', 'First Day of School',
      'Dog Tags', 'Cat Collars', 'Pet Memorials', 'Paw Prints',
      'Chore Charts', 'Lunchboxes', 'Water Bottles', 'Backpack Tags',
      'Piggy Banks', 'Toy Chests', 'Nursery Signs', 'Growth Charts',
      'Family Recipe Boards', 'Family Crests', 'Ancestry Maps',
      'Grandparent Gifts', 'Sibling Gifts', 'Godparent Gifts',
      'First Communion', 'Confirmation Gifts', 'Bat Mitzvah Gifts',
      'Birthday Countdowns', 'Kindergarten Diplomas', 'Homemade Coupons',
      'Reading Nook Signs', 'Bunk Bed Plaques', 'Room Signs',
    ],
    speed: 360,
    direction: 'right' as const,
    opacity: 0.48,
    size: 'text-3xl sm:text-4xl',
  },
  {
    // Love, memories, milestones — the personal stuff
    items: [
      'Your Vows', 'Your First Dance Lyrics', 'The Coordinates Where You Met',
      'Your First Love Letter', 'An Inside Joke', 'A Song That Means Something',
      'The Date You Moved In', 'Your Wedding Date', 'Your Proposal Spot',
      'The Last Voicemail You Got from Them', 'Your Grandpa\'s Signature',
      'Your Mom\'s Handwriting', 'A Family Saying', 'A Quote You Live By',
      'A Dog Who\'s No Longer Here', 'The Address of Your Childhood Home',
      'Your Kid\'s Signature', 'A Song Lyric', 'A Poem',
      'A Tattoo Design', 'A Scribble That Made You Laugh',
      'The Ticket from That Night', 'A Ring You\'ll Always Wear',
      'Whatever You Can\'t Let Go Of',
    ],
    speed: 280,
    direction: 'left' as const,
    opacity: 0.55,
    size: 'text-2xl sm:text-3xl',
  },
  {
    // Musicians, artists, creators
    items: [
      'Album Covers on Vinyl Sleeves', 'Band Logos on Amp Grilles',
      'Lyric Sheets', 'Setlists', 'Pedalboard Name Plates',
      'Studio Signs', 'Album Release Plaques', 'First Show Posters',
      'Paint Palette Knives', 'Sketchbook Covers', 'Pen Holders',
      'Camera Straps', 'Lens Caps', 'Darkroom Signs', 'Gallery Labels',
      'Studio Stools', 'Pottery Wheels', 'Kiln Tags', 'Loom Plates',
      'Sewing Machine Cases', 'Knitting Needles', 'Crochet Hooks',
      'Writing Desks', 'Typewriter Plates', 'Fountain Pens',
    ],
    speed: 470,
    direction: 'right' as const,
    opacity: 0.35,
    size: 'text-2xl sm:text-3xl',
  },
  {
    // Pure whimsy — the things that make people smile
    items: [
      'The Cat You\'re Not Supposed to Have Named',
      'Your Neighbor\'s Middle Name',
      'The License Plate You Wish You Had',
      'The Cocktail You Invented',
      'Your Fantasy Football Team Logo',
      'The Road Trip Nobody Forgot',
      'Your First Business Card (Age 8)',
      'Your Signature Dance Move',
      'The Dad Joke You Tell Too Often',
      'Your Call Sign',
      'Your Gamer Tag on a Steel Plate',
      'The Bar Where You Met',
      'The Street You Grew Up On',
      'The Tree You Planted',
      'The Bike You Rebuilt',
      'The Truck You Named',
      'The Boat You Own',
      'Your Airstream\'s Kitchen Plaque',
    ],
    speed: 520,
    direction: 'left' as const,
    opacity: 0.4,
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

/** opacityScale multiplies every line's opacity — pass < 1 to make the
 *  marquee more transparent (e.g. 0.45 on the landing page). */
export default function ItemScroller({ opacityScale = 1 }: { opacityScale?: number }) {
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
                opacity: line.opacity * opacityScale,
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
