import { getTranslations } from 'next-intl/server'
import WhyEteyaClient from './WhyEteyaClient'

export default async function WhyEteya() {
  const t = await getTranslations('why')
  const items = t.raw('items') as Array<{ title: string; body: string }>
  return <WhyEteyaClient label={t('section_label')} heading={t('heading')} items={items} />
}
