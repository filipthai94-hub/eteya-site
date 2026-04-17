"use client"

import { useState, useEffect, useRef } from "react"
import { XIcon } from "lucide-react"
import Cal from "@calcom/embed-react"
import styles from "./contact-card.module.css"

const services = [
  { value: "ai-agent", label: "AI-agent / Assistent" },
  { value: "ai-automatisering", label: "AI-automatisering" },
  { value: "strategi", label: "Strategi & Rådgivning" },
  { value: "annat", label: "Annat" },
]

interface ContactCardProps {
  onClose?: () => void
}

export default function ContactCard({ onClose }: ContactCardProps) {
  const [serviceValue, setServiceValue] = useState("")
  const [gdprChecked, setGdprChecked] = useState(false)
  const selectRef = useRef<HTMLSelectElement>(null)

  return (
    <div className={styles.root}>
      {/* Drag handle (mobile) */}
      <div className={styles.dragHandle} />

      {/* Close button — circle with X */}
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
            Fyll i formuläret och boka en tid — vi återkommer med en analys av ert företag.
          </p>

          {/* Kontaktinfo — en rad */}
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
                  name="name"
                  required
                  placeholder="Ditt namn"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="din@email.com"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Företag *</label>
              <input
                type="text"
                name="company"
                required
                placeholder="Företagsnamn"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Vad behöver ni hjälp med?</label>
              <select
                ref={selectRef}
                name="service"
                value={serviceValue}
                onChange={(e) => setServiceValue(e.target.value)}
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
                name="message"
                placeholder="Berätta kort om ert projekt..."
                rows={2}
                className={`${styles.input} ${styles.textarea}`}
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

          {/* ROI badge */}
          <div className={styles.roiBadge}>
            <span className={styles.roiBadgeLabel}>Din ROI-prognos</span>
            <span className={styles.roiBadgeValue}>390 000 kr/år</span>
          </div>
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
              config={{ theme: "dark" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}