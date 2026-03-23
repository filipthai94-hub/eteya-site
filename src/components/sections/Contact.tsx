'use client'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { m, AnimatePresence } from 'motion/react'
import { sendContactEmail } from '@/app/[locale]/actions/contact'
import FadeIn from '@/components/animations/FadeIn'
import SectionTitle from '@/components/ui/SectionTitle'

function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-base font-medium py-4 hover:bg-accent/90 transition-colors disabled:opacity-50 min-h-[44px] uppercase tracking-widest text-sm"
    >
      {pending ? loadingLabel : label}
    </button>
  )
}

export default function Contact() {
  const t = useTranslations('contact')
  const [state, action] = useActionState(sendContactEmail, null)

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionTitle label={t('section_label')} heading={t('heading')} />
          <p className="text-secondary mb-10 -mt-6">{t('subheading')}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <form action={action} className="max-w-2xl space-y-6">
            {/* Honeypot - hidden from real users */}
            <input
              type="text"
              name="website"
              aria-label="Leave empty"
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-secondary text-sm mb-2">{t('fields.name.label')}</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t('fields.name.placeholder')}
                  className="w-full bg-surface border border-border text-primary px-4 py-3 focus:border-accent focus:outline-none transition-colors min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-secondary text-sm mb-2">{t('fields.email.label')}</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t('fields.email.placeholder')}
                  className="w-full bg-surface border border-border text-primary px-4 py-3 focus:border-accent focus:outline-none transition-colors min-h-[44px]"
                />
              </div>
            </div>
            <div>
              <label className="block text-secondary text-sm mb-2">{t('fields.message.label')}</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={t('fields.message.placeholder')}
                className="w-full bg-surface border border-border text-primary px-4 py-3 focus:border-accent focus:outline-none transition-colors resize-none"
              />
            </div>
            <SubmitButton label={t('submit')} loadingLabel={t('submit_loading')} />
            <AnimatePresence>
              {state?.success && (
                <m.p
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-accent text-sm"
                >
                  {t('success')}
                </m.p>
              )}
              {state?.error && (
                <m.p
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm"
                >
                  {state.error}
                </m.p>
              )}
            </AnimatePresence>
          </form>
        </FadeIn>
      </div>
    </section>
  )
}
