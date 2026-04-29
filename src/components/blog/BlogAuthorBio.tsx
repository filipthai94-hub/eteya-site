/**
 * BlogAuthorBio — premium author-card med signatur-citat.
 *
 * Design-DNA matchar ROI-calculator-modalen + CTA-card (linear-gradient
 * bg, white-low border, multi-layer shadow, 16px radius). Större foto
 * (110px) med subtle lime-ring som intensifieras vid hover.
 *
 * Innehåll:
 *   - Side-label "FÖRFATTARE"
 *   - Foto med lime-ring + name + role
 *   - Bio (2-3 meningar)
 *   - SIGNATUR-CITAT (1 mening, earned wisdom — bara den författaren kan säga)
 *   - LinkedIn-länk (medvetet ENDAST en CTA-väg, ingen "boka samtal" här
 *     eftersom det skulle dubblera inline-CTA + footer-CTA)
 *
 * Citatet är obligatoriskt per BLOG_AUTHORING.md "Author bio-mall".
 * Lägg till nya författare = lägg till deras citat i AUTHOR_QUOTES.
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

/**
 * Signatur-citat per författare. EN mening, "earned wisdom" — bara den
 * personen kan säga den. Se BLOG_AUTHORING.md "Author bio-mall" för
 * regler om vad som gör ett citat icke-klichigt.
 */
const AUTHOR_QUOTES: Record<
  BlogAuthor,
  Record<BlogLocale, string>
> = {
  filip: {
    sv: 'Mer AI-projekt dör i kick-off-mötet än i koden.',
    en: 'More AI projects die in the kick-off meeting than in the code.',
  },
  agit: {
    sv: 'Den dyraste integrationen är den ingen vågar röra om sex månader.',
    en: 'The most expensive integration is the one no one dares to touch in six months.',
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
        <div className="blog-author-card">
          <div className="blog-author-row">
            <Link
              href={profilePath}
              locale={locale}
              className="blog-author-photo-wrap"
              aria-label={getAuthorName(author)}
            >
              <Image
                src={getAuthorImage(author)}
                alt={getAuthorName(author)}
                width={110}
                height={110}
                className="blog-author-photo"
              />
            </Link>

            <div className="blog-author-text">
              <div className="blog-author-header">
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
              </div>
              <p className="blog-author-bio-text">
                {AUTHOR_BIOS[author][locale]}
              </p>
            </div>
          </div>

          <blockquote className="blog-author-quote">
            <span className="blog-author-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            {AUTHOR_QUOTES[author][locale]}
            <span className="blog-author-quote-mark" aria-hidden="true">
              &rdquo;
            </span>
          </blockquote>

          <a
            href={AUTHOR_LINKEDIN[author]}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-author-linkedin"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            LINKEDIN
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="blog-author-arrow">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
