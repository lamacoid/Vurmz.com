'use client'
/**
 * A category from the reserve: the chef's knife, the skillet, the cooler.
 * The page is in my words about what makes a good one, then the customer
 * picks the maker from the ones I usually buy (plain text, no logos),
 * previews the mark in their own words and face, and reserves it. The
 * order lands on the books through /api/reserve as a quote.
 */
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FontBook from '@/components/shop/FontBook'
import RoomTheme from '@/components/shop/RoomTheme'
import { CategoryCard } from '@/components/shop/ReserveList'
import { ReserveMark } from '@/components/shop/ReserveMarks'
import { fontOptions } from '@/lib/fonts'
import { SOURCING } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { deliveredPrice, type SourcedItem, type ReserveCategory } from '@/lib/sourcing'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const fieldCls = 'w-full h-11 px-3.5 rounded-[var(--r-control)] bg-[#0D2F35]/70 border border-white/12 text-[#F3EEE2] placeholder:text-[#DED6C3]/40 focus:outline-none focus:border-[#7FCFD4]/70 transition-colors'
const display = { fontFamily: 'var(--font-display), Georgia, serif' }

/** What the plate looks like, and what a mark looks like on it. Honest to the material. */
function plateFor(item: SourcedItem): { bg: string; ink: string; edge: string } {
  const m = item.material.toLowerCase()
  const bright = /bright|silver/i.test(item.mark)
  if (/maple|wood|beech/.test(m)) return { bg: 'linear-gradient(135deg,#D9B27C 0%,#C49A5E 55%,#B98E55 100%)', ink: '#3E2410', edge: 'rgba(60,30,10,0.35)' }
  if (/leather/.test(m)) return { bg: 'linear-gradient(135deg,#6B4A33 0%,#4E3423 100%)', ink: '#1C110A', edge: 'rgba(0,0,0,0.35)' }
  if (/carbon/.test(m)) return { bg: 'linear-gradient(135deg,#2A2C2F 0%,#151719 100%)', ink: '#B9BDC1', edge: 'rgba(255,255,255,0.10)' }
  if (/polyethylene|rotomolded/.test(m)) return { bg: 'linear-gradient(135deg,#6E7B7A 0%,#4F5B5A 100%)', ink: '#DCE2E1', edge: 'rgba(255,255,255,0.14)' }
  if (/powder/.test(m)) return { bg: 'linear-gradient(135deg,#2C4C5B 0%,#1F3743 100%)', ink: '#E9EBEC', edge: 'rgba(255,255,255,0.14)' }
  if (/titanium/.test(m)) return { bg: 'linear-gradient(135deg,#7C8186 0%,#585D62 100%)', ink: '#17191B', edge: 'rgba(255,255,255,0.18)' }
  if (/cast iron/.test(m)) return { bg: 'linear-gradient(135deg,#4A4D50 0%,#2E3134 100%)', ink: '#E4E6E8', edge: 'rgba(255,255,255,0.12)' }
  if (/chrome|brass/.test(m)) return { bg: 'linear-gradient(135deg,#D6D8DA 0%,#A9ADB1 100%)', ink: '#1E2224', edge: 'rgba(255,255,255,0.4)' }
  return { bg: 'linear-gradient(135deg,#C3C7CB 0%,#979CA1 100%)', ink: bright ? '#F4F5F6' : '#22272A', edge: 'rgba(255,255,255,0.35)' }
}

export default function ReservePiece({ cat, makers, also }: { cat: ReserveCategory; makers: SourcedItem[]; also: ReserveCategory[] }) {
  const [pick, setPick] = useState(0)
  const item = makers[pick] ?? makers[0]
  const [text, setText] = useState(cat.sample)
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

  useEffect(() => { window.dispatchEvent(new Event('vurmz:door-ready')) }, [])

  const fontOpt = fontOptions.find(f => f.value === font) ?? fontOptions[0]
  const plate = useMemo(() => plateFor(item), [item])
  const base = deliveredPrice(item)
  const total = base + (giftBox ? SOURCING.giftBox : 0) + (second ? SOURCING.secondLocation : 0)
  const shown = text.trim() || cat.sample
  const size = Math.max(22, Math.min(64, 440 / Math.max(6, shown.length)))
  // The maker's own placements win when it has them; the category's otherwise.
  const placements = item.placements.length ? item.placements : cat.placements
  const chosenPlacement = placements.includes(placement) ? placement : placements[0]

  const summary = [
    `From the reserve: ${item.name}.`,
    `Engrave "${shown}" in ${fontOpt.label} on the ${chosenPlacement.toLowerCase()}.`,
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
    <div className="relative -mt-[92px] sm:-mt-[100px] pt-[118px] sm:pt-[132px] pb-20 bg-[#123F47] text-[#DED6C3] overflow-hidden">
      <RoomTheme />
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <Image src={cat.photo?.src ?? cat.backdrop} alt="" fill priority sizes="100vw" quality={55} className={`object-cover ${cat.photo ? 'opacity-[0.34]' : 'opacity-[0.22]'}`} />
        <div className="absolute inset-0 bg-[#123F47]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7FCFD4]/[0.08] via-transparent to-[#0D2F35]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop/reserve" className="inline-block text-[length:var(--step-fine)] font-mono tracking-[0.2em] uppercase text-[#7FCFD4]/80 hover:text-[#7FCFD4] transition-colors">
          Back to the reserve
        </Link>

        {/* The category, in my words. */}
        <header className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8 items-end">
          <div className="max-w-[62ch]">
            <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[#7FCFD4] mb-3">The reserve</p>
            <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-white/95" style={display}>
              {cat.label}
            </h1>
            <p className="mt-5 text-[length:var(--step-lead)] leading-relaxed text-[#DED6C3]/88 first-letter:text-[1.6em] first-letter:font-semibold first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9] first-letter:text-[#7FCFD4]" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
              {cat.about}
            </p>
          </div>
          <ReserveMark kind={cat.key} className="hidden lg:block w-full text-[#7FCFD4]/70" />
        </header>

        {/* Three facts, the way a menu says them. */}
        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-[var(--r-panel)] overflow-hidden border border-white/12 bg-white/10">
          <div className="bg-[#123F47]/80 backdrop-blur-md px-5 py-4">
            <dt className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#7FCFD4]">What it comes to</dt>
            <dd className="mt-1 text-[length:var(--step-body)] text-[#F3EEE2] tabular-nums">
              {makers.length ? `${usd(deliveredPrice(makers[0]))} to ${usd(deliveredPrice(makers[makers.length - 1]))}` : ''}
              <span className="block text-[11px] text-[#DED6C3]/55 mt-0.5">the piece at its price, plus {usd(SOURCING.reserveFee)} to find it, mark it, and bring it</span>
            </dd>
          </div>
          <div className="bg-[#123F47]/80 backdrop-blur-md px-5 py-4">
            <dt className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#7FCFD4]">Where the mark goes</dt>
            <dd className="mt-1 text-[length:var(--step-body)] text-[#F3EEE2]">{cat.placements.join(', ').toLowerCase()}<span className="block text-[11px] text-[#DED6C3]/55 mt-0.5">{cat.mark}</span></dd>
          </div>
          <div className="bg-[#123F47]/80 backdrop-blur-md px-5 py-4">
            <dt className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#7FCFD4]">When</dt>
            <dd className="mt-1 text-[length:var(--step-body)] text-[#F3EEE2]">Within the week<span className="block text-[11px] text-[#DED6C3]/55 mt-0.5">bought locally, marked, hand delivered; one to two weeks when ordered in</span></dd>
          </div>
        </dl>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(280px,2fr)] gap-6 lg:gap-8 items-start">
          <section className="rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] backdrop-blur-md p-4 sm:p-6 space-y-6">
            {/* The maker, picked from the ones I usually buy. Plain text only. */}
            <div>
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[#7FCFD4] mb-1">The one I buy for you</p>
              <p className="text-[length:var(--step-fine)] text-[#DED6C3]/60 mb-3">Starting points, the ones I would buy myself. Want a different one? Name it in the notes and I will source it.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {makers.map((m, i) => {
                  const on = i === pick
                  return (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => { setPick(i); setPlacement((m.placements[0] ?? cat.placements[0])) }}
                      aria-pressed={on}
                      className={`text-left rounded-[var(--r-tile)] border p-3 transition-colors duration-[var(--t-hover)] ${on ? 'border-[#7FCFD4] bg-[#7FCFD4]/12' : 'border-white/12 hover:border-white/30'}`}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className={`text-[length:var(--step-body)] font-semibold leading-snug ${on ? 'text-white' : 'text-[#F3EEE2]'}`}>{m.name}</span>
                        <span className="text-[length:var(--step-body)] tabular-nums whitespace-nowrap text-[#F3EEE2]">{usd(deliveredPrice(m))}</span>
                      </span>
                      <span className="block mt-0.5 text-[length:var(--step-fine)] text-[#DED6C3]/65">{m.material}. {/^ordered/i.test(m.where) ? 'Ordered in, one to two weeks.' : 'In hand within the week.'}</span>
                    </button>
                  )
                })}
              </div>
              <blockquote className="mt-4 pl-4 border-l-2 border-[#7FCFD4]/50 text-[length:var(--step-row)] leading-relaxed text-[#DED6C3]/80" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>{item.blurb}</blockquote>
            </div>

            {/* The mark, previewed live. */}
            <div>
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[#7FCFD4] mb-3">The engraving</p>
              <div
                className="relative rounded-[var(--r-tile)] overflow-hidden aspect-[16/9]"
                style={{ background: plate.bg, boxShadow: `inset 0 0 0 1px ${plate.edge}` }}
              >
                <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 1px, transparent 1px 3px)' }} aria-hidden />
                {/* The object, drawn in the plate's ink, with the words on it where the mark goes. */}
                <ReserveMark kind={cat.key} className="absolute -right-[6%] -bottom-[12%] w-[70%] h-auto" style={{ color: plate.ink, opacity: 0.16 }} />
                <div className="absolute inset-0 grid place-items-center px-8 pb-6">
                  <p
                    className="relative text-center leading-tight break-words max-w-full"
                    style={{ ...fontOpt.style, color: plate.ink, fontSize: `${size}px`, textShadow: /F4F5F6|E9EBEC|E4E6E8|DCE2E1|B9BDC1/.test(plate.ink) ? '0 0 8px rgba(255,255,255,0.35)' : '0 1px 0 rgba(255,255,255,0.18)' }}
                  >
                    {shown}
                  </p>
                </div>
                <span className="absolute left-3 bottom-2 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: plate.ink, opacity: 0.6 }}>
                  {chosenPlacement}
                </span>
              </div>
              <p className="mt-2.5 text-[length:var(--step-fine)] text-[#DED6C3]/60">{item.mark} The words and the face, on the material. The piece is the real thing.</p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2">
                  <span className="block text-[11px] font-medium text-[#DED6C3]/70 mb-1.5">The words</span>
                  <input value={text} onChange={e => setText(e.target.value.slice(0, 40))} placeholder={cat.sample} className={fieldCls} />
                  <span className="block text-[11px] text-[#DED6C3]/45 mt-1">Up to 40 characters. Two lines? Say so in the notes.</span>
                </label>
                <div className="sm:col-span-2">
                  <span className="block text-[11px] font-medium text-[#DED6C3]/70 mb-1.5">The face</span>
                  <div className="reserve-fontbook"><FontBook value={font} onChange={setFont} sampleText={shown} /></div>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-[11px] font-medium text-[#DED6C3]/70 mb-1.5">Where it goes</span>
                  <div className="flex flex-wrap gap-2">
                    {placements.map(p => {
                      const on = p === chosenPlacement
                      return (
                        <button key={p} type="button" onClick={() => setPlacement(p)} aria-pressed={on}
                          className={`h-9 px-3.5 rounded-[var(--r-control)] text-[length:var(--step-row)] border transition-colors duration-[var(--t-hover)] ${on ? 'border-[#7FCFD4] bg-[#7FCFD4]/15 text-white' : 'border-white/15 text-[#DED6C3]/80 hover:border-white/35'}`}>
                          {p}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <label className="flex items-start gap-3 rounded-[var(--r-tile)] border border-white/12 p-3 cursor-pointer hover:border-white/25 transition-colors">
                  <input type="checkbox" checked={giftBox} onChange={e => setGiftBox(e.target.checked)} className="mt-1 accent-[#7FCFD4]" />
                  <span>
                    <span className="block text-[length:var(--step-row)] text-[#F3EEE2]">Gift box <span className="text-[#DED6C3]/60">+{usd(SOURCING.giftBox)}</span></span>
                    <span className="block text-[11px] text-[#DED6C3]/55">Boxed and ready to hand over.</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 rounded-[var(--r-tile)] border border-white/12 p-3 cursor-pointer hover:border-white/25 transition-colors">
                  <input type="checkbox" checked={second} onChange={e => setSecond(e.target.checked)} className="mt-1 accent-[#7FCFD4]" />
                  <span>
                    <span className="block text-[length:var(--step-row)] text-[#F3EEE2]">A second placement <span className="text-[#DED6C3]/60">+{usd(SOURCING.secondLocation)}</span></span>
                    <span className="block text-[11px] text-[#DED6C3]/55">A date on the other side, a line inside the lid.</span>
                  </span>
                </label>
                <label className="block sm:col-span-2">
                  <span className="block text-[11px] font-medium text-[#DED6C3]/70 mb-1.5">Notes</span>
                  <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0, 400))} rows={3}
                    placeholder="A different maker or size, a second line, a logo you will send, a date you need it by."
                    className="w-full px-3.5 py-2.5 rounded-[var(--r-control)] bg-[#0D2F35]/70 border border-white/12 text-[#F3EEE2] placeholder:text-[#DED6C3]/40 focus:outline-none focus:border-[#7FCFD4]/70 transition-colors resize-y" />
                </label>
              </div>
            </div>
          </section>

          {/* The money and the button. */}
          <aside className="lg:sticky lg:top-28 space-y-4">
            <section className="rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] backdrop-blur-md p-5 sm:p-6">
              <dl className="space-y-2 text-[length:var(--step-row)]">
                <div className="flex justify-between gap-4"><dt className="text-[#DED6C3]/75">{item.name}</dt><dd className="tabular-nums text-[#F3EEE2]">{usd(item.retail)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[#DED6C3]/75">Found, engraved, delivered</dt><dd className="tabular-nums text-[#F3EEE2]">{usd(base - item.retail)}</dd></div>
                {giftBox && <div className="flex justify-between gap-4"><dt className="text-[#DED6C3]/75">Gift box</dt><dd className="tabular-nums text-[#F3EEE2]">{usd(SOURCING.giftBox)}</dd></div>}
                {second && <div className="flex justify-between gap-4"><dt className="text-[#DED6C3]/75">Second placement</dt><dd className="tabular-nums text-[#F3EEE2]">{usd(SOURCING.secondLocation)}</dd></div>}
                <div className="flex justify-between gap-4 pt-2 border-t border-white/12">
                  <dt className="text-[#F3EEE2] font-semibold">Total</dt>
                  <dd className="tabular-nums text-white text-[length:var(--step-panel)]" style={display}>{usd(total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[11px] leading-relaxed text-[#DED6C3]/55">
                The {cat.noun} at its price, receipt in the box. A deposit of {usd(SOURCING.deposit(item.retail))} holds it before I buy, returned in full if you change your mind before then. The rest when it is in your hands.
              </p>
              {done ? (
                <div className="mt-5 rounded-[var(--r-tile)] border border-[#7FCFD4]/50 bg-[#7FCFD4]/10 p-4">
                  <p className="text-[length:var(--step-body)] font-semibold text-white">Reserved. {done.number}.</p>
                  <p className="mt-1.5 text-[length:var(--step-row)] leading-relaxed text-[#DED6C3]/85">
                    A confirmation is on its way to {email.trim()}. I will reach out today for the {usd(done.deposit)} deposit, then go get the piece.
                  </p>
                </div>
              ) : (
                <form onSubmit={reserve} className="mt-5 space-y-3" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="block text-[11px] font-medium text-[#DED6C3]/70 mb-1">Your name</span>
                      <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" className={fieldCls} />
                    </label>
                    <label className="block">
                      <span className="block text-[11px] font-medium text-[#DED6C3]/70 mb-1">Phone <span className="text-[#DED6C3]/45">(so I can text you)</span></span>
                      <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" className={fieldCls} />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="block text-[11px] font-medium text-[#DED6C3]/70 mb-1">Email</span>
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
                  {err && <p className="text-[12px] text-amber-200">{err}</p>}
                  <p className="text-center text-[11px] text-[#DED6C3]/55">
                    Nothing is charged here. Rather talk?{' '}
                    <a href={smsHref} className="text-[#7FCFD4] hover:text-white transition-colors">Text it</a> or{' '}
                    <a href={mailHref} className="text-[#7FCFD4] hover:text-white transition-colors">email it</a>.
                  </p>
                </form>
              )}
            </section>

            <section className="rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] backdrop-blur-md p-5 sm:p-6">
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[#7FCFD4] mb-3">What arrives</p>
              <ul className="space-y-2 text-[length:var(--step-row)] text-[#DED6C3]/85">
                <li className="flex gap-2.5"><span className="text-[#7FCFD4]" aria-hidden>&middot;</span>The piece, bought new, receipt in the box.</li>
                <li className="flex gap-2.5"><span className="text-[#7FCFD4]" aria-hidden>&middot;</span>Your words, marked in the material.</li>
                <li className="flex gap-2.5"><span className="text-[#7FCFD4]" aria-hidden>&middot;</span>Hand delivered across the south Denver metro, by me.</li>
                <li className="flex gap-2.5"><span className="text-[#7FCFD4]" aria-hidden>&middot;</span>{item.leadTime}</li>
              </ul>
            </section>
          </aside>
        </div>

        {also.length > 0 && (
          <section className="mt-14">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[#7FCFD4]">Also in the reserve</p>
              <Link href="/shop/reserve" className="text-[length:var(--step-fine)] text-[#DED6C3]/60 hover:text-white transition-colors">The whole room</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {also.map(c => <CategoryCard key={c.key} cat={c} compact />)}
            </div>
          </section>
        )}

        <p className="mt-12 max-w-[56ch] text-[length:var(--step-row)] leading-relaxed text-[#DED6C3]/70">
          Same hands, same care, same delivery run as everything else I make. I am {siteInfo.founder.name}, one shop in {siteInfo.city}.
        </p>
        <p className="mt-6 max-w-[64ch] text-[11px] leading-relaxed text-[#DED6C3]/45">
          VURMZ is an independent engraver, not affiliated with or endorsed by any maker named here. Engraving a piece may void its maker&apos;s warranty. Deposit, cancellation, and guarantee terms are in the <Link href="/terms" className="underline decoration-[#DED6C3]/30 hover:text-[#DED6C3]/80">terms</Link>.
          {cat.photo && <>{' '}Photograph by <a href={cat.photo.href} target="_blank" rel="noopener noreferrer" className="underline decoration-[#DED6C3]/30 hover:text-[#DED6C3]/80">{cat.photo.credit}</a>.</>}
        </p>
      </div>
    </div>
  )
}
