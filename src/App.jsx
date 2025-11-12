import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import FloatingObject from './FloatingObject'
import './index.css'

function GlossyBadge({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs text-gray-700 shadow-sm backdrop-blur-md">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
      {children}
    </div>
  )
}

function SoftGlow({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute blur-3xl opacity-60 ${className}`} />
  )
}

export default function App() {
  const canvasRef = useRef(null)

  // Build a safe, encoded SVG grain data URL to avoid string literal/escape issues
  const grainBg = useMemo(() => {
    try {
      const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
          <filter id='n'>
            <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/>
          </filter>
          <rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/>
        </svg>`
      return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
    } catch {
      // Fallback to a subtle solid color if anything goes wrong
      return 'linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.02))'
    }
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c || typeof c.getContext !== 'function') return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const DPR = Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1, 2)

    function resize() {
      const rect = c.getBoundingClientRect?.()
      const width = rect?.width || c.offsetWidth || 0
      const height = rect?.height || c.offsetHeight || 0
      c.width = Math.max(1, Math.floor(width * DPR))
      c.height = Math.max(1, Math.floor(height * DPR))
    }

    resize()

    let t = 0
    const dots = Array.from({ length: 60 }, () => ({
      r: 40 + Math.random() * 80,
      a: Math.random() * Math.PI * 2,
      s: 0.2 + Math.random() * 0.6,
    }))

    let rafId = 0
    function draw() {
      const W = c.width
      const H = c.height
      ctx.clearRect(0, 0, W, H)

      // soft ambient gradient
      const g = ctx.createRadialGradient(W*0.7, H*0.3, 50, W*0.5, H*0.6, Math.max(W, H))
      g.addColorStop(0, 'rgba(255,255,255,0.9)')
      g.addColorStop(1, 'rgba(230,236,248,0.4)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.translate(W/2, H/2)
      ctx.scale(DPR, DPR)

      dots.forEach((d, i) => {
        const x = Math.cos(d.a + t * d.s) * d.r * 3
        const y = Math.sin(d.a + t * d.s) * d.r * 1.2
        const size = 2 + (i % 7)
        const alpha = 0.06 + (i % 5) * 0.01
        ctx.fillStyle = `rgba(120,140,170,${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()
      t += 0.005
      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white text-gray-900 relative">
      {/* big soft background glows */}
      <SoftGlow className="-top-40 left-0 h-[60vh] w-[50vw] bg-[radial-gradient(closest-side,rgba(164,202,255,0.6),transparent_60%)]" />
      <SoftGlow className="-bottom-40 right-0 h-[60vh] w-[50vw] bg-[radial-gradient(closest-side,rgba(199,210,254,0.5),transparent_60%)]" />

      {/* subtle grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: grainBg }} />

      {/* hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 md:pt-28">
        <div className="relative grid items-center gap-12 md:grid-cols-2">
          <div className="relative z-10">
            <div className="mb-6">
              <GlossyBadge>Available for new projects</GlossyBadge>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              Minimal, cinematic interfaces for modern software.
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              I craft premium web experiences with attention to light, material and motion.
              Inspired by Apple’s visual language: soft shadows, glass panels, depth and calm.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#work" className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.28)] transition-shadow">View Work</a>
              <a href="#contact" className="rounded-full border border-gray-200 bg-white/60 px-6 py-3 text-sm font-medium backdrop-blur-md hover:bg-white/80 transition-colors">Get in touch</a>
            </div>
          </div>

          {/* 3D showcase panel */}
          <div className="relative h-[520px] md:h-[580px]">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full rounded-[28px] border border-white/60 bg-white/70 shadow-[0_30px_80px_rgba(0,0,0,0.08)]" />

            <FloatingObject className="absolute left-1/2 top-6 h-40 w-64 -translate-x-1/2" delay={0.2}>
              <div className="flex h-full items-center justify-center">
                <div className="h-24 w-40 rounded-xl bg-gradient-to-br from-zinc-200 to-white shadow-inner" />
              </div>
              <div className="absolute inset-x-4 -bottom-4 mx-auto h-3 rounded-full bg-black/5 blur-md" />
            </FloatingObject>

            <FloatingObject className="absolute right-6 top-24 h-28 w-28" delay={0.6}>
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-zinc-200 to-white" />
            </FloatingObject>

            <FloatingObject className="absolute left-6 bottom-10 h-28 w-44" delay={1.0}>
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-zinc-200 to-white" />
            </FloatingObject>

            {/* code glyph */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute inset-0 grid place-items-center"
            >
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.2),transparent_70%)]" />
                <div className="relative text-[80px] md:text-[100px] font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-black to-zinc-500/70 select-none">
                  {'</>'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* work section */}
      <section id="work" className="relative mx-auto max-w-6xl px-6 pb-28">
        <h2 className="text-3xl md:text-4xl font-semibold">Selected Work</h2>
        <p className="mt-3 text-gray-600">Interfaces with a focus on clarity, tactility and performance.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[1,2,3].map((i) => (
            <FloatingObject key={i} className="h-64">
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(120px_120px_at_30%_20%,rgba(0,0,0,0.06),transparent_60%)]" />
              <div className="p-5">
                <div className="h-36 rounded-xl bg-gradient-to-br from-zinc-200 to-white" />
                <div className="mt-4 h-2 w-1/2 rounded-full bg-black/10" />
                <div className="mt-2 h-2 w-1/3 rounded-full bg-black/10" />
              </div>
            </FloatingObject>
          ))}
        </div>
      </section>

      {/* contact/footer */}
      <section id="contact" className="relative mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-8 md:grid-cols-2">
          <FloatingObject className="p-6">
            <h3 className="text-xl font-semibold">Let’s build something exceptional</h3>
            <p className="mt-2 text-gray-600">Email me with a short brief and a timeline. I’ll reply within 24 hours.</p>
            <a href="mailto:hello@example.com" className="mt-6 inline-flex rounded-full bg-black px-5 py-2 text-sm font-medium text-white">hello@example.com</a>
          </FloatingObject>

          <FloatingObject className="p-6">
            <h3 className="text-xl font-semibold">Capabilities</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
              {['Design Systems','3D/Motion','WebGL','Next/React','E-commerce','Performance'].map((item) => (
                <li key={item} className="rounded-full border border-white/60 bg-white/50 px-3 py-1 backdrop-blur-md">{item}</li>
              ))}
            </ul>
          </FloatingObject>
        </div>

        <div className="mt-10 flex items-center justify-between text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Your Name</span>
          <div className="flex items-center gap-3">
            <a href="/test" className="hover:text-gray-700">System</a>
            <a href="#" className="hover:text-gray-700">Dribbble</a>
            <a href="#" className="hover:text-gray-700">Twitter</a>
          </div>
        </div>
      </section>
    </div>
  )
}
