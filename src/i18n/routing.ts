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
    }
  },
  // Prefix always shown for both locales
  localePrefix: 'always'
} as const)

export type Pathnames = typeof routing.pathnames
export type Locale = typeof routing.locales[number]
