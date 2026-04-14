"use client"

import { useState, useEffect, useRef } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { XIcon } from "lucide-react"
import ButtonStripe from "./ButtonStripe"
import { sendContactEmail } from "@/app/[locale]/actions/contact"
import styles from "./contact-card.module.css"

const services = [
  { value: "ai-agent", label: "AI-agent / Assistent" },
  { value: "ai-automatisering", label: "AI-automatisering" },
  { value: "strategi", label: "Strategi & Rådgivning" },
  { value: "annat", label: "Annat" },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <ButtonStripe type="submit" disabled={pending} fullWidth>
      {pending ? "Skickar..." : "Skicka förfrågan"}
    </ButtonStripe>
  )
}

interface ContactCardProps {
  onClose?: () => void
}

export default function ContactCard({ onClose }: ContactCardProps) {
  const [state, action] = useActionState(sendContactEmail, null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [serviceValue, setServiceValue] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [dropdownOpen])

  // Auto-close modal on success
  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => onClose?.(), 2500)
      return () => clearTimeout(t)
    }
  }, [state, onClose])

  return (
    <div className={styles.root} style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none', width: '100%' }}>
      {/* Corners */}
      <span className={`${styles.corner} ${styles.cornerTL}`} />
      <span className={`${styles.corner} ${styles.cornerTR}`} />
      <span className={`${styles.corner} ${styles.cornerBL}`} />
      <span className={`${styles.corner} ${styles.cornerBR}`} />

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={styles.closeButton}
          type="button"
        >
          <XIcon style={{ width: '22px', height: '22px' }} />
        </button>
      )}

      {/* Card — animated */}
      <div className={styles.grid}>
        {/* Left: Contact Info */}
        <div className={styles.left}>
          <div>
            <h1 className={styles.title}>
              Kontakta oss
            </h1>
            <p className={styles.subtitle}>
              Fyll i formuläret så återkommer vi inom 1 vardag.
            </p>
          </div>

          <div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div>
                <p className={styles.contactLabel}>Email</p>
                <p className={styles.contactValue}>kontakt@eteya.ai</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <p className={styles.contactLabel}>Telefon</p>
                <p className={styles.contactValue}>+46 8 123 45 67</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className={styles.form}>
          {state?.success ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className={styles.successText}>Tack! Vi återkommer inom 1 vardag.</p>
            </div>
          ) : (
            <form action={action}>
              {/* Honeypot */}
              <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              {/* Hidden service value */}
              <input type="hidden" name="service" value={serviceValue} />

              {/* Row: Name + Email */}
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

              {/* Company */}
              <div className={styles.field}>
                <label className={styles.label}>Företag</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Företagsnamn"
                  className={styles.input}
                />
              </div>

              {/* Service dropdown */}
              <div className={styles.field} ref={dropdownRef}>
                <label className={styles.label}>Vad behöver ni hjälp med?</label>
                <div className={styles.dropdownContainer}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`${styles.dropdownButton} ${serviceValue ? styles.dropdownButtonSelected : styles.dropdownButtonPlaceholder}`}
                  >
                    <span>{serviceValue ? services.find(s => s.value === serviceValue)?.label : "Välj tjänst..."}</span>
                    <svg style={{ width: '13px', height: '13px', flexShrink: 0, transition: 'transform 150ms', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className={styles.dropdown}>
                      {services.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => { setServiceValue(s.value); setDropdownOpen(false) }}
                          className={styles.dropdownItem}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className={styles.field}>
                <label className={styles.label}>Beskrivning</label>
                <textarea
                  name="message"
                  required
                  placeholder="Berätta om ert projekt..."
                  rows={4}
                  className={`${styles.input} ${styles.textarea}`}
                />
              </div>

              {(state as { error?: string } | null)?.error && (
                <p className={styles.error}>
                  {(state as { error: string }).error}
                </p>
              )}

              <SubmitButton />
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
