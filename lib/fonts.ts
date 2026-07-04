// Shared font options for all product designers
// 59 curated fonts from Font Book — self-hosted via /public/fonts/
// CSS @font-face declarations in app/fonts.css

export const ENGRAVING_COLOR = '#c0c0c0'
export const ENGRAVING_COLOR_DARK = '#a0a0a0'

export type FontCategory =
  | 'vurmz'
  | 'professional-sans'
  | 'professional-serif'
  | 'script'
  | 'industrial'
  | 'display'
  | 'monospace'
  | 'fun'
  | 'western'
  | 'gothic'

export interface FontOption {
  value: string
  label: string
  category: FontCategory
  style: React.CSSProperties
}

export const fontOptions: FontOption[] = [
  // ============================================
  // VURMZ ORIGINALS — exclusive house type, only on VURMZ
  // ============================================
  { value: 'kerf', label: 'Kerf', category: 'vurmz', style: { fontFamily: "'Kerf', sans-serif", letterSpacing: '1px' } },

  // ============================================
  // PROFESSIONAL SANS-SERIF (10)
  // ============================================
  { value: 'b691-sans', label: 'B691 Sans', category: 'professional-sans', style: { fontFamily: "'B691-Sans', sans-serif" } },
  { value: 'e820-sans', label: 'E820 Sans', category: 'professional-sans', style: { fontFamily: "'E820-Sans', sans-serif" } },
  { value: 'eurasia', label: 'Eurasia', category: 'professional-sans', style: { fontFamily: "'Eurasia', sans-serif" } },
  { value: 'coolvetica', label: 'Coolvetica', category: 'professional-sans', style: { fontFamily: "'Coolvetica', sans-serif" } },
  { value: 'cleargothic', label: 'ClearGothic', category: 'professional-sans', style: { fontFamily: "'ClearGothicSerial', sans-serif" } },
  { value: 'bolton-sans', label: 'Bolton Sans', category: 'professional-sans', style: { fontFamily: "'Bolton Sans', sans-serif" } },
  { value: 'birmingham-sans', label: 'Birmingham Sans', category: 'professional-sans', style: { fontFamily: "'Birmingham Sans Serif', sans-serif" } },
  { value: 'blue-highway', label: 'Blue Highway', category: 'professional-sans', style: { fontFamily: "'Blue Highway D Type', sans-serif" } },
  { value: 'bonobo', label: 'Bonobo', category: 'professional-sans', style: { fontFamily: "'Bonobo', sans-serif" } },
  { value: 'anuphan', label: 'Anuphan', category: 'professional-sans', style: { fontFamily: "'Anuphan', sans-serif" } },

  // ============================================
  // PROFESSIONAL SERIF (10)
  // ============================================
  { value: 'bodoni', label: 'Bodoni', category: 'professional-serif', style: { fontFamily: "'Bodoni', serif" } },
  { value: 'baskerville', label: 'Baskerville', category: 'professional-serif', style: { fontFamily: "'Baskerville-Old-Face', serif" } },
  { value: 'century-schoolbook', label: 'Century Schoolbook', category: 'professional-serif', style: { fontFamily: "'Century-Schoolbook', serif" } },
  { value: 'bernhard-modern', label: 'Bernhard Modern', category: 'professional-serif', style: { fontFamily: "'BernhardModern', serif" } },
  { value: 'egyptienne', label: 'Egyptienne', category: 'professional-serif', style: { fontFamily: "'EgyptienneStd', serif" } },
  { value: 'cambridge', label: 'Cambridge', category: 'professional-serif', style: { fontFamily: "'Cambridge', serif" } },
  { value: 'b693-roman', label: 'B693 Roman', category: 'professional-serif', style: { fontFamily: "'B693-Roman', serif" } },
  { value: 'b820-roman', label: 'B820 Roman', category: 'professional-serif', style: { fontFamily: "'B820-Roman', serif" } },
  { value: 'copperplate-gothic', label: 'Copperplate Gothic', category: 'professional-serif', style: { fontFamily: "'Copperplate-Gothic', serif", letterSpacing: '2px' } },
  { value: 'bestseller', label: 'Bestseller', category: 'professional-serif', style: { fontFamily: "'Bestseller', serif" } },

  // ============================================
  // SCRIPT / CALLIGRAPHY (9)
  // ============================================
  { value: 'bernhard-script', label: 'Bernhard Script', category: 'script', style: { fontFamily: "'BernhardScript', cursive" } },
  { value: 'brush-script', label: 'Brush Script', category: 'script', style: { fontFamily: "'Brush-Script', cursive" } },
  { value: 'commercial-script', label: 'Commercial Script', category: 'script', style: { fontFamily: "'Commercial-Script', cursive" } },
  { value: 'elegant-script', label: 'Elegant Script', category: 'script', style: { fontFamily: "'Elegant-Script', cursive" } },
  { value: 'daisy-script', label: 'Daisy Script', category: 'script', style: { fontFamily: "'Daisy Script', cursive" } },
  { value: 'bay-script', label: 'BayScript', category: 'script', style: { fontFamily: "'BayScript', cursive" } },
  { value: 'amanda-rose', label: 'Amanda Rose', category: 'script', style: { fontFamily: "'Amanda Rose', cursive" } },
  { value: 'bernhard-elegant', label: 'Bernhard Elegant', category: 'script', style: { fontFamily: "'BernhardElegant', cursive" } },
  { value: 'black-chancery', label: 'Black Chancery', category: 'script', style: { fontFamily: "'BlackChancery', cursive" } },

  // ============================================
  // INDUSTRIAL / STENCIL / MILITARY (9)
  // ============================================
  { value: 'ag-stencil', label: 'AG Stencil', category: 'industrial', style: { fontFamily: "'AG Stencil', sans-serif", letterSpacing: '1px' } },
  { value: 'stencilia', label: 'Stencilia', category: 'industrial', style: { fontFamily: "'Stencilia-A', sans-serif", letterSpacing: '1px' } },
  { value: 'bride-stencil', label: 'Bride Stencil', category: 'industrial', style: { fontFamily: "'Bride Stencil', sans-serif" } },
  { value: 'ruler-stencil', label: 'Ruler Stencil', category: 'industrial', style: { fontFamily: "'Ruler Stencil', sans-serif" } },
  { value: 'battlefield', label: 'Battlefield', category: 'industrial', style: { fontFamily: "'Battlefield', sans-serif" } },
  { value: 'alpha-taurus', label: 'Alpha Taurus', category: 'industrial', style: { fontFamily: "'Alpha Taurus', sans-serif" } },
  // 'ben-zion' delisted 2026-07-03: faux-Hebrew costume face. Real-script
  // support (actual Hebrew/Arabic/CJK fonts rendering real text) is the
  // honest version of this; see ADMIN-CHARTER notes. @font-face retained
  // so past orders keep rendering.
  { value: 'archery-black', label: 'Archery Black', category: 'industrial', style: { fontFamily: "'Archery Black', sans-serif" } },
  { value: 'blacktop', label: 'Blacktop', category: 'industrial', style: { fontFamily: "'Blacktop', sans-serif" } },

  // ============================================
  // DISPLAY / BOLD (6)
  // ============================================
  { value: 'cooper-black', label: 'Cooper Black', category: 'display', style: { fontFamily: "'Cooper-Black', serif" } },
  { value: 'canyon', label: 'Canyon', category: 'display', style: { fontFamily: "'Canyon', sans-serif" } },
  { value: 'impact-label', label: 'Impact Label', category: 'display', style: { fontFamily: "'Impact Label', sans-serif" } },
  { value: 'bamf', label: 'Bamf', category: 'display', style: { fontFamily: "'Bamf', sans-serif" } },
  { value: 'blavicke-capitals', label: 'Blavicke Capitals', category: 'display', style: { fontFamily: "'Blavicke Capitals', sans-serif", letterSpacing: '2px' } },
  { value: 'charlemagne', label: 'Charlemagne', category: 'display', style: { fontFamily: "'Charlemagne', serif" } },

  // ============================================
  // MONOSPACE / TECHNICAL (4)
  // ============================================
  { value: 'courier-ps', label: 'Courier', category: 'monospace', style: { fontFamily: "'Courier-PS', monospace" } },
  { value: 'bitstream-vera', label: 'Bitstream Vera Mono', category: 'monospace', style: { fontFamily: "'Bitstream Vera Sans Mono', monospace" } },
  { value: 'bank-design', label: 'BankDesign', category: 'monospace', style: { fontFamily: "'BankDesign', monospace" } },

  // ============================================
  // FUN / NOVELTY
  // ============================================
  { value: 'spacetime', label: 'Space Time', category: 'fun', style: { fontFamily: "'Space Time', sans-serif" } },
  { value: 'balloon', label: 'Balloon', category: 'fun', style: { fontFamily: "'Balloon', cursive" } },
  { value: 'jua', label: 'Jua', category: 'fun', style: { fontFamily: "'Jua', sans-serif" } },
  { value: 'boopee', label: 'Boopee', category: 'fun', style: { fontFamily: "'Boopee', cursive" } },
  { value: 'bonita', label: 'Bonita', category: 'fun', style: { fontFamily: "'Bonita', cursive" } },
  { value: 'pop-art', label: 'Pop Art', category: 'fun', style: { fontFamily: "'Pop Art', sans-serif" } },
  { value: 'bionic-comic', label: 'Bionic Comic', category: 'fun', style: { fontFamily: "'Bionic Comic', cursive" } },

  // ============================================
  // WESTERN / VINTAGE (3)
  // ============================================
  { value: 'cockney', label: 'Cockney', category: 'western', style: { fontFamily: "'Cockney', serif" } },
  { value: 'byington', label: 'Byington', category: 'western', style: { fontFamily: "'Byington', serif" } },
  { value: 'bellhop', label: 'Bellhop', category: 'western', style: { fontFamily: "'Bellhop NF', serif" } },

  // ============================================
  // GOTHIC / BLACKLETTER (2)
  // ============================================
  { value: 'olde-english', label: 'Olde English', category: 'gothic', style: { fontFamily: "'Olde English', serif" } },
  { value: 'stencil-gothic', label: 'Stencil Gothic', category: 'gothic', style: { fontFamily: "'Stencil Gothic BE', sans-serif" } },
]

// Group fonts by category for UI display
export const fontsByCategory: Record<FontCategory, FontOption[]> = {
  vurmz: fontOptions.filter(f => f.category === 'vurmz'),
  'professional-sans': fontOptions.filter(f => f.category === 'professional-sans'),
  'professional-serif': fontOptions.filter(f => f.category === 'professional-serif'),
  script: fontOptions.filter(f => f.category === 'script'),
  industrial: fontOptions.filter(f => f.category === 'industrial'),
  display: fontOptions.filter(f => f.category === 'display'),
  monospace: fontOptions.filter(f => f.category === 'monospace'),
  fun: fontOptions.filter(f => f.category === 'fun'),
  western: fontOptions.filter(f => f.category === 'western'),
  gothic: fontOptions.filter(f => f.category === 'gothic'),
}

export const categoryLabels: Record<FontCategory, string> = {
  vurmz: 'VURMZ Originals',
  'professional-sans': 'Clean & Modern',
  'professional-serif': 'Classic & Professional',
  script: 'Script & Elegant',
  industrial: 'Industrial & Stencil',
  display: 'Bold & Impactful',
  monospace: 'Technical & Monospace',
  fun: 'Fun & Creative',
  western: 'Western & Vintage',
  gothic: 'Gothic & Blackletter',
}
