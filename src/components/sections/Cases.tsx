import { getTranslations } from 'next-intl/server'
import CasesClient from './CasesClient'

interface CaseData {
  name: string
  tag: string
  metric: string
  slug: string
  problem: string
  solution: string
  results: string[]
  quote: string
  quoteAuthor: string
}

export default async function Cases({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('cases')
  const items = t.raw('items') as CaseData[]
  return (
    <CasesClient
      locale={locale}
      heading={t('heading')}
      cta={t('cta')}
      problemLabel={t('problemLabel')}
      solutionLabel={t('solutionLabel')}
      resultsLabel={t('resultsLabel')}
      items={items}
    />
  )
}