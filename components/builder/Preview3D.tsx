'use client'
/**
 * The 3D engraving preview (task #52): the customer's Builder layout,
 * projected live onto a real product model. The 2D canvas stays the
 * editor; this is the money shot. The mark renders the way the laser
 * actually behaves on the material: frost-light on slate and anodized,
 * dark on stainless.
 *
 * Vanilla three.js on purpose (no react wrapper): smaller bundle, and
 * nothing here needs React's render loop. Loaded client-only via the
 * same useClientOnly pattern as the Konva canvas; never SSR'd.
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { fontOptions } from '@/lib/fonts'
import type { CanvasBuilderConfig, BuilderSubmission } from '@/lib/builder/types'

const IN = 0.0254 // meters per inch: models are exported at true scale

function bareFamily(fontValue?: string): string {
  const stack = (fontOptions.find(f => f.value === fontValue)?.style.fontFamily as string) ?? 'sans-serif'
  return stack.split(',')[0].replace(/["']/g, '').trim()
}

/** Load an image for mark rendering (design thumbs are same-origin via /api/media). */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/** Render the layout as a white-on-transparent mark map, honest to the
 *  laser: art and photos mark by their darkness, text marks solid. */
async function renderMarkMap(
  canvas: HTMLCanvasElement,
  config: CanvasBuilderConfig,
  value: BuilderSubmission,
  previews?: Record<string, string>,
) {
  const SIZE = 1024
  canvas.width = SIZE
  canvas.height = Math.round(SIZE * (config.heightIn / config.widthIn))
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const px = SIZE / config.widthIn

  const families = Array.from(new Set(
    value.elements.filter(e => e.kind === 'text').map(e => bareFamily(e.fontValue)),
  ))
  await Promise.all(families.map(f => document.fonts.load(`48px "${f}"`).catch(() => null)))

  for (const el of value.elements) {
    ctx.save()
    const x = el.xIn * px, y = el.yIn * px, w = el.wIn * px, h = el.hIn * px
    ctx.translate(x + w / 2, y + h / 2)
    ctx.rotate((el.rotationDeg * Math.PI) / 180)
    if (el.kind === 'text') {
      ctx.fillStyle = '#ffffff'
      ctx.font = `${h}px "${bareFamily(el.fontValue)}"`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(el.text || 'Your text', 0, 0, w)
    } else {
      const src = el.kind === 'upload' ? previews?.[el.id] : el.designThumb
      const img = src ? await loadImage(src) : null
      if (img) {
        // darkness -> mark strength: draw, then convert luminance to alpha
        const tmp = document.createElement('canvas')
        tmp.width = Math.max(2, Math.round(w)); tmp.height = Math.max(2, Math.round(h))
        const tctx = tmp.getContext('2d')!
        tctx.drawImage(img, 0, 0, tmp.width, tmp.height)
        const data = tctx.getImageData(0, 0, tmp.width, tmp.height)
        const p = data.data
        for (let i = 0; i < p.length; i += 4) {
          const lum = (p[i] * 0.299 + p[i + 1] * 0.587 + p[i + 2] * 0.114) / 255
          const a = p[i + 3] / 255
          const strength = (1 - lum) * a // dark art marks strongest
          p[i] = 255; p[i + 1] = 255; p[i + 2] = 255
          p[i + 3] = Math.round(strength * 255)
        }
        tctx.putImageData(data, 0, 0)
        ctx.drawImage(tmp, -w / 2, -h / 2, w, h)
      }
    }
    ctx.restore()
  }
}

export default function Preview3D({ modelUrl, config, value, previews }: {
  modelUrl: string
  config: CanvasBuilderConfig
  value: BuilderSubmission
  previews?: Record<string, string>
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const markCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const markMatRef = useRef<THREE.MeshStandardMaterial | null>(null)
  /** Materials named 'tintable' in the GLB take the chosen finish color at
   *  runtime, so one model serves every anodized variant. */
  const tintMatsRef = useRef<THREE.MeshStandardMaterial[]>([])
  const stateRef = useRef<{ renderer?: THREE.WebGLRenderer; dispose?: () => void }>({})

  // Scene: built once per model.
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let alive = true

    const width = mount.clientWidth
    const height = Math.round(width * 0.72)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.005, 2)
    camera.position.set(0.11, 0.12, 0.14)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.minDistance = 0.06
    controls.maxDistance = 0.4
    controls.maxPolarAngle = Math.PI * 0.52
    controls.target.set(0, 0, 0)

    // soft ground shadow disc for weight
    const shadowTex = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 256
      const g = c.getContext('2d')!
      const grad = g.createRadialGradient(128, 128, 20, 128, 128, 128)
      grad.addColorStop(0, 'rgba(0,0,0,0.45)'); grad.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grad; g.fillRect(0, 0, 256, 256)
      return new THREE.CanvasTexture(c)
    })()
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.16),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -0.0002
    scene.add(shadow)

    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    let markMesh: THREE.Mesh | null = null

    loader.load(modelUrl, gltf => {
      if (!alive) return
      const model = gltf.scene
      tintMatsRef.current = []
      model.traverse(node => {
        const mesh = node as THREE.Mesh
        if (mesh.isMesh) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          for (const m of mats) {
            if ((m as THREE.MeshStandardMaterial).name === 'tintable') {
              tintMatsRef.current.push(m as THREE.MeshStandardMaterial)
            }
          }
        }
      })
      const initialMat = config.materials.find(x => x.key === value.materialKey) ?? config.materials[0]
      if (initialMat) tintMatsRef.current.forEach(m => m.color.set(initialMat.surface))
      // center on origin, rest on the ground
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center)
      model.position.y += (box.max.y - box.min.y) / 2 - (center.y - box.min.y) + 0
      const box2 = new THREE.Box3().setFromObject(model)
      model.position.y -= box2.min.y
      scene.add(model)

      // the mark plane rides a hair above the flat top
      const topY = new THREE.Box3().setFromObject(model).max.y
      const mark = config.materials.find(m => m.key === value.materialKey) ?? config.materials[0]
      const markColor = mark?.markColor ?? ((mark?.mark ?? 'light') === 'light' ? '#e9e5da' : '#232028')
      const canvas = document.createElement('canvas')
      markCanvasRef.current = canvas
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      textureRef.current = tex
      const markMat = new THREE.MeshStandardMaterial({
        map: tex, transparent: true, color: markColor,
        roughness: 0.92, metalness: 0, depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: -1,
      })
      markMatRef.current = markMat
      markMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(config.widthIn * IN * 0.985, config.heightIn * IN * 0.985),
        markMat,
      )
      markMesh.rotation.x = -Math.PI / 2
      markMesh.position.y = topY + 0.00012
      scene.add(markMesh)

      renderMarkMap(canvas, config, value, previews).then(() => { tex.needsUpdate = true })
    })

    let raf = 0
    const tick = () => { controls.update(); renderer.render(scene, camera); raf = requestAnimationFrame(tick) }
    tick()

    const onResize = () => {
      const w = mount.clientWidth
      const h = Math.round(w * 0.72)
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    stateRef.current.dispose = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      pmrem.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
    return () => { alive = false; stateRef.current.dispose?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl])

  // Live updates: redraw the mark map when the layout changes, and keep
  // the mark color honest to the chosen material's polarity.
  useEffect(() => {
    const canvas = markCanvasRef.current
    const tex = textureRef.current
    if (!canvas || !tex) return
    const m = config.materials.find(x => x.key === value.materialKey) ?? config.materials[0]
    const mm = markMatRef.current
    if (mm && m) {
      mm.color.set(m.markColor ?? (m.mark === 'light' ? '#e9e5da' : '#232028'))
      // Physical read of the mark: an explicit markColor on a light-polarity
      // material is bare metal showing through (anodized strip), so it gets
      // metallic sheen; dark-polarity marks are annealed oxide, matte.
      if (m.markColor && m.mark === 'light') { mm.metalness = 0.8; mm.roughness = 0.5 }
      else { mm.metalness = 0; mm.roughness = 0.92 }
      mm.needsUpdate = true
    }
    if (m) tintMatsRef.current.forEach(t => t.color.set(m.surface))
    let alive = true
    renderMarkMap(canvas, config, value, previews).then(() => { if (alive) tex.needsUpdate = true })
    return () => { alive = false }
  }, [value, config, previews])

  return (
    <div>
      <div ref={mountRef} className="rounded-sm overflow-hidden bg-[var(--ink)]/[0.04]" />
      <p className="mt-1.5 text-[10px] text-[var(--ink-soft)]">Drag to spin · scroll to zoom · switch to Flat to edit</p>
    </div>
  )
}
