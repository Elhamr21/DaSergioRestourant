import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Philosophy } from '@/components/philosophy'
import { MenuSection } from '@/components/menu-section'
import { GallerySection } from '@/components/gallery-section'
import { ContactSection } from '@/components/contact-section'
import { GoogleReviews } from '@/components/google-reviews'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <MenuSection />
        <GallerySection />
        <ContactSection />
        <GoogleReviews />
      </main>
      <Footer />
    </>
  )
}
