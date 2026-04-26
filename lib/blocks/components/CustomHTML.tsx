import type { BlockPropsMap } from '../types'

/**
 * Admin-authored raw HTML. Sanitization happens on write in the editor API,
 * not on render — we trust what's in the DB. If allowScripts is false we also
 * strip <script> at render as defense in depth.
 */
function stripScripts(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
}

export default function CustomHTML({ props }: { props: BlockPropsMap['CustomHTML'] }) {
  const html = props.allowScripts ? props.html : stripScripts(props.html)
  return (
    <section className="py-4">
      <div
        className="max-w-5xl mx-auto px-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}
