import { getTranslations } from 'next-intl/server'
import ServicesClient from './ServicesClient'

export default async function Services() {
  const t = await getTranslations('services')
  const items = t.raw('items') as Array<{ number: string; title: string; description: string; detail: string }>
  return (
    <ServicesClient
      labelJa={t('label_ja')}
      labelEn={t('label_en')}
      heading={t('heading')}
      items={items}
    />
  )
}
