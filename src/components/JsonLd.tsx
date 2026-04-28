/**
 * JsonLd Component — Wrapper för strukturerad data (JSON-LD)
 *
 * Användning:
 * <JsonLd data={organizationSchema} />            // single schema
 * <JsonLd data={{ '@context': '...', '@graph': [...] }} />   // graph
 *
 * Pattern: @graph + @id-länkning används för att Google + LLMs
 * (ChatGPT, Perplexity, Google AI Overviews) ska se hela sajten som
 * en sammankopplad entitetsgraf istället för isolerade scheman.
 */

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ─── BASE-URL & STABLE @id-KONVENTION ─────────────────────────────
const BASE_URL = 'https://eteya.ai'

export const ORG_ID = `${BASE_URL}/#organization`
export const WEBSITE_ID = `${BASE_URL}/#website`

/** Bygg page-specifik @id (t.ex. https://eteya.ai/sv/kundcase/telestore#article) */
export function pageId(path: string, suffix: string = 'webpage'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${cleanPath}#${suffix}`
}

/** Bygg full canonical URL */
export function canonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${cleanPath}`
}

// ─── ORGANIZATION SCHEMA ──────────────────────────────────────────
/**
 * Organization Schema — Ska finnas på ALLA sidor (via root layout).
 * Andra schemas refererar till den via { '@id': ORG_ID }.
 */
export const organizationSchema = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Eteya',
  legalName: 'Eteya Consulting AB',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${BASE_URL}/#logo`,
    url: `${BASE_URL}/favicon-512x512.png`,
    width: 512,
    height: 512,
  },
  // Description matches visible Hero text (research: schema must echo visible HTML)
  description: 'Eteya bygger AI-agenter och processautomation för svenska små och medelstora företag. Leverans på veckor, mätbar besparing. Grundat 2024 i Karlskoga.',
  foundingDate: '2024-11',
  founder: {
    '@type': 'Person',
    name: 'Filip Thai',
    jobTitle: 'CEO & Founder',
  },
  // Areas of expertise — strong E-E-A-T signal for AI search engines
  knowsAbout: [
    'AI-automation',
    'AI-agenter',
    'Processautomation',
    'AI-implementation för SMB',
    'Custom AI-lösningar',
    'E-handel automation',
    'Kundtjänst-automation',
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Sweden',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Solhagsvägen 26A',
    addressLocality: 'Karlskoga',
    postalCode: '691 52',
    addressCountry: 'SE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'kontakt@eteya.ai',
    areaServed: 'SE',
    availableLanguage: ['Swedish', 'English'],
  },
  sameAs: [
    'https://www.linkedin.com/company/eteya-consulting-ab/',
    'https://www.instagram.com/eteyaconsultingab/',
    'https://www.facebook.com/profile.php?id=61573471850082',
    'https://x.com/EteyaAI',
  ],
  vatID: 'SE559552739001',
}

// ─── WEBSITE SCHEMA ───────────────────────────────────────────────
export const webSiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'Eteya',
  url: BASE_URL,
  description: 'Eteya — svensk AI-konsultbyrå som bygger AI-agenter för små och medelstora företag.',
  publisher: { '@id': ORG_ID },
  inLanguage: ['sv-SE', 'en-US'],
}

// ─── PERSON SCHEMA (team-medlemmar) ───────────────────────────────
export interface PersonSchemaInput {
  name: string
  jobTitle: string
  bio: string
  image?: string
  linkedin?: string
  /** Path till profil-sidan, t.ex. '/sv/om-oss/filip' */
  profilePath?: string
}

export function createPersonSchema(person: PersonSchemaInput): object {
  const profileUrl = person.profilePath ? canonicalUrl(person.profilePath) : person.linkedin
  return {
    '@type': 'Person',
    ...(person.profilePath && { '@id': `${canonicalUrl(person.profilePath)}#person` }),
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.bio,
    ...(person.image && { image: person.image }),
    ...(profileUrl && { url: profileUrl }),
    sameAs: person.linkedin ? [person.linkedin] : [],
    worksFor: { '@id': ORG_ID },
    knowsAbout: ['AI', 'Automation', 'Machine Learning', 'Business Strategy'],
  }
}

// ─── BREADCRUMB SCHEMA ────────────────────────────────────────────
export interface BreadcrumbItem {
  /** Display name (visas i SERP) */
  name: string
  /** Path utan domain, t.ex. '/sv/kundcase/telestore'. Sista item kan ha samma path som sidan. */
  path: string
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  }
}

// ─── ARTICLE SCHEMA (case-studies + blog) ─────────────────────────
export interface ArticleSchemaInput {
  /** Path utan domain, t.ex. '/sv/kundcase/telestore' */
  path: string
  /** Page title utan brand-suffix (max 110 chars per Google) */
  headline: string
  description: string
  /** Image-URLs (rekommenderat: array med flera aspect ratios) */
  image: string[]
  /** ISO-8601 med tidszon, t.ex. '2025-09-15T08:00:00+02:00'.
   *  Per Schema.org/Google: "Use ISO 8601 format with timezone". */
  datePublished: string
  /** ISO-8601 med tidszon — senaste modifiering */
  dateModified: string
  /** Locale t.ex. 'sv-SE' */
  inLanguage: string
  /** Branscher/keywords som artikeln handlar om */
  about?: string[]
  /** Author-schema (Person eller Organization). Default: Eteya som Org.
   *  Per Google: "author MUST be Person/Organization with name + url".
   *  För blog-artiklar SKA detta vara Person-schema (createPersonSchema).
   *  För case-studies (utfört arbete av Eteya) defaultar det till Org. */
  author?: object
}

export function createArticleSchema(article: ArticleSchemaInput): object {
  const url = canonicalUrl(article.path)
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: article.author ?? { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },  // Eteya as publisher (alltid)
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    inLanguage: article.inLanguage,
    ...(article.about && { about: article.about }),
  }
}

// ─── WEBPAGE SCHEMA ───────────────────────────────────────────────
export interface WebPageSchemaInput {
  path: string
  name: string
  description: string
  inLanguage: string
  /** Optional: vilken huvud-entitet sidan refererar till */
  primaryEntity?: { '@id': string }
  /** Voice-search speakable selectors (Google Assistant) */
  speakableSelectors?: string[]
}

export function createWebPageSchema(input: WebPageSchemaInput): object {
  const url = canonicalUrl(input.path)
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: input.inLanguage,
    ...(input.primaryEntity && { primaryImageOfPage: input.primaryEntity }),
    ...(input.speakableSelectors && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: input.speakableSelectors,
      },
    }),
  }
}

// ─── ABOUTPAGE SCHEMA ─────────────────────────────────────────────
export interface AboutPageSchemaInput {
  path: string
  name: string
  description: string
  inLanguage: string
  /** Person-@ids som omnämns på sidan */
  mentions?: Array<{ '@id': string }>
}

export function createAboutPageSchema(input: AboutPageSchemaInput): object {
  const url = canonicalUrl(input.path)
  return {
    '@type': 'AboutPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: input.inLanguage,
    ...(input.mentions && { mentions: input.mentions }),
  }
}

// ─── CONTACTPAGE SCHEMA ───────────────────────────────────────────
export interface ContactPageSchemaInput {
  path: string
  name: string
  description: string
  inLanguage: string
}

export function createContactPageSchema(input: ContactPageSchemaInput): object {
  const url = canonicalUrl(input.path)
  return {
    '@type': 'ContactPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: input.inLanguage,
  }
}

// ─── PROFILEPAGE SCHEMA (person-sidor) ────────────────────────────
export interface ProfilePageSchemaInput {
  path: string
  name: string
  description: string
  inLanguage: string
  /** Person-@id som sidan handlar om */
  mainEntityId: string
}

export function createProfilePageSchema(input: ProfilePageSchemaInput): object {
  const url = canonicalUrl(input.path)
  return {
    '@type': 'ProfilePage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': input.mainEntityId },
    inLanguage: input.inLanguage,
  }
}

// ─── COLLECTIONPAGE SCHEMA (kundcase-hub) ─────────────────────────
export interface CollectionItem {
  /** Path till item, t.ex. '/sv/kundcase/telestore' */
  path: string
  name: string
}

export interface CollectionPageSchemaInput {
  path: string
  name: string
  description: string
  inLanguage: string
  items: CollectionItem[]
}

export function createCollectionPageSchema(input: CollectionPageSchemaInput): object {
  const url = canonicalUrl(input.path)
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: input.inLanguage,
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${url}#itemlist`,
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        url: canonicalUrl(item.path),
        item: { '@id': `${canonicalUrl(item.path)}#article` },
      })),
    },
  }
}

// ─── SERVICE SCHEMA (för hem-sidan) ───────────────────────────────
export interface ServiceSchemaInput {
  /** Slug t.ex. 'ai-agents' — används i @id */
  slug: string
  name: string
  description: string
  serviceType: string
  /** Locale-prefix för @id, t.ex. '/sv' */
  localePath: string
}

export function createServiceSchema(input: ServiceSchemaInput): object {
  return {
    '@type': 'Service',
    '@id': `${BASE_URL}${input.localePath}#service-${input.slug}`,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: {
      '@type': 'Country',
      name: 'Sweden',
    },
  }
}

// ─── FAQPAGE SCHEMA ───────────────────────────────────────────────
export interface FaqItem {
  question: string
  answer: string
}

export function createFaqSchema(faqs: FaqItem[], path?: string): object {
  return {
    '@type': 'FAQPage',
    ...(path && { '@id': `${canonicalUrl(path)}#faq` }),
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ─── BUILDER: Bygg komplett @graph för en sida ────────────────────
/**
 * Kombinerar flera scheman till en sammanhängande @graph med @context överst.
 *
 * Användning:
 *   const graph = buildGraph([organizationSchema, webSiteSchema, ...])
 *   <JsonLd data={graph} />
 */
export function buildGraph(schemas: object[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  }
}
