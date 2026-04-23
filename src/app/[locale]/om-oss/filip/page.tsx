import { Metadata } from 'next';
import { VaultClient } from '@/components/vault/VaultClient';
import type { PersonData } from '@/components/vault/VaultDesktop';

const filipPerson: PersonData = {
  name: 'Filip Thai',
  role: 'Grundare & VD',
  phone: '+46 73 982 39 62',
  email: 'kontakt@eteya.ai',
  website: 'eteya.ai',
  linkedinName: 'Filip Thai',
  linkedinUrl: 'https://www.linkedin.com/in/filip-thai-10449a3b6/',
  calUrl: 'https://cal.com/eteya-ai/strategimote',
  vcfHref: '/filip-thai.vcf',
  vcfDownload: 'Filip-Thai.vcf',
  image: '/images/team/filip.png',
  engraving: 'FILIP THAI',
  initials: 'F.T.',
};

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
      ? 'Filip Thai är grundare och VD för Eteya Consulting AB. AI-konsult med expertis inom AI-automation, AI-agenter och affärsstrategi. Boka strategimöte här.'
      : 'Filip Thai is founder and CEO of Eteya Consulting AB. AI consultant with expertise in AI automation, AI agents and business strategy. Book a strategy call here.',
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

function getSchemas(locale: string) {
  const isSv = locale === 'sv';
  const pagePath = isSv ? '/sv/om-oss/filip' : '/en/about/filip';
  const url = `https://eteya.ai${pagePath}`;
  const rootPath = isSv ? '/sv' : '/en';
  const aboutPath = isSv ? '/sv/om-oss' : '/en/about';

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Filip Thai',
    jobTitle: isSv ? 'Grundare & VD' : 'CEO & Founder',
    worksFor: { '@type': 'Organization', name: 'Eteya Consulting AB', url: 'https://eteya.ai' },
    telephone: '+46739823962',
    email: 'kontakt@eteya.ai',
    url,
    sameAs: ['https://www.linkedin.com/in/filip-thai-10449a3b6/'],
    image: 'https://eteya.ai/images/team/filip.png',
    address: { '@type': 'PostalAddress', addressLocality: 'Karlskoga', addressCountry: 'SE' },
  };

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Filip Thai — Eteya Consulting',
    description: isSv
      ? 'Filip Thai är grundare och VD för Eteya Consulting AB. AI-konsult med expertis inom automation och affärsstrategi.'
      : 'Filip Thai is founder and CEO of Eteya Consulting AB. AI consultant with expertise in automation and business strategy.',
    url,
    mainEntity: personSchema,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isSv ? 'Hem' : 'Home', item: `https://eteya.ai${rootPath}` },
      { '@type': 'ListItem', position: 2, name: isSv ? 'Om Oss' : 'About', item: `https://eteya.ai${aboutPath}` },
      { '@type': 'ListItem', position: 3, name: 'Filip Thai', item: url },
    ],
  };

  return { personSchema, profilePageSchema, breadcrumbSchema };
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function FilipPage({ params }: Props) {
  const { locale } = await params;
  const isSv = locale === 'sv';
  const { personSchema, profilePageSchema, breadcrumbSchema } = getSchemas(locale);

  return (
    <>
      {/* Visually-hidden H1 for SEO + screen readers. The Vault UI
          styles the name elsewhere but has no semantic heading — this
          ensures Google and assistive tech can identify the page's
          primary topic (the person named). */}
      <h1 className="sr-only">
        {isSv
          ? 'Filip Thai — Grundare & VD | Eteya Consulting'
          : 'Filip Thai — CEO & Founder | Eteya Consulting'}
      </h1>

      {/* Plain <script> tags so JSON-LD is in the initial SSR HTML
          and readable by Googlebot + AI crawlers. Next.js <Script>
          defers and injects client-side, making the schemas invisible
          to crawlers reading the initial HTML. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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

      {/* DESKTOP & MOBILE */}
      <VaultClient person={filipPerson} />
    </>
  );
}
