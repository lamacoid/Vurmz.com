'use client'

import { motion } from 'framer-motion'

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
  font = 'Inter',
}: ToolVisualizerProps) {

  // Common engraving area styles
  const areaStyles = {
    fill: '#1a1a1a',
    stroke: '#333',
    textFill: '#c0c0c0',
  }

  const renderSmallRect = () => (
    // 0.5" x 1" rectangle - most common for tools
    <svg viewBox="0 0 160 100" className="w-full max-w-xs mx-auto">
      <defs>
        <linearGradient id="metalSurface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a"/>
          <stop offset="50%" stopColor="#1a1a1a"/>
          <stop offset="100%" stopColor="#0f0f0f"/>
        </linearGradient>
        <filter id="engrave" x="-10%" y="-10%" width="120%" height="120%">
          <feOffset in="SourceAlpha" dx="0.5" dy="0.5" result="offset"/>
          <feGaussianBlur in="offset" stdDeviation="0.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Marking plate background */}
      <motion.rect
        x="30"
        y="30"
        width="100"
        height="40"
        rx="3"
        fill="url(#metalSurface)"
        stroke="#444"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Engraved border effect */}
      <motion.rect
        x="35"
        y="35"
        width="90"
        height="30"
        rx="1"
        fill="none"
        stroke="#333"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.2 }}
      />

      {/* Text - laser engraved look */}
      {text && (
        <motion.text
          x="80"
          y={text2 ? "48" : "54"}
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize={text.length > 12 ? "8" : "10"}
          fontFamily={font}
          fontWeight="500"
          filter="url(#engrave)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="80"
          y="60"
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize="7"
          fontFamily={font}
          filter="url(#engrave)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {text2}
        </motion.text>
      )}

      {/* Size label */}
      <text x="80" y="85" textAnchor="middle" fill="#666" fontSize="8">
        0.5&quot; × 1&quot;
      </text>
    </svg>
  )

  const renderMediumRect = () => (
    // 1" x 2" rectangle - for larger tools
    <svg viewBox="0 0 200 120" className="w-full max-w-sm mx-auto">
      <defs>
        <linearGradient id="metalSurface2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a"/>
          <stop offset="50%" stopColor="#1a1a1a"/>
          <stop offset="100%" stopColor="#0f0f0f"/>
        </linearGradient>
      </defs>

      <motion.rect
        x="25"
        y="20"
        width="150"
        height="60"
        rx="4"
        fill="url(#metalSurface2)"
        stroke="#444"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.rect
        x="32"
        y="27"
        width="136"
        height="46"
        rx="2"
        fill="none"
        stroke="#333"
        strokeWidth="0.5"
        strokeDasharray="3,3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.2 }}
      />

      {text && (
        <motion.text
          x="100"
          y={text2 ? "48" : "55"}
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize={text.length > 15 ? "10" : "13"}
          fontFamily={font}
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="100"
          y="65"
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize="9"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {text2}
        </motion.text>
      )}

      <text x="100" y="100" textAnchor="middle" fill="#666" fontSize="8">
        1&quot; × 2&quot;
      </text>
    </svg>
  )

  const renderCircle1 = () => (
    // 1" diameter circle
    <svg viewBox="0 0 140 120" className="w-full max-w-xs mx-auto">
      <defs>
        <radialGradient id="metalCircle" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#333"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </radialGradient>
      </defs>

      <motion.circle
        cx="70"
        cy="55"
        r="40"
        fill="url(#metalCircle)"
        stroke="#444"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.circle
        cx="70"
        cy="55"
        r="34"
        fill="none"
        stroke="#333"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.2 }}
      />

      {text && (
        <motion.text
          x="70"
          y={text2 ? "52" : "58"}
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize={text.length > 8 ? "9" : "11"}
          fontFamily={font}
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="70"
          y="66"
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize="7"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {text2}
        </motion.text>
      )}

      <text x="70" y="110" textAnchor="middle" fill="#666" fontSize="8">
        1&quot; diameter
      </text>
    </svg>
  )

  const renderCircleHalf = () => (
    // 0.5" diameter circle - smallest option
    <svg viewBox="0 0 120 100" className="w-full max-w-xs mx-auto">
      <defs>
        <radialGradient id="metalCircleSmall" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#333"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </radialGradient>
      </defs>

      <motion.circle
        cx="60"
        cy="45"
        r="25"
        fill="url(#metalCircleSmall)"
        stroke="#444"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.circle
        cx="60"
        cy="45"
        r="20"
        fill="none"
        stroke="#333"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.2 }}
      />

      {text && (
        <motion.text
          x="60"
          y="48"
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize={text.length > 5 ? "6" : "8"}
          fontFamily={font}
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.text>
      )}

      <text x="60" y="85" textAnchor="middle" fill="#666" fontSize="8">
        0.5&quot; diameter
      </text>
    </svg>
  )

  const renderOval = () => (
    // Oval marking area
    <svg viewBox="0 0 180 100" className="w-full max-w-sm mx-auto">
      <defs>
        <linearGradient id="metalOval" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a"/>
          <stop offset="50%" stopColor="#1a1a1a"/>
          <stop offset="100%" stopColor="#0f0f0f"/>
        </linearGradient>
      </defs>

      <motion.ellipse
        cx="90"
        cy="45"
        rx="70"
        ry="30"
        fill="url(#metalOval)"
        stroke="#444"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.ellipse
        cx="90"
        cy="45"
        rx="62"
        ry="23"
        fill="none"
        stroke="#333"
        strokeWidth="0.5"
        strokeDasharray="3,3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.2 }}
      />

      {text && (
        <motion.text
          x="90"
          y={text2 ? "42" : "48"}
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize={text.length > 12 ? "9" : "11"}
          fontFamily={font}
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="90"
          y="56"
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize="8"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {text2}
        </motion.text>
      )}

      <text x="90" y="90" textAnchor="middle" fill="#666" fontSize="8">
        0.75&quot; × 1.5&quot; oval
      </text>
    </svg>
  )

  const renderCustom = () => (
    <svg viewBox="0 0 160 100" className="w-full max-w-xs mx-auto">
      <defs>
        <linearGradient id="metalCustom" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a"/>
          <stop offset="50%" stopColor="#1a1a1a"/>
          <stop offset="100%" stopColor="#0f0f0f"/>
        </linearGradient>
      </defs>

      {/* Custom area placeholder */}
      <motion.rect
        x="30"
        y="25"
        width="100"
        height="50"
        rx="4"
        fill="url(#metalCustom)"
        stroke="#444"
        strokeWidth="1"
        strokeDasharray="5,5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      {text ? (
        <motion.text
          x="80"
          y={text2 ? "48" : "54"}
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize="10"
          fontFamily={font}
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.text>
      ) : (
        <motion.text
          x="80"
          y="54"
          textAnchor="middle"
          fill="#555"
          fontSize="9"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Custom size
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="80"
          y="62"
          textAnchor="middle"
          fill={areaStyles.textFill}
          fontSize="8"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {text2}
        </motion.text>
      )}

      <text x="80" y="90" textAnchor="middle" fill="#666" fontSize="8">
        Specify in notes
      </text>
    </svg>
  )

  return (
    <div className="w-full">
      {shape === 'small-rect' && renderSmallRect()}
      {shape === 'medium-rect' && renderMediumRect()}
      {shape === 'circle-1' && renderCircle1()}
      {shape === 'circle-half' && renderCircleHalf()}
      {shape === 'oval' && renderOval()}
      {shape === 'custom' && renderCustom()}

      <p className="text-center text-xs text-gray-400 mt-2">
        Preview of engraving area
      </p>
    </div>
  )
}
