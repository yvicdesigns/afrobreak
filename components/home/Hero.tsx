'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Play, Calendar, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import DonateButton from '@/components/ui/DonateButton'

const stats = [
  { value: '79+', label: 'Videos' },
  { value: '50+', label: 'Instructors' },
  { value: '10K+', label: 'Members' },
  { value: '38+', label: 'Countries' },
]

const PARTICLE_COUNT = 15

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      radius: number; alpha: number; color: string; rotation: number; rotSpeed: number
    }

    const colors = ['rgba(249,115,22,', 'rgba(139,92,246,', 'rgba(251,191,36,']
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      radius: Math.random() * 3 + 1,
      alpha: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.alpha
        // Diamond shape
        ctx.beginPath()
        ctx.moveTo(0, -p.radius * 2)
        ctx.lineTo(p.radius, 0)
        ctx.lineTo(0, p.radius * 2)
        ctx.lineTo(-p.radius, 0)
        ctx.closePath()
        ctx.fillStyle = `${p.color}${p.alpha})`
        ctx.fill()
        ctx.restore()
      })
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://uexidlplvbssarvuxfyn.supabase.co/storage/v1/object/public/media/thumbnails/1774424299617-st0ntdzolp9.jpg"
          alt="Dancer"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 hero-overlay" />
        {/* Additional layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Animated particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Geometric decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        {/* Floating rings */}
        <div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-primary-500/10 animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full border border-secondary-500/15 animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full border border-gold-DEFAULT/8 animate-float"
          style={{ animationDelay: '4s' }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-12">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/30 mb-8 animate-fade-in opacity-initial fill-forwards"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-semibold text-primary-400 tracking-widest uppercase">
              The Dance Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="heading-xl text-white mb-6 animate-slide-up opacity-initial fill-forwards animation-delay-100"
          >
            RHYTHM AND{' '}
            <span className="gradient-text-orange">DANCE</span>
            <br />
            BREAKTHROUGH{' '}
            <span className="relative inline-block">
              <span className="gradient-text-purple">CULTURE</span>
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary-500 to-transparent" />
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-lg text-text-secondary leading-relaxed mb-10 max-w-xl animate-slide-up opacity-initial fill-forwards animation-delay-200"
          >
            Empowering African Youth Breakthrough Hiphop Culture and Dance Sport for Development.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 mb-16 animate-slide-up opacity-initial fill-forwards animation-delay-300"
          >
            <Link href="/videos">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play size={18} className="fill-white" />}
                className="btn-glow"
              >
                Start Watching
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Calendar size={18} />}
              >
                Browse Events
              </Button>
            </Link>
            <DonateButton variant="hero" />
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap gap-8 animate-fade-in opacity-initial fill-forwards animation-delay-500"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div>
                  <div className="text-2xl font-black gradient-text-orange">{stat.value}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-widest font-medium">
                    {stat.label}
                  </div>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-10 bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-text-secondary tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} className="text-primary-500" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 hero-bottom-fade z-10 pointer-events-none" />
    </section>
  )
}
