# Eteya Website — Nästa Steg

> **Skapad:** 2026-04-21  
> **Status:** Kontaktformulär ✅ KLAR | Bokningssystem ⏳ KOMMANDE

---

## ✅ AVSLUTAT (2026-04-21)

### Kontaktformulär & Turnstile
- [x] Cloudflare Turnstile integration på `/sv/kontakt`
- [x] SubmitButton fix (använder nu `turnstileToken` istället för `turnstileReady`)
- [x] Felkod 110200 löst (domän tillagd i Cloudflare Turnstile)
- [x] Email-notiser skickas till `kontakt@eteya.ai`
- [x] Detaljerad validering med specifika felmeddelanden
- [x] Alla env vars importerade till Vercel (11 nycklar)
- [x] Dokumentation skapad (`PROJECT-OVERVIEW.md`)

**Testat & Fungerar:**
- ✅ Formulär kan skickas
- ✅ Turnstile visar "Klart!" med grön checkruta
- ✅ Email kommer fram till `kontakt@eteya.ai`
- ✅ Validering fungerar (meddelande < 10 tecken → felmeddelande)

---

## 🔄 PÅGÅENDE

### Domänkonfiguration (Produktion)
- [ ] **Köp domän i Vercel**
  - Gå till: https://vercel.com/filipthai94-7315s-projects/site/settings/domains
  - Lägg till: `eteya.ai` och `www.eteya.ai`
  - Följ Vercels instruktioner för DNS-konfiguration
  
- [ ] **Uppdatera DNS i Cloudflare**
  - Logga in på Cloudflare Dashboard
  - Gå till DNS för `eteya.ai`
  - Lägg till CNAME/A-record enligt Vercels instruktioner
  
- [ ] **Lägg till produktionsdomäner i Turnstile**
  - Cloudflare Dashboard → Turnstile → din widget
  - Hostname Management → Lägg till:
    - `eteya.ai`
    - `www.eteya.ai`
  
- [ ] **Testa i produktion**
  - Gå till `https://eteya.ai/sv/kontakt`
  - Testa formuläret
  - Verifiera att email kommer fram

---

## 📅 KOMMANDE (Denna Vecka)

### ROI Booking System (Fas 1)
- [ ] **Cal.com Setup (Filip)**
  - [ ] Skapa Cal.com-konto (free tier)
  - [ ] Skapa event-typ: "Strategimöte" (30 min)
  - [ ] Konfigurera tillgänglighet: Mån-Fre 09:00-17:00 CET
  - [ ] Skapa webhook secret
  - [ ] Skicka calLink + secret till Aline

### ROI Booking System (Fas 2-4)
- [ ] **Frontend Implementation**
  - [ ] Installera `@calcom/embed-react`
  - [ ] Uppdatera `ContactCard` — bredare modal + responsive grid
  - [ ] Lägga till Cal.com inline embed
  - [ ] Lägga till GDPR-checkbox
  - [ ] Prefill-logik (namn + email → Cal.com)
  - [ ] ROI-data export från kalkylatorn
  - [ ] Göra företag obligatorisk

- [ ] **Backend Implementation**
  - [ ] `/api/lead` route — Turnstile + honeypot + rate limiting + Google Sheets
  - [ ] `/api/webhook/cal` route — Cal.com webhook handler
  - [ ] Google Sheets integration (API credentials)

- [ ] **Research + PDF**
  - [ ] Research-script (hemsida + Allabolag + SCB + konkurrenspriser)
  - [ ] PDF-generering (Puppeteer)
  - [ ] Discord + email-notiser

---

## 🎯 LÅNGSIKTIGT (Nästa Månad)

### SEO & Performance
- [ ] **SEO Foundation**
  - [ ] robots.txt
  - [ ] sitemap.xml
  - [ ] Meta tags för alla sidor
  - [ ] Open Graph tags
  - [ ] Structured data (JSON-LD)
  
- [ ] **Performance**
  - [ ] Bildoptimering (WebP, lazy loading)
  - [ ] Code splitting
  - [ ] Caching-strategi
  - [ ] Vercel Analytics

### Content & Features
- [ ] **Case Studies**
  - [ ] Telestore case study (klar)
  - [ ] Fler case studies (2-3 st)
  - [ ] Kundomdömen
  
- [ ] **Blogg**
  - [ ] Blogg-sektion
  - [ ] Första inläggen (AI-nyheter, tips)
  - [ ] RSS-feed

- [ ] **Eteya Platform Integration**
  - [ ] Länk till dashboard.eteya.ai
  - [ ] Demo-sektion
  - [ ] Pricing information

---

## 🐛 KÄNDA PROBLEM ATT HÅLLA KOLL PÅ

### Turnstile
- **Problem:** Kan få felkod 110200 om domän inte är tillagd
- **Lösning:** Alltid lägga till nya domäner i Cloudflare Dashboard → Turnstile → Hostname Management
- **Dokumentation:** https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/

### Email (Resend)
- **Problem:** `noreply@eteya.ai` måste vara verifierad i Resend
- **Lösning:** Gå till Resend Dashboard → Domains → Lägg till `eteya.ai` och verifiera DNS
- **Dokumentation:** https://resend.com/docs

### Cal.com (kommande)
- **Problem:** Webhook kan misslyckas om secret är fel
- **Lösning:** Dubbelkolla webhook secret i Cal.com Dashboard → Webhooks
- **Dokumentation:** https://cal.com/docs/api/webhooks

---

## 📚 DOKUMENTATION

| Dokument | Sökväg | Status |
|----------|--------|--------|
| **Projektöversikt** | `PROJECT-OVERVIEW.md` | ✅ Uppdaterad 2026-04-21 |
| **ROI Booking Spec** | `docs/ROI-BOOKING-SPEC.md` | ✅ Komplett spec |
| **Nästa Steg** | `NEXT-STEPS.md` | ✅ Denna fil |
| **Tech Stack** | `TOOLS.md` (workspace) | ✅ Uppdaterad |
| **README** | `README.md` | ⚠️ Behöver uppdateras |

---

## 🔗 VIKTIGA LÄNKAR

### Vercel
- **Projekt:** https://vercel.com/filipthai94-7315s-projects/site
- **Deployments:** https://vercel.com/filipthai94-7315s-projects/site/deployments
- **Env Vars:** https://vercel.com/filipthai94-7315s-projects/site/settings/environment-variables
- **Domains:** https://vercel.com/filipthai94-7315s-projects/site/settings/domains

### Cloudflare
- **Dashboard:** https://dash.cloudflare.com/
- **Turnstile:** https://dash.cloudflare.com/?to=/:account/turnstile
- **DNS:** https://dash.cloudflare.com/?to=/:account/:zone/dns

### GitHub
- **Repo:** https://github.com/filipthai94-hub/eteya-site.git
- **Issues:** https://github.com/filipthai94-hub/eteya-site/issues

### Tredjepartsverktyg
- **Cal.com:** https://cal.com/
- **Resend:** https://resend.com/
- **Cloudflare Turnstile:** https://www.cloudflare.com/products/turnstile/

---

## 📞 KONTAKT

**Projektansvarig:** Filip Thai  
**Email:** filip@eteya.ai  
**Discord:** #eteya-website  

**Senaste uppdatering:** 2026-04-21 13:45 UTC  
**Dokumentation av:** Aline 🌺
