import { getTranslations } from 'next-intl/server'
import HeroClient from './HeroClient'

export default async function Hero() {
  const t = await getTranslations('hero')
  return (
    <HeroClient
      role={t('role')}
      headline={t('headline')}
      subheadline={t('subheadline')}
      ctaPrimary={t('cta_primary')}
      ctaSecondary={t('cta_secondary')}
      scrollLabel={t('scroll_label')}
    />
  )
}
