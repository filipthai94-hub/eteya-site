'use client'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { sendContactEmail } from '@/app/[locale]/actions/contact'
import { C } from '@/lib/colors'
import Button from '@/components/ui/Button'

function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant="primary" disabled={pending} style={{ width: '100%' }}>
      {pending ? loadingLabel : label}
    </Button>
  )
}

const inputStyle = {
  width: '100%',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: `1px solid rgba(255,255,255,0.15)`,
  color: '#FFFFFF',
  padding: '1rem 0',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function Contact() {
  const t = useTranslations('contact')
  const [state, action] = useActionState(sendContactEmail, null)

  return (
    <section id="contact" style={{ backgroundColor: C.bg, paddingTop: '7rem', paddingBottom: '7rem', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {t('section_label')}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(3rem, 5vw, 5rem)',
              color: C.primary, textTransform: 'uppercase', lineHeight: 0.9,
              marginBottom: '2rem',
            }}>{t('heading')}</h2>
            <p style={{ color: C.secondary, fontSize: '0.9375rem', lineHeight: 1.7 }}>{t('subheading')}</p>
          </div>

          {/* Right — form */}
          <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  {t('fields.name.label')}
                </label>
                <input type="text" name="name" required placeholder={t('fields.name.placeholder')}
                  style={{ ...inputStyle }}
                  onFocus={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.6)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  {t('fields.email.label')}
                </label>
                <input type="email" name="email" required placeholder={t('fields.email.placeholder')}
                  style={{ ...inputStyle }}
                  onFocus={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.6)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                {t('fields.message.label')}
              </label>
              <textarea name="message" required rows={4} placeholder={t('fields.message.placeholder')}
                style={{ ...inputStyle, resize: 'none', minHeight: '100px' }}
                onFocus={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.6)')}
                onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
            </div>

            <div style={{ marginTop: '2rem' }}>
              <SubmitButton label={t('submit')} loadingLabel={t('submit_loading')} />
            </div>

            {state?.success && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: '1rem' }}>{t('success')}</p>
            )}
            {(state as { error?: string } | null)?.error && (
              <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: '1rem' }}>
                {(state as { error: string }).error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
