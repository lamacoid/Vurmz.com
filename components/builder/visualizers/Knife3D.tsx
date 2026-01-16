'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Text,
  PresentationControls,
} from '@react-three/drei'
import * as THREE from 'three'

interface Knife3DProps {
  type?: 'chef' | 'pocket'
  bladeText?: string
  handleText?: string
  engravingLocation?: 'blade' | 'handle' | 'both'
  font?: string
}

// Accurate proportions based on real knife specifications:
// Miyabi SG2 8" Chef: Blade 8", Height 1.875", Overall 13.25", Spine 2mm
// Kershaw Pocket: Blade 3", Overall 7", Handle with G-10

function ChefKnife({
  bladeText = '',
  handleText = '',
  engravingLocation = 'blade',
}: {
  bladeText?: string
  handleText?: string
  engravingLocation?: 'blade' | 'handle' | 'both'
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle sway - text stays visible
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.012
    }
  })

  // Premium Damascus steel blade - based on Miyabi SG2
  const bladeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c8c8c8'),
    metalness: 0.92,
    roughness: 0.12,
    envMapIntensity: 1.3,
  }), [])

  // Pakkawood handle - Miyabi style rich rosewood
  const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3d1f14'),
    metalness: 0.15,
    roughness: 0.55,
  }), [])

  // Stainless steel bolster
  const bolsterMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b8b8b8'),
    metalness: 0.95,
    roughness: 0.15,
  }), [])

  const showBlade = engravingLocation === 'blade' || engravingLocation === 'both'
  const showHandle = engravingLocation === 'handle' || engravingLocation === 'both'

  // Miyabi SG2 8" chef knife proportions:
  // Blade: 8" (scaled to 2.8 units), Height: 1.875" (0.65 units)
  // Handle: ~5" (1.75 units), Overall: 13.25"
  const bladeShape = useMemo(() => {
    const shape = new THREE.Shape()
    // Accurate Japanese gyuto profile with classic curve
    shape.moveTo(0, 0.15)                              // Heel start
    shape.lineTo(0, 0.02)                              // Heel bottom
    shape.quadraticCurveTo(0.6, 0.35, 1.4, 0.45)      // Belly curve up
    shape.quadraticCurveTo(2.0, 0.42, 2.5, 0.25)      // Toward tip
    shape.quadraticCurveTo(2.7, 0.12, 2.8, 0)         // Tip point
    shape.lineTo(2.7, -0.04)                           // Spine start
    shape.quadraticCurveTo(2.0, -0.06, 1.0, -0.05)    // Spine curve
    shape.quadraticCurveTo(0.3, -0.04, 0, 0.02)       // Back to heel
    shape.lineTo(0, 0.15)
    return shape
  }, [])

  const extrudeSettings = {
    depth: 0.018,  // 2mm spine thickness scaled
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.002,
    bevelSegments: 4,
  }

  return (
    <group ref={groupRef} position={[0.2, 0, 0]} rotation={[0.05, 0, 0]}>
      {/* Main blade - extruded shape */}
      <mesh
        geometry={new THREE.ExtrudeGeometry(bladeShape, extrudeSettings)}
        material={bladeMaterial}
        position={[-0.8, -0.15, -0.009]}
        castShadow
      />

      {/* Bolster - stainless steel transition piece */}
      <mesh position={[-0.85, 0.02, 0]} material={bolsterMaterial} castShadow>
        <boxGeometry args={[0.12, 0.32, 0.06]} />
      </mesh>

      {/* Handle - D-shaped Pakkawood with taper */}
      <mesh position={[-1.45, 0, 0]} rotation={[0, 0, 0.01]} material={handleMaterial} castShadow>
        <capsuleGeometry args={[0.065, 1.0, 8, 16]} />
      </mesh>

      {/* Handle end cap - stainless with mosaic accent feel */}
      <mesh position={[-1.98, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={bolsterMaterial}>
        <cylinderGeometry args={[0.05, 0.055, 0.04, 16]} />
      </mesh>

      {/* Red spacer accent (Miyabi signature) */}
      <mesh position={[-0.92, 0.02, 0]}>
        <boxGeometry args={[0.015, 0.26, 0.045]} />
        <meshStandardMaterial color="#8b2020" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Blade laser engraving - positioned on flat of blade */}
      {showBlade && bladeText && (
        <Text
          position={[0.5, 0.12, 0.012]}
          rotation={[0, 0, 0]}
          fontSize={0.065}
          color="#707070"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.2}
          letterSpacing={0.02}
        >
          {bladeText}
        </Text>
      )}

      {/* Handle engraving */}
      {showHandle && handleText && (
        <Text
          position={[-1.45, 0, 0.075]}
          rotation={[0, 0, 0]}
          fontSize={0.04}
          color="#a08060"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.7}
        >
          {handleText}
        </Text>
      )}
    </group>
  )
}

function PocketKnife({
  bladeText = '',
  handleText = '',
  engravingLocation = 'blade',
}: {
  bladeText?: string
  handleText?: string
  engravingLocation?: 'blade' | 'handle' | 'both'
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle sway - text stays visible
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.012
    }
  })

  // Kershaw blade - stonewash finish steel
  const bladeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b8b8b8'),
    metalness: 0.85,
    roughness: 0.25,
    envMapIntensity: 1.2,
  }), [])

  // G-10 handle - 3D machined texture, matte black
  const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1c1c1c'),
    metalness: 0.25,
    roughness: 0.75,
  }), [])

  // Stainless steel liner and hardware
  const linerMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#505050'),
    metalness: 0.85,
    roughness: 0.25,
  }), [])

  const showBlade = engravingLocation === 'blade' || engravingLocation === 'both'
  const showHandle = engravingLocation === 'handle' || engravingLocation === 'both'

  // Kershaw pocket knife proportions:
  // Blade: 3" (1.05 units), Overall: 7" (2.45 units)
  // Handle: 4" (1.4 units)
  const bladeShape = useMemo(() => {
    const shape = new THREE.Shape()
    // Drop point / clip point blade profile
    shape.moveTo(0, 0.08)                              // Heel top
    shape.lineTo(0, -0.02)                             // Heel bottom (edge)
    shape.quadraticCurveTo(0.3, 0.12, 0.7, 0.14)      // Belly curve
    shape.quadraticCurveTo(0.9, 0.12, 1.0, 0.06)      // Toward tip
    shape.lineTo(1.05, 0)                              // Sharp tip
    shape.lineTo(0.95, -0.03)                          // Clip point spine
    shape.quadraticCurveTo(0.5, -0.04, 0, -0.02)      // Spine to heel
    shape.lineTo(0, 0.08)
    return shape
  }, [])

  const extrudeSettings = {
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.002,
    bevelSegments: 3,
  }

  return (
    <group ref={groupRef} position={[0.3, 0, 0]}>
      {/* Main blade - extruded clip point */}
      <mesh
        geometry={new THREE.ExtrudeGeometry(bladeShape, extrudeSettings)}
        material={bladeMaterial}
        position={[-0.6, -0.03, -0.011]}
        castShadow
      />

      {/* Handle scale - top (G-10) */}
      <mesh position={[-1.3, 0.03, 0.035]} material={handleMaterial} castShadow>
        <boxGeometry args={[1.35, 0.28, 0.05]} />
      </mesh>

      {/* Handle scale - bottom (G-10) */}
      <mesh position={[-1.3, 0.03, -0.035]} material={handleMaterial} castShadow>
        <boxGeometry args={[1.35, 0.28, 0.05]} />
      </mesh>

      {/* Steel liner visible at spine */}
      <mesh position={[-1.3, 0.03, 0]} material={linerMaterial}>
        <boxGeometry args={[1.3, 0.25, 0.015]} />
      </mesh>

      {/* Pivot screw - recessed */}
      <mesh position={[-0.62, 0.03, 0.062]} rotation={[Math.PI / 2, 0, 0]} material={linerMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
      </mesh>
      {/* Torx head detail */}
      <mesh position={[-0.62, 0.03, 0.072]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.005, 6]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pocket clip - deep carry style */}
      <group position={[-1.55, 0.14, 0.058]}>
        <mesh material={linerMaterial}>
          <boxGeometry args={[0.7, 0.055, 0.015]} />
        </mesh>
        <mesh position={[-0.32, 0.025, 0]} material={linerMaterial}>
          <boxGeometry args={[0.08, 0.08, 0.015]} />
        </mesh>
      </group>

      {/* Flipper tab */}
      <mesh position={[-0.52, -0.06, 0]} material={linerMaterial}>
        <boxGeometry args={[0.12, 0.06, 0.06]} />
      </mesh>

      {/* Lock bar cutout visual */}
      <mesh position={[-0.9, 0.03, 0.037]}>
        <boxGeometry args={[0.3, 0.15, 0.004]} />
        <meshStandardMaterial color="#252525" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Blade laser engraving */}
      {showBlade && bladeText && (
        <Text
          position={[-0.15, 0.05, 0.015]}
          rotation={[0, 0, 0]}
          fontSize={0.045}
          color="#606060"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.7}
          letterSpacing={0.01}
        >
          {bladeText}
        </Text>
      )}

      {/* Handle engraving */}
      {showHandle && handleText && (
        <Text
          position={[-1.3, 0.03, 0.062]}
          rotation={[0, 0, 0]}
          fontSize={0.038}
          color="#707070"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.9}
        >
          {handleText}
        </Text>
      )}
    </group>
  )
}

function Scene({ type, bladeText, handleText, engravingLocation }: Knife3DProps) {
  const KnifeComponent = type === 'pocket' ? PocketKnife : ChefKnife

  return (
    <>
      {/* Clean studio lighting for floating product */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 8, 5]} intensity={1} />
      <directionalLight position={[-5, 6, -3]} intensity={0.5} />
      <directionalLight position={[0, -3, 0]} intensity={0.2} />

      {/* Studio environment for realistic metal reflections */}
      <Environment preset="studio" background={false} />

      {/* Premium presentation controls */}
      <PresentationControls
        global
        rotation={[0.1, 0, 0]}
        polar={[-0.3, 0.3]}
        azimuth={[-0.5, 0.5]}
        snap
      >
        <KnifeComponent
          bladeText={bladeText}
          handleText={handleText}
          engravingLocation={engravingLocation}
        />
      </PresentationControls>

      {/* Orbit controls as fallback */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        rotateSpeed={0.4}
      />
    </>
  )
}

export default function Knife3D({
  type = 'chef',
  bladeText = '',
  handleText = '',
  engravingLocation = 'blade',
}: Knife3DProps) {
  return (
    <div className="w-full h-[280px] relative">
      <Canvas
        camera={{ position: [0, 1, 4], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene
            type={type}
            bladeText={bladeText}
            handleText={handleText}
            engravingLocation={engravingLocation}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
