import Image from 'next/image'

/** One etching from the sheet, contained in its box, cream on the glass. */
export default function EtchArt({ src, alt = '', className = '', sizes = '(max-width: 640px) 60vw, 300px' }: { src: string; alt?: string; className?: string; sizes?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-contain" />
    </div>
  )
}
