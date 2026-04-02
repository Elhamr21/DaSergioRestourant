'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react'
import { logoUrl, contactInfo, openingHours } from '@/lib/data'

const navLinks = [
  { href: '#hero', label: 'Startseite' },
  { href: '#speisekarte', label: 'Speisekarte' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#kontakt', label: 'Kontakt' },
  { href: '/impressum', label: 'Impressum' },
]

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = href
    }
  }

  return (
    <footer className="bg-deep-green pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={logoUrl}
              alt="Da Sergio Logo"
              width={140}
              height={45}
              className="h-10 w-auto mb-4"
            />
            <p className="text-gray-text text-sm leading-relaxed">
              Authentische italienische Küche in Fulda. Genießen Sie handgemachte Pizza, 
              frische Pasta und traditionelle Gerichte in gemütlicher Atmosphäre.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-foreground font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-text hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-foreground font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={contactInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-gray-text hover:text-gold transition-colors text-sm group"
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gold/70 group-hover:text-gold" />
                  <span>{contactInfo.address}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-2 text-gray-text hover:text-gold transition-colors text-sm group"
                >
                  <Phone className="w-4 h-4 shrink-0 text-gold/70 group-hover:text-gold" />
                  <span>{contactInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 text-gray-text hover:text-gold transition-colors text-sm group"
                >
                  <Mail className="w-4 h-4 shrink-0 text-gold/70 group-hover:text-gold" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-foreground font-semibold mb-4">Öffnungszeiten</h4>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-gold/70" />
              <div>
                {openingHours.map((oh, index) => (
                  <p key={index} className="text-gray-text text-sm">
                    <span className="text-foreground">{oh.day}</span>
                    <br />
                    {oh.hours}
                  </p>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-foreground font-semibold mb-3">Folgen Sie uns</p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center text-gold transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center text-gold transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-text text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Da Sergio - Restaurant & Pizzeria. Alle Rechte vorbehalten.
            </p>
            <p className="text-gray-text text-sm">
              Realisiert von{' '}
              <a
                href="https://ictfive.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-dark transition-colors"
              >
                ictfive
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
