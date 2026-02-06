'use client'

type MarkingShape = 'small-rect' | 'medium-rect' | 'circle-1' | 'circle-half' | 'oval' | 'custom'

interface ToolVisualizerProps {
  shape: MarkingShape
  text?: string
  text2?: string
  font?: string
}

export default function ToolVisualizer({
  shape,
  text = '',
  text2 = '',
  font = 'Arial, sans-serif',
}: ToolVisualizerProps) {

  const renderShape = () => {
    switch (shape) {
      case 'small-rect':
        return (
          <g>
            <rect x="40" y="30" width="80" height="40" rx="2" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
            <text x="80" y={text2 ? 48 : 54} textAnchor="middle" fill="#c0c0c0" fontSize="10" fontFamily={font}>
              {text || '0.5" × 1"'}
            </text>
            {text2 && (
              <text x="80" y="62" textAnchor="middle" fill="#999" fontSize="8" fontFamily={font}>
                {text2}
              </text>
            )}
          </g>
        )
      case 'medium-rect':
        return (
          <g>
            <rect x="30" y="25" width="100" height="50" rx="2" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
            <text x="80" y={text2 ? 48 : 54} textAnchor="middle" fill="#c0c0c0" fontSize="12" fontFamily={font}>
              {text || '1" × 2"'}
            </text>
            {text2 && (
              <text x="80" y="64" textAnchor="middle" fill="#999" fontSize="9" fontFamily={font}>
                {text2}
              </text>
            )}
          </g>
        )
      case 'circle-half':
        return (
          <g>
            <circle cx="80" cy="50" r="25" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
            <text x="80" y={text2 ? 48 : 54} textAnchor="middle" fill="#c0c0c0" fontSize="8" fontFamily={font}>
              {text || '0.5"'}
            </text>
            {text2 && (
              <text x="80" y="60" textAnchor="middle" fill="#999" fontSize="6" fontFamily={font}>
                {text2}
              </text>
            )}
          </g>
        )
      case 'circle-1':
        return (
          <g>
            <circle cx="80" cy="50" r="35" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
            <text x="80" y={text2 ? 48 : 54} textAnchor="middle" fill="#c0c0c0" fontSize="10" fontFamily={font}>
              {text || '1" circle'}
            </text>
            {text2 && (
              <text x="80" y="62" textAnchor="middle" fill="#999" fontSize="8" fontFamily={font}>
                {text2}
              </text>
            )}
          </g>
        )
      case 'oval':
        return (
          <g>
            <ellipse cx="80" cy="50" rx="50" ry="28" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
            <text x="80" y={text2 ? 48 : 54} textAnchor="middle" fill="#c0c0c0" fontSize="10" fontFamily={font}>
              {text || 'Oval'}
            </text>
            {text2 && (
              <text x="80" y="62" textAnchor="middle" fill="#999" fontSize="8" fontFamily={font}>
                {text2}
              </text>
            )}
          </g>
        )
      case 'custom':
        return (
          <g>
            <rect x="30" y="25" width="100" height="50" rx="2" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4,2" />
            <text x="80" y="50" textAnchor="middle" fill="#888" fontSize="10" fontFamily={font}>
              Custom Size
            </text>
            <text x="80" y="64" textAnchor="middle" fill="#666" fontSize="8" fontFamily={font}>
              Specify in notes
            </text>
          </g>
        )
      default:
        return null
    }
  }

  const getLabel = () => {
    const labels: Record<MarkingShape, string> = {
      'small-rect': '0.5" × 1" Rectangle',
      'medium-rect': '1" × 2" Rectangle',
      'circle-half': '0.5" Circle',
      'circle-1': '1" Circle',
      'oval': '0.75" × 1.5" Oval',
      'custom': 'Custom Size',
    }
    return labels[shape] || 'Marking Area'
  }

  return (
    <div className="w-full">
      <svg viewBox="0 0 160 100" className="w-full max-w-xs mx-auto">
        {renderShape()}
      </svg>
      <p className="text-center text-sm text-gray-500 mt-2">
        {getLabel()}
      </p>
    </div>
  )
}
