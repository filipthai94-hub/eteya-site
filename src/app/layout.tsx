import { Barlow, Barlow_Condensed, Geist, Inter, JetBrains_Mono } from 'next/font/google'
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

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${display.variable} ${displayWide.variable} ${nums.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
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
