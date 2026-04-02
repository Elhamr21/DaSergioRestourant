'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { restaurantInfo, eventMedia } from '@/lib/data'

export function Philosophy() {
  return (
    <section id="unsere-kueche" className="py-20 md:py-32 bg-deep-green-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unsere <span className="text-gold">Küche</span>
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl text-gold font-serif italic mb-6">
              Italienische Klassiker, liebevoll zubereitet
            </p>
            <div className="space-y-4 text-gray-text leading-relaxed">
              {restaurantInfo.philosophy.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-serif text-2xl">A</span>
              </div>
              <div>
                <p className="text-foreground font-medium">{restaurantInfo.owner}</p>
                <p className="text-gray-text text-sm">Inhaberin</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {eventMedia.slice(0, 4).map((event, index) => (
              <motion.div
                key={event.id}
                className="relative aspect-square rounded-xl overflow-hidden group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Image
                  src={event.url}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-foreground font-medium text-sm">{event.title}</p>
                  <p className="text-gold text-xs">{event.eventDate}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats/Highlights */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { number: '20+', label: 'Jahre Erfahrung' },
            { number: '50+', label: 'Gerichte' },
            { number: '4.8', label: 'Google Bewertung' },
            { number: '100%', label: 'Frische Zutaten' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 glass rounded-xl">
              <p className="text-3xl md:text-4xl font-bold text-gold mb-2">{stat.number}</p>
              <p className="text-gray-text text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
