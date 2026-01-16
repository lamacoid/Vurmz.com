'use client'

import { motion } from 'framer-motion'

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
  font = 'Inter',
}: KeychainVisualizerProps) {

  // Color variations based on selected color
  const getColorGradient = () => {
    const colorMap: Record<string, { light: string; mid: string; dark: string }> = {
      '#1a1a1a': { light: '#3a3a3a', mid: '#2a2a2a', dark: '#1a1a1a' },
      '#c0c0c0': { light: '#e0e0e0', mid: '#c0c0c0', dark: '#a0a0a0' },
      '#b87333': { light: '#d4955c', mid: '#b87333', dark: '#8b5a2b' },
      '#ffd700': { light: '#ffe44d', mid: '#ffd700', dark: '#ccac00' },
      '#4a9b8c': { light: '#6bb5a7', mid: '#4a9b8c', dark: '#3a7b6c' },
    }
    return colorMap[color] || colorMap['#1a1a1a']
  }

  const colors = getColorGradient()
  const textColor = color === '#ffd700' || color === '#c0c0c0' ? '#333' : '#ddd'

  const renderRectangle = () => (
    <svg viewBox="0 0 200 100" className="w-full max-w-xs mx-auto">
      <defs>
        <linearGradient id={`rectGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.light}/>
          <stop offset="50%" stopColor={colors.mid}/>
          <stop offset="100%" stopColor={colors.dark}/>
        </linearGradient>
      </defs>

      {/* Ring */}
      <motion.circle
        cx="30"
        cy="50"
        r="12"
        fill="none"
        stroke="#888"
        strokeWidth="3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      />

      {/* Body */}
      <motion.rect
        x="50"
        y="20"
        width="130"
        height="60"
        rx="5"
        fill={`url(#rectGrad-${color})`}
        stroke={colors.dark}
        strokeWidth="1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Hole for ring */}
      <motion.circle
        cx="62"
        cy="50"
        r="8"
        fill="#f5f5f5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      />

      {/* Connection line */}
      <motion.line
        x1="42"
        y1="50"
        x2="54"
        y2="50"
        stroke="#888"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />

      {/* Text */}
      {text && (
        <motion.text
          x="120"
          y={text2 ? "45" : "55"}
          textAnchor="middle"
          fill={textColor}
          fontSize="12"
          fontFamily={font}
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="120"
          y="62"
          textAnchor="middle"
          fill={textColor}
          fontSize="9"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {text2}
        </motion.text>
      )}
    </svg>
  )

  const renderOval = () => (
    <svg viewBox="0 0 200 100" className="w-full max-w-xs mx-auto">
      <defs>
        <linearGradient id={`ovalGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.light}/>
          <stop offset="50%" stopColor={colors.mid}/>
          <stop offset="100%" stopColor={colors.dark}/>
        </linearGradient>
      </defs>

      {/* Ring */}
      <motion.circle
        cx="25"
        cy="50"
        r="10"
        fill="none"
        stroke="#888"
        strokeWidth="3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      />

      {/* Oval body */}
      <motion.ellipse
        cx="120"
        cy="50"
        rx="70"
        ry="35"
        fill={`url(#ovalGrad-${color})`}
        stroke={colors.dark}
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Hole for ring */}
      <motion.circle
        cx="58"
        cy="50"
        r="6"
        fill="#f5f5f5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      />

      {/* Text */}
      {text && (
        <motion.text
          x="125"
          y={text2 ? "48" : "55"}
          textAnchor="middle"
          fill={textColor}
          fontSize="11"
          fontFamily={font}
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="125"
          y="62"
          textAnchor="middle"
          fill={textColor}
          fontSize="8"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {text2}
        </motion.text>
      )}
    </svg>
  )

  const renderDogTag = () => (
    <svg viewBox="0 0 180 120" className="w-full max-w-xs mx-auto">
      <defs>
        <linearGradient id={`tagGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.light}/>
          <stop offset="50%" stopColor={colors.mid}/>
          <stop offset="100%" stopColor={colors.dark}/>
        </linearGradient>
      </defs>

      {/* Chain links */}
      <motion.path
        d="M 90,5 Q 85,5 85,10 L 85,15 Q 85,20 90,20 Q 95,20 95,15 L 95,10 Q 95,5 90,5"
        fill="none"
        stroke="#888"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      {/* Dog tag body */}
      <motion.path
        d={`
          M 50,25
          L 130,25
          Q 145,25 145,40
          L 145,95
          Q 145,110 130,110
          L 50,110
          Q 35,110 35,95
          L 35,40
          Q 35,25 50,25
          Z
        `}
        fill={`url(#tagGrad-${color})`}
        stroke={colors.dark}
        strokeWidth="1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Hole */}
      <motion.circle
        cx="90"
        cy="35"
        r="6"
        fill="#f5f5f5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      />

      {/* Notch */}
      <motion.rect
        x="35"
        y="95"
        width="10"
        height="10"
        fill="#f5f5f5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      {/* Text lines */}
      {text && (
        <motion.text
          x="90"
          y="60"
          textAnchor="middle"
          fill={textColor}
          fontSize="11"
          fontFamily={font}
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="90"
          y="78"
          textAnchor="middle"
          fill={textColor}
          fontSize="9"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {text2}
        </motion.text>
      )}
    </svg>
  )

  const renderBottleOpener = () => (
    <svg viewBox="0 0 220 100" className="w-full max-w-sm mx-auto">
      <defs>
        <linearGradient id={`openerGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.light}/>
          <stop offset="50%" stopColor={colors.mid}/>
          <stop offset="100%" stopColor={colors.dark}/>
        </linearGradient>
      </defs>

      {/* Ring */}
      <motion.circle
        cx="25"
        cy="50"
        r="12"
        fill="none"
        stroke="#888"
        strokeWidth="3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      />

      {/* Body */}
      <motion.path
        d={`
          M 45,30
          L 180,25
          Q 200,25 205,40
          L 205,60
          Q 200,75 180,75
          L 45,70
          Q 35,65 35,50
          Q 35,35 45,30
          Z
        `}
        fill={`url(#openerGrad-${color})`}
        stroke={colors.dark}
        strokeWidth="1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Ring hole */}
      <motion.circle
        cx="55"
        cy="50"
        r="8"
        fill="#f5f5f5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      />

      {/* Bottle opener cutout */}
      <motion.path
        d={`
          M 165,38
          L 195,38
          Q 200,38 200,43
          L 200,57
          Q 200,62 195,62
          L 165,62
          L 170,55
          L 165,50
          L 170,45
          Z
        `}
        fill="#f5f5f5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      {/* Text */}
      {text && (
        <motion.text
          x="110"
          y={text2 ? "48" : "55"}
          textAnchor="middle"
          fill={textColor}
          fontSize="12"
          fontFamily={font}
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="110"
          y="64"
          textAnchor="middle"
          fill={textColor}
          fontSize="9"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {text2}
        </motion.text>
      )}
    </svg>
  )

  const renderRound = () => (
    <svg viewBox="0 0 150 120" className="w-full max-w-xs mx-auto">
      <defs>
        <linearGradient id={`roundGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.light}/>
          <stop offset="50%" stopColor={colors.mid}/>
          <stop offset="100%" stopColor={colors.dark}/>
        </linearGradient>
      </defs>

      {/* Ring */}
      <motion.circle
        cx="75"
        cy="15"
        r="8"
        fill="none"
        stroke="#888"
        strokeWidth="2.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      />

      {/* Round body */}
      <motion.circle
        cx="75"
        cy="65"
        r="40"
        fill={`url(#roundGrad-${color})`}
        stroke={colors.dark}
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Hole */}
      <motion.circle
        cx="75"
        cy="32"
        r="5"
        fill="#f5f5f5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      />

      {/* Text */}
      {text && (
        <motion.text
          x="75"
          y={text2 ? "62" : "70"}
          textAnchor="middle"
          fill={textColor}
          fontSize="11"
          fontFamily={font}
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.text>
      )}
      {text2 && (
        <motion.text
          x="75"
          y="78"
          textAnchor="middle"
          fill={textColor}
          fontSize="8"
          fontFamily={font}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {text2}
        </motion.text>
      )}
    </svg>
  )

  return (
    <div className="w-full">
      {shape === 'rectangle' && renderRectangle()}
      {shape === 'oval' && renderOval()}
      {shape === 'dog-tag' && renderDogTag()}
      {shape === 'bottle-opener' && renderBottleOpener()}
      {shape === 'round' && renderRound()}

      <p className="text-center text-sm text-gray-500 mt-3">
        {shape === 'rectangle' && 'Rectangle Keychain'}
        {shape === 'oval' && 'Oval Keychain'}
        {shape === 'dog-tag' && 'Dog Tag Style'}
        {shape === 'bottle-opener' && 'Bottle Opener Keychain'}
        {shape === 'round' && 'Round Keychain'}
      </p>
    </div>
  )
}
