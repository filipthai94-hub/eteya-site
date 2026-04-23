'use client'

/**
 * PlasmaLime — Example 1 hero background.
 *
 * Plasma wave shader with mouse parallax, re-coloured for the Eteya
 * brand (lime #C8FF00 instead of violet). Port of "Shader Background"
 * by thanh from 21st.dev.
 *
 * Enhancements beyond the original:
 *   1. Mouse-parallax — cursor subtly shifts the wave field
 *   2. Atmospheric lime bgColors tuned to match the purple original's
 *      perceptual luminance (WCAG-weighted green channel)
 *   3. Premium line rendering: fwidth() adaptive AA + 60/40 crisp/soft
 *      blend + 20 lines per group + Reinhard tone mapping
 *   4. Two-pass circle accents (halo + core) with additive blending
 *   5. DPR-aware canvas (desktop 2×, mobile 1.5×)
 *   6. IntersectionObserver + visibilitychange — pause off-screen / in
 *      background tab (battery/CPU savings)
 *   7. desynchronized WebGL context + CSS layer promotion for smooth
 *      scroll alongside the animation
 *
 * Original source: https://21st.dev/community/components/thanh/shader-background/default
 */

import { useEffect, useRef } from 'react'

export default function PlasmaLime() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Scroll-jank-proof canvas context ──
    // desynchronized: true  → canvas renders direct-to-screen, bypassing
    //                         the page composition queue. This is the key
    //                         fix for smooth scroll alongside animation.
    // alpha: false          → required companion to desynchronized; the
    //                         shader already outputs opaque pixels.
    // antialias: false      → browser-level MSAA isn't needed; we do our
    //                         own adaptive AA via fwidth() in the shader.
    // powerPreference       → hint the OS to use discrete GPU if present.
    const gl = canvas.getContext('webgl', {
      desynchronized: true,
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      console.warn('WebGL not supported')
      return
    }
    // fwidth() for adaptive AA — requires this extension in WebGL1
    gl.getExtension('OES_standard_derivatives')

    // ── Shader sources ──
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `

    const fsSource = `
      #extension GL_OES_standard_derivatives : enable
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;   // normalized -1..1 (0,0 = centre)

      const float overallSpeed = 0.2;
      const float gridSmoothWidth = 0.015;
      const float axisWidth = 0.05;
      const float majorLineWidth = 0.025;
      const float minorLineWidth = 0.0125;
      const float majorLineFrequency = 5.0;
      const float minorLineFrequency = 1.0;
      const vec4 gridColor = vec4(0.5);
      const float scale = 5.0;

      // ── Eteya lime palette ──
      // Original lineColor was vec4(0.4, 0.2, 0.8, 1.0) (violet).
      // Lime brand is #C8FF00 → (0.78, 1.0, 0.0). Slightly boosted for glow.
      const vec4 lineColor = vec4(0.78, 1.0, 0.0, 1.0);

      // ── Premium line parameters ──
      // minLineWidth 0.007: thin, defined strokes (was 0.01 — too chunky)
      // maxLineWidth 0.05:  controlled width without soft bloat (was 0.2 — way too wide)
      // linesPerGroup 20:   richer density while keeping per-line quality
      const float minLineWidth = 0.007;
      const float maxLineWidth = 0.05;
      const float lineSpeed = 1.0 * overallSpeed;
      const float lineAmplitude = 1.0;
      const float lineFrequency = 0.2;
      const float warpSpeed = 0.2 * overallSpeed;
      const float warpFrequency = 0.5;
      const float warpAmplitude = 1.0;
      const float offsetFrequency = 0.5;
      const float offsetSpeed = 1.33 * overallSpeed;
      const float minOffsetSpread = 0.6;
      const float maxOffsetSpread = 2.0;
      const int linesPerGroup = 20;

      // ── Mouse parallax intensity ──
      // 0.30 = subtle but noticeable. Higher = more dramatic.
      const float mouseParallax = 0.30;

      #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
      #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

      float drawGridLines(float axis) {
        return drawCrispLine(0.0, axisWidth, axis)
              + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
              + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
      }

      float drawGrid(vec2 space) {
        return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
      }

      float random(float t) {
        return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
      }

      float getPlasmaY(float x, float horizontalFade, float offset) {
        return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec4 fragColor;
        vec2 uv = fragCoord.xy / iResolution.xy;
        vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

        // ── Mouse parallax: shift wave field subtly with cursor ──
        space.x += iMouse.x * mouseParallax;
        space.y += iMouse.y * mouseParallax;

        float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
        float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

        space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
        space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

        vec4 lines = vec4(0.0);

        // ── Eteya lime atmospheric background (premium-lifted) ──
        // Lifted ~1.6× to hit the 0.15–0.25 L sweet spot used by
        // Stripe/Linear/Apple hero gradients. Text readability is now
        // handled by a CSS backdrop-filter panel behind the text, so
        // the shader itself can run at full atmospheric intensity.
        // Green channel is the dominant axis (WCAG weight 0.7152).
        vec4 bgColor1 = vec4(0.14, 0.22, 0.04, 1.0);
        vec4 bgColor2 = vec4(0.18, 0.32, 0.06, 1.0);

        for(int l = 0; l < linesPerGroup; l++) {
          float normalizedLineIndex = float(l) / float(linesPerGroup);
          float offsetTime = iTime * offsetSpeed;
          float offsetPosition = float(l) + space.x * offsetFrequency;
          float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
          float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
          float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
          float linePosition = getPlasmaY(space.x, horizontalFade, offset);

          // ── Premium line: adaptive AA via fwidth (resolution-independent) ──
          // 40% soft glow halo + 60% crisp bright core = neon wire look.
          // fwidth() replaces hard-coded gridSmoothWidth for true sharpness.
          float lineDist = abs(linePosition - space.y);
          float fw = max(fwidth(lineDist), 1e-4);
          float softGlow  = smoothstep(halfWidth + fw * 2.0, halfWidth, lineDist);
          float crispCore = smoothstep(halfWidth * 0.25 + fw, halfWidth * 0.25, lineDist);
          float line = softGlow * 0.4 + crispCore * 0.6;

          // ── Premium circle: two-pass (outer halo + sharp core) ──
          // Additive blend avoids the * 4.0 clipping.
          float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
          vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
          float circDist = length(space - circlePosition);
          float fwc = max(fwidth(circDist), 1e-4);
          float circleHalo = smoothstep(0.025 + fwc, 0.025, circDist) * 0.5;
          float circleCore = smoothstep(0.012 + fwc, 0.012, circDist);
          float circle = circleHalo + circleCore;

          line = line + circle;
          lines += line * lineColor * rand;
        }

        fragColor = mix(bgColor1, bgColor2, uv.x);
        fragColor *= verticalFade;
        fragColor.a = 1.0;
        fragColor += lines;

        // ── Reinhard tone mapping ──
        // Compresses bright stacked lines so they stay lime (not clip to white).
        // Dark background values (< 0.15) are barely affected.
        fragColor.rgb = fragColor.rgb / (fragColor.rgb + vec3(1.0));

        // NOTE: No center-dimmer. Text readability is handled by a CSS
        // backdrop-filter panel on .hero-content — a more premium approach
        // (same pattern used by Stripe/Linear/Apple) that keeps the shader
        // cinematic everywhere while guaranteeing WCAG contrast only where
        // text actually sits.

        gl_FragColor = fragColor;
      }
    `

    // ── Compile & link ──
    const loadShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource)
    if (!vertexShader || !fragmentShader) return

    const shaderProgram = gl.createProgram()
    if (!shaderProgram) return
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(shaderProgram))
      return
    }

    // ── Fullscreen quad ──
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const vertexPositionLoc = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    const resolutionLoc = gl.getUniformLocation(shaderProgram, 'iResolution')
    const timeLoc = gl.getUniformLocation(shaderProgram, 'iTime')
    const mouseLoc = gl.getUniformLocation(shaderProgram, 'iMouse')

    // ── Container-sized canvas with DPR ──
    // Desktop: cap at 2× (Retina-sharp)
    // Mobile:  cap at 1.5× — still much sharper than 1× but 44% less GPU
    //          work than 2×, so iOS Safari's scroll compositor doesn't
    //          have to fight the shader for GPU bandwidth on scroll.
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.5)
      : Math.min(window.devicePixelRatio || 1, 2)

    const getSize = () => {
      const parent = canvas.parentElement
      const w = parent ? parent.clientWidth : window.innerWidth
      const h = parent ? parent.clientHeight : window.innerHeight
      return { w, h }
    }

    const resizeCanvas = () => {
      const { w, h } = getSize()
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // ── Mouse parallax (with lerp for smoothness) ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      // Normalise to -1..1, invert Y because GL origin is bottom-left
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }
    // Listen globally so parallax works even when cursor is over the text
    window.addEventListener('mousemove', handleMouseMove)

    // ── Render loop with pause/resume ──
    let startTime = Date.now()
    let pausedAccumTime = 0 // seconds of pause time to subtract
    let lastPauseAt = 0
    let frameId: number = 0
    let isPaused = false

    const render = () => {
      // Lerp mouse toward target (smoothing factor 0.05)
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      const currentTime = (Date.now() - startTime - pausedAccumTime) / 1000

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(shaderProgram)
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height)
      gl.uniform1f(timeLoc, currentTime)
      gl.uniform2f(mouseLoc, mouse.x, mouse.y)

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(vertexPositionLoc, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(vertexPositionLoc)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      frameId = requestAnimationFrame(render)
    }

    const start = () => {
      if (isPaused) {
        pausedAccumTime += Date.now() - lastPauseAt
        isPaused = false
      }
      if (!frameId) frameId = requestAnimationFrame(render)
    }

    const stop = () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
      if (!isPaused) {
        lastPauseAt = Date.now()
        isPaused = true
      }
    }

    // ── IntersectionObserver: pause off-screen ──
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start()
          else stop()
        }
      },
      { threshold: 0, rootMargin: '0px' },
    )
    if (canvas.parentElement) io.observe(canvas.parentElement)

    // ── Tab visibility: pause when tab hidden ──
    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Kick off
    start()

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibility)
      gl.deleteProgram(shaderProgram)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(positionBuffer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        // ── GPU compositor layer promotion ──
        // Forces the canvas onto its own layer so the browser can scroll
        // the page independently of canvas repaints. Without this, every
        // scroll triggers a full-viewport composite that competes with
        // the shader's rAF cycle → jank.
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    />
  )
}
