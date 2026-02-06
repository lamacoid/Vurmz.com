'use client'

type KeychainShape = 'rectangle' | 'oval' | 'dog-tag' | 'bottle-opener' | 'round'

interface KeychainVisualizerProps {
  shape: KeychainShape
  text?: string
  text2?: string
  color?: string
  font?: string
}

export default function KeychainVisualizer({
  shape,
  text = '',
  text2 = '',
  color = '#1a1a1a',
  font = 'Arial, sans-serif',
}: KeychainVisualizerProps) {
  const textColor = color === '#ffd700' || color === '#c0c0c0' ? '#333' : '#ddd'

  const renderShape = () => {
    switch (shape) {
      case 'rectangle':
        return (
          <g>
            <circle cx="30" cy="50" r="10" fill="none" stroke="#888" strokeWidth="2.5" />
            <line x1="40" y1="50" x2="55" y2="50" stroke="#888" strokeWidth="2" />
            <rect x="55" y="22" width="120" height="56" rx="4" fill={color} stroke="#555" strokeWidth="1" />
            <circle cx="67" cy="50" r="6" fill="#f0f0f0" />
          </g>
        )
      case 'oval':
        return (
          <g>
            <circle cx="25" cy="50" r="10" fill="none" stroke="#888" strokeWidth="2.5" />
            <line x1="35" y1="50" x2="48" y2="50" stroke="#888" strokeWidth="2" />
            <ellipse cx="115" cy="50" rx="60" ry="32" fill={color} stroke="#555" strokeWidth="1" />
            <circle cx="60" cy="50" r="5" fill="#f0f0f0" />
          </g>
        )
      case 'round':
        return (
          <g>
            <circle cx="100" cy="50" r="35" fill={color} stroke="#555" strokeWidth="1" />
            <circle cx="100" cy="20" r="6" fill="#f0f0f0" />
            <circle cx="100" cy="8" r="8" fill="none" stroke="#888" strokeWidth="2.5" />
          </g>
        )
      case 'dog-tag':
        return (
          <g>
            <path
              d="M 55,18 L 145,18 Q 165,18 165,38 L 165,62 Q 165,82 145,82 L 55,82 Q 35,82 35,62 L 35,38 Q 35,18 55,18 Z"
              fill={color}
              stroke="#555"
              strokeWidth="1"
            />
            <circle cx="100" cy="28" r="5" fill="#f0f0f0" />
            <circle cx="100" cy="12" r="8" fill="none" stroke="#888" strokeWidth="2.5" />
          </g>
        )
      case 'bottle-opener':
        return (
          <g>
            <rect x="30" y="30" width="140" height="40" rx="5" fill={color} stroke="#555" strokeWidth="1" />
            <ellipse cx="150" cy="50" rx="14" ry="12" fill="#222" stroke="#444" strokeWidth="1.5" />
            <circle cx="48" cy="50" r="6" fill="#f0f0f0" />
            <circle cx="20" cy="50" r="10" fill="none" stroke="#888" strokeWidth="2.5" />
            <line x1="30" y1="50" x2="42" y2="50" stroke="#888" strokeWidth="2" />
          </g>
        )
      default:
        return null
    }
  }

  const getTextPos = () => {
    switch (shape) {
      case 'rectangle': return { x: 115, y1: 48, y2: 62 }
      case 'oval': return { x: 115, y1: 48, y2: 62 }
      case 'round': return { x: 100, y1: 50, y2: 62 }
      case 'dog-tag': return { x: 100, y1: 52, y2: 68 }
      case 'bottle-opener': return { x: 90, y1: 48, y2: 58 }
      default: return { x: 100, y1: 50, y2: 62 }
    }
  }

  const pos = getTextPos()

  return (
    <div className="w-full">
      <svg viewBox="0 0 200 100" className="w-full max-w-xs mx-auto">
        {renderShape()}

        <text
          x={pos.x}
          y={pos.y1}
          textAnchor="middle"
          fill={textColor}
          fontSize="11"
          fontFamily={font}
          fontWeight="500"
        >
          {text || 'Your Text'}
        </text>

        {text2 && (
          <text
            x={pos.x}
            y={pos.y2}
            textAnchor="middle"
            fill={textColor}
            fontSize="9"
            fontFamily={font}
            opacity="0.8"
          >
            {text2}
          </text>
        )}
      </svg>

      <p className="text-center text-sm text-gray-500 mt-2">
        {shape.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
      </p>
    </div>
  )
}
