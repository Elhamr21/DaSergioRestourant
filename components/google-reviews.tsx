'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
import { reviews } from '@/lib/data'

function AnimatedRating({ rating }: { rating: number }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star, index) => (
        <motion.div
          key={star}
          initial={{ scale: 0, rotate: -180 }}
          animate={animate ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating ? 'text-gold fill-gold' : 'text-gray-text'
            }`}
          />
        </motion.div>
      ))}
    </div>
  )
}

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(end * progress)
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toFixed(1)}</span>
}

function ReviewCard({ review, index }: { review: typeof reviews[0]; index: number }) {
  return (
    <motion.div
      className="glass rounded-xl p-6"
      initial={{ opacity: 0, y: 20, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
          <span className="text-gold font-semibold text-lg">
            {review.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-medium">{review.name}</p>
          <p className="text-gray-text text-sm">{review.date}</p>
        </div>
        <AnimatedRating rating={review.rating} />
      </div>
      <p className="text-gray-text leading-relaxed italic">
        &quot;{review.text}&quot;
      </p>
    </motion.div>
  )
}

export function GoogleReviews() {
  return (
    <section className="py-20 md:py-32 bg-deep-green-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unsere <span className="text-gold">Bewertungen</span>
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-8" />

          {/* Overall Rating */}
          <div className="inline-flex flex-col items-center glass rounded-2xl px-10 py-8">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl md:text-6xl font-bold text-gold">
                <CountUp end={4.8} />
              </span>
              <span className="text-2xl text-gray-text">/5</span>
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= 5 ? 'text-gold fill-gold' : 'text-gray-text'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-text">
              Basierend auf <span className="text-foreground font-medium">422 Bewertungen</span>
            </p>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="https://www.google.com/maps/place/Da+Sergio+Restaurant+%26+Pizzeria"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-medium"
          >
            Alle Rezensionen auf Google anzeigen
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
