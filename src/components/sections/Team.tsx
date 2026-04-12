import { getTranslations } from 'next-intl/server'
import TeamClient from './TeamClient'

export default async function Team() {
  const t = await getTranslations('team')
  const members = t.raw('members') as Array<{ name: string; role: string; bio: string; image?: string }>
  
  return (
    <TeamClient
      label={t('label')}
      heading={t('heading')}
      members={members}
    />
  )
}
