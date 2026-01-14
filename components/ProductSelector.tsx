'use client'

// Custom SVG icon for pen with accurate details (chrome tip, accent rings, stylus tip)
function PenIcon() {
  return (
    <svg viewBox="0 0 48 24" style={{ width: '100%', height: '24px' }}>
      {/* Chrome tip */}
      <polygon points="0,12 8,8 8,16" fill="url(#chrome-pen)" />
      {/* Accent rings near grip */}
      <rect x="8" y="9" width="1.5" height="6" fill="#e0e0e0" />
      <rect x="10" y="9" width="1.5" height="6" fill="#e0e0e0" />
      {/* Barrel */}
      <rect x="12" y="8" width="28" height="8" rx="1" fill="#1a1a1a" />
      {/* Chrome end */}
      <rect x="40" y="9" width="2" height="6" fill="#c0c0c0" />
      {/* Stylus tip */}
      <ellipse cx="45" cy="12" rx="3" ry="3" fill="#333" />
      {/* Gradient */}
      <defs>
        <linearGradient id="chrome-pen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0f0f0" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Custom SVG for metal business card
function CardIcon() {
  return (
    <svg viewBox="0 0 40 28" style={{ width: '100%', height: '22px' }}>
      <rect x="2" y="2" width="36" height="24" rx="2" fill="#1a1a1a" />
      <rect x="2" y="2" width="36" height="6" fill="rgba(255,255,255,0.1)" rx="2" />
      <rect x="6" y="8" width="16" height="2" fill="#666" rx="1" />
      <rect x="6" y="12" width="12" height="1.5" fill="#555" rx="0.5" />
      <rect x="28" y="16" width="6" height="6" fill="#444" rx="1" />
    </svg>
  )
}

// Custom SVG for tags/labels
function TagIcon() {
  return (
    <svg viewBox="0 0 32 32" style={{ width: '100%', height: '24px' }}>
      {/* Tag body */}
      <path d="M4 8 L20 8 L28 16 L20 24 L4 24 Z" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Hole */}
      <circle cx="10" cy="16" r="3" fill="#444" stroke="#333" strokeWidth="1" />
      {/* Text lines */}
      <rect x="15" y="13" width="8" height="2" fill="#666" rx="1" />
      <rect x="15" y="17" width="6" height="1.5" fill="#555" rx="0.5" />
    </svg>
  )
}

// Custom SVG for knife
function KnifeIcon() {
  return (
    <svg viewBox="0 0 48 24" style={{ width: '100%', height: '24px' }}>
      {/* Blade */}
      <path d="M2 12 L28 6 L28 12 L2 12 Z" fill="#c0c0c0" stroke="#999" strokeWidth="0.5" />
      {/* Blade edge */}
      <line x1="2" y1="12" x2="28" y2="12" stroke="#888" strokeWidth="1" />
      {/* Handle */}
      <rect x="28" y="8" width="16" height="8" rx="1" fill="#4a3728" />
      {/* Handle detail */}
      <rect x="30" y="10" width="1" height="4" fill="#3a2718" />
      <rect x="33" y="10" width="1" height="4" fill="#3a2718" />
      <rect x="36" y="10" width="1" height="4" fill="#3a2718" />
      {/* Guard */}
      <rect x="27" y="7" width="2" height="10" fill="#c0c0c0" rx="0.5" />
    </svg>
  )
}

// Custom SVG for tools
function ToolIcon() {
  return (
    <svg viewBox="0 0 32 32" style={{ width: '100%', height: '24px' }}>
      {/* Wrench head */}
      <path d="M4 6 L12 6 L14 10 L14 14 L12 18 L4 18 L2 14 L2 10 Z" fill="#666" stroke="#555" strokeWidth="1" />
      {/* Wrench opening */}
      <rect x="4" y="10" width="4" height="4" fill="#1a1a1a" />
      {/* Handle */}
      <rect x="14" y="10" width="14" height="4" rx="1" fill="#666" stroke="#555" strokeWidth="0.5" />
      {/* Grip texture */}
      <line x1="18" y1="10" x2="18" y2="14" stroke="#555" strokeWidth="0.5" />
      <line x1="22" y1="10" x2="22" y2="14" stroke="#555" strokeWidth="0.5" />
      <line x1="26" y1="10" x2="26" y2="14" stroke="#555" strokeWidth="0.5" />
    </svg>
  )
}

// Custom SVG for keychain
function KeychainIcon() {
  return (
    <svg viewBox="0 0 32 32" style={{ width: '100%', height: '24px' }}>
      {/* Ring */}
      <circle cx="8" cy="10" r="6" fill="none" stroke="#c0c0c0" strokeWidth="2" />
      {/* Tag */}
      <rect x="14" y="6" width="14" height="10" rx="2" fill="#1a1a1a" />
      {/* Tag hole */}
      <circle cx="17" cy="11" r="1.5" fill="#444" />
      {/* Tag text */}
      <rect x="20" y="9" width="6" height="1.5" fill="#666" rx="0.5" />
      <rect x="20" y="12" width="4" height="1" fill="#555" rx="0.5" />
      {/* Chain link */}
      <ellipse cx="12" cy="10" rx="2" ry="3" fill="none" stroke="#c0c0c0" strokeWidth="1.5" />
    </svg>
  )
}

// Custom SVG for key marking
function KeyIcon() {
  return (
    <svg viewBox="0 0 40 24" style={{ width: '100%', height: '24px' }}>
      {/* Key head */}
      <circle cx="8" cy="12" r="6" fill="#c0c0c0" stroke="#999" strokeWidth="1" />
      <circle cx="8" cy="12" r="2.5" fill="#888" />
      {/* Key shaft */}
      <rect x="14" y="10" width="22" height="4" fill="#c0c0c0" stroke="#999" strokeWidth="0.5" />
      {/* Key teeth */}
      <rect x="28" y="14" width="2" height="3" fill="#c0c0c0" />
      <rect x="32" y="14" width="2" height="4" fill="#c0c0c0" />
      <rect x="24" y="14" width="2" height="2" fill="#c0c0c0" />
    </svg>
  )
}

interface ProductOption {
  value: string
  label: string
  icon: React.ReactNode
}

const products: ProductOption[] = [
  { value: 'pens', label: 'Pens', icon: <PenIcon /> },
  { value: 'business-cards', label: 'Metal Cards', icon: <CardIcon /> },
  { value: 'tags-labels', label: 'Tags & Labels', icon: <TagIcon /> },
  { value: 'knives', label: 'Knives', icon: <KnifeIcon /> },
  { value: 'tools', label: 'Tool Marking', icon: <ToolIcon /> },
  { value: 'keychains', label: 'Keychains', icon: <KeychainIcon /> },
  { value: 'keys', label: 'Key Marking', icon: <KeyIcon /> },
]

interface ProductSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function ProductSelector({
  value,
  onChange,
}: ProductSelectorProps) {
  const isOther = value === 'other'
  const isTagsLabels = value === 'tags-labels'

  // Products with dedicated designers (show checkmark when configured)
  const designerProducts = ['pens', 'business-cards', 'tags-labels', 'knives']
  const hasDesigner = designerProducts.includes(value)

  return (
    <div>
      <label className="block text-sm font-medium text-vurmz-dark mb-3">
        What would you like engraved? <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {products.map((product) => {
          const isDesignerProduct = designerProducts.includes(product.value)
          return (
            <button
              key={product.value}
              type="button"
              onClick={() => onChange(product.value)}
              className={`relative flex flex-col items-center justify-center p-4 h-24 border-2 rounded-xl transition-all ${
                value === product.value
                  ? 'border-vurmz-teal bg-vurmz-teal/10 ring-2 ring-vurmz-teal ring-offset-1 shadow-lg scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              {isDesignerProduct && (
                <span className="absolute top-1 right-1 text-[10px] font-bold text-vurmz-teal bg-vurmz-teal/10 px-1.5 py-0.5 rounded-full">
                  DESIGN
                </span>
              )}
              <div className="mb-2">{product.icon}</div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
                {product.label}
              </span>
            </button>
          )
        })}

        {/* Custom "?" tile with clay/sculpted look */}
        <button
          type="button"
          onClick={() => onChange('other')}
          className={`relative flex flex-col items-center justify-center p-4 h-24 border-2 rounded-xl transition-all overflow-hidden ${
            isOther
              ? 'border-vurmz-teal ring-2 ring-vurmz-teal ring-offset-1 shadow-lg scale-[1.02]'
              : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
          }`}
          style={{
            background: 'linear-gradient(145deg, #c9a67a 0%, #b8956a 40%, #a6845c 100%)',
          }}
        >
          {/* Clay texture - lumpy/organic feel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 25% 20%, rgba(255,255,255,0.35) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 75% 80%, rgba(0,0,0,0.15) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(139,105,20,0.1) 0%, transparent 70%),
                radial-gradient(ellipse 30% 20% at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 50%),
                radial-gradient(ellipse 25% 15% at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)
              `,
            }}
          />
          {/* Subtle crack/texture lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.1) 45%, transparent 50%),
                linear-gradient(-45deg, transparent 60%, rgba(0,0,0,0.08) 65%, transparent 70%)
              `,
            }}
          />
          {/* Question mark with pressed/embossed clay effect */}
          <span
            className="relative text-3xl font-bold mb-2"
            style={{
              color: '#6b5222',
              textShadow: `
                1.5px 1.5px 0px rgba(255,255,255,0.5),
                -0.5px -0.5px 0px rgba(0,0,0,0.3),
                2px 3px 6px rgba(0,0,0,0.25)
              `,
              fontFamily: 'Georgia, serif',
            }}
          >
            ?
          </span>
          <span
            className="relative text-xs font-semibold text-center leading-tight"
            style={{
              color: '#5a4420',
              textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.4)',
            }}
          >
            Other
          </span>
        </button>
      </div>

      {/* Selected product indicator with helpful context */}
      {value && (
        <div className="mt-3 p-3 bg-vurmz-teal/5 border border-vurmz-teal/20 rounded-lg">
          <p className="text-sm text-vurmz-dark font-medium">
            {isOther
              ? '✏️ Tell me about your project in the notes below'
              : isTagsLabels
              ? '✨ Use the designer below to customize your labels'
              : value === 'knives'
              ? '✨ Design your knife engraving below'
              : hasDesigner
              ? '✨ Use the designer below to customize your order'
              : `✅ ${products.find(p => p.value === value)?.label} selected - describe your project below`
            }
          </p>
        </div>
      )}

      {/* Bring your own materials notice */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-vurmz-dark">Bring your own items?</span> I can engrave materials you provide -
          knives, tools, pans, or other items. Select the closest category and describe what you have.
        </p>
      </div>
    </div>
  )
}
