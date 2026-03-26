import { Barlow_Condensed, Geist } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${display.variable} ${body.variable}`}>
      <head>
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
      </head>
      <body className="bg-et-bg text-et-primary font-body antialiased">{children}</body>
    </html>
  )
}
