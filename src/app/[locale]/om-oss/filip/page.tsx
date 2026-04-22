import { Metadata } from 'next';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { VaultBeams } from '@/components/vault/VaultBeams';

// ssr: false — prevents hydration mismatch (date timezone + Math.cos/sin drift)
const VaultDesktop = dynamic(
  () => import('@/components/vault/VaultDesktop').then(m => ({ default: m.VaultDesktop })),
  { ssr: false }
);
const VaultMobile = dynamic(
  () => import('@/components/vault/VaultMobile').then(m => ({ default: m.VaultMobile })),
  { ssr: false }
);

// ─── SEO ────────────────────────────────────────────────────────────────────

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
    alternates: {
      canonical: url,
      languages: {
        sv: 'https://eteya.ai/sv/om-oss/filip',
        en: 'https://eteya.ai/en/about/filip',
        'x-default': 'https://eteya.ai/sv/om-oss/filip',
      },
    },
    openGraph: {
      title: 'Filip Thai — Eteya Consulting',
      description: isSv ? 'Grundare & VD · AI Consulting' : 'CEO & Founder · AI Consulting',
      url,
      images: [{ url: '/images/team/filip.png', width: 1200, height: 630, alt: 'Filip Thai' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isSv ? 'Filip Thai — Grundare & VD | Eteya Consulting' : 'Filip Thai — CEO & Founder | Eteya Consulting',
      description: isSv ? 'Filip Thai är grundare och VD för Eteya Consulting AB.' : 'Filip Thai is founder and CEO of Eteya Consulting AB.',
      images: ['/images/team/filip.png'],
    },
  };
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Filip Thai',
  jobTitle: 'Grundare & VD',
  worksFor: { '@type': 'Organization', name: 'Eteya Consulting AB', url: 'https://eteya.ai' },
  telephone: '+46739823962',
  email: 'kontakt@eteya.ai',
  url: 'https://eteya.ai/om-oss/filip',
  sameAs: ['https://www.linkedin.com/in/filip-thai-10449a3b6/'],
  image: 'https://eteya.ai/images/team/filip.png',
  address: { '@type': 'PostalAddress', addressLocality: 'Stockholm', addressCountry: 'SE' },
};

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: 'Filip Thai — Eteya Consulting',
  description: 'Filip Thai är grundare och VD för Eteya Consulting AB. AI-konsult med expertis inom automation och affärsstrategi.',
  url: 'https://eteya.ai/om-oss/filip',
  mainEntity: personSchema,
};

const filipBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://eteya.ai/sv' },
    { '@type': 'ListItem', position: 2, name: 'Om Oss', item: 'https://eteya.ai/sv/om-oss' },
    { '@type': 'ListItem', position: 3, name: 'Filip Thai', item: 'https://eteya.ai/sv/om-oss/filip' },
  ],
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function FilipPage() {
  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="profile-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(filipBreadcrumbSchema) }}
      />

      {/* Responsiv CSS — ingen Tailwind-dependency */}
      <style>{`
        .vault-desktop-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(ellipse at 50% 38%, #181816 0%, #0a0a09 50%, #010101 100%);
          position: relative;
        }
        .vault-stage {
          position: relative;
          width: 1440px;
          height: 900px;
          transform-origin: center;
          transform: scale(var(--vault-scale, 1));
          overflow: hidden;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 1px 0 0 rgba(255,255,255,0.08),
            inset 0 -1px 0 rgba(0,0,0,0.55),
            inset -1px 0 0 rgba(0,0,0,0.28),
            0 0 80px rgba(200,255,0,0.03),
            0 8px 32px rgba(0,0,0,0.55),
            0 40px 100px rgba(0,0,0,0.75);
          z-index: 2;
        }
        .vault-stage::after {
          content: '';
          position: absolute;
          top: 0; left: -80%;
          width: 55%; height: 100%;
          background: linear-gradient(
            97deg,
            transparent 0%,
            rgba(255,255,255,0.012) 35%,
            rgba(255,255,255,0.032) 50%,
            rgba(255,255,255,0.012) 65%,
            transparent 100%
          );
          animation: stageSheen 12s cubic-bezier(0.45,0,0.55,1) infinite;
          pointer-events: none;
          z-index: 9999;
        }
        @keyframes stageSheen {
          0%,  25%  { left: -80%; opacity: 0; }
          30%        { opacity: 1; }
          70%        { opacity: 1; }
          75%, 100%  { left: 130%; opacity: 0; }
        }
        .vault-mobile-wrapper {
          display: none;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          position: relative;
        }

        /* Stage scale breakpoints */
        :root { --vault-scale: 1; }
        @media (max-width: 1500px) { :root { --vault-scale: 0.85; } }
        @media (max-width: 1300px) { :root { --vault-scale: 0.70; } }
        @media (max-width: 1050px) { :root { --vault-scale: 0.55; } }

        /* Switch desktop↔mobile at 768px */
        @media (max-width: 768px) {
          .vault-desktop-wrapper { display: none; }
          .vault-mobile-wrapper  { display: block; }
        }
      `}</style>

      {/* DESKTOP */}
      <div className="vault-desktop-wrapper">
        <VaultBeams intensity="strong" />
        <div className="vault-stage">
          <VaultDesktop />
        </div>
      </div>

      {/* MOBILE */}
      <div className="vault-mobile-wrapper">
        <VaultBeams intensity="strong" />
        <VaultMobile />
      </div>
    </>
  );
}
