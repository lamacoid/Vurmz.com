'use client'
/**
 * A category from the reserve: the chef's knife, the skillet, the cooler.
 * The page is plain: the photograph, my words about what makes a good one,
 * the pieces I usually buy, and a short order form. The order lands on the
 * books through /api/reserve as a quote. No preview theater; the piece is
 * the real thing and the confirmation says exactly what will be on it.
 */
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryCard } from '@/components/shop/ReserveList'
import { fontOptions } from '@/lib/fonts'
import { SOURCING } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { deliveredPrice, itemPhoto, type SourcedItem, type ReserveCategory } from '@/lib/sourcing'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const fieldCls = 'w-full h-11 px-3.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--feature)]/70 transition-colors'
const panel = 'rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)]'

export default function ReservePiece({ cat, makers, also }: { cat: ReserveCategory; makers: SourcedItem[]; also: ReserveCategory[] }) {
  const [pick, setPick] = useState(0)
  const item = makers[pick] ?? makers[0]
  const [text, setText] = useState('')
  const [font, setFont] = useState('zen-kurenaido')
  const [placement, setPlacement] = useState(cat.placements[0])
  const [giftBox, setGiftBox] = useState(false)
  const [second, setSecond] = useState(false)
  const [notes, setNotes] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [hp, setHp] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState<{ number: string; deposit: number } | null>(null)

  useEffect(() => {
    // A tile in the shop can arrive with the maker already chosen.
    const want = new URLSearchParams(window.location.search).get('maker')
    if (want) {
      const i = makers.findIndex(m => m.slug === want)
      if (i >= 0) { setPick(i); setPlacement(makers[i].placements[0] ?? cat.placements[0]) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const base = deliveredPrice(item)
  const total = base + (giftBox ? SOURCING.giftBox : 0) + (second ? SOURCING.secondLocation : 0)
  // The maker's own placements win when it has them; the category's otherwise.
  const placements = item.placements.length ? item.placements : cat.placements
  const chosenPlacement = placements.includes(placement) ? placement : placements[0]
  const fontOpt = fontOptions.find(f => f.value === font) ?? fontOptions[0]

  const summary = [
    `From the reserve: ${item.name}.`,
    `Engrave "${text.trim() || cat.sample}" on the ${chosenPlacement.toLowerCase()}.`,
    giftBox ? 'Gift box, yes.' : '',
    second ? 'Second placement, yes.' : '',
    notes.trim() ? `Notes: ${notes.trim()}` : '',
    `Delivered: ${usd(total)}.`,
  ].filter(Boolean).join(' ')
  const smsHref = getSmsLink(`Hi Zach. ${summary}`)
  const mailHref = `mailto:${siteInfo.email}?subject=${encodeURIComponent(`Reserve: ${item.name}`)}&body=${encodeURIComponent(`Hi Zach.\n\n${summary}\n\nMy name: \nBest number: `)}`

  async function reserve(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setErr('')
    if (!text.trim()) { setErr('Tell me the words to engrave.'); return }
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErr('Your name and a real email, so I can confirm it.'); return }
    setBusy(true)
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: item.slug, text: text.trim(), font, placement: chosenPlacement, giftBox, second, notes, name: name.trim(), email: email.trim(), phone: phone.trim(), website: hp }),
      })
      const j = (await res.json().catch(() => null)) as { ok?: boolean; data?: { number: string; deposit: number }; error?: { message?: string } } | null
      if (!res.ok || !j?.ok || !j.data) throw new Error(j?.error?.message || 'That did not go through.')
      setDone(j.data)
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'That did not go through. Nothing was saved; text me instead.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Link href="/shop/reserve" className="text-[length:var(--step-fine)] font-mono tracking-[0.18em] uppercase text-[var(--feature)] hover:text-[var(--ink)] transition-colors">
          The reserve
        </Link>

        {/* The category: the photograph and my words. */}
        <header className="mt-6 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] gap-6 md:gap-10 items-start">
          <div className="max-w-[62ch]">
            <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>
              {cat.label}
            </h1>
            <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">{cat.about}</p>
          </div>
          {(itemPhoto(item) ?? cat.photo?.src) && (
            <div className="relative aspect-[4/3] rounded-[var(--r-panel)] overflow-hidden border border-[var(--hairline)]">
              <Image src={itemPhoto(item) ?? cat.photo!.src} alt={item.name} fill priority sizes="(max-width: 768px) 100vw, 320px" className="object-cover" />
            </div>
          )}
        </header>

        {/* Three facts, the way a menu says them. */}
        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`${panel} px-5 py-4`}>
            <dt className="text-[10px] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)]">What it comes to</dt>
            <dd className="mt-1 text-[length:var(--step-body)] text-[var(--ink)] tabular-nums">
              {makers.length ? `${usd(deliveredPrice(makers[0]))} to ${usd(deliveredPrice(makers[makers.length - 1]))}` : ''}
              <span className="block text-[11px] text-[var(--ink-soft)] mt-0.5">the piece at cost, plus the {usd(SOURCING.reserveFee)} fee for finding it, marking it, and bringing it</span>
            </dd>
          </div>
          <div className={`${panel} px-5 py-4`}>
            <dt className="text-[10px] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)]">Where the mark goes</dt>
            <dd className="mt-1 text-[length:var(--step-body)] text-[var(--ink)]">{cat.placements.join(', ').toLowerCase()}<span className="block text-[11px] text-[var(--ink-soft)] mt-0.5">{cat.mark}</span></dd>
          </div>
          <div className={`${panel} px-5 py-4`}>
            <dt className="text-[10px] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)]">When</dt>
            <dd className="mt-1 text-[length:var(--step-body)] text-[var(--ink)]">Within the week<span className="block text-[11px] text-[var(--ink-soft)] mt-0.5">bought locally, marked, hand delivered; one to two weeks when ordered in</span></dd>
          </div>
        </dl>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(280px,2fr)] gap-6 lg:gap-8 items-start">
          <section className={`${panel} p-4 sm:p-6 space-y-7`}>
            {/* The piece, picked from the ones I usually buy. Plain text only. */}
            <div>
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[var(--eyebrow)] mb-1">The one I buy for you</p>
              <p className="text-[length:var(--step-fine)] text-[var(--ink-soft)] mb-3">Starting points, the ones I would buy myself. Want a different one? Name it in the notes and I will source it.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {makers.map((m, i) => {
                  const on = i === pick
                  return (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => { setPick(i); setPlacement(m.placements[0] ?? cat.placements[0]) }}
                      aria-pressed={on}
                      className={`text-left rounded-[var(--r-tile)] border p-3 transition-colors duration-[var(--t-hover)] ${on ? 'border-[var(--feature)] bg-[var(--glass)]' : 'border-[var(--hairline)] hover:border-[var(--feature)]/40'}`}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-[length:var(--step-body)] font-semibold leading-snug text-[var(--ink)]">{m.name}</span>
                        <span className="text-[length:var(--step-body)] tabular-nums whitespace-nowrap text-[var(--ink)]">{usd(deliveredPrice(m))}</span>
                      </span>
                      <span className="block mt-0.5 text-[length:var(--step-fine)] text-[var(--ink-soft)]">{m.material}. {/^ordered/i.test(m.where) ? 'Ordered in, one to two weeks.' : 'In hand within the week.'}</span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">{item.blurb}</p>
            </div>

            {/* The engraving, said plainly. */}
            <div>
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[var(--eyebrow)] mb-3">The engraving</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2">
                  <span className="block text-[11px] font-medium text-[var(--ink-soft)] mb-1.5">The words</span>
                  <input value={text} onChange={e => setText(e.target.value.slice(0, 40))} placeholder={cat.sample} className={fieldCls} />
                  <span className="block text-[11px] text-[var(--ink-soft)]/70 mt-1">Up to 40 characters. Two lines? Say so in the notes. {item.mark}</span>
                </label>
                <label className="block">
                  <span className="block text-[11px] font-medium text-[var(--ink-soft)] mb-1.5">The lettering</span>
                  <select value={font} onChange={e => setFont(e.target.value)} className={fieldCls}>
                    {fontOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                  <span className="block text-[11px] text-[var(--ink-soft)]/70 mt-1">Not sure? Leave it on {fontOpt.label} and I will set it right.</span>
                </label>
                <div>
                  <span className="block text-[11px] font-medium text-[var(--ink-soft)] mb-1.5">Where it goes</span>
                  <div className="flex flex-wrap gap-2">
                    {placements.map(p => {
                      const on = p === chosenPlacement
                      return (
                        <button key={p} type="button" onClick={() => setPlacement(p)} aria-pressed={on}
                          className={`h-9 px-3.5 rounded-[var(--r-control)] text-[length:var(--step-row)] border transition-colors duration-[var(--t-hover)] ${on ? 'border-[var(--feature)] bg-[var(--glass)] text-[var(--ink)]' : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:border-[var(--feature)]/40'}`}>
                          {p}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <label className="flex items-start gap-3 rounded-[var(--r-tile)] border border-[var(--hairline)] p-3 cursor-pointer hover:border-[var(--feature)]/40 transition-colors">
                  <input type="checkbox" checked={giftBox} onChange={e => setGiftBox(e.target.checked)} className="mt-1 accent-[var(--coral)]" />
                  <span>
                    <span className="block text-[length:var(--step-row)] text-[var(--ink)]">Gift box <span className="text-[var(--ink-soft)]">+{usd(SOURCING.giftBox)}</span></span>
                    <span className="block text-[11px] text-[var(--ink-soft)]">Boxed and ready to hand over.</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 rounded-[var(--r-tile)] border border-[var(--hairline)] p-3 cursor-pointer hover:border-[var(--feature)]/40 transition-colors">
                  <input type="checkbox" checked={second} onChange={e => setSecond(e.target.checked)} className="mt-1 accent-[var(--coral)]" />
                  <span>
                    <span className="block text-[length:var(--step-row)] text-[var(--ink)]">A second placement <span className="text-[var(--ink-soft)]">+{usd(SOURCING.secondLocation)}</span></span>
                    <span className="block text-[11px] text-[var(--ink-soft)]">A date on the other side, a line inside the lid.</span>
                  </span>
                </label>
                <label className="block sm:col-span-2">
                  <span className="block text-[11px] font-medium text-[var(--ink-soft)] mb-1.5">Notes</span>
                  <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0, 400))} rows={3}
                    placeholder="A different maker or size, a second line, a logo you will send, a date you need it by."
                    className="w-full px-3.5 py-2.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--feature)]/70 transition-colors resize-y" />
                </label>
              </div>
            </div>
          </section>

          {/* The money and the button. */}
          <aside className="lg:sticky lg:top-28 space-y-4">
            <section className={`${panel} p-5 sm:p-6`}>
              <dl className="space-y-2 text-[length:var(--step-row)]">
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">{item.name}</dt><dd className="tabular-nums text-[var(--ink)]">{usd(item.retail)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Found, engraved, delivered</dt><dd className="tabular-nums text-[var(--ink)]">{usd(base - item.retail)}</dd></div>
                {giftBox && <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Gift box</dt><dd className="tabular-nums text-[var(--ink)]">{usd(SOURCING.giftBox)}</dd></div>}
                {second && <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Second placement</dt><dd className="tabular-nums text-[var(--ink)]">{usd(SOURCING.secondLocation)}</dd></div>}
                <div className="flex justify-between gap-4 pt-2 border-t border-[var(--hairline)]">
                  <dt className="text-[var(--ink)] font-semibold">Total</dt>
                  <dd className="tabular-nums text-[var(--ink)] text-[length:var(--step-panel)]" style={display}>{usd(total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[11px] leading-relaxed text-[var(--ink-soft)]">
                The {cat.noun} at cost, receipt in the box, and the fee on top. A deposit of {usd(SOURCING.deposit(item.retail))} holds it before I buy, returned in full if you change your mind before then. The rest when it is in your hands.
              </p>
              {done ? (
                <div className="mt-5 rounded-[var(--r-tile)] border border-[var(--feature)]/50 bg-[var(--glass)] p-4">
                  <p className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">Reserved. {done.number}.</p>
                  <p className="mt-1.5 text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">
                    A confirmation is on its way to {email.trim()}. I will reach out today for the {usd(done.deposit)} deposit, then go get the piece.
                  </p>
                </div>
              ) : (
                <form onSubmit={reserve} className="mt-5 space-y-3" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="block text-[11px] font-medium text-[var(--ink-soft)] mb-1">Your name</span>
                      <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" className={fieldCls} />
                    </label>
                    <label className="block">
                      <span className="block text-[11px] font-medium text-[var(--ink-soft)] mb-1">Phone <span className="text-[var(--ink-soft)]/60">(so I can text you)</span></span>
                      <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" className={fieldCls} />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="block text-[11px] font-medium text-[var(--ink-soft)] mb-1">Email</span>
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" inputMode="email" autoComplete="email" className={fieldCls} />
                    </label>
                    <label className="hidden" aria-hidden>
                      <span>Website</span>
                      <input value={hp} onChange={e => setHp(e.target.value)} tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <button type="submit" disabled={busy}
                    className="puffy-btn w-full flex items-center justify-center h-12 px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)] disabled:opacity-60">
                    {busy ? 'Reserving' : `Reserve this ${cat.noun}`}
                  </button>
                  {err && <p className="text-[12px] text-[var(--error)]">{err}</p>}
                  <p className="text-center text-[11px] text-[var(--ink-soft)]">
                    Nothing is charged here. Rather talk?{' '}
                    <a href={smsHref} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">Text it</a> or{' '}
                    <a href={mailHref} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">email it</a>.
                  </p>
                </form>
              )}
            </section>

            <section className={`${panel} p-5 sm:p-6`}>
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[var(--eyebrow)] mb-3">What arrives</p>
              <ul className="space-y-2 text-[length:var(--step-row)] text-[var(--ink-soft)]">
                <li className="flex gap-2.5"><span className="text-[var(--feature)]" aria-hidden>&middot;</span>The piece, bought new, receipt in the box.</li>
                <li className="flex gap-2.5"><span className="text-[var(--feature)]" aria-hidden>&middot;</span>Your words, marked in the material.</li>
                <li className="flex gap-2.5"><span className="text-[var(--feature)]" aria-hidden>&middot;</span>Hand delivered across the south Denver metro, by me.</li>
                <li className="flex gap-2.5"><span className="text-[var(--feature)]" aria-hidden>&middot;</span>{item.leadTime}</li>
              </ul>
            </section>
          </aside>
        </div>

        {also.length > 0 && (
          <section className="mt-14">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[var(--eyebrow)]">Also in the reserve</p>
              <Link href="/shop/reserve" className="text-[length:var(--step-fine)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">All of it</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {also.map(c => <CategoryCard key={c.key} cat={c} compact />)}
            </div>
          </section>
        )}

        <p className="mt-12 max-w-[64ch] text-[11px] leading-relaxed text-[var(--ink-soft)]/80">
          VURMZ is an independent engraver, not affiliated with or endorsed by any maker named here. Engraving a piece may void its maker&apos;s warranty. Deposit, cancellation, and guarantee terms are in the <Link href="/terms" className="underline decoration-[var(--hairline)] hover:text-[var(--ink)]">terms</Link>.
          {cat.photo && <>{' '}Photograph by <a href={cat.photo.href} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--hairline)] hover:text-[var(--ink)]">{cat.photo.credit}</a>.</>}
        </p>
      </div>
    </div>
  )
}
