# Eteya Website — Projektöversikt 2026-04-21

> **Status:** ✅ Produktion redo (testas på Vercel preview)  
> **Senaste uppdatering:** 2026-04-21  
> **URL:** https://site-six-mu-70.vercel.app  
> **Repo:** https://github.com/filipthai94-hub/eteya-site.git

---

## 📋 INNEHÅLLSFÖRTECKNING

1. [Projektöversikt](#projektöversikt)
2. [Teknisk Stack](#teknisk-stack)
3. [Miljöer](#miljöer)
4. [Funktioner](#funktioner)
5. [API Routes](#api-routes)
6. [Komponenter](#komponenter)
7. [Miljövariabler](#miljövariabler)
8. [Deploy & Hosting](#deploy--hosting)
9. [Tredjepartstjänster](#tredjepartstjänster)
10. [Kända Problem & Lösningar](#kända-problem--lösningar)
11. [Nästa Steg](#nästa-steg)

---

## 🎯 PROJEKTÖVERSIKT

**Eteya Website** är en marknadsföringssajt för Eteya Consulting AB — ett AI-konsultbolag specialiserat på automation, strategi och rådgivning.

**Syfte:**
- Presentera Eteyas tjänster och case studies
- Generera leads genom ROI-kalkylator + bokningsformulär
- Samla in kontaktinformation med spam-skydd (Cloudflare Turnstile)
- Skicka automatiska email-notiser vid nya förfrågningar

**Målgrupp:**
- Företagsledare och beslutsfattare i Sverige
- Företag som vill automatisera processer med AI

---

## 🛠️ TEKNISK STACK

| Kategori | Verktyg | Version |
|----------|---------|---------|
| **Framework** | Next.js | 16.2.1 |
| **Språk** | TypeScript | 5.x |
| **UI-bibliotek** | React | 19.2.4 |
| **Animation** | GSAP | 3.14.2 |
| **Smooth Scroll** | Lenis | 1.3.20 |
| **I18n** | next-intl | 4.8.3 |
| **Validering** | Zod | 4.3.6 |
| **Email** | Resend | 6.9.4 |
| **Booking** | Cal.com Embed | 1.5.3 |
| **Spam-skydd** | Cloudflare Turnstile | Latest |
| **Icons** | Lucide React | 1.7.0 |
| **Styling** | Tailwind CSS | 4.x |
| **Hosting** | Vercel | Latest |

---

## 🌍 MILJÖER

| Miljö | URL | Status | Användning |
|-------|-----|--------|------------|
| **Preview** | https://site-six-mu-70.vercel.app | ✅ Aktiv | Test & utveckling |
| **Produktion** | https://eteya.ai | ⏳ Kommande | Live (när DNS är kopplat) |

**DNS-status:**
- Domän `eteya.ai` är registrerad i Cloudflare
- Ännu inte kopplad till Vercel (kommer senare)
- Turnstile konfigurerad för `site-six-mu-70.vercel.app` (test) + `eteya.ai` (produktion)

---

## ✨ FUNKTIONER

### 1. **Startsida** (`/sv`)
- Hero-sektion med animationer (GSAP)
- ROI-kalkylator (interaktiv)
- Case studies (Telestore, m.fl.)
- Social proof (kunder, resultat)
- Footer CTA med bokningsmodal

### 2. **Kontakt-sida** (`/sv/kontakt`)
- Kontaktformulär med Cloudflare Turnstile
- Företagsinformation (adress, email, öppettider)
- Sociala medier-länkar
- **Turnstile integration:** ✅ Fungerar sedan 2026-04-21

### 3. **Om Oss** (`/sv/om-oss`)
- Företagspresentation
- Team-sektion
- Vår story

### 4. **Tjänster** (`/sv/tjanster`)
- AI-automatisering
- AI-strategi & rådgivning
- Integrationer
- Utbildning & training

### 5. **ROI Kalkylator** (Modal)
- Interaktiv kalkylator
- Beräknar besparing baserat på anställda, timlön, admin-timmar
- "Boka strategimöte" CTA → öppnar bokningsmodal

### 6. **Bokningsmodal** (Footer CTA)
- Två steg:
  1. Kontaktformulär (namn, email, företag, tjänst)
  2. Cal.com kalender (inbäddad)
- Prefill av namn + email i Cal.com
- ROI-data skickas som metadata

---

## 🔌 API ROUTES

### `/api/contact` (POST)
**Syfte:** Skicka kontaktformulär

**Request:**
```typescript
{
  name: string;          // Min 2 tecken
  email: string;         // Email-format
  company?: string;      // Max 200 tecken
  service?: string;      // Valfritt
  message: string;       // Min 10, max 2000 tecken
  website: string;       // Honeypot (måste vara tom)
  'cf-turnstile-response': string;  // Turnstile token
}
```

**Validering:**
- Zod schema
- Turnstile verifiering (server-side)
- Honeypot (om `website` är ifylld → blockera)

**Response:**
```typescript
// Success
{ success: true }

// Error
{ error: "Ogiltiga uppgifter: ..." }
```

**Email-notis:**
- Skickas till: `kontakt@eteya.ai`
- Från: `noreply@eteya.ai` (via Resend)
- Innehåll: Namn, email, företag, tjänst, meddelande

---

## 🧩 KOMPONENTER

### Layout
- `Nav.tsx` — Navigation (header)
- `FooterCTAClient.tsx` — Footer med boknings-CTA

### Sektioner
- `Contact.tsx` — Kontakt-sida (formulär + Turnstile)
- `FooterCTAClient.tsx` — Footer CTA med modal
- `SocialProof.tsx` — Kundloggor + resultat
- `ROICalculatorClient.tsx` — ROI-kalkylator

### UI
- `contact-card.tsx` — Bokningsmodal (två steg)
- `ButtonStripe.tsx` — Stiliserad knapp
- `contact-card.module.css` — Modal styles

---

## 🔐 MILJÖVARIABLER

### Lokalt (`.env.local`)
```bash
# Cal.com Booking
NEXT_PUBLIC_CAL_LINK=eteya-ai/strategimote
CAL_WEBHOOK_SECRET=<REDACTED>
CAL_API_KEY=<REDACTED>

# Cloudflare Turnstile (Spam-skydd)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<REDACTED>
TURNSTILE_SECRET_KEY=<REDACTED>

# Supabase (Eteya Project)
ETEYA_SUPABASE_URL=<REDACTED>
ETEYA_SUPABASE_ANON_KEY=<REDACTED>
ETEYA_SUPABASE_SERVICE_ROLE_KEY=<REDACTED>

# Discord Notifications
DISCORD_WEBHOOK_URL=<REDACTED>

# Apiverket API (Company Data)
APIVERKET_API_KEY=<REDACTED>

# Resend API (Email Notifications)
RESEND_API_KEY=<REDACTED>
```

**⚠️ VARNING:** Dessa nycklar är hemliga! Dela aldrig `.env.local` eller commita nycklar till Git.

**Referens:** Fullständiga nycklar finns i `vercel-env-import.txt` (lokal fil, ej i Git).

### Vercel (Production + Preview)
Alla ovanstående variabler är importerade via `vercel-env-import.txt` (2026-04-21).

**Import-fil sökväg:**
```
/home/openclaw/.openclaw/workspace/projects/eteya/site/vercel-env-import.txt
```

---

## 🚀 DEPLOY & HOSTING

### Vercel Setup
- **Projekt:** `filipthai94-7315s-projects/site`
- **Auto-deploy:** Vid push till `main`
- **Build command:** `next build`
- **Output:** `standalone` (för optimering)

### Deploy Workflow
1. Gör ändringar lokalt
2. `git add . && git commit -m "..." && git push`
3. Vercel auto-deployar (2-3 minuter)
4. Testa på preview-URL
5. Vid produktion: Deploy to Production i Vercel

### Kommandon
```bash
# Lokal utveckling
npm run dev

# Bygg för produktion
npm run build

# Starta produktion lokalt
npm start

# Lint
npm run lint
```

---

## 📦 TREDJE PARTS TJÄNSTER

| Tjänst | Syfte | API Key | Status |
|--------|-------|---------|--------|
| **Vercel** | Hosting & deploy | - | ✅ Aktiv |
| **Cal.com** | Bokningssystem | `cal_live_...` | ✅ Konfigurerad |
| **Cloudflare Turnstile** | Spam-skydd | `0x4AAAAA...` | ✅ Fungerar |
| **Resend** | Email-notiser | `re_6puVHB...` | ✅ Fungerar |
| **Supabase** | Databas (Eteya) | `<REDACTED>` | ✅ Konfigurerad |
| **Discord Webhook** | Internt notiser | `https://discord...` | ✅ Konfigurerad |
| **Apiverket** | Företagsdata | `sk_live_...` | ✅ Konfigurerad |

---

## 🐛 KÄNDA PROBLEM & LÖSNINGAR

### 1. Turnstile visades inte på kontakt-sidan (2026-04-21)
**Problem:** Knappen "Skicka förfrågan" var disabled även efter Turnstile laddat.

**Orsak:** `SubmitButton` kollade på `turnstileReady` (när script laddar) istället för `turnstileToken` (när användaren klarat utmaningen).

**Lösning:**
- Ändrade `SubmitButton` att ta emot `turnstileToken` som prop
- Knappen är nu disabled tills `turnstileToken` finns
- Commit: `de8bb45` (2026-04-21)

### 2. Felkod 110200 från Cloudflare (2026-04-21)
**Problem:** Turnstile visade felmeddelande "Domain not authorized".

**Orsak:** Domänen `site-six-mu-70.vercel.app` var inte tillagd i Cloudflare Turnstile widgetens "Allowed hostnames".

**Lösning:**
- Lade till `site-six-mu-70.vercel.app` i Cloudflare Dashboard → Turnstile → Hostname Management
- För produktion: Lägg till `eteya.ai` och `www.eteya.ai` när DNS är kopplat

### 3. Kontaktformulär skickades till fel email (2026-04-21)
**Problem:** Mail skickades till `filip@eteya.ai` (finns inte).

**Orsak:** Fel emailadress i `/api/contact` route.

**Lösning:**
- Ändrade från `filip@eteya.ai` till `kontakt@eteya.ai`
- Commit: `305eeef` (2026-04-21)

### 4. "Ogiltiga uppgifter" vid formulärskick (2026-04-21)
**Problem:** Felmeddelande utan specifik information.

**Lösning:**
- Lade till detaljerad validering med specifika felmeddelanden
- Nu visas exakt vilket fält som är fel (t.ex. "Meddelandet är för kort (minst 10 tecken)")
- Commit: `b16e28b` (2026-04-21)

---

## 📅 NÄSTA STEG

### Kort sikt (denna vecka)
- [ ] **Koppla domän `eteya.ai` till Vercel**
  - Gå till Vercel → Project Settings → Domains
  - Lägg till `eteya.ai` och `www.eteya.ai`
  - Uppdatera DNS i Cloudflare (CNAME/A-record från Vercel)
- [ ] **Lägg till produktionsdomäner i Turnstile**
  - Cloudflare Dashboard → Turnstile → Hostname Management
  - Lägg till `eteya.ai` och `www.eteya.ai`
- [ ] **Testa hela flödet i produktion**
  - Kontaktformulär
  - Turnstile
  - Email-notiser till `kontakt@eteya.ai`

### Medel sikt (nästa vecka)
- [ ] **Implementera ROI Booking-flödet** (se `docs/ROI-BOOKING-SPEC.md`)
  - Cal.com webhook integration
  - Research-script (Allabolag + SCB)
  - PDF-generering
  - Discord + email-notiser
- [ ] **Lägga till fler case studies**
- [ ] **SEO-optimering** (meta tags, sitemap, robots.txt)

### Lång sikt (nästa månad)
- [ ] **Eteya Platform integration** (dashboard.eteya.ai)
- [ ] **Analytics** (Vercel Analytics eller Google Analytics)
- [ ] **A/B-testning** av CTA-knappar
- [ ] **Blogg** för AI-nyheter och insights

---

## 📞 KONTAKT & SUPPORT

**Projektansvarig:** Filip Thai  
**Email:** filip@eteya.ai  
**Discord:** #eteya-website  

**Dokumentation:**
- Projektspec: `docs/ROI-BOOKING-SPEC.md`
- Teknisk stack: `TOOLS.md` (i workspace root)
- OpenClaw config: `openclaw.json`

---

## 📝 ÄNDRINGSLOGG

### 2026-04-21
- ✅ Turnstile integration fixad på kontakt-sidan
- ✅ Felkod 110200 löst (domän tillagd i Cloudflare)
- ✅ Email-notiser skickas nu till `kontakt@eteya.ai`
- ✅ Detaljerad validering för kontaktformulär
- ✅ Alla env vars importerade till Vercel

### 2026-04-17
- ✅ Lenis smooth scroll för hash-länkar fixad
- ✅ ButtonSwap uppdaterad för onClick-prop

### 2026-04-10
- ✅ Level 3 Workflow implementerat med Lobster pipelines

---

**Senaste uppdatering:** 2026-04-21 13:40 UTC  
**Dokumentation skriven av:** Aline 🌺
