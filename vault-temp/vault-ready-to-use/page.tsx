import { Metadata } from 'next';
import Script from 'next/script';
import { VaultDesktop } from '@/components/vault/VaultDesktop';
import { VaultMobile } from '@/components/vault/VaultMobile';

// ─── SEO ───────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSv = locale === 'sv';
  const url = `https://eteya.ai/${locale}/${isSv ? 'om-oss' : 'about'}/filip`;

  return {
    title: isSv
      ? 'Filip Thai — Grundare & VD | Eteya Consulting'
      : 'Filip Thai — CEO & Founder | Eteya Consulting',
    description: isSv
      ? 'Filip Thai är grundare och VD för Eteya Consulting AB. Kontakta Filip för AI-konsulting, mötesbokningar och mer.'
      : 'Filip Thai is founder and CEO of Eteya Consulting AB. Contact Filip for AI consulting, meeting bookings and more.',
    openGraph: {
      title: isSv ? 'Filip Thai — Eteya Consulting' : 'Filip Thai — Eteya Consulting',
      description: isSv ? 'Grundare & VD · AI Consulting' : 'CEO & Founder · AI Consulting',
      url,
      images: [{ url: '/images/team/filip.png', width: 1200, height: 630, alt: 'Filip Thai' }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Filip Thai — Eteya Consulting',
      images: ['/images/team/filip.png'],
    },
    alternates: {
      canonical: url,
      languages: {
        'sv': 'https://eteya.ai/sv/om-oss/filip',
        'en': 'https://eteya.ai/en/about/filip',
      },
    },
  };
}

// ─── JSON-LD ────────────────────────────────────────────────────────────────

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Filip Thai',
  jobTitle: 'Grundare & VD',
  worksFor: {
    '@type': 'Organization',
    name: 'Eteya Consulting AB',
    url: 'https://eteya.ai',
  },
  telephone: '+46739823962',
  email: 'kontakt@eteya.ai',
  url: 'https://eteya.ai/om-oss/filip',
  sameAs: ['https://www.linkedin.com/in/filip-thai-10449a3b6/'],
  image: 'https://eteya.ai/images/team/filip.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Stockholm',
    addressCountry: 'SE',
  },
};

// ─── PAGE ───────────────────────────────────────────────────────────────────

export default function FilipPage() {
  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/*
        NAVIGATION: lägg din <Nav /> här ovanför om du vill ha den
        <Nav />
      */}

      {/* Desktop: full viewport, stage centrerad */}
      <div className="hidden md:flex items-center justify-center w-screen h-screen overflow-hidden relative"
        style={{ background: 'radial-gradient(ellipse at 50% 38%, #181816 0%, #0a0a09 50%, #010101 100%)' }}>

        {/* Full-viewport beams bakom scenen — importeras inuti VaultDesktop */}

        {/* 1440×900 machined glass stage */}
        <div
          className="relative overflow-hidden"
          style={{
            width: 1440, height: 900,
            transformOrigin: 'center',
            transform: 'scale(var(--vault-scale, 1))',
            boxShadow: [
              'inset 0 1px 0 rgba(255,255,255,0.18)',
              'inset 1px 0 0 rgba(255,255,255,0.08)',
              'inset 0 -1px 0 rgba(0,0,0,0.55)',
              'inset -1px 0 0 rgba(0,0,0,0.28)',
              '0 0 80px rgba(200,255,0,0.03)',
              '0 8px 32px rgba(0,0,0,0.55)',
              '0 40px 100px rgba(0,0,0,0.75)',
            ].join(', '),
          }}
        >
          <VaultDesktop />
        </div>
      </div>

      {/* Mobile: full dynamic viewport height */}
      <div className="md:hidden w-screen" style={{ height: '100dvh' }}>
        <VaultMobile />
      </div>

      {/*
        FOOTER: lägg din <FooterCTAClient /> här undertill om du vill ha den
        <FooterCTAClient />
      */}
    </>
  );
}
