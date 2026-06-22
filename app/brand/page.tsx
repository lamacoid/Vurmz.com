import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VURMZ Brand Board',
  robots: { index: false, follow: false },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

const PALETTE = [
  { name: 'Oatmeal (paper)', hex: '#DED6C3', role: 'Default background. The page.', text: '#16525C' },
  { name: 'Deep teal (ink)', hex: '#16525C', role: 'Text, headings, dark sections, footer.', text: '#DED6C3' },
  { name: 'Deepest teal (feature)', hex: '#123F47', role: 'Darkest feature bands, for depth.', text: '#DED6C3' },
  { name: 'Glassy teal (accent)', hex: '#7FCFD4', role: 'Accent on dark sections only.', text: '#0c3138' },
  { name: 'Dusty coral (action)', hex: '#C67A6F', role: 'CTAs and key actions. Fill only.', text: '#ffffff' },
  { name: 'Laser red (spark)', hex: '#FF2A2A', role: 'The laser motif only. Cursor, small marks.', text: '#ffffff' },
]

const RATIO = [
  { label: 'Oatmeal', pct: 55, hex: '#DED6C3', text: '#16525C' },
  { label: 'Teal', pct: 30, hex: '#16525C', text: '#DED6C3' },
  { label: 'Coral', pct: 12, hex: '#C67A6F', text: '#ffffff' },
  { label: 'Red', pct: 3, hex: '#FF2A2A', text: '#ffffff' },
]

export default function BrandBoard() {
  return (
    <div style={{ background: '#DED6C3', color: '#16525C', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-20">

        {/* Header */}
        <p className="text-xs font-mono tracking-[0.25em] uppercase mb-6" style={{ color: '#C67A6F' }}>Brand board</p>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-6xl sm:text-7xl font-light tracking-[0.06em]" style={{ color: '#16525C' }}>VURMZ</span>
          <span style={{ color: '#FF2A2A' }} className="mb-3 text-2xl">+</span>
        </div>
        <p className="text-sm tracking-wide mb-1" style={{ color: '#4f5d5b' }}>VURMZ | Laser Engraving</p>
        <p className="text-2xl sm:text-3xl font-semibold mt-8 mb-12" style={{ ...display, color: '#16525C' }}>
          Local. Thoughtful. Fast.
        </p>

        {/* Ratio bar */}
        <h2 className="text-sm font-mono tracking-[0.2em] uppercase mb-3" style={{ color: '#4f5d5b' }}>The ratio</h2>
        <div className="flex w-full h-12 rounded-sm overflow-hidden mb-2" style={{ border: '1px solid rgba(22,82,92,0.15)' }}>
          {RATIO.map((r) => (
            <div key={r.label} style={{ width: `${r.pct}%`, background: r.hex, color: r.text }} className="flex items-center justify-center text-xs font-semibold">
              {r.pct >= 10 ? `${r.label} ${r.pct}%` : ''}
            </div>
          ))}
        </div>
        <p className="text-xs mb-14" style={{ color: '#4f5d5b' }}>Mostly warm paper, punctuated by deep teal, with coral only where you want a click. Red is the laser spark.</p>

        {/* Palette */}
        <h2 className="text-sm font-mono tracking-[0.2em] uppercase mb-4" style={{ color: '#4f5d5b' }}>The palette</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-16">
          {PALETTE.map((c) => (
            <div key={c.hex} className="rounded-sm overflow-hidden" style={{ border: '1px solid rgba(22,82,92,0.15)' }}>
              <div className="h-20 flex items-end p-3" style={{ background: c.hex, color: c.text }}>
                <span className="text-xs font-mono">{c.hex}</span>
              </div>
              <div className="p-3" style={{ background: '#fffdf8' }}>
                <p className="text-sm font-semibold" style={{ color: '#16525C' }}>{c.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#4f5d5b' }}>{c.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sample: paper section */}
        <h2 className="text-sm font-mono tracking-[0.2em] uppercase mb-4" style={{ color: '#4f5d5b' }}>In use</h2>
        <div className="rounded-sm p-8 mb-4" style={{ background: '#fffdf8', border: '1px solid rgba(22,82,92,0.12)' }}>
          <p className="text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: '#C67A6F' }}>Paper section</p>
          <h3 className="text-2xl font-semibold mb-3" style={{ ...display, color: '#16525C' }}>A heading in teal ink</h3>
          <p className="text-sm leading-relaxed mb-5 max-w-md" style={{ color: '#4f5d5b' }}>
            Body copy sits on warm paper in a muted teal grey. Easy to read, warm, and human. Coral shows up once, where the click is.
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold" style={{ background: '#C67A6F', color: '#ffffff' }}>
            Shop engraved goods
          </button>
        </div>

        {/* Sample: deep teal feature */}
        <div className="rounded-sm p-8" style={{ background: '#123F47' }}>
          <p className="text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: '#7FCFD4' }}>Feature section</p>
          <h3 className="text-2xl font-semibold mb-3" style={{ ...display, color: '#DED6C3' }}>A deep teal block punctuates the paper</h3>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(222,214,195,0.8)' }}>
            The dark teal sections are where glassy teal accents and the backlit look live. Oatmeal text on deep teal. This is the cool, precise half of the brand.
          </p>
        </div>

      </div>
    </div>
  )
}
