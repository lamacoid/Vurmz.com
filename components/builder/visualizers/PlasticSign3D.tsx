'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Text,
  RoundedBox,
  PresentationControls,
} from '@react-three/drei'
import * as THREE from 'three'

interface PlasticSign3DProps {
  type?: 'sign' | 'tag' | 'nametag'
  shape?: 'rectangle' | 'rounded' | 'oval' | 'round'
  width?: number
  height?: number
  material?: string
  line1?: string
  line2?: string
  line3?: string
  line4?: string
  textAlignment?: 'left' | 'center' | 'right'
  hasHole?: boolean
  holePosition?: 'top' | 'top-center' | 'left' | 'none'
}

// ============================================================================
// PHOTOREALISTIC MATERIAL DEFINITIONS
// Two-tone engraving plastics have a surface color that gets laser-engraved
// to reveal a contrasting core color underneath.
// ============================================================================

const MATERIAL_CONFIGS: Record<string, {
  name: string
  surfaceColor: THREE.Color
  coreColor: THREE.Color
  type: 'plastic' | 'metal' | 'brass'
  glossiness: number
  thickness: number
}> = {
  // TWO-TONE ENGRAVING PLASTICS (Rowmark-style)
  'abs-black-white': {
    name: 'ABS Black/White',
    surfaceColor: new THREE.Color('#1a1a1a'),
    coreColor: new THREE.Color('#f8f8f8'),
    type: 'plastic',
    glossiness: 0.35,
    thickness: 0.04,
  },
  'abs-white-black': {
    name: 'ABS White/Black',
    surfaceColor: new THREE.Color('#f5f5f5'),
    coreColor: new THREE.Color('#1a1a1a'),
    type: 'plastic',
    glossiness: 0.35,
    thickness: 0.04,
  },
  'plastic-black': {
    name: 'Black/White Plastic',
    surfaceColor: new THREE.Color('#1a1a1a'),
    coreColor: new THREE.Color('#ffffff'),
    type: 'plastic',
    glossiness: 0.3,
    thickness: 0.04,
  },
  'plastic-blue': {
    name: 'Blue/White Plastic',
    surfaceColor: new THREE.Color('#1e3a5f'),
    coreColor: new THREE.Color('#ffffff'),
    type: 'plastic',
    glossiness: 0.35,
    thickness: 0.04,
  },
  'plastic-red': {
    name: 'Red/White Plastic',
    surfaceColor: new THREE.Color('#8b2635'),
    coreColor: new THREE.Color('#ffffff'),
    type: 'plastic',
    glossiness: 0.35,
    thickness: 0.04,
  },
  'plastic-green': {
    name: 'Green/White Plastic',
    surfaceColor: new THREE.Color('#2d5a3c'),
    coreColor: new THREE.Color('#ffffff'),
    type: 'plastic',
    glossiness: 0.35,
    thickness: 0.04,
  },
  'plastic-gold': {
    name: 'Gold/Black Plastic',
    surfaceColor: new THREE.Color('#c9a227'),
    coreColor: new THREE.Color('#1a1a1a'),
    type: 'plastic',
    glossiness: 0.45,
    thickness: 0.04,
  },
  'plastic-silver': {
    name: 'Silver/Black Plastic',
    surfaceColor: new THREE.Color('#b8b8b8'),
    coreColor: new THREE.Color('#1a1a1a'),
    type: 'plastic',
    glossiness: 0.5,
    thickness: 0.04,
  },
  'plastic-burgundy': {
    name: 'Burgundy/Gold Plastic',
    surfaceColor: new THREE.Color('#722f37'),
    coreColor: new THREE.Color('#d4af37'),
    type: 'plastic',
    glossiness: 0.4,
    thickness: 0.04,
  },
  'plastic-yellow': {
    name: 'Yellow/Black Plastic',
    surfaceColor: new THREE.Color('#f0c020'),
    coreColor: new THREE.Color('#1a1a1a'),
    type: 'plastic',
    glossiness: 0.35,
    thickness: 0.04,
  },
  'plastic-white': {
    name: 'White/Black Plastic',
    surfaceColor: new THREE.Color('#f5f5f5'),
    coreColor: new THREE.Color('#1a1a1a'),
    type: 'plastic',
    glossiness: 0.3,
    thickness: 0.04,
  },
  // METALS
  'anodized-black': {
    name: 'Anodized Black',
    surfaceColor: new THREE.Color('#1a1a1a'),
    coreColor: new THREE.Color('#c0c0c0'),
    type: 'metal',
    glossiness: 0.75,
    thickness: 0.025,
  },
  'anodized-blue': {
    name: 'Anodized Blue',
    surfaceColor: new THREE.Color('#1e3a5f'),
    coreColor: new THREE.Color('#c0c0c0'),
    type: 'metal',
    glossiness: 0.75,
    thickness: 0.025,
  },
  'anodized-red': {
    name: 'Anodized Red',
    surfaceColor: new THREE.Color('#8b0000'),
    coreColor: new THREE.Color('#f0d080'),
    type: 'metal',
    glossiness: 0.75,
    thickness: 0.025,
  },
  'anodized-gold': {
    name: 'Anodized Gold',
    surfaceColor: new THREE.Color('#DAA520'),
    coreColor: new THREE.Color('#1a1a1a'),
    type: 'metal',
    glossiness: 0.8,
    thickness: 0.025,
  },
  'stainless': {
    name: 'Stainless Steel',
    surfaceColor: new THREE.Color('#C0C0C0'),
    coreColor: new THREE.Color('#2a2a2a'),
    type: 'metal',
    glossiness: 0.85,
    thickness: 0.02,
  },
  // BRASS (Premium)
  'brass': {
    name: 'Solid Brass',
    surfaceColor: new THREE.Color('#B5A642'),
    coreColor: new THREE.Color('#8B7355'),
    type: 'brass',
    glossiness: 0.88,
    thickness: 0.035,
  },
}

// ============================================================================
// SIGN BODY - Photorealistic rendering with engraved text
// ============================================================================

function SignBody({
  type = 'sign',
  shape = 'rectangle',
  width = 4,
  height = 2,
  material = 'plastic-black',
  line1 = '',
  line2 = '',
  line3 = '',
  line4 = '',
  textAlignment = 'center',
  hasHole = false,
  holePosition = 'top-center',
}: PlasticSign3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const config = MATERIAL_CONFIGS[material] || MATERIAL_CONFIGS['plastic-black']

  // Very subtle floating animation - keeps focus on the product
  useFrame((state) => {
    if (groupRef.current) {
      // Minimal gentle sway to show it's 3D
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.01
    }
  })

  // Scale: 1 inch = 0.35 scene units
  const scale = 0.35
  const w = width * scale
  const h = height * scale
  const thickness = config.thickness

  // Photorealistic surface material
  const surfaceMaterial = useMemo(() => {
    if (config.type === 'plastic') {
      return new THREE.MeshPhysicalMaterial({
        color: config.surfaceColor,
        metalness: 0,
        roughness: 1 - config.glossiness,
        clearcoat: 0.2,
        clearcoatRoughness: 0.35,
        envMapIntensity: 0.6,
        side: THREE.DoubleSide,
      })
    } else if (config.type === 'brass') {
      return new THREE.MeshStandardMaterial({
        color: config.surfaceColor,
        metalness: 0.95,
        roughness: 0.1,
        envMapIntensity: 1.4,
      })
    } else {
      return new THREE.MeshStandardMaterial({
        color: config.surfaceColor,
        metalness: 0.88,
        roughness: 1 - config.glossiness,
        envMapIntensity: 1.2,
      })
    }
  }, [config])

  // Engraved text color (revealed core layer)
  const engraveColor = `#${config.coreColor.getHexString()}`

  // Text positioning
  const getTextAnchor = (): 'left' | 'center' | 'right' => {
    return textAlignment
  }

  const getTextX = () => {
    if (textAlignment === 'left') return -w / 2 + 0.06
    if (textAlignment === 'right') return w / 2 - 0.06
    return 0
  }

  // Build text lines array
  const lines: string[] = []
  if (line1) lines.push(line1)
  if (line2) lines.push(line2)
  if (line3) lines.push(line3)
  if (line4) lines.push(line4)

  // Dynamic font sizing based on sign dimensions
  const baseFontSize = Math.min(w * 0.15, h * 0.25, 0.12)
  const primaryFontSize = lines.length <= 2 ? baseFontSize * 1.3 : baseFontSize
  const secondaryFontSize = baseFontSize * 0.7

  // Vertical text distribution
  const getLineY = (index: number, total: number) => {
    const lineHeight = baseFontSize * 1.5
    const totalHeight = total * lineHeight
    const startY = totalHeight / 2 - lineHeight * 0.5
    return startY - index * lineHeight
  }

  const cornerRadius = shape === 'rounded' ? 0.04 : 0.012
  const isRound = shape === 'round' || shape === 'oval'

  return (
    <group ref={groupRef}>
      {/* Main body */}
      {isRound ? (
        <mesh material={surfaceMaterial} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[w / 2, w / 2, thickness, 64]} />
        </mesh>
      ) : (
        <RoundedBox
          args={[w, h, thickness]}
          radius={cornerRadius}
          smoothness={4}
          material={surfaceMaterial}
          castShadow
          receiveShadow
        />
      )}

      {/* Engraved text - positioned on front surface */}
      <group position={[0, 0, thickness / 2 + 0.001]}>
        {lines.map((text, idx) => (
          <Text
            key={idx}
            position={[getTextX(), getLineY(idx, lines.length), 0]}
            fontSize={idx === 0 ? primaryFontSize : secondaryFontSize}
            color={engraveColor}
            anchorX={getTextAnchor()}
            anchorY="middle"
            maxWidth={w * 0.9}
            textAlign={textAlignment}
            letterSpacing={0.02}
          >
            {text}
          </Text>
        ))}

        {/* Placeholder when empty */}
        {lines.length === 0 && (
          <Text
            position={[0, 0, 0]}
            fontSize={primaryFontSize}
            color={engraveColor}
            anchorX="center"
            anchorY="middle"
            maxWidth={w * 0.85}
            textAlign="center"
            letterSpacing={0.04}
          >
            {type === 'nametag' ? 'YOUR NAME' : 'YOUR TEXT'}
          </Text>
        )}
      </group>

      {/* Mounting hole */}
      {hasHole && holePosition !== 'none' && (
        <group
          position={[
            holePosition === 'left' ? -w / 2 + 0.08 : 0,
            holePosition === 'left' ? 0 : h / 2 - 0.06,
            0,
          ]}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, thickness + 0.01, 16]} />
            <meshStandardMaterial color="#333333" metalness={0.4} roughness={0.6} />
          </mesh>
        </group>
      )}
    </group>
  )
}

// ============================================================================
// SCENE - Clean studio lighting for floating product
// ============================================================================

function Scene(props: PlasticSign3DProps) {
  return (
    <>
      {/* Clean studio lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1} />
      <directionalLight position={[-3, 5, -2]} intensity={0.5} />
      <directionalLight position={[0, -3, 0]} intensity={0.2} />

      {/* Studio environment for realistic reflections */}
      <Environment preset="studio" background={false} />

      {/* Premium presentation controls */}
      <PresentationControls
        global
        rotation={[0.1, 0, 0]}
        polar={[-0.25, 0.25]}
        azimuth={[-0.4, 0.4]}
        snap
      >
        <SignBody {...props} />
      </PresentationControls>

      {/* Orbit controls as fallback */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.9}
        minAzimuthAngle={-Math.PI / 5}
        maxAzimuthAngle={Math.PI / 5}
        rotateSpeed={0.4}
      />
    </>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PlasticSign3D(props: PlasticSign3DProps) {
  return (
    <div className="w-full h-[260px] relative">
      <Canvas
        camera={{ position: [0, 0.6, 2], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export { MATERIAL_CONFIGS }
