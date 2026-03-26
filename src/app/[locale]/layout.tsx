import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import MotionProvider from '@/components/animations/MotionProvider'
import type { Metadata } from 'next'

const BASE_URL = 'https://eteya.ai'

const META: Record<string, { title: string; description: string }> = {
  sv: {
    title: 'Eteya — AI som driver ditt företag',
    description:
      'Vi bygger AI agents, process automation och custom AI-lösningar för svenska och internationella företag.',
  },
  en: {
    title: 'Eteya — AI that powers your business',
    description:
      'We build AI agents, process automation and custom AI solutions for Swedish and international businesses.',
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
  }
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
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <MotionProvider>{children}</MotionProvider>
    </NextIntlClientProvider>
  )
}
