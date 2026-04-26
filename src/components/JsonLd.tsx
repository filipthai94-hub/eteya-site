/**
 * JsonLd Component — Wrapper för strukturerad data (JSON-LD)
 * 
 * Användning:
 * <JsonLd data={organizationSchema} />
 * <JsonLd data={webSiteSchema} />
 */

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Organization Schema — Ska finnas på ALLA sidor
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Eteya',
  legalName: 'Eteya Consulting AB',
  url: 'https://eteya.ai',
  logo: 'https://eteya.ai/favicon-512x512.png',
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

/**
 * WebSite Schema — Bara på hemsidan
 */
export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Eteya',
  url: 'https://eteya.ai',
  description: 'Eteya — svensk AI-konsultbyrå som bygger AI-agenter för små och medelstora företag.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://eteya.ai/sok?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  inLanguage: ['sv-SE', 'en-US'],
}

/**
 * Person Schema — För team-medlemmar (om-oss)
 */
export function createPersonSchema(person: {
  name: string
  jobTitle: string
  bio: string
  image?: string
  linkedin?: string
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.bio,
    image: person.image,
    url: person.linkedin,
    sameAs: person.linkedin ? [person.linkedin] : [],
    knowsAbout: ['AI', 'Automation', 'Machine Learning', 'Business Strategy'],
  }
}

/**
 * FAQPage Schema — För FAQ-sektioner
 */
export function createFaqSchema(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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

/**
 * BreadcrumbList Schema — För alla undersidor
 */
export function createBreadcrumbSchema(items: Array<{
  position: number
  name: string
  item: string
}>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  }
}

/**
 * Article Schema — För case studies och blogg
 */
export function createArticleSchema(article: {
  headline: string
  description: string
  image: string[]
  datePublished: string
  dateModified: string
  author: { name: string; url: string }
  url: string
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eteya',
      logo: {
        '@type': 'ImageObject',
        url: 'https://eteya.ai/favicon-512x512.png',
      },
    },
    url: article.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  }
}
