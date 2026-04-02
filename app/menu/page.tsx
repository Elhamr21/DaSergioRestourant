'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Leaf, Wheat, Calendar, X } from 'lucide-react'
import { menuItems, logoUrl } from '@/lib/data'
import type { MenuItem } from '@/lib/types'

const categories = [
  { id: 'all', label: 'Alle', pageIndex: 0 },
  { id: 'antipasti', label: 'Antipasti', pageIndex: 0 },
  { id: 'salate', label: 'Salate', pageIndex: 0 },
  { id: 'pizza', label: 'Pizza', pageIndex: 2 },
  { id: 'pasta', label: 'Pasta', pageIndex: 4 },
  { id: 'schnitzel', label: 'Schnitzel', pageIndex: 3 },
  { id: 'fleisch', label: 'Fleisch', pageIndex: 3 },
  { id: 'fisch', label: 'Fisch', pageIndex: 9 },
  { id: 'dolci', label: 'Desserts', pageIndex: 8 },
]

// Menu pages for book-flip viewer
const menuPages = [
  { 
    id: 'vorspeisen', 
    title: 'Vorspeisen, Salate & Suppen',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vorspeisen_salate_supen1-QrQHcWxymNX2IRSYKI5rQojEvZKdL2.png'
  },
  { 
    id: 'weine', 
    title: 'Weine & Prosecco',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ApfelweinWeisweineRotweineProsecco2-44FL7XRUuoz5GGytCailFaiM3HC7vv.png'
  },
  { 
    id: 'pizza', 
    title: 'Pizza',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza3-K2D1ypi49VsYzsrc9mRXNtx7V6XvSk.png'
  },
  { 
    id: 'schnitzel', 
    title: 'Schnitzel & Fleisch',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schnitzel_fleisch4-dyJTYdFEeSGpAGLu3XXimNmHDd2A20.png'
  },
  { 
    id: 'pasta', 
    title: 'Pasta',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pasta5-xZyEHeyAetXimfIToxp6PSKuURFHUA.png'
  },
  { 
    id: 'heisse', 
    title: 'Heiße Getränke & Spirituosen',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/seiseGetranke_spriritousen6-azQv5xsWD2ylpJdrXVU89hyNne7trY.png'
  },
  { 
    id: 'alkoholfrei', 
    title: 'Alkoholfreie Getränke',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlkoholfreieGetranke_selbstgemachteLimonade7-rVDOrqVTXqHT1uGIBPfT6WBROqR2Bv.png'
  },
  { 
    id: 'biere', 
    title: 'Biere',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Biere8-SoEJ48uRgWu4HhvNmihO6Jfj32gTPJ.png'
  },
  { 
    id: 'desserts', 
    title: 'Desserts',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Deserts9-4gaTDMhgMrZAByQ5UTL5bAg0OA9BjU.png'
  },
  { 
    id: 'fisch', 
    title: 'Fisch',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fisch10-uFSl89s2S4SbYMe7JtM637eHJUOqKW.png'
  },
]

function MenuItemCard({ item, onClick }: { item: MenuItem; onClick: () => void }) {
  return (
    <motion.button
      className="group flex items-center gap-4 bg-deep-green hover:bg-deep-green-dark rounded-xl p-3 text-left w-full transition-colors"
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-foreground font-medium text-sm group-hover:text-gold transition-colors truncate">
          {item.name}
        </h3>
        <p className="text-gray-text text-xs line-clamp-1">{item.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gold font-semibold text-sm">{item.price.toFixed(2)}€</span>
          {item.isVegetarian && <Leaf className="w-3 h-3 text-green-400" />}
          {item.isGlutenFree && <Wheat className="w-3 h-3 text-amber-400" />}
        </div>
      </div>
    </motion.button>
  )
}

function ItemDetailModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative bg-deep-green rounded-2xl overflow-hidden shadow-2xl z-10 max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-deep-green-dark/80 hover:bg-gold text-foreground hover:text-deep-green p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative aspect-video">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 448px) 100vw, 448px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-green to-transparent" />
        </div>

        <div className="p-6">
          <span className="text-gold text-xs font-medium uppercase tracking-wider">{item.category}</span>
          <h2 className="font-serif text-2xl font-bold text-foreground mt-1 mb-2">{item.name}</h2>
          <p className="text-gray-text text-sm mb-4">{item.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gold text-2xl font-bold">{item.price.toFixed(2)}€</span>
            <div className="flex gap-2">
              {item.isVegetarian && (
                <span className="inline-flex items-center gap-1 bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs">
                  <Leaf className="w-3 h-3" /> Vegetarisch
                </span>
              )}
              {item.isGlutenFree && (
                <span className="inline-flex items-center gap-1 bg-amber-600/20 text-amber-400 px-2 py-1 rounded-full text-xs">
                  <Wheat className="w-3 h-3" /> Glutenfrei
                </span>
              )}
            </div>
          </div>
          {item.allergens.length > 0 && (
            <p className="text-gray-text text-xs border-t border-border pt-3">
              <span className="font-medium text-foreground">Allergene:</span> {item.allergens.join(', ')}
            </p>
          )}
          <Link
            href="/#reservation"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-wine to-wine-dark text-foreground font-semibold px-4 py-3 rounded-lg hover:shadow-lg hover:shadow-wine/30 transition-all"
          >
            <Calendar className="w-5 h-5" />
            Make a Reservation
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BookViewer({ currentPage, setCurrentPage }: { currentPage: number; setCurrentPage: (page: number) => void }) {
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')
  const [displayPage, setDisplayPage] = useState(currentPage)

  useEffect(() => {
    if (currentPage !== displayPage && !isFlipping) {
      setFlipDirection(currentPage > displayPage ? 'next' : 'prev')
      setIsFlipping(true)
      setTimeout(() => {
        setDisplayPage(currentPage)
        setIsFlipping(false)
      }, 600)
    }
  }, [currentPage, displayPage, isFlipping])

  const goToPage = (direction: 'next' | 'prev') => {
    if (isFlipping) return
    
    if (direction === 'next' && currentPage < menuPages.length - 1) {
      setCurrentPage(currentPage + 1)
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const jumpToPage = (index: number) => {
    if (index !== currentPage && !isFlipping) {
      setCurrentPage(index)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Book Header - Elegant Style */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gold/20">
        <div>
          <h3 className="text-foreground font-serif text-xl font-bold">
            {menuPages[displayPage].title}
          </h3>
          <p className="text-gold/70 text-xs mt-1 tracking-wider uppercase">Da Sergio Speisekarte</p>
        </div>
        <div className="bg-deep-green px-4 py-2 rounded-full border border-gold/30">
          <span className="text-gold font-medium text-sm">
            {displayPage + 1} <span className="text-gray-text">/ {menuPages.length}</span>
          </span>
        </div>
      </div>

      {/* Book Container - Premium Leather Book Style */}
      <div className="relative flex-1 min-h-[400px]" style={{ perspective: '2500px' }}>
        {/* Outer Book Cover Shadow */}
        <div className="absolute -inset-2 bg-gradient-to-br from-black/40 via-black/20 to-black/40 rounded-2xl blur-xl" />
        
        {/* Book Cover - Dark Green Leather Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-950 rounded-xl shadow-2xl">
          {/* Gold Border Trim */}
          <div className="absolute inset-0 rounded-xl border-2 border-gold/30" />
          {/* Inner Gold Accent Line */}
          <div className="absolute inset-2 rounded-lg border border-gold/10" />
        </div>
        
        {/* Book Spine Effect - Gold Embossed */}
        <div className="absolute left-0 top-2 bottom-2 w-6 bg-gradient-to-r from-emerald-900 via-green-900 to-green-950 rounded-l-lg z-10 shadow-inner">
          <div className="absolute inset-y-4 left-1 w-0.5 bg-gradient-to-b from-gold/40 via-gold/60 to-gold/40 rounded-full" />
          <div className="absolute inset-y-4 left-3 w-px bg-gold/20 rounded-full" />
        </div>
        
        {/* Page Stack Effect - Cream Paper Pages */}
        <div className="absolute top-3 right-3 bottom-3 left-8 bg-gradient-to-r from-amber-100/5 to-amber-50/10 rounded-r-lg transform translate-x-0.5" />
        <div className="absolute top-4 right-4 bottom-4 left-9 bg-gradient-to-r from-amber-100/3 to-amber-50/5 rounded-r-lg transform translate-x-1" />
        
        {/* Main Page Container */}
        <div 
          className="absolute top-2 right-2 bottom-2 left-6 overflow-hidden rounded-r-lg bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 shadow-inner"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Current Page */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={displayPage}
              className="absolute inset-0"
              initial={{ 
                rotateY: flipDirection === 'next' ? -90 : 90,
                opacity: 0,
                originX: 0,
              }}
              animate={{ 
                rotateY: 0,
                opacity: 1,
              }}
              exit={{ 
                rotateY: flipDirection === 'next' ? 90 : -90,
                opacity: 0,
                zIndex: 10,
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.645, 0.045, 0.355, 1],
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                transformOrigin: 'left center',
              }}
            >
              {/* Page Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 overflow-hidden">
                <Image
                  src={menuPages[displayPage].url}
                  alt={menuPages[displayPage].title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Page Inner Shadow */}
                <div className="absolute inset-0 shadow-[inset_4px_0_12px_rgba(0,0,0,0.4)]" />
                {/* Page Edge Highlight */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold/10 via-gold/20 to-gold/10" />
              </div>
              
              {/* Page Curl Effect */}
              <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
                <div className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-tl from-gold/10 via-transparent to-transparent rounded-tl-3xl" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Flipping Page Light Sweep */}
          {isFlipping && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
            </motion.div>
          )}

          {/* Navigation Buttons - Elegant Style */}
          <button
            onClick={() => goToPage('prev')}
            disabled={currentPage === 0 || isFlipping}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-900 to-green-950 hover:from-gold hover:to-amber-600 text-gold hover:text-deep-green p-3 rounded-full shadow-xl transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed z-40 border border-gold/30 hover:border-gold hover:scale-110"
            aria-label="Vorherige Seite"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goToPage('next')}
            disabled={currentPage === menuPages.length - 1 || isFlipping}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-900 to-green-950 hover:from-gold hover:to-amber-600 text-gold hover:text-deep-green p-3 rounded-full shadow-xl transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed z-40 border border-gold/30 hover:border-gold hover:scale-110"
            aria-label="Nächste Seite"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Page Indicators - Gold Dots */}
      <div className="flex justify-center gap-2 mt-6 pt-4 border-t border-gold/10">
        {menuPages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => jumpToPage(index)}
            disabled={isFlipping}
            className={`rounded-full transition-all duration-300 ${
              index === displayPage 
                ? 'bg-gradient-to-r from-gold to-amber-500 w-8 h-2.5 shadow-lg shadow-gold/40' 
                : 'bg-emerald-900/60 hover:bg-gold/40 w-2.5 h-2.5 border border-gold/20'
            }`}
            title={page.title}
            aria-label={`Gehe zu ${page.title}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [currentBookPage, setCurrentBookPage] = useState(0)

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    const category = categories.find(c => c.id === categoryId)
    if (category) {
      setCurrentBookPage(category.pageIndex)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/19120193-uhd_3840_2160_25fps%20%281%29-PsUdS1OH4cSOKFazvdzena4kdXeY2B.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/95" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-5 h-5 text-gold group-hover:-translate-x-1 transition-transform" />
            <Image
              src={logoUrl}
              alt="Da Sergio"
              width={100}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <Link
            href="/#reservation"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-wine to-wine-dark text-foreground font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-wine/30 transition-all text-sm"
          >
            <Calendar className="w-4 h-4" />
            Reservieren
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Title */}
          <div className="text-center py-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Unsere <span className="text-gold">Speisekarte</span>
            </h1>
            <p className="text-gray-text max-w-xl mx-auto text-sm">
              Entdecken Sie unsere authentischen italienischen Gerichte oder blättern Sie durch unsere vollständige Speisekarte.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-gold text-deep-green shadow-lg shadow-gold/30'
                    : 'bg-deep-green/80 text-foreground hover:bg-deep-green hover:text-gold border border-border'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Item List */}
            <div className="order-2 lg:order-1">
              <h2 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full" />
                Gerichte ({filteredItems.length})
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Book Viewer */}
            <div className="order-1 lg:order-2 bg-deep-green/50 backdrop-blur-sm rounded-2xl p-6 min-h-[500px] lg:min-h-[600px] border border-border">
              <BookViewer 
                currentPage={currentBookPage} 
                setCurrentPage={setCurrentBookPage} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
