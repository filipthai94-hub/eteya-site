/**
 * Root layout — minimal passthrough for i18n.
 *
 * Next.js App Router requires a root layout, but for next-intl sites
 * the real html/body/head live in [locale]/layout.tsx so that the
 * lang attribute can be set server-side from the URL locale segment.
 *
 * Non-[locale] routes in this app (robots.txt, sitemap.xml, llms.txt,
 * manifest, opengraph-image) are all metadata/data route handlers —
 * they don't render HTML and don't need this layout to do anything.
 *
 * Verification meta tags below propagate to ALL routes (root + locale)
 * because Next.js inherits metadata from root layout into nested layouts.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://eteya.ai'),
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? '',
    other: {
      // Bing Webmaster Tools (no native field in Next.js metadata API yet — use 'other')
      // Source: https://github.com/vercel/next.js/discussions/57464
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION ?? '',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
