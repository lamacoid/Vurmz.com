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

interface Tool3DProps {
  toolType?: 'hammer' | 'wrench' | 'screwdriver' | 'pliers' | 'drill' | 'tape-measure' | 'level'
  text?: string
  textLine2?: string
}

// ============================================================================
// TOOL 3D VISUALIZER
// Photorealistic rendering of common tools with laser engraving
// ============================================================================

function HammerTool({ text, textLine2 }: { text?: string; textLine2?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.12
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.015
    }
  })

  // Polished steel head
  const steelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b0b0b0'),
    metalness: 0.88,
    roughness: 0.2,
    envMapIntensity: 1.2,
  }), [])

  // Hickory wood handle
  const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#a67c52'),
    metalness: 0.05,
    roughness: 0.65,
  }), [])

  return (
    <group ref={groupRef} rotation={[0, 0, -0.15]}>
      {/* Hammer head - forged steel */}
      <mesh position={[0, 0.85, 0]} material={steelMaterial} castShadow>
        <boxGeometry args={[0.65, 0.25, 0.25]} />
      </mesh>
      {/* Face (striking surface) */}
      <mesh position={[0.35, 0.85, 0]} rotation={[0, 0, Math.PI / 2]} material={steelMaterial} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
      </mesh>
      {/* Claw end */}
      <mesh position={[-0.35, 0.85, 0.06]} rotation={[0.3, 0, 0]} material={steelMaterial} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.08]} />
      </mesh>
      <mesh position={[-0.35, 0.85, -0.06]} rotation={[-0.3, 0, 0]} material={steelMaterial} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.08]} />
      </mesh>

      {/* Handle hole in head */}
      <mesh position={[0, 0.78, 0]} material={woodMaterial}>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
      </mesh>

      {/* Wood handle */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} material={woodMaterial} castShadow>
        <capsuleGeometry args={[0.055, 1.2, 8, 16]} />
      </mesh>

      {/* Rubber grip at bottom */}
      <mesh position={[0, -0.5, 0]}>
        <capsuleGeometry args={[0.06, 0.35, 8, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Laser engraved text on head */}
      {text && (
        <Text
          position={[0, 0.98, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.06}
          color="#505050"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.55}
          letterSpacing={0.02}
        >
          {text}
        </Text>
      )}
      {textLine2 && (
        <Text
          position={[0, 0.98, 0.09]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.04}
          color="#606060"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.5}
        >
          {textLine2}
        </Text>
      )}
    </group>
  )
}

function WrenchTool({ text, textLine2 }: { text?: string; textLine2?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.12
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.015
    }
  })

  // Chrome vanadium steel
  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c8c8c8'),
    metalness: 0.95,
    roughness: 0.08,
    envMapIntensity: 1.3,
  }), [])

  // Combination wrench shape
  const wrenchShape = useMemo(() => {
    const shape = new THREE.Shape()
    // Open end
    shape.moveTo(-1.2, 0.15)
    shape.lineTo(-1.0, 0.12)
    shape.lineTo(-0.9, 0.08)
    shape.lineTo(0.8, 0.06)
    // Box end (rounded)
    shape.quadraticCurveTo(1.0, 0.06, 1.1, 0.15)
    shape.quadraticCurveTo(1.2, 0.25, 1.1, 0.35)
    shape.quadraticCurveTo(1.0, 0.44, 0.8, 0.44)
    // Back to open end
    shape.lineTo(-0.9, 0.42)
    shape.lineTo(-1.0, 0.38)
    shape.lineTo(-1.2, 0.35)
    // Open end jaw
    shape.lineTo(-1.25, 0.32)
    shape.lineTo(-1.3, 0.25)
    shape.lineTo(-1.25, 0.18)
    shape.lineTo(-1.2, 0.15)
    return shape
  }, [])

  const extrudeSettings = {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.003,
    bevelSegments: 2,
  }

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      <mesh
        geometry={new THREE.ExtrudeGeometry(wrenchShape, extrudeSettings)}
        material={chromeMaterial}
        position={[0.2, -0.25, -0.02]}
        castShadow
      />

      {/* Engraved text on wrench body */}
      {text && (
        <Text
          position={[0, 0.25, 0.025]}
          fontSize={0.065}
          color="#707070"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.0}
          letterSpacing={0.02}
        >
          {text}
        </Text>
      )}
      {textLine2 && (
        <Text
          position={[0, 0.12, 0.025]}
          fontSize={0.04}
          color="#808080"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.8}
        >
          {textLine2}
        </Text>
      )}
    </group>
  )
}

function ScrewdriverTool({ text, textLine2 }: { text?: string; textLine2?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.12
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.015
    }
  })

  // Chrome shaft
  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d0d0d0'),
    metalness: 0.92,
    roughness: 0.1,
    envMapIntensity: 1.2,
  }), [])

  // Red/yellow Wiha-style handle
  const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c43a3a'),
    metalness: 0.1,
    roughness: 0.55,
  }), [])

  const yellowAccent = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e0a020'),
    metalness: 0.1,
    roughness: 0.55,
  }), [])

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Chrome shaft */}
      <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 16]} />
      </mesh>

      {/* Tip (flathead) */}
      <mesh position={[-1.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial} castShadow>
        <boxGeometry args={[0.05, 0.12, 0.015]} />
      </mesh>

      {/* Handle - main body */}
      <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={handleMaterial} castShadow>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
      </mesh>

      {/* Yellow accent stripe */}
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={yellowAccent}>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
      </mesh>

      {/* Chrome ferrule */}
      <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial}>
        <cylinderGeometry args={[0.06, 0.045, 0.12, 16]} />
      </mesh>

      {/* Engraved text on handle */}
      {text && (
        <Text
          position={[0.35, 0.11, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.045}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.6}
          letterSpacing={0.01}
        >
          {text}
        </Text>
      )}
    </group>
  )
}

function DrillTool({ text, textLine2 }: { text?: string; textLine2?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.015
    }
  })

  // DeWalt yellow
  const yellowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f0b020'),
    metalness: 0.15,
    roughness: 0.5,
  }), [])

  // Black housing
  const blackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a1a1a'),
    metalness: 0.2,
    roughness: 0.6,
  }), [])

  // Chrome chuck
  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c0c0c0'),
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 1.2,
  }), [])

  return (
    <group ref={groupRef} rotation={[0, -0.3, 0]} position={[-0.2, 0, 0]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} material={yellowMaterial} castShadow>
        <boxGeometry args={[0.9, 0.45, 0.35]} />
      </mesh>

      {/* Motor housing (rounded front) */}
      <mesh position={[0.5, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} material={blackMaterial} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
      </mesh>

      {/* Chuck */}
      <mesh position={[0.75, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
      </mesh>

      {/* Drill bit */}
      <mesh position={[1.0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial}>
        <coneGeometry args={[0.02, 0.35, 8]} />
      </mesh>

      {/* Handle/grip */}
      <mesh position={[-0.15, -0.4, 0]} rotation={[0.15, 0, 0]} material={blackMaterial} castShadow>
        <capsuleGeometry args={[0.09, 0.4, 8, 16]} />
      </mesh>

      {/* Battery pack */}
      <mesh position={[0, -0.55, 0]} material={blackMaterial} castShadow>
        <boxGeometry args={[0.55, 0.25, 0.3]} />
      </mesh>

      {/* Trigger */}
      <mesh position={[-0.1, -0.15, 0]} material={blackMaterial}>
        <boxGeometry args={[0.08, 0.12, 0.06]} />
      </mesh>

      {/* Engraved text on body */}
      {text && (
        <Text
          position={[0, 0.24, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.055}
          color="#1a1a1a"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.75}
          letterSpacing={0.02}
        >
          {text}
        </Text>
      )}
      {textLine2 && (
        <Text
          position={[0, 0.24, 0.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.035}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.6}
        >
          {textLine2}
        </Text>
      )}
    </group>
  )
}

function TapeMeasureTool({ text, textLine2 }: { text?: string; textLine2?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.12
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.015
    }
  })

  // Stanley yellow
  const yellowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f0c020'),
    metalness: 0.1,
    roughness: 0.55,
  }), [])

  // Chrome accents
  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c0c0c0'),
    metalness: 0.9,
    roughness: 0.15,
  }), [])

  // Rubber grip
  const rubberMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a1a1a'),
    metalness: 0.05,
    roughness: 0.8,
  }), [])

  return (
    <group ref={groupRef}>
      {/* Main body - rounded rectangle */}
      <RoundedBox
        args={[0.5, 0.55, 0.22]}
        radius={0.04}
        smoothness={4}
        material={yellowMaterial}
        castShadow
      />

      {/* Chrome ring/button */}
      <mesh position={[0.15, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} material={chromeMaterial}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
      </mesh>

      {/* Lock button */}
      <mesh position={[-0.1, 0.15, 0.115]} material={rubberMaterial}>
        <boxGeometry args={[0.08, 0.1, 0.02]} />
      </mesh>

      {/* Tape exit slot */}
      <mesh position={[0.27, 0, 0]} material={chromeMaterial}>
        <boxGeometry args={[0.02, 0.12, 0.18]} />
      </mesh>

      {/* Rubber grip zone */}
      <mesh position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.12, 0.52, 0.24]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.1} roughness={0.85} />
      </mesh>

      {/* Engraved text */}
      {text && (
        <Text
          position={[0.05, 0, 0.125]}
          fontSize={0.05}
          color="#1a1a1a"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.35}
          letterSpacing={0.02}
        >
          {text}
        </Text>
      )}
      {textLine2 && (
        <Text
          position={[0.05, -0.1, 0.125]}
          fontSize={0.03}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.3}
        >
          {textLine2}
        </Text>
      )}
    </group>
  )
}

// Main Scene
function Scene({ toolType, text, textLine2 }: Tool3DProps) {
  const renderTool = () => {
    switch (toolType) {
      case 'hammer':
        return <HammerTool text={text} textLine2={textLine2} />
      case 'wrench':
        return <WrenchTool text={text} textLine2={textLine2} />
      case 'screwdriver':
        return <ScrewdriverTool text={text} textLine2={textLine2} />
      case 'drill':
        return <DrillTool text={text} textLine2={textLine2} />
      case 'tape-measure':
        return <TapeMeasureTool text={text} textLine2={textLine2} />
      default:
        return <HammerTool text={text} textLine2={textLine2} />
    }
  }

  return (
    <>
      {/* Clean studio lighting for floating product */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <directionalLight position={[-4, 6, -3]} intensity={0.5} />
      <directionalLight position={[0, -3, 0]} intensity={0.2} />

      {/* Studio environment for realistic reflections */}
      <Environment preset="studio" background={false} />

      {/* Premium presentation controls */}
      <PresentationControls
        global
        rotation={[0.1, 0, 0]}
        polar={[-0.35, 0.35]}
        azimuth={[-0.5, 0.5]}
        snap
      >
        {renderTool()}
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

export default function Tool3D({
  toolType = 'hammer',
  text = '',
  textLine2 = '',
}: Tool3DProps) {
  return (
    <div className="w-full h-[280px] relative">
      <Canvas
        camera={{ position: [0, 1.2, 3.5], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene toolType={toolType} text={text} textLine2={textLine2} />
        </Suspense>
      </Canvas>
    </div>
  )
}
