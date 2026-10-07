import { siteInfo } from './site-info'

// Zach's story, flattened 2026-07-16 on his call: facts only, no quips.
// Every sentence is still true; the winks are gone. Menu-minimalist:
// three short paragraphs, the pillars as three words, no explainer cards.
export const aboutContent = {
  headline: 'I stumbled into this making things for another project.',

  storyParagraphs: [
    `I wanted custom cards for another project and decided to make them myself. I taught myself the machine. One led to another, and it hasn't stopped.`,
    `VURMZ started as a nickname in high school. Now it's the name on the invoices.`,
    `I've lived in Centennial most of my life. Every job is quoted, made, and delivered from here.`,
  ],

  pillars: 'Local. Thoughtful. Fast.',

  image: '/images/zach.jpeg',
} as const

export const aboutMeta = {
  description: `Meet ${siteInfo.founder.name}, the person behind VURMZ. Laser engraving in ${siteInfo.city}, Colorado. Local. Thoughtful. Fast.`,
}
