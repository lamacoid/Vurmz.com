'use client'

import { Suspense, useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, OrbitControls, Float } from '@react-three/drei'
import * as THREE from 'three'

// ─── Engraving texture manager ─────────────────────────────
function useEngravingTexture(width = 1024, height = 512) {
  const canvas = useMemo(() => {
    if (typeof document === 'undefined') return null
    const c = document.createElement('canvas')
    c.width = width
    c.height = height
    return c
  }, [width, height])

  const texture = useMemo(() => {
    if (!canvas) return null
    const tex = new THREE.CanvasTexture(canvas)
    tex.flipY = false
    return tex
  }, [canvas])

  const drawText = useCallback((text: string) => {
    if (!canvas || !texture) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    if (!text) {
      texture.needsUpdate = true
      return
    }

    let fontSize = 120
    ctx.font = `bold ${fontSize}px "Courier New", monospace`
    while (ctx.measureText(text).width > width * 0.8 && fontSize > 20) {
      fontSize -= 4
      ctx.font = `bold ${fontSize}px "Courier New", monospace`
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Depth shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillText(text, width / 2 + 2, height / 2 + 2)

    // Main engraved surface — bright silver
    ctx.fillStyle = '#c8d0d0'
    ctx.fillText(text, width / 2, height / 2)

    // Highlight pass
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = 'rgba(200,220,220,0.3)'
    ctx.fillText(text, width / 2, height / 2 - 1)
    ctx.globalCompositeOperation = 'source-over'

    texture.needsUpdate = true
  }, [canvas, texture, width, height])

  return { texture, drawText }
}

// ─── Laser beam effect ─────────────────────────────────────
function LaserBeam({ active, position }: { active: boolean; position: [number, number, number] }) {
  const beamRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (!beamRef.current) return
    beamRef.current.visible = active
    if (glowRef.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 30) * 0.3
      glowRef.current.intensity = active ? 3 * pulse : 0
    }
  })

  return (
    <group ref={beamRef} position={position}>
      <pointLight ref={glowRef} color="#ffffff" intensity={0} distance={0.5} decay={2} />
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={active ? 0.9 : 0} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.06, 16]} />
        <meshBasicMaterial color="#ff8c42" transparent opacity={active ? 0.4 : 0} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.001, 0.003, 0.3, 8]} />
        <meshBasicMaterial color="#ff6030" transparent opacity={active ? 0.6 : 0} />
      </mesh>
      <SparkParticles active={active} />
    </group>
  )
}

// ─── Spark particles ───────────────────────────────────────
function SparkParticles({ active }: { active: boolean }) {
  const count = 30
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const velocities = useRef(new Float32Array(count * 3))
  const lifetimes = useRef(new Float32Array(count))

  useFrame((_, delta) => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      if (active && lifetimes.current[i] <= 0 && Math.random() > 0.7) {
        velocities.current[i * 3] = (Math.random() - 0.5) * 2
        velocities.current[i * 3 + 1] = Math.random() * 3 + 1
        velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 2
        lifetimes.current[i] = 0.2 + Math.random() * 0.4
        dummy.position.set(0, 0, 0)
      } else {
        lifetimes.current[i] -= delta
        dummy.position.x += velocities.current[i * 3] * delta
        dummy.position.y += velocities.current[i * 3 + 1] * delta
        dummy.position.z += velocities.current[i * 3 + 2] * delta
        velocities.current[i * 3 + 1] -= 9.8 * delta
      }
      const scale = Math.max(0, lifetimes.current[i]) * 0.015
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffb74d" />
    </instancedMesh>
  )
}

// ─── Smoke effect ──────────────────────────────────────────
function SmokeEffect({ active, position }: { active: boolean; position: [number, number, number] }) {
  const count = 12
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const state = useRef(
    Array.from({ length: count }, () => ({
      y: 0, x: 0, z: 0, life: 0, scale: 0, speed: 0,
    }))
  )

  useFrame((_, delta) => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      const s = state.current[i]
      if (active && s.life <= 0 && Math.random() > 0.85) {
        s.x = (Math.random() - 0.5) * 0.03
        s.y = 0
        s.z = (Math.random() - 0.5) * 0.03
        s.life = 1
        s.scale = 0.01
        s.speed = 0.1 + Math.random() * 0.15
      }
      s.life -= delta * 0.5
      s.y += s.speed * delta
      s.x += Math.sin(s.y * 5 + i) * 0.01 * delta
      s.scale += delta * 0.04
      dummy.position.set(position[0] + s.x, position[1] + s.y + 0.02, position[2] + s.z)
      const sc = Math.max(0, s.life) * s.scale
      dummy.scale.setScalar(sc)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#667777" transparent opacity={0.15} />
    </instancedMesh>
  )
}

// ─── Machine model ─────────────────────────────────────────
function LaserMachine({ engravingTexture }: { engravingTexture: THREE.CanvasTexture | null }) {
  const { scene } = useGLTF('/models/laser-machine.glb')
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    const workpiece = clonedScene.getObjectByName('Workpiece')
    if (workpiece && workpiece instanceof THREE.Mesh && engravingTexture) {
      const mat = (workpiece.material as THREE.MeshStandardMaterial).clone()
      mat.emissiveMap = engravingTexture
      mat.emissive = new THREE.Color(0.6, 0.65, 0.65)
      mat.needsUpdate = true
      workpiece.material = mat
    }
  }, [clonedScene, engravingTexture])

  return <primitive object={clonedScene} />
}

// ─── Engraving animation controller ────────────────────────
function EngravingController({
  text,
  onLaserPosition,
  onProgress,
  onComplete,
  engravingDrawText,
}: {
  text: string
  onLaserPosition: (pos: [number, number, number], active: boolean) => void
  onProgress: (pct: number) => void
  onComplete: () => void
  engravingDrawText: (text: string) => void
}) {
  const charIndexRef = useRef(0)
  const charTimerRef = useRef(0)
  const targetTextRef = useRef('')
  const currentTextRef = useRef('')

  useFrame((_, delta) => {
    if (text !== targetTextRef.current) {
      targetTextRef.current = text
      charIndexRef.current = 0
      currentTextRef.current = ''
      charTimerRef.current = 0
      if (!text) {
        engravingDrawText('')
        onLaserPosition([0, 0.04, 0.2], false)
        onProgress(0)
      }
    }

    if (!text) return

    if (charIndexRef.current < text.length) {
      charTimerRef.current += delta
      if (charTimerRef.current >= 0.15) {
        charTimerRef.current = 0
        charIndexRef.current++
        currentTextRef.current = text.slice(0, charIndexRef.current)
        engravingDrawText(currentTextRef.current)
        onProgress(Math.floor((charIndexRef.current / text.length) * 100))
      }

      const charFraction = charIndexRef.current / Math.max(text.length, 1)
      const laserX = -0.7 + charFraction * 1.4
      onLaserPosition([laserX, 0.04, 0.2], true)
    } else {
      onLaserPosition([0, 0.04, 0.2], false)
      onProgress(100)
      onComplete()
    }
  })

  return null
}

// ─── Dust particles ────────────────────────────────────────
function DustParticles() {
  const count = 50
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4
      arr[i * 3 + 1] = Math.random() * 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3] + Math.sin(t * 0.2 + i) * 0.1,
        positions[i * 3 + 1] + Math.sin(t * 0.3 + i * 0.5) * 0.05,
        positions[i * 3 + 2] + Math.cos(t * 0.2 + i) * 0.1,
      )
      dummy.scale.setScalar(0.003 + Math.sin(t + i) * 0.001)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#334444" transparent opacity={0.3} />
    </instancedMesh>
  )
}

// ─── Camera rig ────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(2, 1.8, 2.2)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <OrbitControls
      enablePan={false}
      enableZoom={true}
      minDistance={1.5}
      maxDistance={5}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.45}
      autoRotate
      autoRotateSpeed={0.3}
      target={[0, 0.05, 0]}
    />
  )
}

// ─── Scene ─────────────────────────────────────────────────
function Scene({ text, onProgress, onComplete, onLaserActive }: {
  text: string
  onProgress: (pct: number) => void
  onComplete: () => void
  onLaserActive: (active: boolean) => void
}) {
  const [laserPos, setLaserPos] = useState<[number, number, number]>([0, 0.04, 0.2])
  const [laserActive, setLaserActive] = useState(false)
  const { texture, drawText } = useEngravingTexture()

  const handleLaserPosition = useCallback((pos: [number, number, number], active: boolean) => {
    setLaserPos(pos)
    setLaserActive(active)
    onLaserActive(active)
  }, [onLaserActive])

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 2]} intensity={1.5} color="#fff5ee" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-2, 2, -1]} intensity={0.4} color="#d0e0ff" />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#ffffff" />
      <Environment preset="warehouse" background={false} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#080c0c" roughness={0.9} metalness={0.1} />
      </mesh>

      <LaserMachine engravingTexture={texture} />
      <LaserBeam active={laserActive} position={laserPos} />
      <SmokeEffect active={laserActive} position={laserPos} />
      <EngravingController
        text={text}
        onLaserPosition={handleLaserPosition}
        onProgress={onProgress}
        onComplete={onComplete}
        engravingDrawText={drawText}
      />
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.2}>
        <DustParticles />
      </Float>
    </>
  )
}

// ─── Main component ────────────────────────────────────────
export default function LaserSimulatorPage() {
  const [text, setText] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [progress, setProgress] = useState(0)
  const [isEngraving, setIsEngraving] = useState(false)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Backspace') {
        setText(prev => {
          const next = prev.slice(0, -1)
          setDisplayText(next)
          return next
        })
        e.preventDefault()
        return
      }
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Tab') return
      if (e.key.length === 1) {
        setShowHint(false)
        setText(prev => {
          if (prev.length >= 15) return prev
          const next = prev + e.key
          setDisplayText(next)
          return next
        })
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#080c0c] overflow-hidden select-none">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080c0c]">
          <div className="w-8 h-8 border-2 border-vurmz-teal/20 border-t-vurmz-teal rounded-full animate-spin mb-4" />
          <span className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">Loading simulator</span>
        </div>
      }>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          className="absolute inset-0"
        >
          <Scene
            text={text}
            onProgress={setProgress}
            onComplete={() => setIsEngraving(false)}
            onLaserActive={setIsEngraving}
          />
        </Canvas>
      </Suspense>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-vurmz-teal/40">404</span>
          <span className="text-[10px] font-mono text-white/20">Page not found</span>
        </div>
        <Link href="/" className="text-xs font-mono text-vurmz-teal/50 hover:text-vurmz-teal transition-colors">
          &larr; vurmz.com
        </Link>
      </div>

      {/* Center hint */}
      {showHint && !text && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-sm font-mono text-white/20 mb-2 animate-pulse">Start typing to engrave</p>
            <p className="text-[10px] font-mono text-white/10">drag to orbit &middot; scroll to zoom</p>
          </div>
        </div>
      )}

      {/* Bottom control panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="mx-4 mb-4 rounded-sm border border-white/[0.06] bg-[#080c0c]/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-2.5 text-[10px] font-mono">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isEngraving ? 'bg-orange-400 animate-pulse' : text ? 'bg-vurmz-teal' : 'bg-white/20'}`} />
                <span className="text-white/40 tracking-wider uppercase">
                  {isEngraving ? 'Engraving' : text ? 'Complete' : 'Ready'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/30">INPUT:</span>
              <span className="text-white/60 tracking-wider max-w-[300px] truncate">
                {displayText || '—'}
              </span>
              {!text && <span className="w-[1px] h-3 bg-vurmz-teal/50 animate-pulse" />}
            </div>
            <div className="flex items-center gap-4 text-white/25">
              {text && <span>{progress}%</span>}
            </div>
          </div>
          {text && (
            <div className="h-[1px] bg-white/[0.04]">
              <div
                className="h-full transition-all duration-150"
                style={{ width: `${progress}%`, backgroundColor: isEngraving ? '#ff8c42' : '#3CB9B2' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
