"use client"

import { useState, useMemo } from "react"
import { XIcon } from "lucide-react"
import Cal from "@calcom/embed-react"
import styles from "./contact-card.module.css"

const services = [
  { value: "ai-agent", label: "AI-agent / Assistent" },
  { value: "ai-automatisering", label: "AI-automatisering" },
  { value: "strategi", label: "Strategi & Rådgivning" },
  { value: "annat", label: "Annat" },
]

// ROI data type — matches what ROICalculatorClient sends
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    description: '',
  })
  const [gdprChecked, setGdprChecked] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Build Cal.com config with conditional metadata
  const calConfig = useMemo(() => {
    const base: Record<string, string> = {
      theme: "dark",
      "metadata[source]": roiData ? "roi-calculator" : "footer-cta",
    }

    // Prefill name + email from form
    if (formData.name) base.name = formData.name
    if (formData.email) base.email = formData.email

    // Form metadata
    if (formData.company) base["metadata[company]"] = formData.company
    if (formData.service) base["metadata[service]"] = formData.service
    if (formData.description) base["metadata[description]"] = formData.description

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
  }, [roiData, formData.name, formData.email, formData.company, formData.service, formData.description])

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

      <div className={styles.grid}>
        {/* Vänster: Form */}
        <div className={styles.formCol}>
          <h1 className={styles.title}>Kontakta oss</h1>
          <p className={styles.subtitle}>
            {roiData
              ? "Din ROI-prognos sparas automatiskt. Fyll i formuläret och boka en tid."
              : "Fyll i formuläret och boka en tid — vi återkommer med en analys av ert företag."}
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

          {/* Form fields — controlled inputs */}
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

            <div className={styles.field}>
              <label className={styles.label}>Beskrivning</label>
              <textarea
                placeholder="Berätta kort om ert projekt..."
                rows={2}
                className={`${styles.input} ${styles.textarea}`}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
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
              <span className={styles.roiBadgeLabel}>Din ROI-prognos</span>
              <span className={styles.roiBadgeValue}>{fmtK(roiData.annualSavings)}/år</span>
              <div className={styles.roiBadgeDetails}>
                {roiData.implCost != null && (
                  <div className={styles.roiDetailItem}>
                    <span className={styles.roiDetailLabel}>Implementering</span>
                    <span className={styles.roiDetailValue}>{fmtK(roiData.implCost)}</span>
                  </div>
                )}
                {roiData.year1 != null && roiData.year2 != null && roiData.year3 != null && (
                  <div className={styles.roiDetailItem}>
                    <span className={styles.roiDetailLabel}>3-årsprognos</span>
                    <span className={styles.roiDetailValue}>
                      År1: {fmtK(roiData.year1)} · År2: {fmtK(roiData.year2)} · År3: {fmtK(roiData.year3)}
                    </span>
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
            </div>
          )}
        </div>

        {/* Höger: Cal.com */}
        <div className={styles.calCol}>
          <div className={styles.calHeader}>
            <div className={styles.calTitle}>Välj en tid</div>
          </div>
          <div className={styles.calEmbed}>
            <Cal
              calLink="filip-thai-8l9zgr/test"
              style={{ width: "100%", height: "100%" }}
              config={calConfig}
            />
          </div>
        </div>
      </div>
    </div>
  )
}