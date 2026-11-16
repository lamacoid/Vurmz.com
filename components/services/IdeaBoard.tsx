'use client'

import { useState } from 'react'
import { getSmsLink } from '@/lib/site-info'
import { CATALOG, SIGNATURE, SOURCING, ONSITE } from '@/lib/pricing'
import { ETCH } from '@/lib/shop-art'
import EtchArt from '@/components/shop/EtchArt'

/**
 * The idea board (2026-11-12). Zach: the business page "needs fun ideas,
 * maybe a brainstorming area." A buyer picks what they run and gets five
 * things worth putting a name on, each with its real price and a text
 * that is already written. It is a list, not a designer: nothing is
 * simulated and nothing is configured. Every category renders in the
 * page (hidden when not picked) so search and AI crawlers read all of it.
 * Prices read from lib/pricing.ts.
 */

const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const price = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

// The ladder for anything handed over: one, four or more, ten or more.
const ladder = `${price(CATALOG.tool.crew.perPiece)} each at ${CATALOG.tool.crew.minQty} or more, ${price(CATALOG.tool.jobsite.perPiece)} at ${CATALOG.tool.jobsite.minQty} or more`
const knives = `${price(CATALOG.knife.crew.perKnife)} a knife at ${CATALOG.knife.crew.minQty} or more, ${price(CATALOG.knife.fullKitchen.perKnife)} at ${CATALOG.knife.fullKitchen.minQty} or more`
const tags = `From ${price(CATALOG.serviceTags.aluminumBase)} a tag`
const cards = `${price(CATALOG.cards.matteBlackBase * CATALOG.cards.pack)} per ${CATALOG.cards.pack}`
const pens = `${price(CATALOG.pens.perItem[0])} to ${price(CATALOG.pens.perItem[1])} a pen`
const coasters = `${CATALOG.coasters.pack} for ${price(CATALOG.coasters.packPrice[0])} in pine, ${price(CATALOG.coasters.packPrice[1])} in slate`
const keychains = `${CATALOG.keychains.pack} for ${price(CATALOG.keychains.packPrice[0])}`
const sourced = `The piece at cost, plus ${price(SOURCING.reserveFee)}`
const ask = 'Text a count, get a price today'

type Art = keyof typeof ETCH
interface Idea { art: Art; h: string; p: string; cost: string }
interface Kind { key: string; label: string; run: string; ideas: Idea[] }

const KINDS: Kind[] = [
  {
    key: 'kitchen', label: 'Restaurant or bar', run: 'a restaurant',
    ideas: [
      { art: 'knife', h: 'Every cook’s name on their own knife', p: 'Nobody grabs the wrong one, and nobody walks out with yours.', cost: knives },
      { art: 'coaster', h: 'Coasters with a question on the back', p: 'Your logo up front, something to argue about underneath. Three Willows Ranch runs these.', cost: coasters },
      { art: 'opener', h: 'An opener with a regular’s name on it', p: 'Hang it behind the bar. They come back to use it.', cost: ask },
      { art: 'tag', h: 'Tags on every bin, switch, and shelf', p: 'The new hire stops asking where things go.', cost: tags },
      { art: 'tumbler', h: 'A cup for each of the crew', p: 'A name on the side ends the daily round of whose is this.', cost: `Bring the cups: ${ladder}` },
    ],
  },
  {
    key: 'trades', label: 'Trades crew', run: 'a trades crew',
    ideas: [
      { art: 'tag', h: 'Your number on every unit you service', p: 'The sticker fades. The plate is still there when it breaks again.', cost: tags },
      { art: 'knife', h: 'Tools that find their way home', p: 'Your name on the drill, the meter, and the ladder.', cost: ladder },
      { art: 'wallet', h: 'A metal card nobody throws out', p: 'It ends up on the fridge and stays there.', cost: cards },
      { art: 'tag', h: 'A signature plate on the install', p: 'A small plate with your name and number, left on the job.', cost: `${price(CATALOG.signatureTiles.perTile)} a tile` },
      { art: 'tumbler', h: 'A crew gift that is not a ham', p: 'A cup or a knife with each name on it.', cost: ladder },
    ],
  },
  {
    key: 'office', label: 'Office or team', run: 'an office',
    ideas: [
      { art: 'pen', h: 'Pens that stop wandering off', p: 'Put a name on a pen and people give it back. It is strange and it works.', cost: pens },
      { art: 'tumbler', h: 'A first day kit', p: 'A cup, a pen, and a card with the new hire’s name already on them.', cost: ask },
      { art: 'tag', h: 'Asset tags that stay on', p: 'Laptops, monitors, and the one good chair.', cost: tags },
      { art: 'board', h: 'An award that is not a trophy', p: 'A knife, a board, or a plate with the name and the year. It gets used.', cost: sourced },
      { art: 'coaster', h: 'Coasters for the conference table', p: 'Your logo in slate. It saves the table, too.', cost: coasters },
    ],
  },
  {
    key: 'shop', label: 'Shop or maker', run: 'a shop',
    ideas: [
      { art: 'lighter', h: 'A live engraving day in the store', p: 'I bring the laser. Customers get a name on what they buy while they wait.', cost: `${price(ONSITE.perPieceRetail)} a piece, ${ONSITE.perPieceMinimum} piece minimum` },
      { art: 'pouch', h: 'Engrave what you already sell', p: 'Send the stock, I mark it, you sell it for more.', cost: ladder },
      { art: 'keychain', h: 'A keychain with every big purchase', p: 'It costs you a few dollars and rides on their keys for years.', cost: keychains },
      { art: 'tag', h: 'A maker’s mark for your product', p: 'A small metal plate with your name, stuck or riveted on.', cost: tags },
      { art: 'wallet', h: 'Gift cards in metal', p: 'Heavier than plastic and harder to lose in a drawer.', cost: cards },
    ],
  },
  {
    key: 'venue', label: 'Venue or event', run: 'a venue',
    ideas: [
      { art: 'coaster', h: 'Coasters the guests take home', p: 'The names and the date. They end up on a lot of coffee tables.', cost: coasters },
      { art: 'lighter', h: 'A live station at the party', p: 'Guests give a name and watch it go into the metal.', cost: `From $${ONSITE.halfDay.toLocaleString('en-US')} for a half day` },
      { art: 'knife', h: 'Gifts for the wedding party', p: 'Knives, flasks, or cups, each with a name, in one delivery.', cost: ladder },
      { art: 'tag', h: 'Bag tags for the tournament', p: 'Every player’s name on a tag. The one prize everybody keeps.', cost: ask },
      { art: 'board', h: 'A board for the couple', p: 'The names and the date, burned into the wood.', cost: sourced },
    ],
  },
  {
    key: 'club', label: 'Gym or club', run: 'a gym',
    ideas: [
      { art: 'knife', h: 'Something real for the champions', p: 'The Colorado Wolverines gave theirs engraved KA-BARs. Nobody left those in a drawer.', cost: sourced },
      { art: 'tumbler', h: 'A bottle for every athlete', p: 'Names on the side. It ends the bottle pile by the mat.', cost: `Bring the bottles: ${ladder}` },
      { art: 'tag', h: 'Bag tags with names', p: 'Forty identical black bags, sorted.', cost: ask },
      { art: 'coaster', h: 'A coin for showing up', p: 'A hundred classes, a first competition, a new belt. Your mark in the metal.', cost: ask },
      { art: 'keychain', h: 'Member key tags', p: 'Your logo on their keys, every day.', cost: keychains },
    ],
  },
  {
    key: 'realty', label: 'Real estate', run: 'a real estate office',
    ideas: [
      { art: 'board', h: 'A board with the new address', p: 'The closing gift that stays on the counter instead of in a closet.', cost: sourced },
      { art: 'keychain', h: 'A keychain for the new keys', p: 'The address or the coordinates, and the closing date.', cost: keychains },
      { art: 'opener', h: 'An opener for the first drink in the house', p: 'Small, cheap, and they keep it.', cost: ask },
      { art: 'wallet', h: 'Metal cards', p: 'The one card in the stack they do not recycle.', cost: cards },
      { art: 'coaster', h: 'Slate coasters with the street', p: 'The house number and the street name, in stone.', cost: coasters },
    ],
  },
]

export default function IdeaBoard() {
  const [active, setActive] = useState(0)
  const [spot, setSpot] = useState<number | null>(null)

  // Lands on a different business and lights up one idea in it.
  const surprise = () => {
    let k = Math.floor(Math.random() * KINDS.length)
    if (k === active) k = (k + 1) % KINDS.length
    setActive(k)
    setSpot(Math.floor(Math.random() * KINDS[k].ideas.length))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 mb-6">
        <div className="max-w-[46ch]">
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-3">The idea board</p>
          <h2 className="text-[length:var(--step-section)] leading-[1.05] text-[var(--ink)]" style={display}>Not sure what to put it on? Start here.</h2>
          <p className="mt-3 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
            Pick what you run. These are things I have made, or would like an excuse to.
          </p>
        </div>
        <button
          type="button"
          onClick={surprise}
          className="inline-flex items-center justify-center h-11 px-5 rounded-[var(--r-control)] border border-[var(--hairline)] hover:border-[var(--glass-edge)] text-[var(--ink)] text-[14.5px] font-semibold transition-colors"
        >
          Surprise me
        </button>
      </div>

      <div role="tablist" aria-label="What you run" className="flex flex-wrap gap-2 mb-6">
        {KINDS.map((k, i) => (
          <button
            key={k.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`ideas-${k.key}`}
            onClick={() => { setActive(i); setSpot(null) }}
            className={`h-10 px-4 rounded-full border text-[14px] font-semibold transition-colors ${i === active ? 'bg-[var(--ink)] border-[var(--ink)] text-[var(--page)]' : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:border-[var(--glass-edge)] hover:text-[var(--ink)]'}`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {KINDS.map((k, i) => (
        <div key={k.key} id={`ideas-${k.key}`} role="tabpanel" aria-label={k.label} hidden={i !== active}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 list-none p-0 m-0">
            {k.ideas.map((idea, n) => (
              <li key={idea.h}>
                <a
                  href={getSmsLink(`Hi Zach, I run ${k.run} and saw this on your site: "${idea.h}". How many: `)}
                  className={`group h-full flex gap-4 rounded-[var(--r-panel)] border bg-[var(--surface)] p-4 sm:p-5 transition-colors ${i === active && spot === n ? 'border-[var(--coral)]' : 'border-[var(--hairline)] hover:border-[var(--glass-edge)]'}`}
                >
                  <EtchArt src={ETCH[idea.art]} className="flex-shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px]" sizes="72px" />
                  <span className="flex-1 flex flex-col">
                    <span className="text-[length:var(--step-panel)] leading-[1.15] text-[var(--ink)]" style={display}>{idea.h}</span>
                    <span className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">{idea.p}</span>
                    <span className="mt-auto pt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="text-[13px] font-semibold text-[var(--eyebrow)]">{idea.cost}</span>
                      <span className="text-[12.5px] font-semibold text-[var(--ink)] opacity-0 group-hover:opacity-100 transition-opacity">Text me this one</span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={getSmsLink(`Hi Zach, I run ${k.run} and I have a strange idea: `)}
                className="group h-full flex flex-col justify-center rounded-[var(--r-panel)] border border-dashed border-[var(--glass-edge)] p-5 sm:p-6 hover:bg-[var(--surface)] transition-colors"
              >
                <span className="text-[length:var(--step-panel)] leading-[1.15] text-[var(--ink)]" style={display}>Got a stranger idea? Good.</span>
                <span className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">
                  The odd ones are the ones I like. One piece is {price(SIGNATURE.startingAt)}.
                </span>
                <span className="mt-3 text-[13.5px] font-semibold text-[var(--eyebrow)] group-hover:underline">Text it to me</span>
              </a>
            </li>
          </ul>
        </div>
      ))}
    </div>
  )
}
