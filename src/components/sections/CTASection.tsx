import { getTranslations } from 'next-intl/server'
import CTAClient from './CTAClient'

export default async function CTASection() {
  const t = await getTranslations('cta')
  return <CTAClient headline={t('headline')} body={t('body')} button={t('button')} />
}
