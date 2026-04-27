/**
 * BlogAuthorBio — minimal author-card vid artikel-slut.
 * Använder .blog-author-bio-* CSS-klasser.
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

  return (
    <section className="blog-author-bio">
      <div className="blog-author-bio-row">
        <Link href={profilePath} locale={locale} style={{ flexShrink: 0 }}>
          <Image
            src={getAuthorImage(author)}
            alt={getAuthorName(author)}
            width={64}
            height={64}
            className="blog-author-bio-photo"
          />
        </Link>

        <div className="blog-author-bio-content">
          <div className="blog-author-bio-header">
            <Link
              href={profilePath}
              locale={locale}
              className="blog-author-bio-name"
            >
              {getAuthorName(author)}
            </Link>
            <span className="blog-author-bio-role">
              {getAuthorRole(author, locale)}
            </span>
          </div>
          <p className="blog-author-bio-text">
            {AUTHOR_BIOS[author][locale]}
          </p>
          <a
            href={AUTHOR_LINKEDIN[author]}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-author-bio-link"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
