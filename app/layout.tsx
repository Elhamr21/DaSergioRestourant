import type { Metadata, Viewport } from 'next'
import { Urbanist, Fraunces } from 'next/font/google'
import { AmplifyProvider } from '@/components/amplify-provider'
import { defaultDescription, defaultSeoImage, metadataBase, siteName } from '@/lib/seo'
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
  metadataBase,
  applicationName: siteName,
  title: {
    default: 'Da Sergio - Restaurant & Pizzeria in Fulda',
    template: '%s | Da Sergio Fulda',
  },
  description: defaultDescription,
  keywords: [
    'Da Sergio Fulda',
    'Restaurant Fulda',
    'Pizzeria Fulda',
    'Italienisches Restaurant Fulda',
    'Pizza Fulda',
    'Pasta Fulda',
    'Tisch reservieren Fulda',
  ],
  authors: [{ name: 'Da Sergio Restaurant' }],
  creator: 'Da Sergio',
  publisher: 'Da Sergio',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Da Sergio - Restaurant & Pizzeria in Fulda',
    description: defaultDescription,
    url: '/',
    siteName,
    type: 'website',
    locale: 'de_DE',
    images: [
      {
        url: defaultSeoImage,
        alt: 'Da Sergio Restaurant & Pizzeria in Fulda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Da Sergio - Restaurant & Pizzeria in Fulda',
    description: defaultDescription,
    images: [defaultSeoImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'restaurant',
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
        <AmplifyProvider>
          {children}
        </AmplifyProvider>

      </body>
    </html>
  )
}
