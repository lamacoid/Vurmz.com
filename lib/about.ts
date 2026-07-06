import { siteInfo } from './site-info'

// Zach's own story, in his words (2026-07-05). Every sentence is a fact
// from his life; nothing manufactured. Menu-minimalist: three short
// paragraphs, the pillars as three words, no explainer cards.
export const aboutContent = {
  headline: 'I stumbled into this making things for another project.',

  storyParagraphs: [
    `I wanted to make some custom cards myself instead of ordering them. I like doing things myself, to a fault: to this day I haven't watched a single YouTube video on laser engraving. I'd have learned faster. I learn more thoroughly this way. One machine led to another, and it hasn't stopped.`,
    `VURMZ was an inside joke in high school, then my gamer tag, and now it's on the invoices and the license plate. Yes, it sounds like worms. It's also very easy to Google.`,
    `I'm one person. I've lived in Centennial since before it was Centennial, and you might catch the plate around town. When you text me, you're texting the guy holding the laser.`,
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
