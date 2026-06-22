import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VURMZ Brand Board',
  robots: { index: false, follow: false },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

// Light mode is paper with teal ink. Dark mode flips back to the old teal look.
// Tokens swap on prefers-color-scheme; the paper grain shows only in light mode.
const STYLE = `
.bb{
  --paper:#DED6C3;--ink:#16525C;--ink-soft:#4f5d5b;--surface:#FFFDF8;
  --feature:#123F47;--feature-ink:#DED6C3;--accent:#7FCFD4;--coral:#C67A6F;--eyebrow:#C67A6F;
  background-color:var(--paper);
  background-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%3E%3Cfilter%20id='p'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.8'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23p)'%20opacity='0.05'/%3E%3C/svg%3E");
}
@media (prefers-color-scheme: dark){
  .bb{
    --paper:#16525C;--ink:#DED6C3;--ink-soft:rgba(222,214,195,0.72);--surface:#123F47;
    --feature:#0E333A;--feature-ink:#DED6C3;--accent:#7FCFD4;--coral:#C67A6F;--eyebrow:#7FCFD4;
    background-image:none;
  }
}
`

const PALETTE = [
  { name: 'Oatmeal (paper)', hex: '#DED6C3', role: 'Light-mode background. The page.', text: '#16525C' },
  { name: 'Deep teal (ink)', hex: '#16525C', role: 'Light-mode text. Dark-mode background.', text: '#DED6C3' },
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
    <div className="bb" style={{ color: 'var(--ink)', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-20">

        <p className="text-xs font-mono tracking-[0.25em] uppercase mb-6" style={{ color: 'var(--eyebrow)' }}>Brand board</p>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-6xl sm:text-7xl font-light tracking-[0.06em]" style={{ color: 'var(--ink)' }}>VURMZ</span>
          <span style={{ color: '#FF2A2A' }} className="mb-3 text-2xl">+</span>
        </div>
        <p className="text-sm tracking-wide mb-1" style={{ color: 'var(--ink-soft)' }}>VURMZ | Laser Engraving</p>
        <p className="text-2xl sm:text-3xl font-semibold mt-8 mb-3" style={{ ...display, color: 'var(--ink)' }}>
          Local. Thoughtful. Fast.
        </p>
        <p className="text-xs mb-12" style={{ color: 'var(--ink-soft)' }}>
          Light mode is paper with teal ink. Switch your system to dark mode and this flips back to the old teal look.
        </p>

        <h2 className="text-sm font-mono tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--ink-soft)' }}>The ratio</h2>
        <div className="flex w-full h-12 rounded-sm overflow-hidden mb-2" style={{ border: '1px solid rgba(127,127,127,0.2)' }}>
          {RATIO.map((r) => (
            <div key={r.label} style={{ width: `${r.pct}%`, background: r.hex, color: r.text }} className="flex items-center justify-center text-xs font-semibold">
              {r.pct >= 10 ? `${r.label} ${r.pct}%` : ''}
            </div>
          ))}
        </div>
        <p className="text-xs mb-14" style={{ color: 'var(--ink-soft)' }}>Mostly warm paper, punctuated by deep teal, with coral only where you want a click. Red is the laser spark.</p>

        <h2 className="text-sm font-mono tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--ink-soft)' }}>The palette</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-16">
          {PALETTE.map((c) => (
            <div key={c.hex} className="rounded-sm overflow-hidden" style={{ border: '1px solid rgba(127,127,127,0.2)' }}>
              <div className="h-20 flex items-end p-3" style={{ background: c.hex, color: c.text }}>
                <span className="text-xs font-mono">{c.hex}</span>
              </div>
              <div className="p-3" style={{ background: 'var(--surface)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{c.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>{c.role}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-mono tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--ink-soft)' }}>In use</h2>
        <div className="rounded-sm p-8 mb-4" style={{ background: 'var(--surface)', border: '1px solid rgba(127,127,127,0.15)' }}>
          <p className="text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--eyebrow)' }}>Paper section</p>
          <h3 className="text-2xl font-semibold mb-3" style={{ ...display, color: 'var(--ink)' }}>A heading in teal ink</h3>
          <p className="text-sm leading-relaxed mb-5 max-w-md" style={{ color: 'var(--ink-soft)' }}>
            Body copy sits on warm paper in a muted teal grey. Easy to read, warm, and human. Coral shows up once, where the click is.
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold" style={{ background: 'var(--coral)', color: '#ffffff' }}>
            Shop engraved goods
          </button>
        </div>

        <div className="rounded-sm p-8" style={{ background: 'var(--feature)' }}>
          <p className="text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--accent)' }}>Feature section</p>
          <h3 className="text-2xl font-semibold mb-3" style={{ ...display, color: 'var(--feature-ink)' }}>A deep teal block punctuates the paper</h3>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(222,214,195,0.8)' }}>
            The dark teal sections are where glassy teal accents and the backlit look live. Oatmeal text on deep teal. This is the cool, precise half of the brand.
          </p>
        </div>

      </div>
    </div>
  )
}
