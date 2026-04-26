import type { BlockPropsMap } from '../types'

/**
 * Minimal markdown renderer — paragraphs, headings, bold, italic, links, lists.
 * Intentionally small; swap to `marked` later if we need full spec.
 */
function renderMarkdown(md: string): string {
  let html = md.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Headings
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>')
  // Bold / italic / links
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  // Lists (simple, unnested)
  html = html.replace(/(^|\n)((?:- [^\n]+\n?)+)/g, (_m, pre, block: string) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')
    return `${pre}<ul>${items}</ul>`
  })
  // Paragraphs
  html = html.split(/\n{2,}/).map(p => {
    if (/^<(h\d|ul|ol|p|blockquote)/.test(p)) return p
    return `<p>${p.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')
  return html
}

const widthClass: Record<'narrow' | 'regular' | 'wide', string> = {
  narrow: 'max-w-2xl',
  regular: 'max-w-3xl',
  wide: 'max-w-5xl',
}

export default function RichText({ props }: { props: BlockPropsMap['RichText'] }) {
  const html = renderMarkdown(props.markdown)
  return (
    <section className="py-8">
      <div
        className={`${widthClass[props.maxWidth ?? 'regular']} mx-auto px-6 prose-vurmz`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}
