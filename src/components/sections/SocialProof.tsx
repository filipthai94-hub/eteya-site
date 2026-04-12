import { getTranslations } from 'next-intl/server'
import SocialProofClient from './SocialProofClient'

export default async function SocialProof() {
  const t = await getTranslations('about.socialProof')
  
  const customers = t.raw('customers') as Array<{ name: string; bigNumber: string; bigNumberLabel: string; quote: string; caseStudyUrl: string; logo: string }>

  return (
    <SocialProofClient
      title={t('title')}
      subtitle={t('subtitle')}
      customers={customers}
    />
  )
}