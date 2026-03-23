import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function Footer() {
  const t = await getTranslations('footer')
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: C.bg }}>
      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '0 2rem',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.4em', color: C.primary, marginBottom: '0.75rem' }}>
            ETEYA
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8125rem' }}>{t('tagline')}</p>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', lineHeight: 1.8, textAlign: 'right' }}>
          <p>{t('company')}</p>
          <p>{t('org_nr')}</p>
          <p>{t('address')}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.6875rem' }}>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
