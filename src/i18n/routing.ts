import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['sv', 'en'],
  defaultLocale: 'sv',
  pathnames: {
    '/': '/',
    '/om-oss': {
      sv: '/om-oss',
      en: '/about'
    },
    '/om-oss/filip': {
      sv: '/om-oss/filip',
      en: '/about/filip'
    },
    '/om-oss/agit': {
      sv: '/om-oss/agit',
      en: '/about/agit'
    },
    '/kontakt': {
      sv: '/kontakt',
      en: '/contact'
    },
    '/kundcase': {
      sv: '/kundcase',
      en: '/case-studies'
    },
    '/kundcase/skg-stockholm': {
      sv: '/kundcase/skg-stockholm',
      en: '/case-studies/skg-stockholm'
    },
    '/kundcase/nordicrank': {
      sv: '/kundcase/nordicrank',
      en: '/case-studies/nordicrank'
    },
    '/kundcase/sannegarden': {
      sv: '/kundcase/sannegarden',
      en: '/case-studies/sannegarden'
    },
    '/kundcase/telestore': {
      sv: '/kundcase/telestore',
      en: '/case-studies/telestore'
    },
    '/kundcase/trainwithalbert': {
      sv: '/kundcase/trainwithalbert',
      en: '/case-studies/trainwithalbert'
    },
    '/ai-besparing': {
      sv: '/ai-besparing',
      en: '/ai-savings'
    },
    '/privacy-policy': {
      sv: '/integritetspolicy',
      en: '/privacy-policy'
    },
    '/terms': {
      sv: '/villkor',
      en: '/terms'
    },
    // ── Blog ────────────────────────────────────────
    // SV: /blogg, EN: /blog (matchar B2B-konvention från HubSpot/Stripe/Vercel)
    '/blogg': {
      sv: '/blogg',
      en: '/blog'
    },
    '/blogg/[slug]': {
      sv: '/blogg/[slug]',
      en: '/blog/[slug]'
    },
    '/blogg/tag/[tag]': {
      sv: '/blogg/tag/[tag]',
      en: '/blog/tag/[tag]'
    },
    '/blogg/forfattare/[author]': {
      sv: '/blogg/forfattare/[author]',
      en: '/blog/author/[author]'
    }
  },
  // Prefix always shown for both locales
  localePrefix: 'always'
} as const)

export type Pathnames = typeof routing.pathnames
export type Locale = typeof routing.locales[number]
