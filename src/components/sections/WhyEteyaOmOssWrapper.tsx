import { getTranslations } from 'next-intl/server'
import WhyEteyaOmOss from './WhyEteyaOmOss'

export default async function WhyEteyaOmOssWrapper() {
  const t = await getTranslations('whyEteya')
  const items = t.raw('items') as Array<{ title: string; body: string }>
  return <WhyEteyaOmOss label={t('section_label')} heading={t('heading')} items={items} />
}