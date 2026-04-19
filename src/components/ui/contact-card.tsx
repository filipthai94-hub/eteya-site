"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { XIcon } from "lucide-react"
import Cal from "@calcom/embed-react"
import styles from "./contact-card.module.css"

const services = [
  { value: "ai-agent", label: "AI-agent / Assistent" },
  { value: "ai-automatisering", label: "AI-automatisering" },
  { value: "strategi", label: "Strategi & Rådgivning" },
  { value: "annat", label: "Annat" },
]

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
    label: string
    hoursPerWeek: number
    automationRate: number
    annualSavings: number
  }[]
}

interface ContactCardProps {
  onClose?: () => void
  roiData?: ROIData | null
}

function fmtK(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.', ',') + ' mkr'
  if (n >= 1_000) return Math.round(n / 1_000) + ' tkr'
  return Math.round(n).toLocaleString('sv-SE') + ' kr'
}

export default function ContactCard({ onClose, roiData }: ContactCardProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
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

  // Build Cal.com config with conditional metadata
  const calConfig = useMemo(() => {
    const base: Record<string, string> = {
      theme: "dark",
      brandColor: "#C8FF00",
      "metadata[source]": roiData ? "roi-calculator" : "footer-cta",
    }

    // Prefill name + email from form
    if (formData.name) base.name = formData.name
    if (formData.email) base.email = formData.email

    // Form metadata
    if (formData.company) base["metadata[company]"] = formData.company
    if (formData.service) base["metadata[service]"] = formData.service

    // ROI-specific metadata — only when roiData exists
    if (roiData) {
      base["metadata[annualSavings]"] = String(Math.round(roiData.annualSavings))
      base["metadata[totalHours]"] = String(Math.round(roiData.totalHours))
      base["metadata[roi]"] = String(Math.round(roiData.roi))
      if (roiData.payback) base["metadata[payback]"] = String(roiData.payback)
      if (roiData.implCost) base["metadata[implCost]"] = String(Math.round(roiData.implCost))
      if (roiData.hourlyRate) base["metadata[hourlyRate]"] = String(roiData.hourlyRate)
      if (roiData.year1) base["metadata[year1]"] = String(Math.round(roiData.year1))
      if (roiData.year2) base["metadata[year2]"] = String(Math.round(roiData.year2))
      if (roiData.year3) base["metadata[year3]"] = String(Math.round(roiData.year3))
      if (roiData.processes?.length) {
        base["metadata[roiProcesses]"] = JSON.stringify(
          roiData.processes.map(p => ({
            k: p.key,
            l: p.label,
            h: p.hoursPerWeek,
            r: p.automationRate,
          }))
        )
      }
    }

    return base
  }, [roiData, formData.name, formData.email, formData.company, formData.service])

  return (
    <div className={styles.root}>
      {/* Drag handle (mobile) */}
      <div className={styles.dragHandle} />

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={styles.closeButton}
          type="button"
          aria-label="Stäng"
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
          <span className={styles.progressLabel}>Uppgifter</span>
        </div>
        <div className={styles.progressLine} />
        <div className={styles.progressStep}>
          <div className={`${styles.progressDot} ${step >= 2 ? styles.progressDotActive : ''}`} />
          <span className={styles.progressLabel}>Boka tid</span>
        </div>
      </div>

      {/* Step 1: Form */}
      <div className={`${styles.stepContent} ${step === 1 ? styles.stepVisible : styles.stepHidden} ${direction === 'forward' ? styles.slideLeft : styles.slideRight}`}>
        <div className={styles.formCol}>
          <h1 className={styles.title}>Kontakta oss</h1>
          <p className={styles.subtitle}>
            {roiData
              ? "Din ROI-prognos sparas automatiskt. Fyll i och boka en tid."
              : "Fyll i och boka en tid — vi återkommer med en analys av ert företag."}
          </p>

          {/* Kontaktinfo */}
          <div className={styles.contactRow}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className={styles.contactLabel}>Email</p>
                <p className={styles.contactValue}>kontakt@eteya.ai</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className={styles.contactLabel}>Telefon</p>
                <p className={styles.contactValue}>+46 50-000 00 00</p>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className={styles.formFields}>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Namn *</label>
                <input
                  type="text"
                  required
                  placeholder="Ditt namn"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  required
                  placeholder="din@email.com"
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Företag *</label>
              <input
                type="text"
                required
                placeholder="Företagsnamn"
                className={styles.input}
                value={formData.company}
                onChange={(e) => updateField('company', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Vad behöver ni hjälp med?</label>
              <select
                name="service"
                value={formData.service}
                onChange={(e) => updateField('service', e.target.value)}
                className={`${styles.input} ${styles.select}`}
              >
                <option value="" disabled>Välj tjänst...</option>
                {services.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
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
                Jag godkänner att Eteya behandlar mina uppgifter enligt{" "}
                <a href="/sv/integritetspolicy" className={styles.gdprLink}>
                  integritetspolicyn
                </a>
              </label>
            </div>
          </div>

          {/* ROI badge — only when roiData exists */}
          {roiData && (
            <div className={styles.roiBadge}>
              <div className={styles.roiBadgeHeader}>
                <span className={styles.roiBadgeLabel}>Din ROI-prognos</span>
                <span className={styles.roiBadgeValue}>{fmtK(roiData.annualSavings)}/år</span>
              </div>

              {roiData.year1 != null && roiData.year2 != null && roiData.year3 != null && (
                <div className={styles.roiForecast}>
                  <span className={styles.roiForecastLabel}>3-årsprognos</span>
                  {[
                    { year: 'År 1', value: roiData.year1! },
                    { year: 'År 2', value: roiData.year2! },
                    { year: 'År 3', value: roiData.year3! },
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
                      {p.label}
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
            Välj tid
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 8 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Trust copy */}
          <p className={styles.trustCopy}>
            Vi svarar inom 24 timmar · Dina uppgifter är säkra
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
            Tillbaka
          </button>
          <div className={styles.calHeader}>
            <div className={styles.calTitle}>Välj en tid</div>
          </div>
          <div className={styles.calEmbed}>
            <Cal
              calLink="filip-thai-8l9zgr/test"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={calConfig}
            />
          </div>
        </div>
      </div>
    </div>
  )
}