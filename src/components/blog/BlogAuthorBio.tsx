/**
 * BlogAuthorBio — editorial author byline (Riktning A från research).
 *
 * Design-princip: editorial, INTE feature-card. Topp-tier publikationer
 * (Stripe Press, Linear, Vercel, Atlantic, Figma blog) använder ALDRIG
 * cards, ringar runt foto eller signatur-citat-boxar för byline. Den
 * MINSTA visuella behandlingen ger den MEST premium känslan.
 *
 * Research-baserade val:
 * - INGEN card/gradient/shadow/border-radius (bryter editorial-känsla)
 * - INGEN ring runt foto (klassisk SaaS-template-signal)
 * - INGET signatur-citat (decorativt, AI-template-fingeravtryck)
 * - FYRKANTIGT foto 120×120 (cirkulärt = avatar/SaaS, fyrkantigt = editorial)
 * - Clean typografi: Barlow Condensed namn, Geist body, JetBrains Mono labels
 * - Max 1 lime-accent per block (på "FÖRFATTARE"-label, knappt synlig)
 * - LinkedIn = text-link med ↗ (up-right) inte SVG-icon-knapp
 *
 * Källor: BLOG_AUTHORING.md "Author bio-mall" — research från Stripe Press,
 * Linear, Vercel, Anthropic, Figma, Atlantic, Increment.
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import {
  getAuthorName,
  getAuthorRole,
  getAuthorImage,
} from '@/lib/blog/format'
import type { BlogAuthor, BlogLocale } from '@/lib/blog/types'

interface BlogAuthorBioProps {
  author: BlogAuthor
  locale: BlogLocale
}

const AUTHOR_BIOS: Record<
  BlogAuthor,
  Record<BlogLocale, string>
> = {
  filip: {
    sv: 'AI-konsult med fokus på automation och AI-agenter för svenska SMB. Bygger lösningar som faktiskt levererar mätbar besparing.',
    en: 'AI consultant focused on automation and AI agents for SMBs. Builds solutions that actually deliver measurable savings.',
  },
  agit: {
    sv: 'AI-konsult med expertis inom process-automation, integrations och affärsutveckling för svenska företag.',
    en: 'AI consultant with expertise in process automation, integrations and business development.',
  },
}

const AUTHOR_LINKEDIN: Record<BlogAuthor, string> = {
  filip: 'https://www.linkedin.com/in/filip-thai-10449a3b6/',
  agit: 'https://www.linkedin.com/in/agit-akalp-15701b325/',
}

export default function BlogAuthorBio({
  author,
  locale,
}: BlogAuthorBioProps) {
  const profilePath = author === 'filip' ? '/om-oss/filip' : '/om-oss/agit'
  const sectionLabel = locale === 'sv' ? 'FÖRFATTARE' : 'AUTHOR'

  return (
    <section
      className="blog-section-with-label blog-author-section"
      aria-label={getAuthorName(author)}
    >
      <div className="blog-section-label-col">
        <span className="blog-side-label">{sectionLabel}</span>
      </div>

      <div className="blog-author-content">
        <Link
          href={profilePath}
          locale={locale}
          className="blog-author-photo-wrap"
          aria-label={getAuthorName(author)}
        >
          <Image
            src={getAuthorImage(author)}
            alt={getAuthorName(author)}
            width={120}
            height={120}
            className="blog-author-photo"
          />
        </Link>

        <div className="blog-author-text">
          <Link
            href={profilePath}
            locale={locale}
            className="blog-author-name"
          >
            {getAuthorName(author)}
          </Link>
          <span className="blog-author-role">
            {getAuthorRole(author, locale)}
          </span>
          <p className="blog-author-bio-text">
            {AUTHOR_BIOS[author][locale]}
          </p>
          <a
            href={AUTHOR_LINKEDIN[author]}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-author-linkedin"
          >
            LINKEDIN <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
