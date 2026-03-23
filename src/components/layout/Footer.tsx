import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="font-display text-xl tracking-[0.2em] text-primary mb-2">ETEYA</div>
          <p className="text-secondary text-sm">{t('tagline')}</p>
        </div>
        <div className="text-secondary text-sm text-right">
          <p>{t('company')}</p>
          <p>{t('org_nr')}</p>
          <p className="whitespace-pre-line">{t('address')}</p>
          <p className="mt-4 text-xs">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
