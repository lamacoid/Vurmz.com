'use client'

import { useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Center, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Logo3DProps {
  autoRotate?: boolean
  metalColor?: 'teal' | 'dark' | 'sky' | 'silver' | 'gold'
  showControls?: boolean
  className?: string
}

// Color configurations
const metalConfigs = {
  teal: { color: '#6a8c8c', metalness: 0.85, roughness: 0.15 },
  dark: { color: '#2c3533', metalness: 0.9, roughness: 0.1 },
  sky: { color: '#8caec4', metalness: 0.8, roughness: 0.2 },
  silver: { color: '#c8c8c8', metalness: 0.95, roughness: 0.1 },
  gold: { color: '#d4af37', metalness: 0.92, roughness: 0.15 },
}

// 3D Logo from Blender GLB file (uses actual VURMZ logo with proper RM ligature)
function VurmzLogoModel({ metalColor = 'teal', autoRotate = true }: { metalColor?: keyof typeof metalConfigs; autoRotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/vurmz-logo-3d.glb')

  const config = metalConfigs[metalColor] || metalConfigs.teal

  // Apply custom material
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: config.color,
          metalness: config.metalness,
          roughness: config.roughness,
          envMapIntensity: 1.2,
        })
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene, config])

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={8} />
    </group>
  )
}

function Scene({ metalColor, autoRotate }: { metalColor?: keyof typeof metalConfigs; autoRotate?: boolean }) {
  return (
    <>
      {/* Apple-style soft lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 10, 5]} intensity={0.9} />
      <directionalLight position={[-6, 8, -4]} intensity={0.4} />
      <directionalLight position={[0, -5, 0]} intensity={0.15} />

      {/* Environment for metal reflections */}
      <Environment preset="apartment" background={false} />

      {/* Centered logo */}
      <Center>
        <VurmzLogoModel metalColor={metalColor} autoRotate={autoRotate} />
      </Center>

      {/* Contact shadow */}
      <ContactShadows
        position={[0, -0.7, 0]}
        opacity={0.4}
        scale={8}
        blur={2.5}
        far={1.5}
      />

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
      />
    </>
  )
}

export default function Logo3D({
  autoRotate = true,
  metalColor = 'teal',
  showControls = true,
  className,
}: Logo3DProps) {
  return (
    <div className={className || "w-full h-[400px] bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] rounded-2xl overflow-hidden"}>
      <Canvas
        camera={{ position: [0, 1, 6], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <Scene metalColor={metalColor} autoRotate={autoRotate} />
        </Suspense>
      </Canvas>
      {showControls && (
        <div className="text-center text-xs text-gray-500 py-2">
          Drag to rotate | Scroll to zoom
        </div>
      )}
    </div>
  )
}

// Preload the GLB model
useGLTF.preload('/models/vurmz-logo-3d.glb')
