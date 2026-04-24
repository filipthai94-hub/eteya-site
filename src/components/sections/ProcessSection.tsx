import { getTranslations } from 'next-intl/server'
import ProcessSectionClient from './ProcessSectionClient'

interface Block {
  num: string
  label: string
  scramble: string
  bgImage: string
  heading: string
  body: string
  list: { label: string; num: string }[]
  btnText: string
}

const BG_IMAGES = [
  '/images/process/eteya-brain.webp',
  '/images/process/eteya-arm.webp',
  '/images/process/eteya-figure.webp',
]

export default async function ProcessSection() {
  const t = await getTranslations('process')
  const rawBlocks = t.raw('blocks') as Array<{
    num: string
    label: string
    scramble: string
    heading: string
    body: string
    list: { label: string; num: string }[]
    btnText: string
  }>

  const blocks: Block[] = rawBlocks.map((b, i) => ({
    ...b,
    bgImage: BG_IMAGES[i] || BG_IMAGES[0],
  }))

  return <ProcessSectionClient heading={t('heading')} blocks={blocks} />
}