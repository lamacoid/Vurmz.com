import RoomTheme from '@/components/shop/RoomTheme'

/**
 * The reserve is the one room on the site (2026-10-01): deep teal glass,
 * light ink, the bloom. Everything else sits on the paper.
 */
export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="room relative -mt-[92px] sm:-mt-[100px] pt-[92px] sm:pt-[100px] min-h-screen">
      <RoomTheme />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 20% 10%, rgba(127,207,212,0.10) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 85% 90%, rgba(13,47,53,0.8) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
