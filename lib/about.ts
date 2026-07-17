import { siteInfo } from './site-info'

// Zach's story, flattened 2026-07-16 on his call: facts only, no quips.
// Every sentence is still true; the winks are gone. Menu-minimalist:
// three short paragraphs, the pillars as three words, no explainer cards.
export const aboutContent = {
  headline: 'I stumbled into this making things for another project.',

  storyParagraphs: [
    `I wanted custom cards for another project and decided to make them myself. I taught myself the machine. One led to another, and it hasn't stopped.`,
    `VURMZ started as a nickname in high school. Now it's the name on the invoices.`,
    `I'm one person. I've lived in Centennial most of my life, and I handle every job myself, from the first text to the delivery.`,
  ],

  pillars: 'Local. Thoughtful. Fast.',

  process: [
    { step: 1, title: 'Text me', description: 'Send a text with what you want. Photos help.' },
    { step: 2, title: 'I quote you', description: 'Fast, transparent pricing. No setup fees, no surprises.' },
    { step: 3, title: 'I engrave it', description: 'One person handles your job from setup to finish.' },
    { step: 4, title: 'Hand-delivered', description: `Across the South Denver metro, by me.` },
  ],

  image: '/images/zach.jpeg',
} as const

export const aboutMeta = {
  description: `Meet ${siteInfo.founder.name}, the person behind VURMZ. One-person laser engraving shop in ${siteInfo.city}, Colorado. Local. Thoughtful. Fast.`,
}
