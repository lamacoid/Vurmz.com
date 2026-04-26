/**
 * Block registry — maps block type → { component, schema, label, category }.
 * Used by the renderer on the public side and by the editor inserter in Chunk 1.
 */
import type { ComponentType } from 'react'
import { blockSchemas } from './types'
import type { BlockType } from './types'

import Hero from './components/Hero'
import RichText from './components/RichText'
import CTA from './components/CTA'
import Spacer from './components/Spacer'
import ImageBlock from './components/Image'
import TwoColumn from './components/TwoColumn'
import CustomHTML from './components/CustomHTML'

export interface BlockDefinition {
  type: BlockType
  label: string
  category: 'layout' | 'content' | 'media' | 'interactive' | 'advanced'
  description: string
  component: ComponentType<{ props: unknown }>
  schema: (typeof blockSchemas)[BlockType]
  defaultProps: unknown
}

export const registry: Record<BlockType, BlockDefinition> = {
  Hero: {
    type: 'Hero',
    label: 'Hero',
    category: 'content',
    description: 'Big title, subtitle, and CTAs at the top of a page.',
    component: Hero as ComponentType<{ props: unknown }>,
    schema: blockSchemas.Hero,
    defaultProps: { title: 'Headline goes here', alignment: 'left', ctas: [] },
  },
  RichText: {
    type: 'RichText',
    label: 'Rich Text',
    category: 'content',
    description: 'Paragraphs, headings, lists, and links via Markdown.',
    component: RichText as ComponentType<{ props: unknown }>,
    schema: blockSchemas.RichText,
    defaultProps: { markdown: '## A section title\n\nWrite your content here.', maxWidth: 'regular' },
  },
  CTA: {
    type: 'CTA',
    label: 'Call to Action',
    category: 'content',
    description: 'Prominent action block with one or more buttons.',
    component: CTA as ComponentType<{ props: unknown }>,
    schema: blockSchemas.CTA,
    defaultProps: { title: 'Ready to start?', links: [{ href: '/contact', label: 'Get in touch' }], style: 'teal' },
  },
  Spacer: {
    type: 'Spacer',
    label: 'Spacer',
    category: 'layout',
    description: 'Add vertical whitespace between sections.',
    component: Spacer as ComponentType<{ props: unknown }>,
    schema: blockSchemas.Spacer,
    defaultProps: { size: 'md' },
  },
  Image: {
    type: 'Image',
    label: 'Image',
    category: 'media',
    description: 'A single image with optional caption.',
    component: ImageBlock as ComponentType<{ props: unknown }>,
    schema: blockSchemas.Image,
    defaultProps: { media: { url: '' }, layout: 'inset' },
  },
  TwoColumn: {
    type: 'TwoColumn',
    label: 'Two Column',
    category: 'layout',
    description: 'Side-by-side text or image columns.',
    component: TwoColumn as ComponentType<{ props: unknown }>,
    schema: blockSchemas.TwoColumn,
    defaultProps: {
      left: { kind: 'text', markdown: '## Left column' },
      right: { kind: 'text', markdown: '## Right column' },
      verticalAlign: 'center',
    },
  },
  CustomHTML: {
    type: 'CustomHTML',
    label: 'Custom HTML',
    category: 'advanced',
    description: 'Raw HTML for embeds (Calendly, YouTube, Square, etc). Admin only.',
    component: CustomHTML as ComponentType<{ props: unknown }>,
    schema: blockSchemas.CustomHTML,
    defaultProps: { html: '<!-- paste embed code here -->', allowScripts: false },
  },
}

export const allBlockDefinitions: BlockDefinition[] = Object.values(registry)

export function getBlockDefinition(type: BlockType): BlockDefinition {
  return registry[type]
}
