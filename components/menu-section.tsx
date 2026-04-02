'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Leaf, Wheat, Info, BookOpen, Calendar } from 'lucide-react'
import Link from 'next/link'
import { menuItems, foodDrinkMedia } from '@/lib/data'
import type { MenuItem } from '@/lib/types'

const categories = [
  { id: 'all', label: 'Alle' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'antipasti', label: 'Antipasti' },
  { id: 'salate', label: 'Salate' },
  { id: 'fleisch', label: 'Fleisch' },
  { id: 'schnitzel', label: 'Schnitzel' },
  { id: 'fisch', label: 'Fisch' },
  { id: 'dolci', label: 'Desserts' },
]

// Map category to menu page image
const categoryImages: Record<string, string> = {
  pizza: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza3-K2D1ypi49VsYzsrc9mRXNtx7V6XvSk.png',
  pasta: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pasta5-xZyEHeyAetXimfIToxp6PSKuURFHUA.png',
  antipasti: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vorspeisen_salate_supen1-QrQHcWxymNX2IRSYKI5rQojEvZKdL2.png',
  salate: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vorspeisen_salate_supen1-QrQHcWxymNX2IRSYKI5rQojEvZKdL2.png',
  fleisch: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schnitzel_fleisch4-dyJTYdFEeSGpAGLu3XXimNmHDd2A20.png',
  schnitzel: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schnitzel_fleisch4-dyJTYdFEeSGpAGLu3XXimNmHDd2A20.png',
  fisch: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fisch10-uFSl89s2S4SbYMe7JtM637eHJUOqKW.png',
  dolci: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Deserts9-4gaTDMhgMrZAByQ5UTL5bAg0OA9BjU.png',
}

function MenuCard({ item, onClick }: { item: MenuItem; onClick: () => void }) {
  return (
    <motion.button
      className="group relative bg-deep-green rounded-xl overflow-hidden text-left w-full"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-green via-deep-green/20 to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-gold text-deep-green font-bold px-3 py-1 rounded-full text-sm">
          {item.price.toFixed(2)}€
        </div>

        {/* Dietary Icons */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isVegetarian && (
            <div className="bg-green-600/90 p-1.5 rounded-full" title="Vegetarisch">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          {item.isGlutenFree && (
            <div className="bg-amber-600/90 p-1.5 rounded-full" title="Glutenfrei">
              <Wheat className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-foreground font-semibold text-lg mb-1 group-hover:text-gold transition-colors">
          {item.name}
        </h3>
        <p className="text-gray-text text-sm line-clamp-2">{item.description}</p>
        <p className="text-gold/70 text-xs mt-2 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Zum Vergrößern klicken
        </p>
      </div>
    </motion.button>
  )
}

function BookModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Book Container */}
      <motion.div
        className="relative w-full max-w-4xl bg-deep-green rounded-2xl overflow-hidden shadow-2xl z-10"
        initial={{ 
          rotateY: -90, 
          opacity: 0,
          transformPerspective: 1000,
          transformOrigin: 'left center'
        }}
        animate={{ 
          rotateY: 0, 
          opacity: 1,
        }}
        exit={{ 
          rotateY: 90, 
          opacity: 0,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-deep-green-dark/80 hover:bg-gold text-foreground hover:text-deep-green p-2 rounded-full transition-colors"
          aria-label="Schließen"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left Page - Image */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[500px]">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-green/30 md:block hidden" />
          </div>

          {/* Right Page - Details */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Category Badge */}
              <span className="text-gold text-sm font-medium uppercase tracking-wider">
                {item.category}
              </span>

              {/* Name */}
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                {item.name}
              </h2>

              {/* Description */}
              <p className="text-gray-text text-lg leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-gold text-4xl font-bold">{item.price.toFixed(2)}€</span>
              </div>

              {/* Dietary Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                {item.isVegetarian && (
                  <span className="inline-flex items-center gap-1.5 bg-green-600/20 text-green-400 px-3 py-1.5 rounded-full text-sm">
                    <Leaf className="w-4 h-4" />
                    Vegetarisch
                  </span>
                )}
                {item.isVegan && (
                  <span className="inline-flex items-center gap-1.5 bg-green-600/20 text-green-400 px-3 py-1.5 rounded-full text-sm">
                    <Leaf className="w-4 h-4" />
                    Vegan
                  </span>
                )}
                {item.isGlutenFree && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-600/20 text-amber-400 px-3 py-1.5 rounded-full text-sm">
                    <Wheat className="w-4 h-4" />
                    Glutenfrei
                  </span>
                )}
              </div>

              {/* Allergens */}
              {item.allergens.length > 0 && (
                <div className="border-t border-border pt-4 mb-6">
                  <p className="text-gray-text text-sm">
                    <span className="font-medium text-foreground">Allergene:</span>{' '}
                    {item.allergens.join(', ')}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Link
                  href="/menu"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-light text-deep-green font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-gold/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <BookOpen className="w-5 h-5" />
                  View Full Menu
                </Link>
                <Link
                  href="/#reservation"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-wine to-wine-dark text-foreground font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-wine/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="w-5 h-5" />
                  Make a Reservation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  return (
    <section id="speisekarte" className="py-20 md:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unsere <span className="text-gold">Speisekarte</span>
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6" />
          <p className="text-gray-text max-w-2xl mx-auto">
            Entdecken Sie unsere authentischen italienischen Gerichte, 
            zubereitet mit frischen Zutaten und viel Liebe.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gold text-deep-green'
                  : 'bg-deep-green text-foreground hover:bg-deep-green-dark hover:text-gold'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Full Menu Link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-text mb-4">
            Sehen Sie unsere vollständige Speisekarte mit allen Gerichten
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {foodDrinkMedia.filter(m => m.category === 'food').slice(0, 5).map((media) => (
              <a
                key={media.id}
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-[3/4] rounded-lg overflow-hidden group"
              >
                <Image
                  src={media.url}
                  alt={media.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <p className="absolute bottom-2 left-2 right-2 text-foreground text-xs font-medium">
                  {media.title}
                </p>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Book Modal */}
      <AnimatePresence>
        {selectedItem && (
          <BookModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
