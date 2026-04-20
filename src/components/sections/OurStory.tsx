import { getTranslations } from 'next-intl/server'
import OurStoryClient from './OurStoryClient'

export default async function OurStory() {
  const t = await getTranslations('ourStory')

  return (
    <OurStoryClient
      quote={t('quote')}
      points={[
        { title: t.raw('points.0.title'), text: t.raw('points.0.text') },
        { title: t.raw('points.1.title'), text: t.raw('points.1.text') },
        { title: t.raw('points.2.title'), text: t.raw('points.2.text') },
      ]}
    />
  )
}