'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Check, AlertCircle, Send } from 'lucide-react'
import { contactInfo, openingHours } from '@/lib/data'

interface FormData {
  name: string
  phone: string
  guests: string
  date: string
  time: string
  message: string
}

interface FormErrors {
  name?: string
  phone?: string
  guests?: string
  date?: string
  time?: string
}

const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30'
]

const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']

function SuccessAnimation() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Check className="w-10 h-10 text-green-500" />
        </motion.div>
      </motion.div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">Vielen Dank!</h3>
      <p className="text-gray-text text-center max-w-sm">
        Wir freuen uns auf Ihren Besuch. Sie erhalten in Kürze eine Bestätigung.
      </p>
    </motion.div>
  )
}

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    guests: '',
    date: '',
    time: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bitte geben Sie Ihren Namen ein'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Bitte geben Sie Ihre Telefonnummer ein'
    } else if (!/^[\d\s+()-]{6,}$/.test(formData.phone)) {
      newErrors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein'
    }
    if (!formData.guests) {
      newErrors.guests = 'Bitte wählen Sie die Anzahl der Personen'
    }
    if (!formData.date) {
      newErrors.date = 'Bitte wählen Sie ein Datum'
    }
    if (!formData.time) {
      newErrors.time = 'Bitte wählen Sie eine Uhrzeit'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      // Shake animation on error
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Reset form after showing success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({
        name: '',
        phone: '',
        guests: '',
        date: '',
        time: '',
        message: '',
      })
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <section id="kontakt" className="py-20 md:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Reservierung & <span className="text-gold">Kontakt</span>
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6" />
          <p className="text-gray-text max-w-2xl mx-auto">
            Reservieren Sie jetzt Ihren Tisch oder kontaktieren Sie uns für Fragen und besondere Anlässe
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-8">
              Besuchen Sie uns
            </h3>

            <div className="space-y-6 mb-10">
              <a
                href={contactInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-foreground font-medium group-hover:text-gold transition-colors">Adresse</p>
                  <p className="text-gray-text">{contactInfo.address}</p>
                </div>
              </a>

              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-foreground font-medium group-hover:text-gold transition-colors">Telefon</p>
                  <p className="text-gray-text">{contactInfo.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-foreground font-medium group-hover:text-gold transition-colors">E-Mail</p>
                  <p className="text-gray-text">{contactInfo.email}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Öffnungszeiten</p>
                  {openingHours.map((oh, index) => (
                    <p key={index} className="text-gray-text">
                      {oh.day}: {oh.hours}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden h-64 lg:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2535.8!2d9.6752!3d50.5528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a2a0a!2sHeinrich-von-Bibra-Platz%201b%2C%2036037%20Fulda!5e0!3m2!1sde!2sde!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Da Sergio Standort"
              />
            </div>
          </motion.div>

          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
                Tisch reservieren
              </h3>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <SuccessAnimation key="success" />
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-deep-green-dark border transition-colors ${
                          errors.name ? 'border-red-500' : 'border-border focus:border-gold'
                        } text-foreground placeholder:text-gray-text focus:outline-none`}
                        placeholder="Ihr vollständiger Name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Telefonnummer *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-deep-green-dark border transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-border focus:border-gold'
                        } text-foreground placeholder:text-gray-text focus:outline-none`}
                        placeholder="Ihre Telefonnummer"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Guests */}
                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-foreground mb-2">
                        Anzahl Personen *
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-deep-green-dark border transition-colors ${
                          errors.guests ? 'border-red-500' : 'border-border focus:border-gold'
                        } text-foreground focus:outline-none`}
                      >
                        <option value="">Bitte wählen</option>
                        {guestOptions.map(opt => (
                          <option key={opt} value={opt}>{opt} {opt === '1' ? 'Person' : 'Personen'}</option>
                        ))}
                      </select>
                      {errors.guests && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.guests}
                        </p>
                      )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                          Datum *
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={today}
                          className={`w-full px-4 py-3 rounded-lg bg-deep-green-dark border transition-colors ${
                            errors.date ? 'border-red-500' : 'border-border focus:border-gold'
                          } text-foreground focus:outline-none`}
                        />
                        {errors.date && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.date}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                          Uhrzeit *
                        </label>
                        <select
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg bg-deep-green-dark border transition-colors ${
                            errors.time ? 'border-red-500' : 'border-border focus:border-gold'
                          } text-foreground focus:outline-none`}
                        >
                          <option value="">Wählen</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {errors.time && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.time}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Nachricht (optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg bg-deep-green-dark border border-border focus:border-gold text-foreground placeholder:text-gray-text focus:outline-none resize-none"
                        placeholder="Besondere Wünsche, Allergien, Anlass..."
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold hover:bg-gold-dark text-deep-green font-semibold px-6 py-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-deep-green border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Tisch reservieren
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
