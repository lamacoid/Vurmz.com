import { siteInfo } from './site-info'

export const aboutContent = {
  headline: 'No department. Just me.',
  subhead: 'Just me.',

  intro: `I'm ${siteInfo.founder.name}, and I run VURMZ out of ${siteInfo.city}. I live here, I work here, and I deliver to Centennial, Lone Tree, Highlands Ranch, and everywhere in between. You text me, I quote you, and I handle your job personally.`,

  storyParagraphs: [
    `Got into it for fun. Turns out it's worth getting into for work. I started VURMZ because I wanted to build something with my hands. Laser engraving lets me take a blank piece of metal, wood, or glass and turn it into something personal that lasts. Every mark is permanent. That matters to me.`,
    `There's no team, no warehouse, no middleman. When you text ${siteInfo.phone}, you're texting the person who's going to engrave your order, drive it to your door, and hand it to you. That's how I want it.`,
    `I work with individuals who want a meaningful gift and businesses who want their brand on something people keep. Whether it's one knife or sixty pens, I treat every job the same. I don't deliver until it's right.`,
    `VURMZ is based in ${siteInfo.city}, Colorado. I deliver across the South Denver metro: Littleton, Lone Tree, Parker, Highlands Ranch, Englewood, Castle Rock, Aurora, Greenwood Village, Cherry Hills, and Denver.`,
  ],

  values: [
    {
      title: 'Personal Service',
      description: 'Every job is handled by one person. No handoffs, no departments. You text me, I quote you, I engrave it, I deliver it.',
    },
    {
      title: 'Permanence',
      description: "Laser engraving is etched into the material itself. It doesn't fade, peel, or wash off. It's there for as long as the item exists.",
    },
    {
      title: 'Local First',
      description: `Based in ${siteInfo.city}, delivering across the South Denver metro. I'm your neighbor, not a shipping label.`,
    },
  ],

  process: [
    { step: 1, title: 'Text me', description: 'Send a text with what you want. Photos help.' },
    { step: 2, title: 'I quote you', description: 'Fast, transparent pricing. No setup fees, no surprises.' },
    { step: 3, title: 'I engrave it', description: 'One person handles your job from setup to finish. No outsourcing, no handoffs.' },
    { step: 4, title: 'Hand-delivered', description: 'I deliver to you across the South Denver metro. No shipping, no waiting.' },
  ],

  image: '/images/zach.jpeg',
} as const
