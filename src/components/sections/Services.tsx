import { getTranslations } from 'next-intl/server'
import ServicesClient from './ServicesClient'

export default async function Services() {
  const t = await getTranslations('services')
  const items = t.raw('items') as Array<{ number: string; title: string; description: string }>
  return (
    <ServicesClient
      label={t('section_label')}
      heading={t('heading')}
      items={items}
    />
  )
}
