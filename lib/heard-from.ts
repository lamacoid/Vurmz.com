/**
 * "How did you hear about VURMZ?" Asked on the quote form, the contact
 * form, and checkout (added 2026-11-11, after a customer said ChatGPT sent
 * him). Optional everywhere. The answer rides the message or the order
 * notes as one line with a fixed prefix, so it shows up where Zach already
 * reads and can be counted later with a search for the prefix.
 */
export const HEARD_FROM = [
  'ChatGPT or another AI assistant',
  'Google search',
  'Google Maps',
  'Bing or another search engine',
  'A friend or another business',
  'Saw a piece you made',
  'Instagram or Facebook',
  'Something else',
] as const

export const HEARD_PREFIX = 'Heard about VURMZ:'

export function heardLine(value: string): string {
  const v = (HEARD_FROM as readonly string[]).includes(value) ? value : ''
  return v ? `${HEARD_PREFIX} ${v}` : ''
}
