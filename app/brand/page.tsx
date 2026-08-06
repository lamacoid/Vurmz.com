import type { Metadata } from 'next'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid'
import { Button, Pill, Badge, Card, Input, Eyebrow, Rows, Row } from '@/components/ui'
import { Frame } from '@/components/templates'

export const metadata: Metadata = {
  title: 'VURMZ Kit',
  robots: { index: false, follow: false },
}

/**
 * The kit, rendered from the real components. This page is not a picture of
 * the design system, it IS the design system: every swatch and control below
 * is the same import a page uses. If something here looks wrong, the site
 * looks wrong, and fixing it here fixes it everywhere.
 */

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

const PALETTE = [
  { name: 'Paper', value: '#DED6C3', note: 'the ground under everything, 55%' },
  { name: 'Surface', value: '#FFFDF8', note: 'cards and panels' },
  { name: 'Ink', value: '#16525C', note: 'type and rules, 30%' },
  { name: 'Deepest', value: '#123F47', note: 'bands and image grounds' },
  { name: 'Soft ink', value: '#4F5D5B', note: 'body copy and row values' },
  { name: 'Glass tint', value: 'rgba(127,207,212,.18)', note: 'how a panel lifts' },
  { name: 'Coral', value: '#C67A6F', note: 'one action per view, 12%' },
  { name: 'Laser red', value: '#FF2A2A', note: 'marks only, never a button' },
]

const TYPE = [
  { label: 'Display 46', cls: 'text-[length:var(--step-display)] tracking-[-0.02em]', serif: true, note: 'Fraunces 600' },
  { label: 'Section 30', cls: 'text-[length:var(--step-section)]', serif: true, note: 'Fraunces 600' },
  { label: 'Panel title 19', cls: 'text-[length:var(--step-panel)]', serif: true, note: 'Fraunces 600' },
  { label: 'Lead 17', cls: 'text-[length:var(--step-lead)] leading-[1.7]', serif: false, note: 'Inter 400, ~56 characters' },
  { label: 'Body 15', cls: 'text-[length:var(--step-body)] leading-[1.65]', serif: false, note: 'Inter 400' },
  { label: 'Row 14.5', cls: 'text-[length:var(--step-row)]', serif: false, note: 'Inter 400 / 600' },
  { label: 'Fine 13.5', cls: 'text-[length:var(--step-fine)]', serif: false, note: 'the floor, nothing smaller' },
]

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-14 sm:py-[72px] border-t border-[var(--hairline)] first:border-t-0">
      <Frame>
        <h2 className="text-[length:var(--step-section)] font-semibold tracking-[-0.01em] text-[var(--ink)] mb-8" style={display}>
          {title}
        </h2>
        {children}
      </Frame>
    </section>
  )
}

export default function KitPage() {
  return (
    <div className="bg-[var(--page)] text-[var(--ink)] min-h-screen">
      <Frame className="pt-16 pb-4">
        <Eyebrow>Internal &middot; not indexed</Eyebrow>
        <h1 className="mt-3.5 text-[length:var(--step-display)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance" style={display}>
          The kit.
        </h1>
        <p className="mt-5 max-w-[var(--measure)] text-[length:var(--step-lead)] leading-[1.7] text-[var(--ink-soft)]">
          One ground, one scale, one curve. Everything below is rendered from the
          same components the site uses, so this page cannot drift from the site.
        </p>
      </Frame>

      <Block title="Palette, and the mix">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {PALETTE.map(c => (
            <div key={c.name}>
              <div
                className="h-20 rounded-[var(--r-tile)] border border-[var(--hairline)]"
                style={{ background: c.value }}
              />
              <p className="mt-2.5 text-[length:var(--step-row)] font-semibold">{c.name}</p>
              <p className="font-mono text-[length:var(--step-fine)] text-[var(--ink-soft)]">{c.value}</p>
              <p className="text-[length:var(--step-fine)] text-[var(--ink-soft)]">{c.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[var(--measure)] text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">
          It is a mix, not a set. Roughly 55 oatmeal, 30 teal, 12 coral, and the
          rest laser red. Deep teal is a surface you place on the paper, never a
          second mode the page flips into.
        </p>
      </Block>

      <Block title="Type scale">
        <div className="flex flex-col gap-5">
          {TYPE.map(t => (
            <div key={t.label} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-[var(--hairline)] pb-4 last:border-b-0">
              <span className={`${t.cls} font-semibold`} style={t.serif ? display : undefined}>
                Engraved to spec
              </span>
              <span className="ml-auto font-mono text-[length:var(--step-fine)] text-[var(--ink-soft)] tracking-[0.14em] uppercase">
                {t.label} &middot; {t.note}
              </span>
            </div>
          ))}
          <div className="flex items-baseline gap-6">
            <Eyebrow>Eyebrow 11, tracked .26em</Eyebrow>
          </div>
        </div>
      </Block>

      <Block title="Actions">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="coral">Send me the artwork</Button>
          <Button variant="teal">For business</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="ghost">Quiet</Button>
          <Button variant="imessage" icon={<ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />}>Text me</Button>
          <Button variant="coral" disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <Button variant="coral" size="sm">Small</Button>
          <Button variant="coral" size="md">Medium</Button>
          <Button variant="coral" size="lg">Large</Button>
        </div>
        <div className="max-w-xs mt-5">
          <Button variant="coral" fullWidth>Full width, in a rail</Button>
        </div>
        <p className="mt-6 max-w-[var(--measure)] text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">
          Coral is the one real action on a view. Press sinks 1px. Buttons stay
          flat: no gradient, no shadow, no scale. Three depth treatments were
          tried and all three failed at real size.
        </p>
      </Block>

      <Block title="Selection and status">
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill active>Active</Pill>
          <Pill>Outline</Pill>
          <Pill tone="soft">Soft</Pill>
          <Pill tone="coral">Coral</Pill>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 mt-5">
          <Badge>1 of 1</Badge>
          <Badge tone="teal">Live</Badge>
          <Badge tone="coral">Proof pending</Badge>
        </div>
        <div className="max-w-sm mt-6">
          <Input id="kit-email" label="Email address" placeholder="you@example.com" hint="The field, at its shipped size." />
        </div>
        <p className="mt-6 max-w-[var(--measure)] text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">
          A pill is a choice the visitor makes. A badge states a fact they cannot
          change. Filters are always pills, never a sidebar of checkboxes.
        </p>
      </Block>

      <Block title="Surfaces">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="paper" padding="md" interactive>
            <p className="text-[length:var(--step-panel)] font-semibold" style={display}>Paper, interactive</p>
            <p className="mt-2 text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">
              One line of supporting copy, then the value the customer came for.
            </p>
            <p className="mt-3 text-[length:var(--step-panel)] font-semibold">$38</p>
          </Card>

          <Card variant="flat" padding="md">
            <Eyebrow tone="ink">Flat, the quiet panel</Eyebrow>
            <Rows className="mt-3.5">
              <Row label="Next delivery run" value="Wed" />
              <Row label="Typical turnaround" value="72 hrs" />
              <Row label="Setup fees" value="None" />
            </Rows>
          </Card>

          <Card variant="feature" padding="md">
            <Eyebrow tone="glass">On dark</Eyebrow>
            <p className="mt-3 text-[length:var(--step-body)] leading-[1.65] text-[var(--feature-soft)]">
              Teal ground, oatmeal type, glassy teal for the eyebrow. Coral stays
              the action here too.
            </p>
            <div className="mt-4">
              <Button variant="coral" size="sm">The action</Button>
            </div>
          </Card>
        </div>
        <p className="mt-6 max-w-[var(--measure)] text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">
          Radii step up with the size of the thing: 4 on controls, 8 on tiles, 12
          on panels, 18 on full-bleed bands.
        </p>
      </Block>

      <Block title="Rhythm">
        <Card variant="paper" padding="lg">
          <Eyebrow>A section ends</Eyebrow>
          <p className="mt-3 text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">
            Then 56 to 72 pixels of air, never less than 44.
          </p>
          <div className="my-10 border-t border-[var(--hairline)]" />
          <Eyebrow>The next one opens on its eyebrow</Eyebrow>
          <p className="mt-3 max-w-[var(--measure)] text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">
            Never two borders in a row, never a shadow to separate. Air first,
            then one hairline, then a tint change only if the section really is a
            different kind of thing.
          </p>
        </Card>
      </Block>

      <Block title="Three templates">
        <Rows>
          <Row label="A · Landing" leader value="Eyebrow, display, lead, one primary, image band, three-up, quiet panel, teal closing band" />
          <Row label="B · Index with rail" leader value="Filter pills, the listing on 9 columns, a sticky rail on 3 holding the summary and the only primary" />
          <Row label="C · Detail, two up" leader value="Media left, decisions right, glassy spec panel, one primary and one quiet alternate, related work closes" />
        </Rows>
        <p className="mt-6 max-w-[var(--measure)] text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">
          Landing covers home, services and about. Index covers the shop and the
          portfolio. Detail covers a product, a piece, a service. Everything else
          is a variant of one of the three, which is what keeps a page added next
          year sitting at the same rhythm as the ones built today.
        </p>
      </Block>
    </div>
  )
}
