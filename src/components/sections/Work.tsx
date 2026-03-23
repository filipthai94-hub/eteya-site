import { getTranslations } from 'next-intl/server'
import WorkClient from './WorkClient'

export default async function Work() {
  const t = await getTranslations('work')
  const items = t.raw('items') as Array<{ name: string; tags: string; description: string }>
  return (
    <WorkClient
      labelJa={t('label_ja')}
      labelEn={t('label_en')}
      heading={t('heading')}
      items={items}
    />
  )
}
