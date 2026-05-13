"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { contactInfo, openingHours } from "@/lib/data";
import { ReservationForm } from "@/components/reservation-form";

export function ContactSection() {
  return (
    <section id="kontakt" className="py-20 md:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Reservieren Sie jetzt Ihren Tisch oder kontaktieren Sie uns für
            Fragen und besondere Anlässe
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
                  <p className="text-foreground font-medium group-hover:text-gold transition-colors">
                    Adresse
                  </p>
                  <p className="text-gray-text">{contactInfo.address}</p>
                </div>
              </a>

              <a
                href={`tel:${contactInfo.phoneHref}`}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-foreground font-medium group-hover:text-gold transition-colors">
                    Telefon
                  </p>
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
                  <p className="text-foreground font-medium group-hover:text-gold transition-colors">
                    E-Mail
                  </p>
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
            id="reservation"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ReservationForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
