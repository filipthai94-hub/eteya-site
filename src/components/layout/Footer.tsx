import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function Footer() {
  const t = await getTranslations('footer')
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, paddingTop: '3rem', paddingBottom: '3rem', backgroundColor: C.bg }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.2em', color: C.primary, marginBottom: '0.5rem' }}>ETEYA</div>
          <p style={{ color: C.secondary, fontSize: '0.875rem' }}>{t('tagline')}</p>
        </div>
        <div style={{ color: C.secondary, fontSize: '0.875rem', textAlign: 'right' }}>
          <p>{t('company')}</p>
          <p>{t('org_nr')}</p>
          <p>{t('address')}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem' }}>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
