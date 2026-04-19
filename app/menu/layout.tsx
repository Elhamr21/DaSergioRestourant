import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { defaultSeoImage, getMenuJsonLd } from '@/lib/seo'

const title = 'Speisekarte'
const description =
  'Die Speisekarte von Da Sergio in Fulda mit Pizza, Pasta, Vorspeisen, Fleisch, Fisch, Desserts, Weinen und alkoholfreien Getränken.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: 'Speisekarte | Da Sergio Fulda',
    description,
    url: '/menu',
    images: [
      {
        url: defaultSeoImage,
        alt: 'Speisekarte von Da Sergio in Fulda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speisekarte | Da Sergio Fulda',
    description,
    images: [defaultSeoImage],
  },
}

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={getMenuJsonLd()} />
      {children}
    </>
  )
}
