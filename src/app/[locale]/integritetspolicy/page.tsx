import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import PrivacyPolicyContent from '@/components/pages/PrivacyPolicyContent'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Integritetspolicy — GDPR & Personuppgifter | Eteya',
    description:
      'Eteya Consulting ABs integritetspolicy. Vi följer GDPR och behandlar dina personuppgifter säkert och transparent.',
    alternates: {
      canonical: `${BASE_URL}/sv/integritetspolicy`,
      languages: {
        sv: `${BASE_URL}/sv/integritetspolicy`,
        en: `${BASE_URL}/en/privacy-policy`,
      },
    },
    openGraph: {
      title: 'Integritetspolicy — GDPR & Personuppgifter | Eteya',
      description:
        'Eteya Consulting ABs integritetspolicy. Vi följer GDPR och behandlar dina personuppgifter säkert och transparent.',
      url: `${BASE_URL}/sv/integritetspolicy`,
      siteName: 'Eteya',
      type: 'website',
      locale: 'sv_SE',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Integritetspolicy — GDPR & Personuppgifter | Eteya',
      description:
        'Eteya Consulting ABs integritetspolicy. Vi följer GDPR och behandlar dina personuppgifter säkert och transparent.',
    },
  }
}

export default function IntegritetspolicyPage() {
  return (
    <main>
      <Nav />
      <PrivacyPolicyContent />
    </main>
  )
}
