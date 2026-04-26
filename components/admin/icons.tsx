/**
 * Admin icon set — inline SVGs keyed by name. Small & tree-shakable;
 * avoid pulling in a full icon lib for the handful we need.
 */
import type { SVGProps } from 'react'

const paths: Record<string, string> = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z',
  chart: 'M4 20V8m6 12V4m6 16v-8m6 8v-12',
  doc: 'M6 3h9l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm9 0v5h5',
  image: 'M3 5h18v14H3V5Zm0 10 6-6 5 5 3-3 4 4',
  palette: 'M12 3a9 9 0 1 0 0 18c1.3 0 2-1 2-2a2 2 0 0 0-1-1.7c-.5-.3-.5-1 0-1.3l.7-.4c.4-.3.9-.4 1.4-.3 1.8.3 3.9-.8 3.9-3.3A9 9 0 0 0 12 3Zm-5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  settings: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5c0 .6 0 1.2-.1 1.8l2.1 1.6-2 3.5-2.5-1c-.9.7-1.9 1.2-3 1.5L14 22h-4l-.5-2.6c-1.1-.3-2.1-.8-3-1.5l-2.5 1-2-3.5 2.1-1.6A8 8 0 0 1 4 12c0-.6 0-1.2.1-1.8L2 8.6l2-3.5 2.5 1c.9-.7 1.9-1.2 3-1.5L10 2h4l.5 2.6c1.1.3 2.1.8 3 1.5l2.5-1 2 3.5-2.1 1.6c.1.6.1 1.2.1 1.8Z',
  tag: 'M20 13.5 13.5 20a1.4 1.4 0 0 1-2 0L3 11.5V3h8.5L20 11.5a1.4 1.4 0 0 1 0 2ZM7.5 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  cart: 'M3 4h2l2.7 13.4a1 1 0 0 0 1 .8h10.6a1 1 0 0 0 1-.8L22 8H6M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  box: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9ZM3 7.5 12 12m0 0 9-4.5M12 12v9',
  'file-text': 'M6 3h9l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm9 0v5h5M8 13h8M8 17h5',
  briefcase: 'M3 7h18v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Zm5 0V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 12h18',
  layers: 'M12 3 2 8l10 5 10-5-10-5ZM2 13l10 5 10-5M2 18l10 5 10-5',
  'file-invoice': 'M6 3h9l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm9 0v5h5M8 12h8M8 16h4',
  dollar: 'M12 2v20m6-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13a1 1 0 0 1 .9.6L22 12v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7l2.6-6.4a1 1 0 0 1 .9-.6Z',
  search: 'M11 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm7-2 4 4',
  plus: 'M12 5v14m-7-7h14',
  x: 'M6 6l12 12M18 6 6 18',
  logout: 'M16 17 21 12l-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
  chevron: 'm9 18 6-6-6-6',
}

export function Icon({ name, ...rest }: { name: string } & SVGProps<SVGSVGElement>) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}
