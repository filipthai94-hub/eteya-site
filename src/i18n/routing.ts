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
    '/kontakt': {
      sv: '/kontakt',
      en: '/contact'
    },
    '/kundcase': {
      sv: '/kundcase',
      en: '/case-studies'
    },
    '/kundcase/mbflytt': {
      sv: '/kundcase/mbflytt',
      en: '/case-studies/mbflytt'
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
