import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sannegarden' })

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(180deg, #080808 0%, #181818 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {t('hero.tag')} · eteya.ai
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div
            style={{
              fontSize: '104px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}
          >
            {t('hero.title')}
          </div>
          <div
            style={{
              fontSize: '44px',
              color: '#C8FF00',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              maxWidth: '900px',
            }}
          >
            {t('hero.subtitle')}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: '22px',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          <div style={{ display: 'flex' }}>Eteya · AI-automation</div>
          <div style={{ display: 'flex', color: '#C8FF00' }}>eteya.ai</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
