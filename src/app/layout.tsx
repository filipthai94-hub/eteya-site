import { Barlow, Barlow_Condensed, Geist, Inter, JetBrains_Mono } from 'next/font/google'
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/JsonLd'
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
        <JsonLd data={organizationSchema} />
        <JsonLd data={webSiteSchema} />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-et-bg text-et-primary font-body antialiased">{children}</body>
    </html>
  )
}
