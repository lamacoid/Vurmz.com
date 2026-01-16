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

interface BusinessCard3DProps {
  name?: string
  title?: string
  company?: string
  phone?: string
  email?: string
  cardColor?: string
  finish?: 'matte' | 'brushed' | 'mirror'
}

// Accurate specs for anodized aluminum business cards:
// Standard size: 3.5" x 2" (89mm x 51mm)
// Thickness: 0.8mm to 1mm (premium feel)
// Anodized colors with laser-engraved contrast

const colorConfigs: Record<string, { base: THREE.Color; engrave: string }> = {
  'black': { base: new THREE.Color('#1a1a1a'), engrave: '#d0d0d0' },
  'silver': { base: new THREE.Color('#c8c8c8'), engrave: '#2a2a2a' },
  'gold': { base: new THREE.Color('#c9a227'), engrave: '#1a1a1a' },
  'gunmetal': { base: new THREE.Color('#3a3a3a'), engrave: '#b0b0b0' },
  'rose-gold': { base: new THREE.Color('#b5807a'), engrave: '#ffffff' },
  'blue': { base: new THREE.Color('#1e4070'), engrave: '#d0e0f0' },
}

function MetalCard({
  name = '',
  title = '',
  company = '',
  phone = '',
  email = '',
  cardColor = 'black',
  finish = 'brushed',
}: BusinessCard3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle sway - text stays readable
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.1
      groupRef.current.rotation.x = 0.12 + Math.sin(state.clock.elapsedTime * 0.2) * 0.02
      groupRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 0.3) * 0.015
    }
  })

  const config = colorConfigs[cardColor] || colorConfigs['black']

  // Material properties based on anodized finish
  const materialProps = useMemo(() => {
    switch (finish) {
      case 'mirror':
        return { metalness: 0.98, roughness: 0.02 }
      case 'matte':
        return { metalness: 0.7, roughness: 0.55 }
      case 'brushed':
      default:
        return { metalness: 0.85, roughness: 0.2 }
    }
  }, [finish])

  const cardMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.base,
    metalness: materialProps.metalness,
    roughness: materialProps.roughness,
    envMapIntensity: 1.15,
  }), [config.base, materialProps])

  // Accurate business card dimensions (scaled):
  // Real: 3.5" x 2" x 0.8mm = ratio 3.5:2:0.008
  // Scaled: 3.0 x 1.71 x 0.015 units
  const cardWidth = 3.0
  const cardHeight = 1.71
  const cardThickness = 0.015

  return (
    <group ref={groupRef} position={[0, 0.15, 0]}>
      {/* Main card body - anodized aluminum */}
      <RoundedBox
        args={[cardWidth, cardHeight, cardThickness]}
        radius={0.03}
        smoothness={4}
        material={cardMaterial}
        castShadow
      />

      {/* Laser engraved content - front side */}
      <group position={[0, 0, cardThickness / 2 + 0.002]}>
        {/* Name - primary text */}
        <Text
          position={[-cardWidth/2 + 0.25, cardHeight/2 - 0.35, 0]}
          fontSize={0.18}
          color={config.engrave}
          anchorX="left"
          anchorY="middle"
          maxWidth={cardWidth - 0.5}
          letterSpacing={0.01}
        >
          {name || 'JOHN DOE'}
        </Text>

        {/* Title */}
        <Text
          position={[-cardWidth/2 + 0.25, cardHeight/2 - 0.58, 0]}
          fontSize={0.1}
          color={config.engrave}
          anchorX="left"
          anchorY="middle"
          maxWidth={cardWidth - 0.5}
        >
          {title || 'CEO & Founder'}
        </Text>

        {/* Company */}
        <Text
          position={[-cardWidth/2 + 0.25, cardHeight/2 - 0.78, 0]}
          fontSize={0.085}
          color={config.engrave}
          anchorX="left"
          anchorY="middle"
          maxWidth={cardWidth - 0.5}
          letterSpacing={0.03}
        >
          {company || 'ACME CORPORATION'}
        </Text>

        {/* Subtle divider line */}
        <mesh position={[0, -cardHeight/2 + 0.55, 0]}>
          <planeGeometry args={[cardWidth - 0.5, 0.002]} />
          <meshStandardMaterial color={config.engrave} transparent opacity={0.25} />
        </mesh>

        {/* Phone */}
        <Text
          position={[-cardWidth/2 + 0.25, -cardHeight/2 + 0.35, 0]}
          fontSize={0.075}
          color={config.engrave}
          anchorX="left"
          anchorY="middle"
          maxWidth={cardWidth/2}
        >
          {phone || '(555) 123-4567'}
        </Text>

        {/* Email */}
        <Text
          position={[-cardWidth/2 + 0.25, -cardHeight/2 + 0.18, 0]}
          fontSize={0.065}
          color={config.engrave}
          anchorX="left"
          anchorY="middle"
          maxWidth={cardWidth - 0.3}
        >
          {email || 'john@acmecorp.com'}
        </Text>
      </group>
    </group>
  )
}

function Scene(props: BusinessCard3DProps) {
  return (
    <>
      {/* Clean studio lighting for floating product */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <directionalLight position={[-4, 6, -3]} intensity={0.5} />
      <directionalLight position={[0, -3, 0]} intensity={0.2} />

      {/* Studio environment for realistic metal reflections */}
      <Environment preset="studio" background={false} />

      {/* Premium presentation controls */}
      <PresentationControls
        global
        rotation={[0.15, 0, 0]}
        polar={[-0.3, 0.3]}
        azimuth={[-0.6, 0.6]}
        snap
      >
        <MetalCard {...props} />
      </PresentationControls>

      {/* Orbit controls as fallback */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 5}
        maxAzimuthAngle={Math.PI / 5}
        rotateSpeed={0.4}
      />
    </>
  )
}

export default function BusinessCard3D(props: BusinessCard3DProps) {
  return (
    <div className="w-full h-[280px] relative">
      <Canvas
        camera={{ position: [0, 2, 4.5], fov: 32 }}
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
