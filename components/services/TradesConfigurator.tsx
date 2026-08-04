'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CATALOG, BUSINESS, DELIVERY, businessTierFor } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'

/**
 * The decision strip: what am I marking, which material, how many.
 * Three answers resolve into a live job summary. Every number is imported
 * from lib/pricing.ts; nothing here invents a price. Quote-only picks
 * (ABS, custom tiles, "something else") swap the summary for a text-me
 * state instead of pretending to know.
 */

type Ladder = { minQty: number; unitCents: number }[]

type MaterialOption = {
  key: string
  name: string
  desc: string
  unitCents: number | null // null = quote only
  ladder?: Ladder // qty-stepped unit price (tools, knives); overrides tiers
  adj?: string // reads in the summary line: "60 aluminum labels"
  noun?: string // overrides the category noun when the material IS the thing
  singular?: string
}

type Category = {
  key: string
  label: string
  noun: string // plural
  singular: string
  pack: number // qty stepper step size and minimum
  defaultQty: number
  materials: MaterialOption[]
  addOns: boolean // logo / QR / back side at +$1 each
  tiers: boolean // BUSINESS volume tiers apply
  contactProduct: string // must match a CONTACT_PRODUCT_OPTIONS entry
}

const TAG_MATERIALS: MaterialOption[] = [
  {
    key: 'aluminum',
    name: 'Anodized aluminum',
    desc: 'Bright white mark, 3M backing included',
    unitCents: CATALOG.serviceTags.aluminumBase * 100,
    adj: 'aluminum',
  },
  {
    key: 'stainless',
    name: 'Stainless steel',
    desc: 'Outlives the equipment it is on',
    unitCents: CATALOG.serviceTags.stainlessBase * 100,
    adj: 'stainless',
  },
  {
    key: 'abs',
    name: 'ABS plastic',
    desc: 'Two-color legend plates',
    unitCents: null,
  },
]

const tagCategory = (key: string, label: string, noun: string, singular: string): Category => ({
  key,
  label,
  noun,
  singular,
  pack: CATALOG.serviceTags.pack,
  defaultQty: 60,
  materials: TAG_MATERIALS,
  addOns: true,
  tiers: true,
  contactProduct: `${CATALOG.serviceTags.name} (pack)`,
})

const CATEGORIES: Category[] = [
  tagCategory('panel-labels', 'Equipment & panel labels', 'labels', 'label'),
  tagCategory('asset-tags', 'Asset & ID tags', 'tags', 'tag'),
  tagCategory('valve-tags', 'Valve tags', 'tags', 'tag'),
  tagCategory('safety-labels', 'Safety labels', 'labels', 'label'),
  {
    key: 'tools-gear',
    label: 'Tools & gear',
    noun: 'pieces',
    singular: 'piece',
    pack: 1,
    defaultQty: 8,
    materials: [
      {
        key: 'tools',
        name: 'Hand tools & gear',
        desc: 'Name or ID, marked where it lasts',
        noun: 'tools',
        singular: 'tool',
        unitCents: CATALOG.tool.base * 100,
        ladder: [
          { minQty: 1, unitCents: CATALOG.tool.base * 100 },
          { minQty: CATALOG.tool.crew.minQty, unitCents: CATALOG.tool.crew.perPiece * 100 },
          { minQty: CATALOG.tool.jobsite.minQty, unitCents: CATALOG.tool.jobsite.perPiece * 100 },
        ],
      },
      {
        key: 'knives',
        name: 'Knives, crews',
        desc: 'Bring the blades, I mark them',
        noun: 'knives',
        singular: 'knife',
        unitCents: CATALOG.knife.base * 100,
        ladder: [
          { minQty: 1, unitCents: CATALOG.knife.base * 100 },
          { minQty: CATALOG.knife.crew.minQty, unitCents: CATALOG.knife.crew.perKnife * 100 },
          { minQty: CATALOG.knife.fullKitchen.minQty, unitCents: CATALOG.knife.fullKitchen.perKnife * 100 },
        ],
      },
      {
        key: 'other',
        name: 'Something else',
        desc: 'Odd shapes and one-offs welcome',
        unitCents: null,
      },
    ],
    addOns: false,
    tiers: false,
    contactProduct: CATALOG.tool.name,
  },
  {
    key: 'installer-tiles',
    label: 'Installer tiles',
    noun: 'tiles',
    singular: 'tile',
    pack: 1,
    defaultQty: 10,
    materials: [
      {
        key: 'tile',
        name: 'Signature tile',
        desc: 'Your logo, set into your work',
        unitCents: CATALOG.signatureTiles.perTile * 100,
      },
      {
        key: 'custom',
        name: 'Custom design',
        desc: 'Something beyond the logo',
        unitCents: null,
      },
    ],
    addOns: false,
    tiers: false,
    contactProduct: CATALOG.signatureTiles.name,
  },
]

const ADD_ONS = [
  { key: 'logo', label: 'Logo' },
  { key: 'qr', label: 'QR code' },
  { key: 'back', label: 'Back side' },
] as const

const addOnCents = CATALOG.serviceTags.addOn * 100

function money(cents: number): string {
  const dollars = cents / 100
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`
}

function ladderRate(ladder: Ladder, qty: number): number {
  let rate = ladder[0].unitCents
  for (const step of ladder) if (qty >= step.minQty) rate = step.unitCents
  return rate
}

/** Roving-focus radio row. Arrow keys move selection, per the radio pattern. */
function useRadioKeys(count: number, selected: number, onSelect: (i: number) => void) {
  return (e: React.KeyboardEvent) => {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (selected + 1) % count
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (selected - 1 + count) % count
    if (next >= 0) {
      e.preventDefault()
      onSelect(next)
    }
  }
}

export default function TradesConfigurator() {
  const [categoryKey, setCategoryKey] = useState(CATEGORIES[0].key)
  const [materialKey, setMaterialKey] = useState(CATEGORIES[0].materials[0].key)
  const [qty, setQty] = useState(CATEGORIES[0].defaultQty)
  const [addOns, setAddOns] = useState<Set<string>>(new Set(['logo']))

  const category = CATEGORIES.find(c => c.key === categoryKey) ?? CATEGORIES[0]
  const material = category.materials.find(m => m.key === materialKey) ?? category.materials[0]

  // What to call the thing. A material may rename it (tools, knives), and
  // one of anything is singular.
  const noun = material.noun ?? category.noun
  const singular = material.singular ?? category.singular
  const unitWord = (n: number) => (n === 1 ? singular : noun)

  function pickCategory(c: Category) {
    setCategoryKey(c.key)
    setMaterialKey(c.materials[0].key)
    setQty(c.defaultQty)
  }

  function bumpQty(delta: number) {
    setQty(q => Math.max(category.pack, q + delta * category.pack))
  }

  const job = useMemo(() => {
    if (material.unitCents == null) return null

    const activeAddOns = category.addOns ? ADD_ONS.filter(a => addOns.has(a.key)) : []
    const unitBase = material.ladder ? ladderRate(material.ladder, qty) : material.unitCents
    const unitWithAddOns = unitBase + activeAddOns.length * addOnCents

    const tier = category.tiers ? businessTierFor(qty) : null
    const discountPerUnit = tier ? unitWithAddOns - Math.round(unitWithAddOns * (1 - tier.discount)) : 0
    const subtotal = unitWithAddOns * qty
    const discount = discountPerUnit * qty
    const goods = subtotal - discount
    const deliveryFree = goods >= DELIVERY.freeThreshold * 100
    const total = goods + (deliveryFree ? 0 : 500)

    // Next step up, whichever ladder this category prices on.
    let nextStep: { units: number; note: string } | null = null
    if (category.tiers) {
      const next = BUSINESS.tiers.find(t => t.minUnits > qty)
      if (next && next.discount > 0) {
        nextStep = {
          units: next.minUnits - qty,
          note: `${Math.round(next.discount * 100)}% off${next.name.startsWith('Standing') ? ', plus free delivery on every reorder' : ''}`,
        }
      }
    } else if (material.ladder) {
      const next = material.ladder.find(s => s.minQty > qty)
      if (next) nextStep = { units: next.minQty - qty, note: `${money(next.unitCents)} each` }
    }
    const nextTierMin = category.tiers ? BUSINESS.tiers.find(t => t.minUnits > qty)?.minUnits : material.ladder?.find(s => s.minQty > qty)?.minQty
    const progress = nextTierMin ? Math.min(100, Math.round((qty / nextTierMin) * 100)) : 100

    const rateBadge = tier && tier.discount > 0
      ? `${Math.round(tier.discount * 100)}% off at this count`
      : material.ladder && unitBase < material.ladder[0].unitCents
        ? `${money(unitBase)} each at this count`
        : null

    // Per-unit is the goods rate, not the total divided by count: a $5
    // delivery on a single piece would make the unit price look wrong.
    return { activeAddOns, unitBase, unitWithAddOns, tier, subtotal, discount, goods, deliveryFree, total, nextStep, progress, rateBadge, perUnit: goods / qty }
  }, [category, material, qty, addOns])

  const catIndex = CATEGORIES.findIndex(c => c.key === category.key)
  const matIndex = category.materials.findIndex(m => m.key === material.key)
  const onCatKeys = useRadioKeys(CATEGORIES.length, catIndex, i => pickCategory(CATEGORIES[i]))
  const onMatKeys = useRadioKeys(category.materials.length, matIndex, i => setMaterialKey(category.materials[i].key))

  const summaryLine = job
    ? `${qty} ${material.adj ? material.adj + ' ' : ''}${unitWord(qty)}${job.activeAddOns.length ? `, ${job.activeAddOns.map(a => a.label.toLowerCase()).join(' and ')} on each` : ''}. The site priced it at ${money(job.total)} (${money(Math.round(job.perUnit))} per ${singular}).`
    : ''
  const contactHref = `/services/contact?product=${encodeURIComponent(category.contactProduct)}&message=${encodeURIComponent(summaryLine)}`
  const smsHref = getSmsLink(`Hi Zach, I need ${category.label.toLowerCase()} priced: `)

  return (
    <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        {/* ── The three decisions ── */}
        <div className="px-6 py-8 sm:px-8 sm:py-9">
          <h2 className="text-[26px] leading-tight font-semibold text-[var(--ink)] mb-6" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
            Three decisions and you have a price.
          </h2>

          <p className="text-[15px] font-semibold text-[var(--ink)] mb-3">1. What am I marking?</p>
          <div role="radiogroup" aria-label="What am I marking" className="flex flex-wrap gap-2.5 mb-8" onKeyDown={onCatKeys}>
            {CATEGORIES.map(c => {
              const selected = c.key === category.key
              return (
                <button
                  key={c.key}
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => pickCategory(c)}
                  className={`px-4 py-[11px] rounded-sm text-[15px] transition-colors ${
                    selected
                      ? 'border-[1.5px] border-[var(--ink)] bg-[rgba(127,207,212,.2)] font-semibold text-[var(--ink)]'
                      : 'border border-[var(--ink)]/20 font-medium text-[var(--ink-soft)] hover:border-[#C67A6F] hover:text-[var(--ink)]'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>

          <p className="text-[15px] font-semibold text-[var(--ink)] mb-3">2. Which material?</p>
          <div role="radiogroup" aria-label="Which material" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-8" onKeyDown={onMatKeys}>
            {category.materials.map(m => {
              const selected = m.key === material.key
              return (
                <button
                  key={m.key}
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setMaterialKey(m.key)}
                  className={`p-4 rounded-sm text-left transition-colors ${
                    selected
                      ? 'border-[1.5px] border-[var(--ink)] bg-[rgba(127,207,212,.2)]'
                      : 'border border-[var(--ink)]/20 hover:border-[#C67A6F]'
                  }`}
                >
                  <span className={`block text-[16px] font-semibold ${selected ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}>{m.name}</span>
                  <span className="block mt-1 text-[14px] leading-snug text-[var(--ink-soft)]">{m.desc}</span>
                  <span className="block mt-2 text-[16px] font-semibold text-[var(--ink)]">
                    {m.unitCents == null ? 'Text me' : `${money(m.ladder ? ladderRate(m.ladder, qty) : m.unitCents)} each`}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="text-[15px] font-semibold text-[var(--ink)] mb-3">3. How many?</p>
          <div className="flex flex-wrap items-center gap-4 mb-3.5">
            <div className="flex items-center border border-[var(--ink)]/25 rounded-sm overflow-hidden">
              <button
                type="button"
                aria-label={`Fewer ${noun}`}
                onClick={() => bumpQty(-1)}
                className="w-[46px] h-[50px] flex items-center justify-center text-[20px] text-[var(--ink-soft)] border-r border-[var(--ink)]/15 hover:text-[var(--ink)] transition-colors"
              >
                &minus;
              </button>
              <span aria-live="polite" className="w-[84px] text-center text-[20px] font-semibold text-[var(--ink)]">{qty}</span>
              <button
                type="button"
                aria-label={`More ${noun}`}
                onClick={() => bumpQty(1)}
                className="w-[46px] h-[50px] flex items-center justify-center text-[20px] text-[var(--ink-soft)] border-l border-[var(--ink)]/15 hover:text-[var(--ink)] transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-[15px] text-[var(--ink-soft)]">
              {category.pack > 1 ? `${noun}, sold in packs of ${category.pack}` : noun}
            </span>
            {job?.rateBadge && (
              <span className="sm:ml-auto px-3.5 py-2 rounded-sm bg-[rgba(198,122,111,.14)] border border-[rgba(198,122,111,.45)] text-[14px] font-semibold text-[var(--ink)]">
                {job.rateBadge}
              </span>
            )}
          </div>

          {job && job.progress < 100 && (
            <>
              <div className="flex h-1.5 rounded-full overflow-hidden bg-[var(--ink)]/10 mb-2" aria-hidden>
                <span className="bg-[#C67A6F] rounded-full transition-[width] duration-200" style={{ width: `${job.progress}%` }} />
              </div>
              {job.nextStep && (
                <p className="text-[14px] text-[var(--ink-soft)]">
                  {job.nextStep.units} more {unitWord(job.nextStep.units)} and it steps to {job.nextStep.note}.
                </p>
              )}
            </>
          )}

          {category.addOns && (
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-[14px] text-[var(--ink-soft)]">On each {singular}:</span>
              {ADD_ONS.map(a => {
                const on = addOns.has(a.key)
                return (
                  <button
                    key={a.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setAddOns(prev => {
                        const next = new Set(prev)
                        if (next.has(a.key)) next.delete(a.key)
                        else next.add(a.key)
                        return next
                      })
                    }
                    className={`px-3 py-1.5 rounded-sm text-[13.5px] transition-colors ${
                      on
                        ? 'border-[1.5px] border-[var(--ink)] bg-[rgba(127,207,212,.2)] font-semibold text-[var(--ink)]'
                        : 'border border-[var(--ink)]/20 font-medium text-[var(--ink-soft)] hover:border-[#C67A6F]'
                    }`}
                  >
                    + {a.label} {money(addOnCents)}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ── The job summary ── */}
        <div className="px-6 py-8 sm:px-7 bg-[rgba(127,207,212,.14)] border-t lg:border-t-0 lg:border-l border-[var(--hairline)]">
          <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--ink)] mb-4">Your job</p>

          {job ? (
            <>
              <div className="text-[14.5px] text-[var(--ink-soft)]">
                <span className="flex justify-between py-[9px] border-b border-[var(--hairline)]">
                  <span>{qty} {material.adj ? `${material.adj} ` : ''}{unitWord(qty)}</span>
                  <span>{money(job.unitBase * qty)}</span>
                </span>
                {job.activeAddOns.map(a => (
                  <span key={a.key} className="flex justify-between py-[9px] border-b border-[var(--hairline)]">
                    <span>{a.label} on each, +{money(addOnCents)}</span>
                    <span>{money(addOnCents * qty)}</span>
                  </span>
                ))}
                {job.discount > 0 && job.tier && (
                  <span className="flex justify-between py-[9px] border-b border-[var(--hairline)]">
                    <span>Volume, {Math.round(job.tier.discount * 100)}% off</span>
                    <span className="text-[#C67A6F] font-semibold">&minus;{money(job.discount)}</span>
                  </span>
                )}
                <span className="flex justify-between py-[9px] border-b border-[var(--hairline)]">
                  <span>Hand-delivery {siteInfo.deliveryRunDay}</span>
                  <span>{job.deliveryFree ? 'Free' : money(500)}</span>
                </span>
                <span className="flex justify-between py-[9px]">
                  <span>Setup, art, proof</span>
                  <span>$0</span>
                </span>
              </div>

              <div className="mt-4 pt-4 border-t-[1.5px] border-[var(--ink)]/25 flex items-baseline justify-between">
                <span className="text-[16px] font-semibold text-[var(--ink)]">Total</span>
                <span className="text-[34px] font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                  {money(job.total)}
                </span>
              </div>
              <p className="mt-0.5 mb-5 text-right text-[14px] text-[var(--ink-soft)]">
                {money(Math.round(job.perUnit))} per {singular}
              </p>

              <Link
                href={contactHref}
                className="puffy-btn block w-full text-center py-[15px] rounded-sm bg-vurmz-cta text-white text-[16px] font-semibold hover:bg-vurmz-cta-hover transition-colors"
              >
                Send me the artwork
              </Link>
              {/* The posted rate is real, but it assumes clean artwork and a
                  standard size. Saying so here beats surprising them later. */}
              <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
                That is the posted rate at this count, for a standard size and artwork I can run as sent.
                Odd sizes, or a logo I have to rebuild, move the number, and I tell you before anything runs.
              </p>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
                I reply with a proof photo, usually same day. Pay on delivery, or NET-{BUSINESS.netTermsDays} if you are set up on an account.
              </p>
            </>
          ) : (
            <>
              <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                No posted price for {material.name.toLowerCase()} yet. Text me a photo and a count and I will price it, usually within a few hours.
              </p>
              <a
                href={smsHref}
                className="puffy-btn mt-5 block w-full text-center py-[15px] rounded-sm bg-vurmz-cta text-white text-[16px] font-semibold hover:bg-vurmz-cta-hover transition-colors"
              >
                Text me a photo
              </a>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
                Nothing runs until you approve a proof, same as everything else here.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
