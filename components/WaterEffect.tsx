'use client'

import { useEffect, useRef } from 'react'

export default function WaterEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    // Fragment shader - water caustics and refraction
    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float time;
      uniform vec2 mouse;
      uniform vec2 resolution;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        float aspectRatio = resolution.x / resolution.y;
        vec2 scaledUv = vec2(uv.x * aspectRatio, uv.y);

        // Water caustics pattern
        float t = time * 0.3;
        float caustic1 = snoise(scaledUv * 3.0 + vec2(t, t * 0.7));
        float caustic2 = snoise(scaledUv * 5.0 - vec2(t * 0.8, t * 0.5));
        float caustic3 = snoise(scaledUv * 7.0 + vec2(t * 0.5, -t * 0.3));

        float caustics = (caustic1 + caustic2 * 0.5 + caustic3 * 0.25) / 1.75;
        caustics = pow(abs(caustics), 1.5) * 0.8;

        // Mouse ripple effect
        vec2 mousePos = mouse;
        float dist = distance(uv, mousePos);
        float ripple = sin(dist * 30.0 - time * 4.0) * exp(-dist * 5.0) * 0.15;

        // Combine effects
        float intensity = caustics + ripple;

        // Light refraction colors
        vec3 lightColor = vec3(1.0, 1.0, 1.0);
        vec3 waterTint = vec3(0.9, 0.95, 1.0);

        vec3 color = lightColor * intensity * 0.4;
        color += waterTint * caustics * 0.1;

        // Add subtle shimmer
        float shimmer = snoise(scaledUv * 20.0 + time * 2.0) * 0.03;
        color += shimmer;

        gl_FragColor = vec4(color, intensity * 0.5);
      }
    `

    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Create quad
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'time')
    const mouseLocation = gl.getUniformLocation(program, 'mouse')
    const resolutionLocation = gl.getUniformLocation(program, 'resolution')

    let animationId: number
    const startTime = Date.now()

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height
    }

    const animate = () => {
      const time = (Date.now() - startTime) / 1000
      gl.uniform1f(timeLocation, time)
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ mixBlendMode: 'soft-light' }}
    />
  )
}
