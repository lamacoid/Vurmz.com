'use client'
import { RESERVE_CATEGORIES, rangeFor, makersFor, type ReserveCategory } from '@/lib/sourcing'
import Image from 'next/image'
import { DoorLink } from '@/components/BackRoomDoor'
import { ReserveMark } from '@/components/shop/ReserveMarks'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const display = { fontFamily: 'var(--font-display), Georgia, serif' }

/**
 * The reserve, by kind of thing. Six doors, each a line drawing of the
 * object on the glass (drawn here, no maker photos), the one line that
 * sells it, and what it comes to. Every door walks through the teal into
 * the category page, where the maker is picked in plain text.
 */
export default function ReserveList() {
  const doors = RESERVE_CATEGORIES.filter(c => c.featured)
  const more = RESERVE_CATEGORIES.filter(c => !c.featured)
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {doors.map((c, i) => <CategoryCard key={c.key} cat={c} index={i} />)}
      </div>
      {more.length > 0 && (
        <p className="mt-7 text-[length:var(--step-row)] text-[#DED6C3]/70">
          Also in the room:{' '}
          {more.map((c, i) => (
            <span key={c.key}>
              <DoorLink href={`/shop/reserve/${c.key}`} className="text-[#7FCFD4] hover:text-white transition-colors">{c.label.toLowerCase()}</DoorLink>
              {i < more.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

export function CategoryCard({ cat, compact = false, index = 0 }: { cat: ReserveCategory; compact?: boolean; index?: number }) {
  const range = rangeFor(cat.key)
  const n = makersFor(cat.key).length
  return (
    <DoorLink
      href={`/shop/reserve/${cat.key}`}
      className="group relative block rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] hover:bg-white/[0.07] hover:border-[#7FCFD4]/50 backdrop-blur-md overflow-hidden transition-colors duration-[var(--t-hover)]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* The door: a licensed lifestyle photo when I have one, the line drawing on the glass otherwise. */}
      <div className={`relative ${compact ? 'aspect-[16/9]' : 'aspect-[4/3]'} flex items-center justify-center overflow-hidden`}>
        {cat.photo ? (
          <>
            <Image
              src={cat.photo.src}
              alt={cat.label}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
            {/* A teal film, so the photo lives in the room instead of on top of it. */}
            <div className="absolute inset-0 bg-[#123F47]/35 group-hover:bg-[#123F47]/20 transition-colors duration-500" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2F35]/70 via-transparent to-transparent" aria-hidden />
            <ReserveMark kind={cat.key} className="absolute right-3 bottom-3 w-14 text-[#DED6C3]/70 group-hover:text-[#7FCFD4] transition-colors duration-500" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(127,207,212,0.16) 0%, transparent 60%)' }} aria-hidden />
            <ReserveMark kind={cat.key} className="relative w-[62%] max-w-[240px] text-[#DED6C3]/80 group-hover:text-[#7FCFD4] transition-[color,transform] duration-500 ease-out group-hover:-translate-y-1" />
          </>
        )}
      </div>
      <div className={`border-t border-white/10 ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
        <p className={`${compact ? 'text-[length:var(--step-body)]' : 'text-[length:var(--step-panel)]'} leading-tight text-white/95`} style={display}>{cat.label}</p>
        {!compact && <p className="mt-1.5 text-[length:var(--step-row)] leading-snug text-[#DED6C3]/75">{cat.line}</p>}
        <p className="mt-2.5 flex items-baseline justify-between gap-3 text-[length:var(--step-fine)]">
          <span className="text-[#DED6C3]/55">{n === 1 ? 'One maker' : `${n} makers`}</span>
          {range && (
            <span className="tabular-nums text-[#F3EEE2]">
              {range.low === range.high ? usd(range.low) : `${usd(range.low)} to ${usd(range.high)}`}
            </span>
          )}
        </p>
      </div>
    </DoorLink>
  )
}
