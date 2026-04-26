/**
 * Block schemas — one zod schema per block type.
 * Block instance = { id, type, props } where props must match the schema.
 */
import { z } from 'zod'

const mediaRefSchema = z.object({
  mediaId: z.string().optional(),
  url: z.string().optional(),
  alt: z.string().optional(),
})

const linkSchema = z.object({
  href: z.string(),
  label: z.string(),
  newTab: z.boolean().optional(),
  variant: z.enum(['primary', 'secondary', 'ghost']).optional(),
})

export const blockSchemas = {
  Hero: z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    subtitle: z.string().optional(),
    alignment: z.enum(['left', 'center']).default('left'),
    background: mediaRefSchema.optional(),
    ctas: z.array(linkSchema).default([]),
  }),

  RichText: z.object({
    markdown: z.string(),
    maxWidth: z.enum(['narrow', 'regular', 'wide']).default('regular'),
  }),

  CTA: z.object({
    title: z.string(),
    body: z.string().optional(),
    links: z.array(linkSchema).min(1),
    style: z.enum(['teal', 'coral', 'cream']).default('teal'),
  }),

  Spacer: z.object({
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).default('md'),
  }),

  Image: z.object({
    media: mediaRefSchema,
    caption: z.string().optional(),
    layout: z.enum(['inset', 'full-bleed', 'narrow']).default('inset'),
  }),

  TwoColumn: z.object({
    left: z.object({
      kind: z.enum(['text', 'image']),
      markdown: z.string().optional(),
      media: mediaRefSchema.optional(),
    }),
    right: z.object({
      kind: z.enum(['text', 'image']),
      markdown: z.string().optional(),
      media: mediaRefSchema.optional(),
    }),
    verticalAlign: z.enum(['top', 'center', 'bottom']).default('center'),
  }),

  CustomHTML: z.object({
    html: z.string(),
    allowScripts: z.boolean().default(false),
  }),
} as const

export type BlockType = keyof typeof blockSchemas
export type BlockPropsMap = {
  [K in BlockType]: z.infer<(typeof blockSchemas)[K]>
}

export interface Block<T extends BlockType = BlockType> {
  id: string
  type: T
  props: BlockPropsMap[T]
  visibility?: {
    mobile?: boolean
    desktop?: boolean
    adminOnly?: boolean
  }
}

export function isBlockType(type: string): type is BlockType {
  return type in blockSchemas
}

export function validateBlock(block: unknown): block is Block {
  if (typeof block !== 'object' || block === null) return false
  const b = block as { type?: string; id?: string; props?: unknown }
  if (typeof b.type !== 'string' || typeof b.id !== 'string') return false
  if (!isBlockType(b.type)) return false
  const parsed = blockSchemas[b.type].safeParse(b.props)
  return parsed.success
}
