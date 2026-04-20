import { getTranslations } from 'next-intl/server'
import ServicesClient from './ServicesClient'

export default async function Services() {
  const t = await getTranslations('services')
  const items = t.raw('items') as Array<{
    number: string
    title: string
    description: string
    detail: string
    features: string[]
  }>
  return <ServicesClient heading={t('heading')} cta={t('cta')} items={items} />
}