import Image from 'next/image'

/**
 * One etching from the sheet, contained in its box. The sheet is cream
 * (for the teal room); on the paper ground the same drawing is served in
 * deep teal ink from the -ink files made alongside.
 */
export default function EtchArt({ src, alt = '', className = '', sizes = '(max-width: 640px) 60vw, 300px', tone = 'ink' }: { src: string; alt?: string; className?: string; sizes?: string; tone?: 'ink' | 'cream' }) {
  const file = tone === 'ink' ? src.replace(/\.png$/, '-ink.png') : src
  // A watermark passes its own position (absolute). Only add relative when
  // the caller did not position it, or the box lands in the flow and opens
  // a gap above the text (the mobile BYOT band, fixed 2026-10-26).
  const positioned = /\b(absolute|fixed|sticky)\b/.test(className)
  return (
    <div className={positioned ? className : `relative ${className}`}>
      <Image src={file} alt={alt} fill sizes={sizes} className="object-contain" />
    </div>
  )
}
