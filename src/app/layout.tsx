import { Barlow, Barlow_Condensed, Geist, Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const displayWide = Barlow({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display-wide',
  display: 'swap',
})

const nums = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-nums',
  display: 'swap',
})

const body = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://eteya.ai'),
  title: 'Eteya — AI som driver ditt företag',
  description: 'Vi bygger AI agents, process automation och custom AI-lösningar för svenska och internationella företag.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${display.variable} ${displayWide.variable} ${nums.variable} ${body.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Eteya',
              legalName: 'Eteya Consulting AB',
              url: 'https://eteya.ai',
              description:
                'AI & Automation Consulting — vi bygger AI agents, process automation och custom AI-lösningar.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Solhagsvägen 26A',
                addressLocality: 'Karlskoga',
                postalCode: '691 52',
                addressCountry: 'SE',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Eteya',
              url: 'https://eteya.ai',
            }),
          }}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="preload"
          as="image"
          href="/hero-poster.webp"
          fetchPriority="high"
        />
      </head>
      <body className="bg-et-bg text-et-primary font-body antialiased">{children}</body>
    </html>
  )
}
