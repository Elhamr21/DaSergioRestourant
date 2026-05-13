import { MessageCircle } from 'lucide-react'
import { contactInfo } from '@/lib/data'

export function WhatsappButton() {
  return (
    <a
      href={contactInfo.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Da Sergio per WhatsApp kontaktieren"
      className="fixed bottom-4 right-4 z-50 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-[#0b2a16] shadow-lg shadow-black/30 transition hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6 sm:right-6 sm:px-5"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
