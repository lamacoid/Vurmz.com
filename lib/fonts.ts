// Shared font options for all product designers
// These fonts are web-safe or commonly available system fonts
// Engraving exposes silver metal underneath the coating

export const ENGRAVING_COLOR = '#c0c0c0'
export const ENGRAVING_COLOR_DARK = '#a0a0a0'

export interface FontOption {
  value: string
  label: string
  category: 'sans' | 'serif' | 'display' | 'script' | 'specialty'
  style: React.CSSProperties
}

export const fontOptions: FontOption[] = [
  // SANS-SERIF - Clean & Modern
  {
    value: 'arial',
    label: 'Clean Sans',
    category: 'sans',
    style: { fontFamily: 'Arial, Helvetica, sans-serif' }
  },
  {
    value: 'helvetica',
    label: 'Helvetica',
    category: 'sans',
    style: { fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }
  },
  {
    value: 'futura',
    label: 'Futura',
    category: 'sans',
    style: { fontFamily: 'Futura, Century Gothic, sans-serif' }
  },
  {
    value: 'verdana',
    label: 'Verdana',
    category: 'sans',
    style: { fontFamily: 'Verdana, Geneva, sans-serif' }
  },

  // SERIF - Classic & Professional
  {
    value: 'times',
    label: 'Times Classic',
    category: 'serif',
    style: { fontFamily: 'Times New Roman, Times, serif' }
  },
  {
    value: 'georgia',
    label: 'Georgia',
    category: 'serif',
    style: { fontFamily: 'Georgia, Palatino, serif' }
  },
  {
    value: 'palatino',
    label: 'Palatino',
    category: 'serif',
    style: { fontFamily: 'Palatino Linotype, Palatino, serif' }
  },
  {
    value: 'garamond',
    label: 'Garamond',
    category: 'serif',
    style: { fontFamily: 'Garamond, Baskerville, serif' }
  },

  // DISPLAY - Bold & Impactful
  {
    value: 'impact',
    label: 'Impact Bold',
    category: 'display',
    style: { fontFamily: 'Impact, Haettenschweiler, sans-serif' }
  },
  {
    value: 'arial-black',
    label: 'Arial Black',
    category: 'display',
    style: { fontFamily: 'Arial Black, Gadget, sans-serif', fontWeight: 900 }
  },
  {
    value: 'rockwell',
    label: 'Rockwell Slab',
    category: 'display',
    style: { fontFamily: 'Rockwell, Courier Bold, serif' }
  },
  {
    value: 'copperplate',
    label: 'Copperplate',
    category: 'display',
    style: { fontFamily: 'Copperplate, Copperplate Gothic Light, serif', letterSpacing: '2px' }
  },

  // SCRIPT & ELEGANT
  {
    value: 'brush-script',
    label: 'Brush Script',
    category: 'script',
    style: { fontFamily: 'Brush Script MT, cursive' }
  },
  {
    value: 'lucida-handwriting',
    label: 'Handwriting',
    category: 'script',
    style: { fontFamily: 'Lucida Handwriting, cursive' }
  },
  {
    value: 'snell',
    label: 'Snell Roundhand',
    category: 'script',
    style: { fontFamily: 'Snell Roundhand, cursive' }
  },
  {
    value: 'zapfino',
    label: 'Zapfino Elegant',
    category: 'script',
    style: { fontFamily: 'Zapfino, Apple Chancery, cursive' }
  },

  // SPECIALTY - Unique Styles
  {
    value: 'courier',
    label: 'Typewriter',
    category: 'specialty',
    style: { fontFamily: 'Courier New, Courier, monospace' }
  },
  {
    value: 'stencil',
    label: 'Stencil',
    category: 'specialty',
    style: { fontFamily: 'Stencil Std, Stencil, Impact, sans-serif', letterSpacing: '1px' }
  },
  {
    value: 'optima',
    label: 'Optima',
    category: 'specialty',
    style: { fontFamily: 'Optima, Segoe UI, sans-serif' }
  },
  {
    value: 'didot',
    label: 'Didot Modern',
    category: 'specialty',
    style: { fontFamily: 'Didot, Bodoni MT, serif' }
  },
]

// Group fonts by category for UI display
export const fontsByCategory = {
  sans: fontOptions.filter(f => f.category === 'sans'),
  serif: fontOptions.filter(f => f.category === 'serif'),
  display: fontOptions.filter(f => f.category === 'display'),
  script: fontOptions.filter(f => f.category === 'script'),
  specialty: fontOptions.filter(f => f.category === 'specialty'),
}

export const categoryLabels = {
  sans: 'Clean & Modern',
  serif: 'Classic & Professional',
  display: 'Bold & Impactful',
  script: 'Script & Elegant',
  specialty: 'Specialty Styles',
}
