"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Cal, { getCalApi } from "@calcom/embed-react"
import styles from "./contact-card.module.css"

export interface ROIData {
  annualSavings: number
  totalHours: number
  fte: number
  roi: number
  payback: number | null
  implCost?: number
  hourlyRate?: number
  year1?: number
  year2?: number
  year3?: number
  processes?: {
    key: string
    hoursPerWeek: number
    automationRate: number
    annualSavings: number
  }[]
}

interface ContactCardProps {
  onClose?: () => void
  roiData?: ROIData | null
  showContactInfo?: boolean
}

function fmtK(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.', ',') + ' mkr'
  if (n >= 1_000) return Math.round(n / 1_000) + ' tkr'
  return Math.round(n).toLocaleString('sv-SE') + ' kr'
}

export default function ContactCard({ onClose, roiData, showContactInfo = true }: ContactCardProps) {
  const t = useTranslations('contactCard')
  const tCalc = useTranslations('calculator')
  const services = t.raw('services') as { value: string; label: string }[]
  const [step, setStep] = useState<1 | 2>(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    service: '',
  })
  const [gdprChecked, setGdprChecked] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Form validation — step 1 is valid when name + email + GDPR are filled
  const isStep1Valid = formData.name.trim().length > 0 && formData.email.trim().length > 0 && gdprChecked

  // Esc key closes modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Navigate to step 2
  const goToStep2 = useCallback(() => {
    if (!isStep1Valid) return
    setDirection('forward')
    setStep(2)
  }, [isStep1Valid])

  // Navigate back to step 1
  const goToStep1 = useCallback(() => {
    setDirection('backward')
    setStep(1)
  }, [])

  // Init Cal.com embed with auto-height support (official Cal.com solution)
  useEffect(() => {
    (async function () {
      const cal = await getCalApi()
      cal("ui", {
        styles: { branding: { brandColor: "#C8FF00" } },
        hideEventTypeDetails: false,
        layout: "month_view",
        theme: "dark",
      })
    })()
  }, [])

  // Inject CSS to hide Cal.com scrollbar (after Cal.com loads)
  useEffect(() => {
    if (step !== 2) return
    
    // Wait for Cal.com to fully load, then inject CSS to hide scrollbar
    const timer = setTimeout(() => {
      const style = document.createElement('style')
      style.textContent = `
        .cal-inline-container::-webkit-scrollbar { display: none !important; }
        .cal-inline-container { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        
        /* Fallback - target any scrollable container inside Cal.com */
        [class*="scroll"]::-webkit-scrollbar { display: none !important; }
        [class*="scroll"] { scrollbar-width: none !important; -ms-overflow-style: none !important; }
      `
      
      // Inject into calEmbed container
      const calEmbed = document.querySelector('.calEmbed')
      if (calEmbed) {
        calEmbed.appendChild(style)
      }
    }, 500) // Wait 500ms for Cal.com to load
    
    return () => clearTimeout(timer)
  }, [step])

  // Build Cal.com config object for prefill
  const calConfig = useMemo(() => {
    const config: Record<string, any> = {}
    
    // Prefill name and email
    if (formData.name) config.name = formData.name
    if (formData.email) config.email = formData.email
    
    // Metadata
    config["metadata[source]"] = roiData ? "roi-calculator" : "footer-cta"
    if (formData.website) config["metadata[website]"] = formData.website
    if (formData.service) config["metadata[service]"] = formData.service

    // ROI-specific metadata
    if (roiData) {
      config["metadata[annualSavings]"] = String(Math.round(roiData.annualSavings))
      config["metadata[totalHours]"] = String(Math.round(roiData.totalHours))
      config["metadata[roi]"] = String(Math.round(roiData.roi))
      if (roiData.payback) config["metadata[payback]"] = String(roiData.payback)
      if (roiData.implCost) config["metadata[implCost]"] = String(Math.round(roiData.implCost))
      if (roiData.hourlyRate) config["metadata[hourlyRate]"] = String(roiData.hourlyRate)
      if (roiData.year1) config["metadata[year1]"] = String(Math.round(roiData.year1))
      if (roiData.year2) config["metadata[year2]"] = String(Math.round(roiData.year2))
      if (roiData.year3) config["metadata[year3]"] = String(Math.round(roiData.year3))
      if (roiData.processes?.length) {
        config["metadata[roiProcesses]"] = JSON.stringify(
          roiData.processes.map(p => ({
            k: p.key,
            l: tCalc(`processes.${p.key}.name`),
            h: p.hoursPerWeek,
            r: p.automationRate,
          }))
        )
      }
    }

    console.log('🔵 Cal.com config:', config)
    console.log('🔵 formData:', formData)

    return config
  }, [roiData, formData.name, formData.email, formData.website, formData.service])

  return (
    <div className={`${styles.root} main`}>
      {/* Drag handle (mobile) */}
      <div className={styles.dragHandle} />

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={styles.closeButton}
          type="button"
          aria-label={t('close')}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" />
          </svg>
        </button>
      )}

      {/* Progress indicator */}
      <div className={styles.progress}>
        <div className={styles.progressStep}>
          <div className={`${styles.progressDot} ${step >= 1 ? styles.progressDotActive : ''}`} />
          <span className={styles.progressLabel}>{t('progress.step1')}</span>
        </div>
        <div className={styles.progressLine} />
        <div className={styles.progressStep}>
          <div className={`${styles.progressDot} ${step >= 2 ? styles.progressDotActive : ''}`} />
          <span className={styles.progressLabel}>{t('progress.step2')}</span>
        </div>
      </div>

      {/* Step 1: Form */}
      <div className={`${styles.stepContent} ${step === 1 ? styles.stepVisible : styles.stepHidden} ${direction === 'forward' ? styles.slideLeft : styles.slideRight}`}>
        <div className={styles.formCol}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>
            {roiData
              ? t('subtitleRoi')
              : t('subtitleDefault')}
          </p>

          {/* Kontaktinfo */}
          {showContactInfo && (
          <div className={styles.contactRow}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className={styles.contactLabel}>{t('contactEmailLabel')}</p>
                <p className={styles.contactValue}>{t('contactEmail')}</p>
              </div>
            </div>
            {/* Telefon — tillfälligt borttagen tills företagsabonnemang finns */}
            {/* <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className={styles.contactLabel}>Telefon</p>
                <p className={styles.contactValue}>+46 50-000 00 00</p>
              </div>
            </div> */}
          </div>
          )}

          {/* Form fields */}
          <div className={styles.formFields}>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>{t('form.name.label')} *</label>
                <input
                  type="text"
                  required
                  placeholder={t('form.name.placeholder')}
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('form.email.label')} *</label>
                <input
                  type="email"
                  required
                  placeholder={t('form.email.placeholder')}
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t('form.website.label')} *</label>
              <input
                type="text"
                required
                placeholder={t('form.website.placeholder')}
                className={styles.input}
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t('form.service.label')}</label>
              <select
                name="service"
                value={formData.service}
                onChange={(e) => updateField('service', e.target.value)}
                className={`${styles.input} ${styles.select}`}
                style={{ color: '#ffffff', backgroundColor: '#0f0f0f' }}
              >
                <option value="" disabled style={{ color: '#ffffff', backgroundColor: '#0f0f0f' }}>{t('form.service.placeholder')}</option>
                {services.map((s) => (
                  <option key={s.value} value={s.value} style={{ color: '#ffffff', backgroundColor: '#0f0f0f' }}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* GDPR checkbox */}
            <div className={styles.gdpr}>
              <input
                type="checkbox"
                id="gdpr"
                checked={gdprChecked}
                onChange={(e) => setGdprChecked(e.target.checked)}
                className={styles.gdprCheckbox}
                required
              />
              <label htmlFor="gdpr" className={styles.gdprLabel}>
                {t.rich('gdpr', {
                  link: (chunks) => (
                    <a href={t('gdprLink')} className={styles.gdprLink}>
                      {t('gdprLinkText')}
                    </a>
                  )
                })}
              </label>
            </div>
          </div>

          {/* ROI badge — only when roiData exists */}
          {roiData && (
            <div className={styles.roiBadge}>
              <div className={styles.roiBadgeHeader}>
                <span className={styles.roiBadgeLabel}>{t('roiLabel')}</span>
                <span className={styles.roiBadgeValue}>{fmtK(roiData.annualSavings)}{t('roiPerYear')}</span>
              </div>

              {roiData.year1 != null && roiData.year2 != null && roiData.year3 != null && (
                <div className={styles.roiForecast}>
                  <span className={styles.roiForecastLabel}>{t('roi3YearForecast')}</span>
                  {[
                    { year: t('roiYear1'), value: roiData.year1! },
                    { year: t('roiYear2'), value: roiData.year2! },
                    { year: t('roiYear3'), value: roiData.year3! },
                  ].map((item) => {
                    const maxVal = roiData.year3!
                    const pct = Math.round((item.value / maxVal) * 100)
                    return (
                      <div key={item.year} className={styles.roiForecastRow}>
                        <span className={styles.roiForecastYear}>{item.year}</span>
                        <div className={styles.roiForecastBar}>
                          <div
                            className={styles.roiForecastBarFill}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={styles.roiForecastAmount}>{fmtK(item.value)}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {roiData.processes && roiData.processes.length > 0 && (
                <div className={styles.roiProcesses}>
                  {roiData.processes.map((p) => (
                    <span key={p.key} className={styles.roiProcessTag}>
                      {tCalc(`processes.${p.key}.name`)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA button */}
          <button
            className={`${styles.ctaButton} ${!isStep1Valid ? styles.ctaButtonDisabled : ''}`}
            onClick={goToStep2}
            disabled={!isStep1Valid}
            type="button"
          >
            {t('nextStep')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 8 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Trust copy */}
          <p className={styles.trustCopy}>
            {t('trustCopy')}
          </p>
        </div>
      </div>

      {/* Step 2: Calendar */}
      <div className={`${styles.stepContent} ${step === 2 ? styles.stepVisible : styles.stepHidden} ${direction === 'forward' ? styles.slideRight : styles.slideLeft}`}>
        <div className={styles.calCol}>
          <button className={styles.backButton} onClick={goToStep1} type="button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
              <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('back')}
          </button>
          <div className={styles.calHeader}>
            <div className={styles.calTitle}>{t('calendarTitle')}</div>
          </div>
          <div className={styles.calEmbed}>
            <Cal
              key={`${formData.name}-${formData.email}`}
              calLink={process.env.NEXT_PUBLIC_CAL_LINK || "eteya/strategimote"}
              style={{ width: "100%", height: "100%" }}
              config={calConfig}
            />
          </div>
        </div>
      </div>
    </div>
  )
}