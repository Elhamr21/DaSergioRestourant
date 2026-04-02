'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { restaurantInfo } from '@/lib/data'

// Pre-defined particle configurations to avoid hydration mismatches
const particles = [
  { x: 8, size: 6, xDrift: [-10, 15] },
  { x: 22, size: 8, xDrift: [5, -20] },
  { x: 35, size: 5, xDrift: [-15, 10] },
  { x: 48, size: 7, xDrift: [10, -15] },
  { x: 62, size: 9, xDrift: [-5, 25] },
  { x: 75, size: 6, xDrift: [15, -10] },
  { x: 88, size: 8, xDrift: [-20, 5] },
  { x: 15, size: 5, xDrift: [8, -18] },
  { x: 42, size: 7, xDrift: [-12, 20] },
  { x: 58, size: 6, xDrift: [18, -8] },
  { x: 82, size: 9, xDrift: [-8, 12] },
  { x: 95, size: 5, xDrift: [12, -25] },
]

function FloatingParticle({ delay, x, size, xDrift }: { delay: number; x: number; size: number; xDrift: number[] }) {
  return (
    <motion.div
      className="absolute bottom-0 rounded-full bg-gold/30"
      style={{ 
        left: `${x}%`, 
        width: size, 
        height: size,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [-20, -150, -300],
        opacity: [0, 0.5, 0],
        x: [0, xDrift[0], xDrift[1]]
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeOut'
      }}
    />
  )
}

function FloatingParticles() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.5} 
          x={particle.x}
          size={particle.size}
          xDrift={particle.xDrift}
        />
      ))}
    </div>
  )
}

export function Hero() {
  const scrollToMenu = () => {
    document.querySelector('#speisekarte')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
<video
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-full object-cover"
>
  <source src="/videos/back.mp4" type="video/mp4" />
</video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-deep-green/90" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />
      </div>

      {/* Floating Particles - rendered only on client */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4">
            <span className="text-gold">{restaurantInfo.name}</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-foreground/90 font-light tracking-wide mb-6">
            {restaurantInfo.tagline}
          </p>
        </motion.div>

        <motion.p
          className="text-lg sm:text-xl text-gray-text max-w-2xl mx-auto mb-10 text-pretty"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {restaurantInfo.description}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={scrollToMenu}
            className="px-8 py-4 bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-deep-green font-semibold rounded-lg transition-all duration-300 hover:scale-105 min-w-[200px]"
          >
            Speisekarte
          </button>
          <button
            onClick={scrollToContact}
            className="px-8 py-4 bg-gold hover:bg-gold-dark text-deep-green font-semibold rounded-lg transition-all duration-300 hover:scale-105 min-w-[200px]"
          >
            Reservieren
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-gold/70 hover:text-gold transition-colors"
        onClick={scrollToMenu}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        aria-label="Nach unten scrollen"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-10 h-10" />
        </motion.div>
      </motion.button>
    </section>
  )
}
