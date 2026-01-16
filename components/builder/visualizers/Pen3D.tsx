'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Text, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

interface Pen3DProps {
  line1?: string
  line2?: string
  textStyle?: 'one-line' | 'two-lines'
  penColor?: string
  isFountain?: boolean
}

// Premium color configurations with realistic material properties
const colorConfigs: Record<string, { base: THREE.Color; metalness: number; roughness: number; engrave: string }> = {
  '#1a1a1a': { base: new THREE.Color('#1a1a1a'), metalness: 0.25, roughness: 0.5, engrave: '#c0c0c0' },
  '#f5f5f5': { base: new THREE.Color('#f0f0f0'), metalness: 0.15, roughness: 0.45, engrave: '#2a2a2a' },
  '#2a5a9e': { base: new THREE.Color('#2a5a9e'), metalness: 0.3, roughness: 0.45, engrave: '#d0e0f0' },
  '#c43a3a': { base: new THREE.Color('#c43a3a'), metalness: 0.3, roughness: 0.45, engrave: '#f0d0d0' },
  '#e87a9a': { base: new THREE.Color('#e87a9a'), metalness: 0.25, roughness: 0.5, engrave: '#ffffff' },
  '#6a3a8a': { base: new THREE.Color('#6a3a8a'), metalness: 0.3, roughness: 0.45, engrave: '#e0d0f0' },
}

function StylusPen({ line1, line2, textStyle, penColor }: Omit<Pen3DProps, 'isFountain'>) {
  const groupRef = useRef<THREE.Group>(null)
  const config = colorConfigs[penColor || '#1a1a1a'] || colorConfigs['#1a1a1a']

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle idle animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.01
    }
  })

  // Premium chrome material
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e8e8e8',
    metalness: 0.95,
    roughness: 0.08,
    envMapIntensity: 1.5,
  }), [])

  // Soft-touch barrel
  const barrel = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.base,
    metalness: config.metalness,
    roughness: config.roughness,
  }), [config])

  // Rubber tip
  const rubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0,
    roughness: 0.9,
  }), [])

  const penLength = 3.2
  const penRadius = 0.095
  const tipLength = 0.32

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]} position={[0, 0.15, 0]} scale={1.1}>
      {/* Chrome tip */}
      <mesh position={[-penLength/2 - tipLength/2, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={chrome}>
        <coneGeometry args={[penRadius * 0.8, tipLength, 32]} />
      </mesh>

      {/* Chrome collar */}
      <mesh position={[-penLength/2 + 0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chrome}>
        <cylinderGeometry args={[penRadius * 1.05, penRadius * 1.08, 0.07, 32]} />
      </mesh>

      {/* Chrome ring */}
      <mesh position={[-penLength/2 + 0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chrome}>
        <cylinderGeometry args={[penRadius * 1.06, penRadius * 1.06, 0.035, 32]} />
      </mesh>

      {/* Lower barrel */}
      <mesh position={[-penLength/4 - 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={barrel}>
        <cylinderGeometry args={[penRadius, penRadius, penLength/2.3, 32]} />
      </mesh>

      {/* Main barrel with engraving */}
      <mesh position={[penLength/7, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={barrel}>
        <cylinderGeometry args={[penRadius * 0.97, penRadius * 0.97, penLength/1.9, 32]} />
      </mesh>

      {/* Engraved text */}
      {(line1 || 'YOUR BUSINESS') && (
        <Text
          position={[penLength/7, penRadius + 0.006, 0]}
          fontSize={textStyle === 'two-lines' ? 0.05 : 0.065}
          color={config.engrave}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
          letterSpacing={0.015}
          font="/fonts/Inter-Medium.woff2"
        >
          {line1 || 'YOUR BUSINESS'}
        </Text>
      )}
      {textStyle === 'two-lines' && (line2 || 'yourbusiness.com') && (
        <Text
          position={[penLength/7, penRadius * 0.35, 0]}
          fontSize={0.035}
          color={config.engrave}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
          letterSpacing={0.01}
          font="/fonts/Inter-Regular.woff2"
        >
          {line2 || 'yourbusiness.com'}
        </Text>
      )}

      {/* Pocket clip */}
      <group position={[penLength/4 + 0.25, penRadius + 0.035, 0]}>
        <mesh material={chrome}>
          <boxGeometry args={[0.85, 0.016, 0.05]} />
        </mesh>
        <mesh position={[-0.4, 0.008, 0]} material={chrome}>
          <boxGeometry args={[0.07, 0.032, 0.05]} />
        </mesh>
      </group>

      {/* Ring before cap */}
      <mesh position={[penLength/2 - 0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chrome}>
        <cylinderGeometry args={[penRadius * 1.01, penRadius * 1.01, 0.035, 32]} />
      </mesh>

      {/* Cap section */}
      <mesh position={[penLength/2 - 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={barrel}>
        <cylinderGeometry args={[penRadius * 0.9, penRadius * 0.9, 0.5, 32]} />
      </mesh>

      {/* Stylus tip */}
      <mesh position={[penLength/2 + 0.07, 0, 0]} material={rubber}>
        <sphereGeometry args={[penRadius * 0.85, 32, 32]} />
      </mesh>
    </group>
  )
}

function FountainPen({ line1 }: { line1?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.015
    }
  })

  const gold = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d4af37',
    metalness: 0.9,
    roughness: 0.18,
    envMapIntensity: 1.3,
  }), [])

  const lacquer = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    metalness: 0.6,
    roughness: 0.12,
    envMapIntensity: 1.2,
  }), [])

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]} position={[0, 0.1, 0]} scale={1}>
      {/* Nib */}
      <mesh position={[-2.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={gold}>
        <coneGeometry args={[0.045, 0.5, 4]} />
      </mesh>

      {/* Section */}
      <mesh position={[-2.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={gold}>
        <cylinderGeometry args={[0.085, 0.065, 0.4, 32]} />
      </mesh>

      {/* Gold band */}
      <mesh position={[-2.0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={gold}>
        <cylinderGeometry args={[0.095, 0.095, 0.055, 32]} />
      </mesh>

      {/* Barrel */}
      <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={lacquer}>
        <cylinderGeometry args={[0.09, 0.09, 3, 32]} />
      </mesh>

      {/* Text */}
      <Text
        position={[-0.4, 0.1, 0]}
        fontSize={0.06}
        color="#707070"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        font="/fonts/Inter-Medium.woff2"
      >
        {line1 || 'YOUR BUSINESS'}
      </Text>

      {/* Gold band */}
      <mesh position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={gold}>
        <cylinderGeometry args={[0.095, 0.095, 0.055, 32]} />
      </mesh>

      {/* Cap */}
      <mesh position={[1.65, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={lacquer}>
        <cylinderGeometry args={[0.09, 0.09, 1, 32]} />
      </mesh>

      {/* Clip */}
      <mesh position={[1.4, 0.13, 0]} material={gold}>
        <boxGeometry args={[0.8, 0.016, 0.045]} />
      </mesh>

      {/* Finial */}
      <mesh position={[2.2, 0, 0]} material={lacquer}>
        <sphereGeometry args={[0.07, 32, 32]} />
      </mesh>
    </group>
  )
}

function Scene(props: Pen3DProps) {
  return (
    <>
      {/* Clean studio lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />
      <directionalLight position={[0, -3, 0]} intensity={0.2} />

      {/* Studio environment for realistic reflections */}
      <Environment preset="studio" background={false} />

      {/* The pen with presentation controls */}
      <PresentationControls
        global
        rotation={[0.1, 0, 0]}
        polar={[-0.3, 0.3]}
        azimuth={[-0.5, 0.5]}
        snap
      >
        {props.isFountain ? (
          <FountainPen line1={props.line1} />
        ) : (
          <StylusPen {...props} />
        )}
      </PresentationControls>

      {/* Orbit controls as fallback */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 1.7}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        rotateSpeed={0.4}
      />
    </>
  )
}

export default function Pen3D(props: Pen3DProps) {
  return (
    <div className="w-full h-[300px] relative">
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 32 }}
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
