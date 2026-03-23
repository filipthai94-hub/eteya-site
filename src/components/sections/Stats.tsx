import { getTranslations } from 'next-intl/server'
import StatsClient from './StatsClient'

export default async function Stats() {
  const t = await getTranslations('stats')
  const items = t.raw('items') as Array<{ value: number; suffix: string; label: string }>
  return <StatsClient heading={t('heading')} items={items} />
}
