import type { Metadata, Viewport } from 'next'
import { Urbanist, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const urbanist = Urbanist({ 
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
})

const fraunces = Fraunces({ 
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Da Sergio - Restaurant & Pizzeria | Fulda',
  description: 'Authentische italienische Küche in Fulda. Genießen Sie handgemachte Pizza, frische Pasta und traditionelle Gerichte in gemütlicher Atmosphäre. Reservieren Sie jetzt!',
  keywords: ['Restaurant', 'Pizzeria', 'Fulda', 'Italienisch', 'Pizza', 'Pasta', 'Da Sergio'],
  authors: [{ name: 'Da Sergio Restaurant' }],
  openGraph: {
    title: 'Da Sergio - Restaurant & Pizzeria | Fulda',
    description: 'Authentische italienische Küche in Fulda. Genießen Sie handgemachte Pizza, frische Pasta und traditionelle Gerichte.',
    type: 'website',
    locale: 'de_DE',
  },
}

export const viewport: Viewport = {
  themeColor: '#18312E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" data-scroll-behavior="smooth" className={`${urbanist.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
