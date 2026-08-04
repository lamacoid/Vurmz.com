'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CATALOG, BUSINESS, DELIVERY, businessTierFor } from '@/lib/pricing'
import { siteInfo } from '@/lib/site-info'

/**
 * One product, two decisions: how many anodized aluminum cards, and what
 * goes on them. Every number is imported from lib/pricing.ts.
 *
 * Cards only, on purpose. Adhesive-backed equipment labels are a separate
 * product at a separate price and are never priced off the cards; they sit
 * in the posted list with their own number. See ServicesClient.
 */

const CARD = CATALOG.cards
const baseCents = CARD.matteBlackBase * 100
const packSize = CARD.pack

const ADD_ONS = [
  { key: 'logo', label: 'Your logo', cents: CARD.addOns.logo * 100 },
  { key: 'qr', label: 'QR code', cents: CARD.addOns.qrCode * 100 },
  { key: 'back', label: 'Back side too', cents: CARD.addOns.backSide * 100 },
] as const

function money(cents: number): string {
  const dollars = cents / 100
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`
}

export default function TradesConfigurator() {
  const [qty, setQty] = useState(60)
  const [addOns, setAddOns] = useState<Set<string>>(new Set(['logo']))

  const job = useMemo(() => {
    const active = ADD_ONS.filter(a => addOns.has(a.key))
    const addOnCents = active.reduce((sum, a) => sum + a.cents, 0)
    const unit = baseCents + addOnCents

    const tier = businessTierFor(qty)
    const discountPerUnit = tier ? unit - Math.round(unit * (1 - tier.discount)) : 0
    const discount = discountPerUnit * qty
    const goods = unit * qty - discount
    const deliveryFree = goods >= DELIVERY.freeThreshold * 100
    const total = goods + (deliveryFree ? 0 : 500)

    const next = BUSINESS.tiers.find(t => t.minUnits > qty)
    const nextStep = next && next.discount > 0
      ? {
          units: next.minUnits - qty,
          note: `${Math.round(next.discount * 100)}% off${next.name.startsWith('Standing') ? ', plus free delivery on every reorder' : ''}`,
        }
      : null
    const progress = next ? Math.min(100, Math.round((qty / next.minUnits) * 100)) : 100

    // Per-unit is the goods rate, not the total divided by count: a $5
    // delivery on a small order would make the card price look wrong.
    return { active, unit, tier, discount, goods, deliveryFree, total, nextStep, progress, perUnit: goods / qty }
  }, [qty, addOns])

  const summaryLine = `${qty} anodized aluminum cards${job.active.length ? `, ${job.active.map(a => a.label.toLowerCase()).join(' and ')}` : ', text only'}. The site priced it at ${money(job.total)} (${money(Math.round(job.perUnit))} a card).`
  const contactHref = `/services/contact?product=${encodeURIComponent(`${CARD.name} (pack)`)}&message=${encodeURIComponent(summaryLine)}`

  return (
    <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        {/* ── The two decisions ── */}
        <div className="px-6 py-8 sm:px-8 sm:py-9">
          <h2 className="text-[26px] leading-tight font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
            Two decisions and you have a price.
          </h2>
          <p className="mt-2 mb-7 max-w-[54ch] text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Anodized aluminum, credit card sized. The laser strips the coating to bright
            metal, so the mark is part of the card. {money(baseCents)} each, sold in packs of {packSize}.
          </p>

          <p className="text-[15px] font-semibold text-[var(--ink)] mb-3">1. How many?</p>
          <div className="flex flex-wrap items-center gap-4 mb-3.5">
            <div className="flex items-center border border-[var(--ink)]/25 rounded-sm overflow-hidden">
              <button
                type="button"
                aria-label="Fewer cards"
                onClick={() => setQty(q => Math.max(packSize, q - packSize))}
                className="w-[46px] h-[50px] flex items-center justify-center text-[20px] text-[var(--ink-soft)] border-r border-[var(--ink)]/15 hover:text-[var(--ink)] transition-colors"
              >
                &minus;
              </button>
              <span aria-live="polite" className="w-[84px] text-center text-[20px] font-semibold text-[var(--ink)]">{qty}</span>
              <button
                type="button"
                aria-label="More cards"
                onClick={() => setQty(q => q + packSize)}
                className="w-[46px] h-[50px] flex items-center justify-center text-[20px] text-[var(--ink-soft)] border-l border-[var(--ink)]/15 hover:text-[var(--ink)] transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-[15px] text-[var(--ink-soft)]">cards, sold in packs of {packSize}</span>
            {job.tier && job.tier.discount > 0 && (
              <span className="sm:ml-auto px-3.5 py-2 rounded-sm bg-[rgba(198,122,111,.14)] border border-[rgba(198,122,111,.45)] text-[14px] font-semibold text-[var(--ink)]">
                {Math.round(job.tier.discount * 100)}% off at this count
              </span>
            )}
          </div>

          {job.progress < 100 && (
            <>
              <div className="flex h-1.5 rounded-full overflow-hidden bg-[var(--ink)]/10 mb-2" aria-hidden>
                <span className="bg-[#C67A6F] rounded-full transition-[width] duration-200" style={{ width: `${job.progress}%` }} />
              </div>
              {job.nextStep && (
                <p className="text-[14px] text-[var(--ink-soft)]">
                  {job.nextStep.units} more and it steps to {job.nextStep.note}.
                </p>
              )}
            </>
          )}

          <p className="text-[15px] font-semibold text-[var(--ink)] mt-8 mb-3">2. What goes on it?</p>
          <p className="text-[14px] text-[var(--ink-soft)] mb-3">
            Text is included. Everything below is {money(CARD.addOns.logo * 100)} a card.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                  className={`p-4 rounded-sm text-left transition-colors ${
                    on
                      ? 'border-[1.5px] border-[var(--ink)] bg-[rgba(127,207,212,.2)]'
                      : 'border border-[var(--ink)]/20 hover:border-[#C67A6F]'
                  }`}
                >
                  <span className={`block text-[16px] font-semibold ${on ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}>
                    {a.label}
                  </span>
                  <span className="block mt-1.5 text-[15px] font-semibold text-[var(--ink)]">
                    +{money(a.cents)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── The job summary ── */}
        <div className="px-6 py-8 sm:px-7 bg-[rgba(127,207,212,.14)] border-t lg:border-t-0 lg:border-l border-[var(--hairline)]">
          <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--ink)] mb-4">Your job</p>

          <div className="text-[14.5px] text-[var(--ink-soft)]">
            <span className="flex justify-between py-[9px] border-b border-[var(--hairline)]">
              <span>{qty} cards, engraved</span>
              <span>{money(baseCents * qty)}</span>
            </span>
            {job.active.map(a => (
              <span key={a.key} className="flex justify-between py-[9px] border-b border-[var(--hairline)]">
                <span>{a.label}, +{money(a.cents)} each</span>
                <span>{money(a.cents * qty)}</span>
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
            {money(Math.round(job.perUnit))} a card
          </p>

          <Link
            href={contactHref}
            className="puffy-btn block w-full text-center py-[15px] rounded-sm bg-vurmz-cta text-white text-[16px] font-semibold hover:bg-vurmz-cta-hover transition-colors"
          >
            Send me the artwork
          </Link>
          {/* The posted rate is real, but it assumes clean artwork. Saying so
              here beats surprising them later. */}
          <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
            That is the posted rate at this count, for artwork I can run as sent. A logo I have
            to rebuild moves the number, and I tell you before anything runs.
          </p>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
            I reply with a proof photo, usually same day. Pay on delivery, or NET-{BUSINESS.netTermsDays} if you are set up on an account.
          </p>
        </div>
      </div>
    </div>
  )
}
