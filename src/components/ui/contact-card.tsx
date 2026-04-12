"use client"

import { useState, useEffect } from "react"
import { MailIcon, PhoneIcon, PlusIcon, XIcon } from "lucide-react"
import styles from "./contact-card.module.css"

type FormState = "idle" | "submitting" | "success" | "error"
type FormField = "name" | "email" | "company" | "service" | "message"
type FormValues = Record<FormField, string>

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  service: "",
  message: "",
}

const services = [
  "AI-agent / Assistent",
  "AI-automatisering",
  "Strategi & Rådgivning",
  "Annat",
]

interface ContactCardProps {
  onClose?: () => void
}

export default function ContactCard({ onClose }: ContactCardProps) {
  const [formValues, setFormValues] = useState<FormValues>(initialValues)
  const [formState, setFormState] = useState<FormState>("idle")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [serverError, setServerError] = useState("")
  const [visible, setVisible] = useState(false)

  // Trigger animation after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError("")

    if (!formValues.name || !formValues.email || !formValues.company || !formValues.service) {
      setServerError("Vänligen fyll i alla obligatoriska fält.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      setServerError("Ange en giltig e-postadress.")
      return
    }

    setFormState("submitting")
    try {
      // TODO: Implementera riktig e-postsändning med Resend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setFormState("success")
      setTimeout(() => onClose?.(), 2000)
    } catch {
      setFormState("error")
      setServerError("Något gick fel. Vänligen försök igen.")
    }
  }

  return (
    <div className={styles.root} style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none', width: '100%' }}>
      {/* Plus icons in corners */}
      <PlusIcon className={styles.plusTopLeft} />
      <PlusIcon className={styles.plusTopRight} />
      <PlusIcon className={styles.plusBottomLeft} />
      <PlusIcon className={styles.plusBottomRight} />

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
                <MailIcon style={{ width: '17px', height: '17px', color: '#ffffff' }} />
              </div>
              <div>
                <p className={styles.contactLabel}>Email</p>
                <p className={styles.contactValue}>kontakt@eteya.ai</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <PhoneIcon style={{ width: '17px', height: '17px', color: '#ffffff' }} />
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
          {formState === "success" ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className={styles.successText}>Tack! Vi återkommer inom 1 vardag.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Row: Name + Email */}
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Namn *</label>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                    placeholder="Ditt namn"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email *</label>
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    placeholder="din@email.com"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Company */}
              <div className={styles.field}>
                <label className={styles.label}>Företag *</label>
                <input
                  type="text"
                  value={formValues.company}
                  onChange={(e) => setFormValues({ ...formValues, company: e.target.value })}
                  placeholder="Företagsnamn"
                  className={styles.input}
                />
              </div>

              {/* Service dropdown */}
              <div className={styles.field}>
                <label className={styles.label}>Vad behöver ni hjälp med? *</label>
                <div className={styles.dropdownContainer}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`${styles.dropdownButton} ${formValues.service ? styles.dropdownButtonSelected : styles.dropdownButtonPlaceholder}`}
                  >
                    <span>{formValues.service || "Välj tjänst..."}</span>
                    <svg style={{ width: '13px', height: '13px', flexShrink: 0, transition: 'transform 150ms', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className={styles.dropdown}>
                      {services.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => { setFormValues({ ...formValues, service }); setDropdownOpen(false) }}
                          className={styles.dropdownItem}
                        >
                          {service}
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
                  value={formValues.message}
                  onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                  placeholder="Berätta om ert projekt..."
                  rows={4}
                  className={`${styles.input} ${styles.textarea}`}
                />
              </div>

              {serverError && (
                <p className={styles.error}>{serverError}</p>
              )}

              <button
                type="submit"
                disabled={formState === "submitting"}
                className={styles.submitButton}
              >
                {formState === "submitting" ? "Skickar..." : "Skicka förfrågan"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
