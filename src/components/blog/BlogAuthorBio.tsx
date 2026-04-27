/**
 * BlogAuthorBio — author-card i botten av artikel.
 *
 * Visar profile-bild, namn, roll, kort bio + länk till profil-sidan.
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
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
    sv: 'Filip Thai är grundare och VD på Eteya. AI-konsult med fokus på automation, AI-agenter och affärsstrategi för svenska små och medelstora företag.',
    en: 'Filip Thai is founder and CEO at Eteya. AI consultant focused on automation, AI agents and business strategy for small and medium-sized businesses.',
  },
  agit: {
    sv: 'Agit Akalp är partner på Eteya. AI-konsult med expertis inom process-automation, integrations och affärsutveckling för svenska företag.',
    en: 'Agit Akalp is partner at Eteya. AI consultant with expertise in process automation, integrations and business development.',
  },
}

export default async function BlogAuthorBio({
  author,
  locale,
}: BlogAuthorBioProps) {
  const t = await getTranslations({ locale, namespace: 'blog.article' })

  return (
    <section className="my-16 pt-12 border-t border-et-border">
      <h2 className="text-sm uppercase tracking-wider font-medium text-white/60 mb-6">
        {t('authorBioHeading')}
      </h2>
      <Link
        href={{
          pathname: '/blogg/forfattare/[author]',
          params: { author },
        }}
        locale={locale}
        className="flex flex-col md:flex-row gap-6 items-start group"
      >
        <Image
          src={getAuthorImage(author)}
          alt={getAuthorName(author)}
          width={96}
          height={96}
          className="rounded-2xl object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="text-2xl font-medium text-white mb-1 group-hover:text-eteya-yellow transition-colors">
            {getAuthorName(author)}
          </h3>
          <p className="text-sm text-white/60 mb-3">
            {getAuthorRole(author, locale)}
          </p>
          <p className="text-white/80 leading-relaxed">{AUTHOR_BIOS[author][locale]}</p>
        </div>
      </Link>
    </section>
  )
}
