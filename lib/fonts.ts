// Shared font options for all product designers
// Curated from local font collection for laser engraving

export const ENGRAVING_COLOR = '#c0c0c0'
export const ENGRAVING_COLOR_DARK = '#a0a0a0'

export interface FontOption {
  value: string
  label: string
  category: 'sans' | 'serif' | 'display' | 'script' | 'fun'
  style: React.CSSProperties
}

export const fontOptions: FontOption[] = [
  // ============================================
  // SANS-SERIF - Clean & Modern
  // ============================================
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
    value: 'century-gothic',
    label: 'Century Gothic',
    category: 'sans',
    style: { fontFamily: 'Century Gothic, CenturyGothic, sans-serif' }
  },
  {
    value: 'bolton-sans',
    label: 'Bolton Sans',
    category: 'sans',
    style: { fontFamily: 'Bolton Sans, Arial, sans-serif' }
  },
  {
    value: 'benjamin-gothic',
    label: 'Benjamin Gothic',
    category: 'sans',
    style: { fontFamily: 'Benjamin-Gothic-Medium, Arial, sans-serif' }
  },

  // ============================================
  // SERIF - Classic & Professional
  // ============================================
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
    value: 'baskerville',
    label: 'Baskerville',
    category: 'serif',
    style: { fontFamily: 'Baskerville, Baskerville Old Face, serif' }
  },
  {
    value: 'garamond',
    label: 'Garamond',
    category: 'serif',
    style: { fontFamily: 'Garamond, Baskerville, serif' }
  },
  {
    value: 'palatino',
    label: 'Palatino',
    category: 'serif',
    style: { fontFamily: 'Palatino Linotype, Palatino, serif' }
  },
  {
    value: 'hamilton-serif',
    label: 'Hamilton Serif',
    category: 'serif',
    style: { fontFamily: 'Hamilton Serif, Georgia, serif' }
  },

  // ============================================
  // DISPLAY - Bold & Impactful
  // ============================================
  {
    value: 'impact',
    label: 'Impact Bold',
    category: 'display',
    style: { fontFamily: 'Impact, Haettenschweiler, sans-serif' }
  },
  {
    value: 'cooper-black',
    label: 'Cooper Black',
    category: 'display',
    style: { fontFamily: 'Cooper-Black-Regular, Cooper Black, serif' }
  },
  {
    value: 'carbon-block',
    label: 'Carbon Block',
    category: 'display',
    style: { fontFamily: 'Carbon Block, Impact, sans-serif' }
  },
  {
    value: 'copperplate',
    label: 'Copperplate',
    category: 'display',
    style: { fontFamily: 'Copperplate, Copperplate Gothic Light, serif', letterSpacing: '2px' }
  },
  {
    value: 'stencil',
    label: 'Stencil',
    category: 'display',
    style: { fontFamily: 'AG-Stencil, Stencil, Impact, sans-serif', letterSpacing: '1px' }
  },
  {
    value: 'ruler-stencil',
    label: 'Ruler Stencil',
    category: 'display',
    style: { fontFamily: 'Ruler Stencil Bold, Stencil, sans-serif' }
  },

  // ============================================
  // SCRIPT - Elegant & Handwritten
  // ============================================
  {
    value: 'commercial-script',
    label: 'Commercial Script',
    category: 'script',
    style: { fontFamily: 'Commercial-Script, cursive' }
  },
  {
    value: 'bernhard-script',
    label: 'Bernhard Script',
    category: 'script',
    style: { fontFamily: 'BernhardScript-Regular, cursive' }
  },
  {
    value: 'calligraph-script',
    label: 'Calligraph',
    category: 'script',
    style: { fontFamily: 'CalligraphScript, cursive' }
  },
  {
    value: 'snell',
    label: 'Snell Roundhand',
    category: 'script',
    style: { fontFamily: 'Snell Roundhand, cursive' }
  },
  {
    value: 'cheyenne-hand',
    label: 'Cheyenne Hand',
    category: 'script',
    style: { fontFamily: 'CheyenneHand, cursive' }
  },
  {
    value: 'daisy-script',
    label: 'Daisy Script',
    category: 'script',
    style: { fontFamily: 'Daisy Script, cursive' }
  },

  // ============================================
  // FUN & CREATIVE - 20 Fun Fonts
  // ============================================
  {
    value: 'comic-commando',
    label: 'Comic Commando',
    category: 'fun',
    style: { fontFamily: 'Comic Book Commando, Comic Sans MS, sans-serif' }
  },
  {
    value: 'bionic-comic',
    label: 'Bionic Comic',
    category: 'fun',
    style: { fontFamily: 'Bionic Comic, Comic Sans MS, sans-serif' }
  },
  {
    value: '300-trojans',
    label: '300 Trojans',
    category: 'fun',
    style: { fontFamily: '300 Trojans, Impact, sans-serif' }
  },
  {
    value: 'college-halo',
    label: 'College Varsity',
    category: 'fun',
    style: { fontFamily: 'College Halo, Impact, sans-serif' }
  },
  {
    value: 'anchor-steam',
    label: 'Anchor Steam',
    category: 'fun',
    style: { fontFamily: 'Anchor Steam NF, serif' }
  },
  {
    value: 'camp-granada',
    label: 'Camp Granada',
    category: 'fun',
    style: { fontFamily: 'Camp Granada NF, serif' }
  },
  {
    value: 'carnival',
    label: 'Carnival',
    category: 'fun',
    style: { fontFamily: 'Carnival MF Rimmed, serif' }
  },
  {
    value: 'biker-bones',
    label: 'Biker Bones',
    category: 'fun',
    style: { fontFamily: 'BikerBones, Impact, sans-serif' }
  },
  {
    value: 'soviet',
    label: '10 Cent Soviet',
    category: 'fun',
    style: { fontFamily: '10 Cent Soviet Bold, Impact, sans-serif' }
  },
  {
    value: 'saturday-night',
    label: 'Saturday Night',
    category: 'fun',
    style: { fontFamily: '10.15 Saturday Night BRK, cursive' }
  },
  {
    value: 'earwig-factory',
    label: 'Earwig Factory',
    category: 'fun',
    style: { fontFamily: 'Earwig Factory, sans-serif' }
  },
  {
    value: 'digital-strip',
    label: 'Digital Strip',
    category: 'fun',
    style: { fontFamily: 'DigitalStrip 2.0 BB, monospace' }
  },
  {
    value: 'coyote-deco',
    label: 'Coyote Deco',
    category: 'fun',
    style: { fontFamily: 'Coyote Deco Bold Italic, serif' }
  },
  {
    value: 'brownwood',
    label: 'Brownwood',
    category: 'fun',
    style: { fontFamily: 'Brownwood NF, serif' }
  },
  {
    value: 'casper-comics',
    label: 'Casper Comics',
    category: 'fun',
    style: { fontFamily: 'Casper Comics, Comic Sans MS, sans-serif' }
  },
  {
    value: 'chock-block',
    label: 'Chock A Block',
    category: 'fun',
    style: { fontFamily: 'Chock A Block NF, Impact, sans-serif' }
  },
  {
    value: 'barbecue',
    label: 'Barbecue',
    category: 'fun',
    style: { fontFamily: 'Barbecue, serif' }
  },
  {
    value: 'beer-glass',
    label: 'Beer Glass',
    category: 'fun',
    style: { fontFamily: 'BeerGlass, serif' }
  },
  {
    value: '7th-service',
    label: '7th Service',
    category: 'fun',
    style: { fontFamily: '7th Service, sans-serif' }
  },
  {
    value: 'blockstepped',
    label: 'Blockstepped',
    category: 'fun',
    style: { fontFamily: 'Blockstepped, Impact, sans-serif' }
  },
]

// Group fonts by category for UI display
export const fontsByCategory = {
  sans: fontOptions.filter(f => f.category === 'sans'),
  serif: fontOptions.filter(f => f.category === 'serif'),
  display: fontOptions.filter(f => f.category === 'display'),
  script: fontOptions.filter(f => f.category === 'script'),
  fun: fontOptions.filter(f => f.category === 'fun'),
}

export const categoryLabels = {
  sans: 'Clean & Modern',
  serif: 'Classic & Professional',
  display: 'Bold & Impactful',
  script: 'Script & Elegant',
  fun: 'Fun & Creative',
}
