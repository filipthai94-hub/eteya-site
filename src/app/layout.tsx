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
 */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
