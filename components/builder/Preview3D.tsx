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
import type { CanvasBuilderConfig, SilhouetteBuilderConfig, BuilderSubmission } from '@/lib/builder/types'

type AnyConfig = CanvasBuilderConfig | SilhouetteBuilderConfig

const IN = 0.0254 // meters per inch: models are exported at true scale

/** Where the mark map's vertical origin sits: flat products use the full
 *  face; cylindrical ones use the visible barrel band (the profile rows
 *  that wrap the cylinder). */
function markRegion(config: AnyConfig): { yOffIn: number; hIn: number } {
  if (config.mode === 'silhouette' && config.markCylinder) {
    const r = config.markCylinder.radiusIn
    return { yOffIn: config.heightIn / 2 - r, hIn: 2 * r }
  }
  return { yOffIn: 0, hIn: config.heightIn }
}

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
  config: AnyConfig,
  value: BuilderSubmission,
  previews?: Record<string, string>,
) {
  const SIZE = 1024
  const region = markRegion(config)
  canvas.width = SIZE
  canvas.height = Math.max(2, Math.round(SIZE * (region.hIn / config.widthIn)))
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const px = SIZE / config.widthIn
  const yOff = region.yOffIn

  const families = Array.from(new Set(
    value.elements.filter(e => e.kind === 'text').map(e => bareFamily(e.fontValue)),
  ))
  await Promise.all(families.map(f => document.fonts.load(`48px "${f}"`).catch(() => null)))

  for (const el of value.elements) {
    ctx.save()
    const x = el.xIn * px, y = (el.yIn - yOff) * px, w = el.wIn * px, h = el.hIn * px
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

/** A cylindrical band that hugs a barrel along X, UV-mapped so the mark
 *  canvas wraps it: u along the length, v across the visible arc. */
function barrelStrip(lengthM: number, radiusM: number, arc = 1.5): THREE.BufferGeometry {
  const L = 96, A = 24
  const pos: number[] = [], norm: number[] = [], uv: number[] = [], idx: number[] = []
  for (let i = 0; i <= L; i++) {
    const x = -lengthM / 2 + (i / L) * lengthM
    for (let j = 0; j <= A; j++) {
      const phi = arc / 2 - (j / A) * arc // + = up; band faces the camera (+Z)
      pos.push(x, radiusM * Math.sin(phi), radiusM * Math.cos(phi))
      norm.push(0, Math.sin(phi), Math.cos(phi))
      uv.push(i / L, 1 - j / A)
    }
  }
  const row = A + 1
  for (let i = 0; i < L; i++) {
    for (let j = 0; j < A; j++) {
      const a = i * row + j, b = (i + 1) * row + j
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  return g
}

/** How the mark behaves physically: a light markColor is bare metal
 *  showing through (metallic sheen); a dark one is annealed oxide or
 *  burn (matte). No markColor = the polarity default, matte. */
function applyMarkPhysics(mat: THREE.MeshStandardMaterial, markColor?: string) {
  if (markColor) {
    const c = new THREE.Color(markColor)
    const lum = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b
    mat.metalness = lum > 0.45 ? 0.75 : 0.15
    mat.roughness = lum > 0.45 ? 0.5 : 0.85
  } else {
    mat.metalness = 0
    mat.roughness = 0.92
  }
  mat.needsUpdate = true
}

/** Turn the mark map's alpha into a normal map: the mark is a shallow
 *  RECESS, so its edges catch and lose light as the product turns. This
 *  is what makes an engraving read as a cut instead of a sticker. */
function alphaToNormal(src: HTMLCanvasElement, dst: HTMLCanvasElement) {
  const w = src.width, h = src.height
  dst.width = w; dst.height = h
  const sctx = src.getContext('2d')!
  const dctx = dst.getContext('2d')!
  const a = sctx.getImageData(0, 0, w, h).data
  const out = dctx.createImageData(w, h)
  const o = out.data
  const A = (x: number, y: number) => a[((Math.max(0, Math.min(h - 1, y)) * w) + Math.max(0, Math.min(w - 1, x))) * 4 + 3]
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // height = -alpha (recessed); sobel-lite gradients
      const dx = (A(x + 1, y) - A(x - 1, y)) / 255
      const dy = (A(x, y + 1) - A(x, y - 1)) / 255
      const i = (y * w + x) * 4
      o[i] = 128 + dx * 90       // +x slope: recess wall
      o[i + 1] = 128 - dy * 90   // three.js +Y up in tangent space
      o[i + 2] = 255
      o[i + 3] = 255
    }
  }
  dctx.putImageData(out, 0, 0)
}

export default function Preview3D({ modelUrl, config, value, previews }: {
  modelUrl: string
  config: AnyConfig
  value: BuilderSubmission
  previews?: Record<string, string>
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const markCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const normalCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const normalTexRef = useRef<THREE.CanvasTexture | null>(null)
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

    const span = Math.max(config.widthIn * IN, 0.09)
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.005, 2)
    camera.position.set(span * 0.75, span * 0.85, span * 1.05)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.minDistance = span * 0.4
    controls.maxDistance = span * 3
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
      new THREE.PlaneGeometry(span * 1.6, span * 1.6),
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

      // the mark surface rides a hair above the product: a plane over a
      // flat top, or a band hugging a cylindrical barrel
      const grounded = new THREE.Box3().setFromObject(model)
      const mark = config.materials.find(m => m.key === value.materialKey) ?? config.materials[0]
      const markColor = mark?.markColor ?? ((mark?.mark ?? 'light') === 'light' ? '#e9e5da' : '#232028')
      const canvas = document.createElement('canvas')
      markCanvasRef.current = canvas
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      textureRef.current = tex
      const nCanvas = document.createElement('canvas')
      normalCanvasRef.current = nCanvas
      const nTex = new THREE.CanvasTexture(nCanvas)
      normalTexRef.current = nTex
      const markMat = new THREE.MeshStandardMaterial({
        map: tex, transparent: true, color: markColor,
        normalMap: nTex, normalScale: new THREE.Vector2(0.55, 0.55),
        depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1,
      })
      applyMarkPhysics(markMat, mark?.markColor)
      markMatRef.current = markMat
      if (config.mode === 'silhouette' && config.markCylinder) {
        markMesh = new THREE.Mesh(
          barrelStrip(config.widthIn * IN, config.markCylinder.radiusIn * IN + 0.00018),
          markMat,
        )
        // the barrel axis sits at the grounded model's vertical center
        markMesh.position.y = (grounded.min.y + grounded.max.y) / 2
        markMesh.position.x = (grounded.min.x + grounded.max.x) / 2
      } else {
        markMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(config.widthIn * IN * 0.985, config.heightIn * IN * 0.985),
          markMat,
        )
        markMesh.rotation.x = -Math.PI / 2
        markMesh.position.y = grounded.max.y + 0.00012
      }
      scene.add(markMesh)

      renderMarkMap(canvas, config, value, previews).then(() => {
        tex.needsUpdate = true
        alphaToNormal(canvas, nCanvas)
        nTex.needsUpdate = true
      })
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
      applyMarkPhysics(mm, m.markColor)
    }
    if (m) tintMatsRef.current.forEach(t => t.color.set(m.surface))
    let alive = true
    renderMarkMap(canvas, config, value, previews).then(() => {
      if (!alive) return
      tex.needsUpdate = true
      const nCanvas = normalCanvasRef.current
      const nTex = normalTexRef.current
      if (nCanvas && nTex) {
        alphaToNormal(canvas, nCanvas)
        nTex.needsUpdate = true
      }
    })
    return () => { alive = false }
  }, [value, config, previews])

  return (
    <div>
      <div ref={mountRef} className="rounded-sm overflow-hidden bg-[var(--ink)]/[0.04]" />
      <p className="mt-1.5 text-[10px] text-[var(--ink-soft)]">Drag to spin · scroll to zoom · switch to Flat to edit</p>
    </div>
  )
}
