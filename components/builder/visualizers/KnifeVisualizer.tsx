'use client'

type KnifeType = 'pocket' | 'chef' | 'steak-set' | 'kitchen-set'
type EngravingLocation = 'blade' | 'handle' | 'both'

interface KnifeVisualizerProps {
  type: KnifeType
  bladeText?: string
  handleText?: string
  engravingLocation: EngravingLocation
  font?: string
  setSize?: number
}

export default function KnifeVisualizer({
  type,
  bladeText = '',
  handleText = '',
  engravingLocation,
  font = 'Arial, sans-serif',
  setSize = 4,
}: KnifeVisualizerProps) {
  const showBlade = engravingLocation === 'blade' || engravingLocation === 'both'
  const showHandle = engravingLocation === 'handle' || engravingLocation === 'both'

  // Steak/Kitchen Set View
  if (type === 'steak-set' || type === 'kitchen-set') {
    const count = type === 'steak-set' ? setSize : 4
    return (
      <div className="w-full">
        <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto">
          <defs>
            <linearGradient id="steakBlade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8e8e8"/>
              <stop offset="50%" stopColor="#d0d0d0"/>
              <stop offset="100%" stopColor="#b8b8b8"/>
            </linearGradient>
            <linearGradient id="steakHandle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5d4037"/>
              <stop offset="50%" stopColor="#4e342e"/>
              <stop offset="100%" stopColor="#3e2723"/>
            </linearGradient>
          </defs>

          {Array.from({ length: count }).map((_, i) => (
            <g key={i} transform={`translate(${i * 25}, ${i * 28})`}>
              {/* Steak knife blade - serrated edge */}
              <path
                d="M 15,22 L 95,18 Q 105,18 108,22 L 108,26 L 95,28 L 15,30 Z"
                fill="url(#steakBlade)"
                stroke="#999"
                strokeWidth="0.5"
              />
              {/* Serrations */}
              <path
                d="M 20,30 L 22,28 L 24,30 L 26,28 L 28,30 L 30,28 L 32,30 L 34,28 L 36,30 L 38,28 L 40,30 L 42,28 L 44,30 L 46,28 L 48,30 L 50,28 L 52,30 L 54,28 L 56,30 L 58,28 L 60,30 L 62,28 L 64,30 L 66,28 L 68,30 L 70,28 L 72,30 L 74,28 L 76,30 L 78,28 L 80,30 L 82,28 L 84,30 L 86,28 L 88,30 L 90,28 L 92,30"
                fill="none"
                stroke="#999"
                strokeWidth="0.5"
              />
              {/* Handle */}
              <path
                d="M 108,18 L 160,20 Q 165,24 160,28 L 108,30 Z"
                fill="url(#steakHandle)"
              />
              {/* Rivets */}
              <circle cx="120" cy="24" r="2" fill="#brass" stroke="#666" strokeWidth="0.5"/>
              <circle cx="145" cy="24" r="2" fill="#brass" stroke="#666" strokeWidth="0.5"/>
            </g>
          ))}

          {/* Text label */}
          {bladeText && (
            <text x="150" y="170" textAnchor="middle" fill="#666" fontSize="11" fontFamily={font}>
              {bladeText}
            </text>
          )}
        </svg>
        <p className="text-center text-sm text-gray-500 mt-2">
          {count}-piece {type === 'steak-set' ? 'Steak Knife' : 'Kitchen'} Set
        </p>
      </div>
    )
  }

  // Chef Knife
  if (type === 'chef') {
    return (
      <div className="w-full">
        <svg viewBox="0 0 340 100" className="w-full max-w-md mx-auto">
          <defs>
            <linearGradient id="chefBlade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5f5f5"/>
              <stop offset="30%" stopColor="#e0e0e0"/>
              <stop offset="70%" stopColor="#c0c0c0"/>
              <stop offset="100%" stopColor="#a0a0a0"/>
            </linearGradient>
            <linearGradient id="chefHandle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4a3728"/>
              <stop offset="50%" stopColor="#5d4037"/>
              <stop offset="100%" stopColor="#3e2723"/>
            </linearGradient>
          </defs>

          {/* Chef knife blade - classic curved shape */}
          <path
            d="M 10,50
               Q 30,65 80,70
               L 180,72
               Q 200,72 210,68
               L 210,48
               Q 200,35 180,30
               L 80,28
               Q 40,30 20,40
               Z"
            fill="url(#chefBlade)"
            stroke="#888"
            strokeWidth="0.75"
          />

          {/* Blade spine highlight */}
          <path
            d="M 20,42 Q 40,32 80,30 L 180,32 Q 195,35 205,42"
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            opacity="0.4"
          />

          {/* Bolster (metal part between blade and handle) */}
          <rect x="205" y="38" width="12" height="24" rx="2" fill="#888" stroke="#666" strokeWidth="0.5"/>

          {/* Handle */}
          <path
            d="M 217,38
               Q 220,36 230,36
               L 300,40
               Q 320,48 320,50
               Q 320,52 300,60
               L 230,64
               Q 220,64 217,62
               Z"
            fill="url(#chefHandle)"
          />

          {/* Handle rivets */}
          <circle cx="240" cy="50" r="3" fill="#c9b037" stroke="#8b7355" strokeWidth="0.5"/>
          <circle cx="265" cy="50" r="3" fill="#c9b037" stroke="#8b7355" strokeWidth="0.5"/>
          <circle cx="290" cy="50" r="3" fill="#c9b037" stroke="#8b7355" strokeWidth="0.5"/>

          {/* Blade engraving text */}
          {showBlade && (
            <text
              x="120"
              y="54"
              textAnchor="middle"
              fill="#666"
              fontSize="12"
              fontFamily={font}
              fontStyle="italic"
            >
              {bladeText || 'Blade text'}
            </text>
          )}

          {/* Handle engraving text */}
          {showHandle && (
            <text
              x="265"
              y="54"
              textAnchor="middle"
              fill="#c9a67a"
              fontSize="9"
              fontFamily={font}
            >
              {handleText || 'Handle'}
            </text>
          )}
        </svg>
        <p className="text-center text-sm text-gray-500 mt-2">Chef Knife</p>
      </div>
    )
  }

  // Pocket Knife (default)
  return (
    <div className="w-full">
      <svg viewBox="0 0 300 90" className="w-full max-w-md mx-auto">
        <defs>
          <linearGradient id="pocketBlade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f0f0"/>
            <stop offset="50%" stopColor="#d8d8d8"/>
            <stop offset="100%" stopColor="#b0b0b0"/>
          </linearGradient>
          <linearGradient id="pocketHandle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a"/>
            <stop offset="50%" stopColor="#1a1a1a"/>
            <stop offset="100%" stopColor="#0a0a0a"/>
          </linearGradient>
        </defs>

        {/* Pocket knife blade - drop point style */}
        <path
          d="M 20,45
             L 110,38
             Q 125,38 130,42
             L 130,48
             Q 125,52 110,52
             L 20,50
             Z"
          fill="url(#pocketBlade)"
          stroke="#888"
          strokeWidth="0.75"
        />

        {/* Blade edge line */}
        <path
          d="M 22,50 L 110,52 Q 122,52 128,48"
          fill="none"
          stroke="#999"
          strokeWidth="0.5"
        />

        {/* Handle body */}
        <rect
          x="125"
          y="30"
          width="145"
          height="30"
          rx="4"
          fill="url(#pocketHandle)"
          stroke="#333"
          strokeWidth="0.5"
        />

        {/* Handle texture lines */}
        <line x1="150" y1="33" x2="150" y2="57" stroke="#333" strokeWidth="0.5" opacity="0.5"/>
        <line x1="175" y1="33" x2="175" y2="57" stroke="#333" strokeWidth="0.5" opacity="0.5"/>
        <line x1="200" y1="33" x2="200" y2="57" stroke="#333" strokeWidth="0.5" opacity="0.5"/>
        <line x1="225" y1="33" x2="225" y2="57" stroke="#333" strokeWidth="0.5" opacity="0.5"/>
        <line x1="250" y1="33" x2="250" y2="57" stroke="#333" strokeWidth="0.5" opacity="0.5"/>

        {/* Pivot screw */}
        <circle cx="132" cy="45" r="6" fill="#444" stroke="#333" strokeWidth="1"/>
        <circle cx="132" cy="45" r="2.5" fill="#555"/>

        {/* Pocket clip */}
        <path
          d="M 258,32 L 272,32 L 272,38 L 265,38 L 265,35 L 258,35 Z"
          fill="#333"
          stroke="#222"
          strokeWidth="0.5"
        />

        {/* Blade engraving text */}
        {showBlade && (
          <text
            x="75"
            y="48"
            textAnchor="middle"
            fill="#555"
            fontSize="9"
            fontFamily={font}
          >
            {bladeText || 'Blade text'}
          </text>
        )}

        {/* Handle engraving text */}
        {showHandle && (
          <text
            x="200"
            y="49"
            textAnchor="middle"
            fill="#888"
            fontSize="8"
            fontFamily={font}
          >
            {handleText || 'Handle text'}
          </text>
        )}
      </svg>
      <p className="text-center text-sm text-gray-500 mt-2">Pocket Knife</p>
    </div>
  )
}
