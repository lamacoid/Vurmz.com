'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Text, RoundedBox, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

interface Keychain3DProps {
  shape?: 'rectangle' | 'oval' | 'dog-tag' | 'bottle-opener' | 'round'
  text?: string
  secondLine?: string
  materialColor?: string
}

// Anodized aluminum colors
const colorConfigs: Record<string, { base: THREE.Color; engrave: string }> = {
  'black': { base: new THREE.Color('#1a1a1a'), engrave: '#d0d0d0' },
  'silver': { base: new THREE.Color('#c0c0c0'), engrave: '#2a2a2a' },
  'red': { base: new THREE.Color('#b83a3a'), engrave: '#ffffff' },
  'blue': { base: new THREE.Color('#2a4a8a'), engrave: '#d0e0f0' },
  'green': { base: new THREE.Color('#2a6a4a'), engrave: '#d0f0e0' },
  'gold': { base: new THREE.Color('#c9a227'), engrave: '#1a1a1a' },
  'copper': { base: new THREE.Color('#b87333'), engrave: '#f0e0d0' },
  'teal': { base: new THREE.Color('#4a9b8c'), engrave: '#ffffff' },
}

function KeychainBody({
  shape = 'rectangle',
  text = '',
  secondLine = '',
  materialColor = 'black',
}: Keychain3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const config = colorConfigs[materialColor] || colorConfigs['black']

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle sway - text stays visible
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.015
    }
  })

  // Anodized aluminum material
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.base,
    metalness: 0.8,
    roughness: 0.25,
    envMapIntensity: 1.1,
  }), [config.base])

  // Chrome ring material
  const ringMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c8c8c8',
    metalness: 0.95,
    roughness: 0.08,
  }), [])

  // Standard keychain dimensions (scaled)
  const thickness = 0.05

  // Shape-specific geometry
  const renderShape = () => {
    switch (shape) {
      case 'rectangle':
        return (
          <>
            <RoundedBox args={[1.5, 0.8, thickness]} radius={0.08} smoothness={4} material={material} castShadow />
            {/* Keyring hole */}
            <mesh position={[0.6, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
              <torusGeometry args={[0.08, 0.02, 16, 32]} />
            </mesh>
          </>
        )

      case 'oval':
        return (
          <>
            <mesh material={material} castShadow>
              <capsuleGeometry args={[0.35, 0.8, 8, 32]} />
            </mesh>
            <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
              <torusGeometry args={[0.07, 0.018, 16, 32]} />
            </mesh>
          </>
        )

      case 'dog-tag':
        // Military dog tag shape
        const dogTagShape = new THREE.Shape()
        dogTagShape.moveTo(-0.4, 0.8)
        dogTagShape.lineTo(0.4, 0.8)
        dogTagShape.quadraticCurveTo(0.55, 0.8, 0.55, 0.65)
        dogTagShape.lineTo(0.55, -0.65)
        dogTagShape.quadraticCurveTo(0.55, -0.8, 0.4, -0.8)
        dogTagShape.lineTo(-0.4, -0.8)
        dogTagShape.quadraticCurveTo(-0.55, -0.8, -0.55, -0.65)
        dogTagShape.lineTo(-0.55, 0.65)
        dogTagShape.quadraticCurveTo(-0.55, 0.8, -0.4, 0.8)
        return (
          <>
            <mesh
              geometry={new THREE.ExtrudeGeometry(dogTagShape, { depth: thickness, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 })}
              material={material}
              position={[0, 0, -thickness / 2]}
              castShadow
            />
            {/* Notch */}
            <mesh position={[0.42, 0.65, 0]}>
              <cylinderGeometry args={[0.06, 0.06, thickness + 0.01, 16]} />
              <meshStandardMaterial color="#0a0a0a" />
            </mesh>
            {/* Hole for chain */}
            <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
              <torusGeometry args={[0.06, 0.015, 16, 32]} />
            </mesh>
          </>
        )

      case 'bottle-opener':
        // Bottle opener keychain shape
        const openerShape = new THREE.Shape()
        openerShape.moveTo(-0.6, 0.3)
        openerShape.lineTo(0.2, 0.3)
        openerShape.quadraticCurveTo(0.6, 0.3, 0.6, 0)
        openerShape.quadraticCurveTo(0.6, -0.3, 0.2, -0.3)
        openerShape.lineTo(-0.6, -0.3)
        openerShape.quadraticCurveTo(-0.75, -0.3, -0.75, 0)
        openerShape.quadraticCurveTo(-0.75, 0.3, -0.6, 0.3)
        // Opener cutout
        const openerHole = new THREE.Path()
        openerHole.moveTo(0.2, 0.12)
        openerHole.quadraticCurveTo(0.35, 0.12, 0.35, 0)
        openerHole.quadraticCurveTo(0.35, -0.12, 0.2, -0.12)
        openerHole.lineTo(0.15, -0.12)
        openerHole.lineTo(0.15, 0.12)
        openerHole.closePath()
        openerShape.holes.push(openerHole)
        return (
          <>
            <mesh
              geometry={new THREE.ExtrudeGeometry(openerShape, { depth: thickness, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 })}
              material={material}
              position={[0.1, 0, -thickness / 2]}
              castShadow
            />
            <mesh position={[-0.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
              <torusGeometry args={[0.07, 0.018, 16, 32]} />
            </mesh>
          </>
        )

      case 'round':
      default:
        return (
          <>
            <mesh material={material} castShadow>
              <cylinderGeometry args={[0.55, 0.55, thickness, 32]} />
            </mesh>
            <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
              <torusGeometry args={[0.08, 0.02, 16, 32]} />
            </mesh>
          </>
        )
    }
  }

  // Text positioning based on shape
  const getTextPosition = (): [number, number, number] => {
    switch (shape) {
      case 'rectangle': return [0, secondLine ? 0.08 : 0, thickness / 2 + 0.005]
      case 'oval': return [0, secondLine ? 0.1 : 0, 0.36]
      case 'dog-tag': return [0, secondLine ? 0.15 : 0, thickness / 2 + 0.005]
      case 'bottle-opener': return [-0.15, secondLine ? 0.05 : 0, thickness / 2 + 0.005]
      case 'round': return [0, secondLine ? 0.08 : 0, thickness / 2 + 0.005]
      default: return [0, 0, thickness / 2 + 0.005]
    }
  }

  const getSecondLinePosition = (): [number, number, number] => {
    const [x, y, z] = getTextPosition()
    return [x, y - 0.2, z]
  }

  const getMaxWidth = () => {
    switch (shape) {
      case 'rectangle': return 1.2
      case 'oval': return 0.5
      case 'dog-tag': return 0.9
      case 'bottle-opener': return 0.6
      case 'round': return 0.8
      default: return 1
    }
  }

  return (
    <group ref={groupRef} rotation={shape === 'oval' ? [0, 0, 0] : [Math.PI / 2, 0, 0]}>
      {renderShape()}

      {/* Primary text */}
      <Text
        position={getTextPosition()}
        fontSize={shape === 'dog-tag' ? 0.12 : 0.1}
        color={config.engrave}
        anchorX="center"
        anchorY="middle"
        maxWidth={getMaxWidth()}
        letterSpacing={0.02}
        rotation={shape === 'oval' ? [0, 0, 0] : [-Math.PI / 2, 0, 0]}
      >
        {text || 'YOUR TEXT'}
      </Text>

      {/* Second line */}
      {secondLine && (
        <Text
          position={getSecondLinePosition()}
          fontSize={0.07}
          color={config.engrave}
          anchorX="center"
          anchorY="middle"
          maxWidth={getMaxWidth()}
          rotation={shape === 'oval' ? [0, 0, 0] : [-Math.PI / 2, 0, 0]}
        >
          {secondLine}
        </Text>
      )}
    </group>
  )
}

function Scene(props: Keychain3DProps) {
  return (
    <>
      {/* Clean studio lighting for floating product */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <directionalLight position={[-4, 6, -3]} intensity={0.5} />
      <directionalLight position={[0, -3, 0]} intensity={0.2} />

      {/* Studio environment for realistic metal reflections */}
      <Environment preset="studio" background={false} />

      {/* Premium presentation controls */}
      <PresentationControls
        global
        rotation={[0.15, 0, 0]}
        polar={[-0.4, 0.4]}
        azimuth={[-0.6, 0.6]}
        snap
      >
        <KeychainBody {...props} />
      </PresentationControls>

      {/* Orbit controls as fallback */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.7}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        rotateSpeed={0.4}
      />
    </>
  )
}

export default function Keychain3D(props: Keychain3DProps) {
  return (
    <div className="w-full h-[260px] relative">
      <Canvas
        camera={{ position: [0, 1.5, 3.5], fov: 32 }}
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
