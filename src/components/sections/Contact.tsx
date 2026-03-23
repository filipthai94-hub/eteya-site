'use client'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { sendContactEmail } from '@/app/[locale]/actions/contact'
import { C } from '@/lib/colors'

function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ width: '100%', backgroundColor: C.accent, color: C.bg, fontWeight: 500, padding: '1rem', cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.6 : 1, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', border: 'none', minHeight: '44px' }}
    >
      {pending ? loadingLabel : label}
    </button>
  )
}

export default function Contact() {
  const t = useTranslations('contact')
  const [state, action] = useActionState(sendContactEmail, null)

  const inputStyle = {
    width: '100%',
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    color: C.primary,
    padding: '0.75rem 1rem',
    outline: 'none',
    fontSize: '1rem',
    minHeight: '44px',
    boxSizing: 'border-box' as const,
  }

  return (
    <section id="contact" style={{ backgroundColor: C.bg, paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <p style={{ color: C.accent, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>{t('section_label')}</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: C.primary, textTransform: 'uppercase', lineHeight: 1, marginBottom: '1rem' }}>{t('heading')}</h2>
        <p style={{ color: C.secondary, marginBottom: '2.5rem' }}>{t('subheading')}</p>
        <form action={action} style={{ maxWidth: '42rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="text" name="website" aria-hidden="true" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: C.secondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('fields.name.label')}</label>
              <input type="text" name="name" required placeholder={t('fields.name.placeholder')} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: C.secondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('fields.email.label')}</label>
              <input type="email" name="email" required placeholder={t('fields.email.placeholder')} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: C.secondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('fields.message.label')}</label>
            <textarea name="message" required rows={5} placeholder={t('fields.message.placeholder')} style={{ ...inputStyle, minHeight: 'auto', resize: 'none' }} />
          </div>
          <SubmitButton label={t('submit')} loadingLabel={t('submit_loading')} />
          {state?.success && <p style={{ color: C.accent, fontSize: '0.875rem' }}>{t('success')}</p>}
          {(state as { error?: string } | null)?.error && <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{(state as { error: string }).error}</p>}
        </form>
      </div>
    </section>
  )
}
