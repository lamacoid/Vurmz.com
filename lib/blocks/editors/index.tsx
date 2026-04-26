'use client'
import type { BlockPropsMap, BlockType } from '../types'
import { TextField, SelectField, ImagePickerField, LinkListField, CheckField } from './shared'

/**
 * Generic prop editor — maps block type → controls.
 * The `onChange` callback receives the entire new props object.
 */
type EditorProps<T extends BlockType> = {
  props: BlockPropsMap[T]
  onChange: (p: BlockPropsMap[T]) => void
}

export function EditHero({ props, onChange }: EditorProps<'Hero'>) {
  return (
    <>
      <TextField label="Eyebrow (small uppercase text)" value={props.eyebrow ?? ''} onChange={v => onChange({ ...props, eyebrow: v || undefined })} />
      <TextField label="Title" value={props.title} onChange={v => onChange({ ...props, title: v })} />
      <TextField label="Subtitle" value={props.subtitle ?? ''} onChange={v => onChange({ ...props, subtitle: v || undefined })} multiline />
      <SelectField
        label="Alignment"
        value={props.alignment ?? 'left'}
        onChange={v => onChange({ ...props, alignment: v })}
        options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }]}
      />
      <ImagePickerField
        label="Background image"
        value={props.background}
        onChange={v => onChange({ ...props, background: v })}
      />
      <LinkListField label="Buttons" value={props.ctas ?? []} onChange={v => onChange({ ...props, ctas: v })} />
    </>
  )
}

export function EditRichText({ props, onChange }: EditorProps<'RichText'>) {
  return (
    <>
      <TextField label="Markdown" value={props.markdown} onChange={v => onChange({ ...props, markdown: v })} multiline />
      <SelectField
        label="Width"
        value={props.maxWidth ?? 'regular'}
        onChange={v => onChange({ ...props, maxWidth: v })}
        options={[
          { value: 'narrow', label: 'Narrow' },
          { value: 'regular', label: 'Regular' },
          { value: 'wide', label: 'Wide' },
        ]}
      />
    </>
  )
}

export function EditCTA({ props, onChange }: EditorProps<'CTA'>) {
  return (
    <>
      <TextField label="Title" value={props.title} onChange={v => onChange({ ...props, title: v })} />
      <TextField label="Body" value={props.body ?? ''} onChange={v => onChange({ ...props, body: v || undefined })} multiline />
      <SelectField
        label="Color style"
        value={props.style ?? 'teal'}
        onChange={v => onChange({ ...props, style: v })}
        options={[
          { value: 'teal', label: 'Teal (services)' },
          { value: 'coral', label: 'Coral (shop)' },
          { value: 'cream', label: 'Cream' },
        ]}
      />
      <LinkListField label="Buttons" value={props.links} onChange={v => onChange({ ...props, links: v })} />
    </>
  )
}

export function EditSpacer({ props, onChange }: EditorProps<'Spacer'>) {
  return (
    <SelectField
      label="Size"
      value={props.size ?? 'md'}
      onChange={v => onChange({ ...props, size: v })}
      options={[
        { value: 'xs', label: 'Extra small' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra large' },
      ]}
    />
  )
}

export function EditImage({ props, onChange }: EditorProps<'Image'>) {
  return (
    <>
      <ImagePickerField label="Image" value={props.media} onChange={v => onChange({ ...props, media: v ?? { url: '' } })} />
      <TextField label="Caption" value={props.caption ?? ''} onChange={v => onChange({ ...props, caption: v || undefined })} />
      <SelectField
        label="Layout"
        value={props.layout ?? 'inset'}
        onChange={v => onChange({ ...props, layout: v })}
        options={[
          { value: 'narrow', label: 'Narrow' },
          { value: 'inset', label: 'Inset' },
          { value: 'full-bleed', label: 'Full bleed' },
        ]}
      />
    </>
  )
}

export function EditTwoColumn({ props, onChange }: EditorProps<'TwoColumn'>) {
  return (
    <>
      <div className="border border-white/5 rounded p-3 mb-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Left column</p>
        <SelectField
          label="Content type"
          value={props.left.kind}
          onChange={v => onChange({ ...props, left: { ...props.left, kind: v } })}
          options={[{ value: 'text', label: 'Text' }, { value: 'image', label: 'Image' }]}
        />
        {props.left.kind === 'text' ? (
          <TextField label="Markdown" value={props.left.markdown ?? ''} onChange={v => onChange({ ...props, left: { ...props.left, markdown: v } })} multiline />
        ) : (
          <ImagePickerField label="Image" value={props.left.media} onChange={v => onChange({ ...props, left: { ...props.left, media: v } })} />
        )}
      </div>
      <div className="border border-white/5 rounded p-3 mb-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Right column</p>
        <SelectField
          label="Content type"
          value={props.right.kind}
          onChange={v => onChange({ ...props, right: { ...props.right, kind: v } })}
          options={[{ value: 'text', label: 'Text' }, { value: 'image', label: 'Image' }]}
        />
        {props.right.kind === 'text' ? (
          <TextField label="Markdown" value={props.right.markdown ?? ''} onChange={v => onChange({ ...props, right: { ...props.right, markdown: v } })} multiline />
        ) : (
          <ImagePickerField label="Image" value={props.right.media} onChange={v => onChange({ ...props, right: { ...props.right, media: v } })} />
        )}
      </div>
      <SelectField
        label="Vertical alignment"
        value={props.verticalAlign ?? 'center'}
        onChange={v => onChange({ ...props, verticalAlign: v })}
        options={[
          { value: 'top', label: 'Top' },
          { value: 'center', label: 'Center' },
          { value: 'bottom', label: 'Bottom' },
        ]}
      />
    </>
  )
}

export function EditCustomHTML({ props, onChange }: EditorProps<'CustomHTML'>) {
  return (
    <>
      <TextField label="HTML" value={props.html} onChange={v => onChange({ ...props, html: v })} multiline />
      <CheckField label="Allow <script> tags (advanced)" value={props.allowScripts ?? false} onChange={v => onChange({ ...props, allowScripts: v })} />
    </>
  )
}

export const editorRegistry: Record<BlockType, React.FC<{ props: unknown; onChange: (p: unknown) => void }>> = {
  Hero: EditHero as React.FC<{ props: unknown; onChange: (p: unknown) => void }>,
  RichText: EditRichText as React.FC<{ props: unknown; onChange: (p: unknown) => void }>,
  CTA: EditCTA as React.FC<{ props: unknown; onChange: (p: unknown) => void }>,
  Spacer: EditSpacer as React.FC<{ props: unknown; onChange: (p: unknown) => void }>,
  Image: EditImage as React.FC<{ props: unknown; onChange: (p: unknown) => void }>,
  TwoColumn: EditTwoColumn as React.FC<{ props: unknown; onChange: (p: unknown) => void }>,
  CustomHTML: EditCustomHTML as React.FC<{ props: unknown; onChange: (p: unknown) => void }>,
}
