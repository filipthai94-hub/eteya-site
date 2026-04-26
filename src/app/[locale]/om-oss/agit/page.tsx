import { Metadata } from 'next';
import { VaultClient } from '@/components/vault/VaultClient';
import type { PersonData } from '@/components/vault/VaultDesktop';
import {
  JsonLd,
  buildGraph,
  createBreadcrumbSchema,
  createProfilePageSchema,
  ORG_ID,
} from '@/components/JsonLd';

const agitPerson: PersonData = {
  name: 'Agit Akalp',
  role: 'Partner',
  phone: '+46 72 300 00 75',
  email: 'kontakt@eteya.ai',
  website: 'eteya.ai',
  linkedinName: 'Agit Akalp',
  linkedinUrl: 'https://www.linkedin.com/in/agit-akalp-15701b325/',
  calUrl: 'https://cal.com/eteya-ai/strategimote',
  vcfHref: '/agit-akalp.vcf',
  vcfDownload: 'Agit-Akalp.vcf',
  image: '/images/team/agit.webp',
  engraving: 'AGIT AKALP',
  initials: 'A.A.',
};

// ─── SEO ────────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSv = locale === 'sv';
  const url = `https://eteya.ai/${locale}/${isSv ? 'om-oss' : 'about'}/agit`;

  return {
    title: isSv
      ? 'Agit Akalp — Partner | Eteya Consulting'
      : 'Agit Akalp — Partner | Eteya Consulting',
    description: isSv
      ? 'Agit Akalp är partner på Eteya Consulting AB. AI-konsult med expertis inom AI-automation, AI-agenter och affärsutveckling. Boka strategimöte här.'
      : 'Agit Akalp is partner at Eteya Consulting AB. AI consultant with expertise in AI automation, AI agents and business development. Book a strategy call here.',
    alternates: {
      canonical: url,
      languages: {
        sv: 'https://eteya.ai/sv/om-oss/agit',
        en: 'https://eteya.ai/en/about/agit',
        'x-default': 'https://eteya.ai/sv/om-oss/agit',
      },
    },
    openGraph: {
      title: 'Agit Akalp — Eteya Consulting',
      description: isSv ? 'Partner · AI Consulting' : 'Partner · AI Consulting',
      url,
      images: [{ url: '/images/team/agit.webp', width: 1200, height: 630, alt: 'Agit Akalp' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Agit Akalp — Partner | Eteya Consulting',
      description: isSv ? 'Agit Akalp är partner på Eteya Consulting AB.' : 'Agit Akalp is partner at Eteya Consulting AB.',
      images: ['/images/team/agit.webp'],
    },
  };
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

function getSchemas(locale: string) {
  const isSv = locale === 'sv';
  const pagePath = isSv ? '/sv/om-oss/agit' : '/en/about/agit';
  const personId = `https://eteya.ai${pagePath}#person`;
  const homePath = isSv ? '/sv' : '/en';
  const aboutPath = isSv ? '/sv/om-oss' : '/en/about';

  const personSchema = {
    '@type': 'Person',
    '@id': personId,
    name: 'Agit Akalp',
    jobTitle: 'Partner',
    worksFor: { '@id': ORG_ID },
    telephone: '+46723000075',
    email: 'kontakt@eteya.ai',
    url: `https://eteya.ai${pagePath}`,
    sameAs: ['https://www.linkedin.com/in/agit-akalp-15701b325/'],
    image: 'https://eteya.ai/images/team/agit.webp',
    address: { '@type': 'PostalAddress', addressLocality: 'Karlskoga', addressCountry: 'SE' },
    knowsAbout: ['AI-automation', 'AI-agenter', 'Affärsutveckling', 'Process-automation'],
  };

  const profilePageSchema = createProfilePageSchema({
    path: pagePath,
    name: 'Agit Akalp — Eteya Consulting',
    description: isSv
      ? 'Agit Akalp är partner på Eteya Consulting AB. AI-konsult med expertis inom automation och affärsutveckling.'
      : 'Agit Akalp is partner at Eteya Consulting AB. AI consultant with expertise in automation and business development.',
    inLanguage: isSv ? 'sv-SE' : 'en-US',
    mainEntityId: personId,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: isSv ? 'Hem' : 'Home', path: homePath },
    { name: isSv ? 'Om Oss' : 'About', path: aboutPath },
    { name: 'Agit Akalp', path: pagePath },
  ]);

  return { personSchema, profilePageSchema, breadcrumbSchema };
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function AgitPage({ params }: Props) {
  const { locale } = await params;
  const { personSchema, profilePageSchema, breadcrumbSchema } = getSchemas(locale);

  return (
    <>
      {/* Visually-hidden H1 for SEO + screen readers. The Vault UI
          styles the name elsewhere but has no semantic heading — this
          ensures Google and assistive tech can identify the page's
          primary topic (the person named). */}
      <h1 className="sr-only">Agit Akalp — Partner | Eteya Consulting</h1>

      {/* Visually-hidden portrait for Google Image Search + screen
          readers. The Vault component renders the photo client-side
          only (ssr: false), so without this tag the image is invisible
          to SSR crawlers. This duplicate is a sr-only <img> that
          serves no visual purpose but gives Googlebot alt-text to
          index in Image Search. */}
      <img
        src="/images/team/agit.webp"
        alt={locale === 'sv'
          ? 'Porträtt av Agit Akalp, Partner på Eteya Consulting'
          : 'Portrait of Agit Akalp, Partner at Eteya Consulting'}
        width={600}
        height={600}
        className="sr-only"
      />

      {/* @graph med ProfilePage + Person + Breadcrumb. */}
      <JsonLd data={buildGraph([profilePageSchema, personSchema, breadcrumbSchema])} />

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
      <VaultClient person={agitPerson} />
    </>
  );
}
