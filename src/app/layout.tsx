import { Barlow_Condensed, Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://eteya.ai'),
  title: 'Eteya — AI som driver ditt företag',
  description: 'Vi bygger AI agents, process automation och custom AI-lösningar för svenska och internationella företag.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${display.variable} ${body.variable}`}>
      <body className="bg-et-bg text-et-primary font-body antialiased">{children}</body>
    </html>
  )
}
