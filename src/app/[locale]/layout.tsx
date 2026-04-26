import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Barlow, Barlow_Condensed, Geist, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { JsonLd, organizationSchema, webSiteSchema, buildGraph } from '@/components/JsonLd'
import MotionProvider from '@/components/animations/MotionProvider'
import ScrollReset from '@/components/ui/ScrollReset'
import TransitionProvider from '@/components/animations/TransitionProvider'
import { ConsentDefault } from '@/components/analytics/ConsentDefault'
import { CookieBanner } from '@/components/cookie-banner/CookieBanner'
import '../globals.css'
import type { Metadata, Viewport } from 'next'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

// viewportFit: 'cover' lets content flow into the iPhone safe-area
// (Dynamic Island, notch). Required for iOS 26+ Safari so hero
// heights calculated with 100svh sit correctly below the status bar.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

// ── Fonts ──
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

const BASE_URL = 'https://eteya.ai'

const META: Record<string, { title: string; description: string }> = {
  sv: {
    title: 'Eteya — AI-byrå för AI-agenter och process-automation',
    description:
      'Eteya bygger AI-agenter, process-automation och custom AI-lösningar åt svenska SMB. Leverans på veckor, mätbar besparing, transparent metodik.',
  },
  en: {
    title: 'Eteya — AI agency for AI agents and process automation',
    description:
      'Eteya builds AI agents, process automation and custom AI solutions for businesses. Delivered in weeks, measurable savings, transparent methodology.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.sv

  return {
    metadataBase: new URL(BASE_URL),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: locale === 'sv' ? BASE_URL : `${BASE_URL}/${locale}`,
      languages: {
        sv: BASE_URL,
        en: `${BASE_URL}/en`,
        'x-default': BASE_URL,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: locale === 'sv' ? BASE_URL : `${BASE_URL}/${locale}`,
      siteName: 'Eteya',
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
    },
  }
}

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'sv' | 'en')) notFound()

  // Enable static rendering
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${display.variable} ${displayWide.variable} ${nums.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Consent Mode v2 default state — MUST run before GA4 loads */}
        <ConsentDefault />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Site-wide entity graph: Organization + WebSite. Andra sidor lägger
            till sidspecifika scheman i sin egen @graph (separat <script>). */}
        <JsonLd data={buildGraph([organizationSchema, webSiteSchema])} />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-et-bg text-et-primary font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2"
          >
            Hoppa till huvudinnehåll
          </a>
          <TransitionProvider>
            <div className="page-transition-overlay" aria-hidden="true" />
            <MotionProvider>
              <ScrollReset />
              <main id="main-content">{children}</main>
            </MotionProvider>
          </TransitionProvider>
          <CookieBanner />
        </NextIntlClientProvider>
        {/* Analytics — Vercel is cookieless (no consent needed); GA4 respects Consent Mode v2 */}
        <Analytics />
        <SpeedInsights />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  )
}
