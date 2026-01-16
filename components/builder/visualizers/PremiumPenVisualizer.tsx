'use client'

import { motion } from 'framer-motion'

interface PremiumPenVisualizerProps {
  line1?: string
  line2?: string
  textStyle?: 'one-line' | 'two-lines'
  penColor?: string
  font?: string
  logoEnabled?: boolean
  logoPlacement?: 'cap' | 'barrel'
  isFountain?: boolean
}

export default function PremiumPenVisualizer({
  line1 = '',
  line2 = '',
  textStyle = 'two-lines',
  penColor = '#1a1a1a',
  font = 'Inter, sans-serif',
  logoEnabled = false,
  logoPlacement = 'cap',
  isFountain = false,
}: PremiumPenVisualizerProps) {

  // Color mapping with premium variations
  const getColorPalette = () => {
    const palettes: Record<string, {
      base: string;
      light: string;
      dark: string;
      highlight: string;
      shadow: string;
      engrave: string;
    }> = {
      '#1a1a1a': {
        base: '#1a1a1a',
        light: '#3d3d3d',
        dark: '#0a0a0a',
        highlight: 'rgba(255,255,255,0.15)',
        shadow: 'rgba(0,0,0,0.4)',
        engrave: '#b8b8b8'
      },
      '#f5f5f5': {
        base: '#f5f5f5',
        light: '#ffffff',
        dark: '#e0e0e0',
        highlight: 'rgba(255,255,255,0.6)',
        shadow: 'rgba(0,0,0,0.1)',
        engrave: '#333333'
      },
      '#2a5a9e': {
        base: '#2a5a9e',
        light: '#3d7acc',
        dark: '#1e4275',
        highlight: 'rgba(255,255,255,0.2)',
        shadow: 'rgba(0,0,0,0.3)',
        engrave: '#c0d4e8'
      },
      '#c43a3a': {
        base: '#c43a3a',
        light: '#e05555',
        dark: '#992b2b',
        highlight: 'rgba(255,255,255,0.2)',
        shadow: 'rgba(0,0,0,0.3)',
        engrave: '#f0c0c0'
      },
      '#e87a9a': {
        base: '#e87a9a',
        light: '#ff9db8',
        dark: '#c55a7a',
        highlight: 'rgba(255,255,255,0.25)',
        shadow: 'rgba(0,0,0,0.2)',
        engrave: '#ffffff'
      },
      '#6a3a8a': {
        base: '#6a3a8a',
        light: '#8a55aa',
        dark: '#4a2a6a',
        highlight: 'rgba(255,255,255,0.2)',
        shadow: 'rgba(0,0,0,0.3)',
        engrave: '#d0b8e0'
      },
    }
    return palettes[penColor] || palettes['#1a1a1a']
  }

  const colors = getColorPalette()

  if (isFountain) {
    return (
      <div className="w-full flex justify-center py-6">
        <motion.svg
          width="380"
          height="80"
          viewBox="0 0 380 80"
          className="drop-shadow-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <defs>
            {/* Gold nib gradient */}
            <linearGradient id="goldNib" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8d48b"/>
              <stop offset="25%" stopColor="#d4af37"/>
              <stop offset="50%" stopColor="#c9a227"/>
              <stop offset="75%" stopColor="#b8960c"/>
              <stop offset="100%" stopColor="#8b7355"/>
            </linearGradient>

            {/* Black lacquer body */}
            <linearGradient id="blackLacquer" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#404040"/>
              <stop offset="15%" stopColor="#2a2a2a"/>
              <stop offset="50%" stopColor="#1a1a1a"/>
              <stop offset="85%" stopColor="#0f0f0f"/>
              <stop offset="100%" stopColor="#1a1a1a"/>
            </linearGradient>

            {/* Subtle reflection */}
            <linearGradient id="fountainReflect" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)"/>
              <stop offset="50%" stopColor="rgba(255,255,255,0)"/>
            </linearGradient>

            {/* Soft shadow filter */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Main pen body with shadow */}
          <g filter="url(#softShadow)">
            {/* Gold nib - pointed tip */}
            <path d="M 5,40 Q 25,32 40,32 L 40,48 Q 25,48 5,40" fill="url(#goldNib)"/>
            <line x1="8" y1="40" x2="35" y2="40" stroke="#a08020" strokeWidth="0.5"/>
            <ellipse cx="40" cy="40" rx="3" ry="9" fill="#d4af37"/>

            {/* Gold section/grip */}
            <rect x="43" y="30" width="35" height="20" fill="url(#goldNib)" rx="2"/>
            <rect x="43" y="30" width="35" height="6" fill="rgba(255,255,255,0.2)" rx="2"/>

            {/* Gold band */}
            <rect x="78" y="29" width="5" height="22" fill="url(#goldNib)"/>

            {/* Black barrel */}
            <rect x="83" y="26" width="200" height="28" fill="url(#blackLacquer)" rx="3"/>
            <rect x="83" y="26" width="200" height="10" fill="url(#fountainReflect)" rx="3"/>

            {/* Engraving text */}
            <text
              x="183"
              y="44"
              textAnchor="middle"
              fill="#a0a0a0"
              fontSize="12"
              fontWeight="600"
              style={{ fontFamily: font }}
            >
              {line1 || 'YOUR BUSINESS'}
            </text>

            {/* Gold band before cap */}
            <rect x="283" y="29" width="5" height="22" fill="url(#goldNib)"/>

            {/* Cap */}
            <rect x="288" y="28" width="60" height="24" fill="url(#blackLacquer)" rx="4"/>
            <rect x="288" y="28" width="60" height="8" fill="url(#fountainReflect)" rx="4"/>

            {/* Gold pocket clip */}
            <path d="M 320 28 Q 320 20 325 16 L 360 16 L 360 22 Q 358 24 325 24 Q 320 24 320 28"
              fill="url(#goldNib)" stroke="#a08020" strokeWidth="0.5"/>

            {/* Cap finial */}
            <ellipse cx="352" cy="40" rx="4" ry="10" fill="url(#blackLacquer)"/>
          </g>
        </motion.svg>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center py-6">
      <motion.svg
        width="380"
        height="80"
        viewBox="0 0 380 80"
        className="drop-shadow-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          {/* Chrome tip gradient - premium metallic look */}
          <linearGradient id="chromeTip" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="10%" stopColor="#f0f0f0"/>
            <stop offset="30%" stopColor="#d8d8d8"/>
            <stop offset="50%" stopColor="#c0c0c0"/>
            <stop offset="70%" stopColor="#a8a8a8"/>
            <stop offset="90%" stopColor="#c0c0c0"/>
            <stop offset="100%" stopColor="#909090"/>
          </linearGradient>

          {/* Barrel body gradient - deep dimension */}
          <linearGradient id="barrelBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.light}/>
            <stop offset="20%" stopColor={colors.base}/>
            <stop offset="50%" stopColor={colors.dark}/>
            <stop offset="80%" stopColor={colors.base}/>
            <stop offset="100%" stopColor={colors.light}/>
          </linearGradient>

          {/* Top highlight reflection */}
          <linearGradient id="topHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.highlight}/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>

          {/* Chrome ring gradient */}
          <linearGradient id="chromeRing" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5"/>
            <stop offset="20%" stopColor="#e0e0e0"/>
            <stop offset="50%" stopColor="#b8b8b8"/>
            <stop offset="80%" stopColor="#d0d0d0"/>
            <stop offset="100%" stopColor="#e8e8e8"/>
          </linearGradient>

          {/* Stylus tip gradient */}
          <radialGradient id="stylusTip" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#4a4a4a"/>
            <stop offset="50%" stopColor="#333333"/>
            <stop offset="100%" stopColor="#1a1a1a"/>
          </radialGradient>

          {/* Soft shadow filter */}
          <filter id="penShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.25"/>
          </filter>

          {/* Inner glow for engraving */}
          <filter id="engravingGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
          </filter>
        </defs>

        {/* Main pen group with shadow */}
        <g filter="url(#penShadow)">
          {/* Chrome pointed tip */}
          <polygon points="5,40 35,30 35,50" fill="url(#chromeTip)"/>
          <line x1="10" y1="40" x2="32" y2="40" stroke="rgba(100,100,100,0.3)" strokeWidth="0.5"/>

          {/* First chrome accent ring */}
          <rect x="35" y="28" width="6" height="24" fill="url(#chromeRing)" rx="1"/>
          <rect x="36" y="28" width="4" height="8" fill="rgba(255,255,255,0.3)" rx="1"/>

          {/* Second chrome accent ring */}
          <rect x="43" y="28" width="6" height="24" fill="url(#chromeRing)" rx="1"/>
          <rect x="44" y="28" width="4" height="8" fill="rgba(255,255,255,0.3)" rx="1"/>

          {/* Main barrel body */}
          <rect x="49" y="24" width="220" height="32" fill="url(#barrelBody)" rx="4"/>

          {/* Barrel highlight reflection */}
          <rect x="49" y="24" width="220" height="12" fill="url(#topHighlight)" rx="4"/>

          {/* Subtle edge definition */}
          <rect x="49" y="24" width="220" height="32" fill="none" stroke={colors.shadow} strokeWidth="0.5" rx="4"/>

          {/* Engraving text area - recessed look */}
          <g style={{ fontFamily: font }}>
            {textStyle === 'two-lines' ? (
              <>
                <text
                  x="155"
                  y="37"
                  textAnchor="middle"
                  fill={colors.engrave}
                  fontSize="11"
                  fontWeight="600"
                  letterSpacing="0.5"
                >
                  {line1 || 'YOUR BUSINESS NAME'}
                </text>
                <text
                  x="155"
                  y="50"
                  textAnchor="middle"
                  fill={colors.engrave}
                  fontSize="8"
                  opacity="0.85"
                  letterSpacing="0.3"
                >
                  {line2 || 'www.yourbusiness.com'}
                </text>
              </>
            ) : (
              <text
                x="155"
                y="44"
                textAnchor="middle"
                fill={colors.engrave}
                fontSize="13"
                fontWeight="600"
                letterSpacing="0.5"
              >
                {line1 || 'YOUR BUSINESS'}
              </text>
            )}
          </g>

          {/* Logo placeholder on barrel */}
          {logoEnabled && logoPlacement === 'barrel' && (
            <g>
              <rect x="225" y="31" width="26" height="18" fill="rgba(255,255,255,0.1)" rx="3" stroke={colors.engrave} strokeWidth="0.5" strokeOpacity="0.5"/>
              <text x="238" y="43" textAnchor="middle" fill={colors.engrave} fontSize="6" fontWeight="500" opacity="0.7">LOGO</text>
            </g>
          )}

          {/* Logo placeholder on cap area */}
          {logoEnabled && logoPlacement === 'cap' && (
            <g>
              <rect x="60" y="31" width="26" height="18" fill="rgba(255,255,255,0.1)" rx="3" stroke={colors.engrave} strokeWidth="0.5" strokeOpacity="0.5"/>
              <text x="73" y="43" textAnchor="middle" fill={colors.engrave} fontSize="6" fontWeight="500" opacity="0.7">LOGO</text>
            </g>
          )}

          {/* Pocket clip - premium chrome */}
          <path
            d="M 269 24 Q 269 14 276 10 L 320 10 L 320 16 Q 316 18 276 18 Q 269 18 269 24"
            fill="url(#chromeTip)"
            stroke="rgba(150,150,150,0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M 269 24 Q 269 14 276 10 L 320 10 L 320 12 Q 316 14 278 14 Q 271 14 271 22"
            fill="rgba(255,255,255,0.3)"
          />

          {/* Chrome ring before cap */}
          <rect x="269" y="25" width="7" height="30" fill="url(#chromeRing)" rx="1"/>
          <rect x="270" y="25" width="5" height="10" fill="rgba(255,255,255,0.3)" rx="1"/>

          {/* Click mechanism/cap section */}
          <rect x="276" y="26" width="60" height="28" fill="url(#barrelBody)" rx="3"/>
          <rect x="276" y="26" width="60" height="10" fill="url(#topHighlight)" rx="3"/>

          {/* Stylus rubber tip */}
          <ellipse cx="346" cy="40" rx="12" ry="12" fill="url(#stylusTip)"/>
          <ellipse cx="344" cy="38" rx="5" ry="5" fill="rgba(255,255,255,0.08)"/>
        </g>
      </motion.svg>
    </div>
  )
}
