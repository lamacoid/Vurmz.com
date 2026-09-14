import { ONSITE } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'

const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const usd = (n: number) => `$${n.toLocaleString('en-US')}`

/**
 * VURMZ on site: the laser comes to the event or the store. One person,
 * one machine, names on the piece while the guest watches. Rate card from
 * the 2026-09 research; every line is a real term.
 */
export default function OnSite({ standalone = false }: { standalone?: boolean }) {
  const rows: Array<[string, string, string?]> = [
    ['Half day', usd(ONSITE.halfDay), 'Up to four hours on site, one station, me at it'],
    ['Full day', usd(ONSITE.fullDay), 'Up to eight hours'],
    ['Extra hour', usd(ONSITE.extraHour)],
    ['Second station', `+${usd(ONSITE.secondStationHalf)} half, +${usd(ONSITE.secondStationFull)} full`, 'Two machines running together, for a big guest list'],
    ['Per piece, for a store', `${usd(ONSITE.perPieceRetail)} a piece`, `${ONSITE.perPieceMinimum} piece minimum. You set the guest price.`],
    ['Travel', `Free within ${ONSITE.travelFreeMiles} miles`, `${usd(ONSITE.travelPerMile)} a mile round trip beyond that`],
    ['Deposit', `${Math.round(ONSITE.depositPct * 100)}% at booking`, 'Balance on the day. Date changes free outside two weeks.'],
  ]
  return (
    <div className={standalone ? '' : 'bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8'}>
      <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)] mb-2">VURMZ on site</p>
      <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>The laser comes to you.</h2>
      <p className="mt-2 max-w-[62ch] text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">
        A launch, a holiday event at the store, a member-guest, a wedding. I bring the machine, the extractor, and a
        proof of the piece already made. Guests give a name and watch it go into the metal.
        {' '}{ONSITE.piecesPerHourMetal[0]} to {ONSITE.piecesPerHourMetal[1]} metal pieces an hour, {ONSITE.piecesPerHourWood[0]} to {ONSITE.piecesPerHourWood[1]} on wood or leather.
      </p>
      <div className="mt-5 text-[length:var(--step-row)]">
        {rows.map(([k, v, note], i) => (
          <div key={k} className={`flex flex-col py-2.5 ${i < rows.length - 1 ? 'border-b border-[var(--hairline)]' : ''}`}>
            <span className="flex items-baseline justify-between gap-4">
              <span className="font-semibold text-[var(--ink)]">{k}</span>
              <span className="text-[var(--eyebrow)] font-semibold whitespace-nowrap">{v}</span>
            </span>
            {note && <span className="text-[length:var(--step-fine)] text-[var(--ink-soft)]">{note}</span>}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[length:var(--step-fine)] leading-relaxed text-[var(--ink-soft)]">
        You supply a six by four foot space with a table, a dedicated 20 amp outlet within 25 feet, a spot the extractor can vent,
        the pieces (or I source them), and the artwork five days ahead. I supply everything else.
      </p>
      <a
        href={getSmsLink('Hi Zach, I have an event that could use live engraving. Date and place: ')}
        className="puffy-btn mt-5 inline-flex items-center justify-center h-11 px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
      >
        Text {siteInfo.phone} about a date
      </a>
    </div>
  )
}
