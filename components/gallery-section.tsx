'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Play, Calendar } from 'lucide-react'
import { eventMedia, foodDrinkMedia, restaurantImages } from '@/lib/data'
import type { EventMedia, FoodDrinkMedia } from '@/lib/types'

type GalleryTab = 'events' | 'food-drinks'
type GalleryFilter = 'all' | 'food' | 'drink'

interface LightboxItem {
  type: 'image' | 'video'
  url: string
  title: string
  description?: string
  date?: string
}

function GalleryCard({ 
  item, 
  onClick,
  index
}: { 
  item: EventMedia | FoodDrinkMedia
  onClick: () => void
  index: number
}) {
  const isVideo = 'type' in item && item.type === 'video'

  return (
    <motion.button
      className="group relative aspect-square rounded-xl overflow-hidden w-full"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <Image
        src={'thumbnail' in item && item.thumbnail ? item.thumbnail : item.url}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
      
      {/* Video Play Icon */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-deep-green ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-foreground font-medium text-sm">{item.title}</h3>
        {'eventDate' in item && item.eventDate && (
          <p className="text-gold text-xs flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {item.eventDate}
          </p>
        )}
        {'category' in item && (
          <span className="text-gold/80 text-xs capitalize">{item.category}</span>
        )}
      </div>
    </motion.button>
  )
}

function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 bg-deep-green/80 hover:bg-gold text-foreground hover:text-deep-green p-2 rounded-full transition-colors"
        aria-label="Schließen"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-5xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {item.type === 'video' ? (
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <video
              src={item.url}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden">
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Caption */}
        <div className="mt-4 text-center">
          <h3 className="text-foreground text-xl font-semibold">{item.title}</h3>
          {item.description && (
            <p className="text-gray-text mt-1">{item.description}</p>
          )}
          {item.date && (
            <p className="text-gold text-sm mt-2 flex items-center justify-center gap-1">
              <Calendar className="w-4 h-4" />
              {item.date}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function GallerySection() {
  const [activeTab, setActiveTab] = useState<GalleryTab>('events')
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null)

  const allMedia = [...foodDrinkMedia, ...restaurantImages]
  
  const filteredFoodDrinks = filter === 'all' 
    ? allMedia
    : allMedia.filter(item => item.category === filter)

  const openLightbox = (item: EventMedia | FoodDrinkMedia) => {
    setLightboxItem({
      type: 'type' in item ? item.type : 'image',
      url: item.url,
      title: item.title,
      description: item.description,
      date: 'eventDate' in item ? item.eventDate : undefined,
    })
  }

  return (
    <section id="galerie" className="py-20 md:py-32 bg-deep-green-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unsere <span className="text-gold">Galerie</span>
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6" />
          <p className="text-gray-text max-w-2xl mx-auto">
            Einblicke in unser Restaurant, besondere Events und unsere köstlichen Gerichte
          </p>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'events'
                ? 'bg-gold text-deep-green'
                : 'bg-deep-green text-foreground hover:text-gold'
            }`}
          >
            Events & Restaurant
          </button>
          <button
            onClick={() => setActiveTab('food-drinks')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'food-drinks'
                ? 'bg-gold text-deep-green'
                : 'bg-deep-green text-foreground hover:text-gold'
            }`}
          >
            Speisekarten
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'events' ? (
            <motion.div
              key="events"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {eventMedia.map((item, index) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => openLightbox(item)}
                  />
                ))}
                {restaurantImages.map((item, index) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    index={index + eventMedia.length}
                    onClick={() => openLightbox(item)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="food-drinks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter Buttons */}
              <div className="flex justify-center gap-2 mb-8">
                {[
                  { id: 'all' as const, label: 'Alle' },
                  { id: 'food' as const, label: 'Speisen' },
                  { id: 'drink' as const, label: 'Getränke' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filter === f.id
                        ? 'bg-gold/20 text-gold border border-gold'
                        : 'bg-deep-green text-foreground hover:text-gold'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredFoodDrinks.map((item, index) => (
                    <GalleryCard
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={() => openLightbox(item)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
