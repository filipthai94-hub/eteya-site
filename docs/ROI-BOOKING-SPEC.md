# ROI Calculator + Smart Booking — Fullständig Spec

> **Datum:** 2026-04-17  
> **Status:** SPEC — väntar på godkännande  
> **Projekt:** Eteya website (eteya.ai)

---

## 1. Systemöversikt

### 1.1 Koncept

När en besökare leker med ROI-kalkylatorn på startsidan och klickar "Boka strategimöte" → all data (kalkylatorns slutresultat + formulärets kontaktuppgifter) sparas. Baserat på företagsnamnet körs en automatiserad research som genererar en PDF-briefing — allt innan mötet ens börjar.

### 1.2 Flöde

```
Besökare leker med ROI-kalkylatorn
    ↓
Klickar "Boka strategimöte"
    ↓
Modal öppnas: Vårt formulär (vänster) + Cal.com kalender (höger)
    ↓
Kunden fyller i: Namn, Email, Företag, Tjänst, Beskrivning + GDPR
    ↓
Namn + Email prefillas i Cal.com automatiskt
    ↓
Kunden väljer tid i Cal.com → bokning bekräftas
    ↓
Cal.com webhook → API route
    ↓
API route sparar data + triggar research-script
    ↓
Research-script kör (~30-60 sekunder):
    1. Företagets hemsida → scraping
    2. Allabolag → anställda, omsättning, bransch
    3. SCB API → bransch-statistik
    4. Konkurrenspriser → Statisk databas (competitors.json)
    5. AI-analys → föreslår automation/AI-möjligheter
    6. Korsar med ROI-kalkylatorns siffror
    ↓
PDF-briefing genereras (premium dark design)
    ↓
Notiser skickas:
    - Discord #mission-control → "🟢 Ny lead: [Företag]"
    - Email till filip@eteya.ai → PDF som bilaga
```

### 1.3 Teknisk stack

| Del | Verktyg | Pris |
|-----|---------|------|
| Bokning | Cal.com Cloud (free tier) | 0 kr/mån |
| Data-lagring | Google Sheets | 0 kr/mån |
| Spam-skydd | Cloudflare Turnstile | 0 kr/mån |
| Företagsresearch | Allabolag scraping + SCB API | 0 kr/mån |
| Konkurrenspriser | Statisk databas (competitors.json) | 0 kr/mån |
| PDF-generering | Puppeteer (server-side) | 0 kr/mån |
| Notiser | Discord webhook + Gmail SMTP | 0 kr/mån |
| Hosting | Hetzner VPS (finns redan) | Finns ✅ |
| **Total** | | **0 kr/mån** |

---

## 2. Frontend

### 2.1 Modal-design

**Komponent:** `ContactCard` (redan existerande i `src/components/ui/contact-card.tsx`)

**Ändringar:**
- Modalen blir bredare: `max-width: 1100px` (idag 520px)
- Layout: CSS Grid med två kolumner på desktop
- Vänster kolumn: vårt formulär (befintliga fält + GDPR-checkbox)
- Höger kolumn: Cal.com inline embed

**Responsive:**
- Desktop (≥1100px): Två kolumner sida vid sida
- Tablet (690-1099px): Formulär först, Cal.com under (fullbredd)
- Mobil (<690px): Formulär först, Cal.com under (fullbredd)

### 2.2 Formulär (vänster kolumn)

**Fält (befintliga + nya):**

| Fält | Typ | Obligatorisk | Källa |
|------|-----|-------------|-------|
| Namn | text | ✅ | Befintlig |
| Email | email | ✅ | Befintlig |
| Företag | text | ✅ | Befintlig (görs obligatorisk) |
| Tjänst | dropdown | ✅ | Befintlig (4 val) |
| Beskrivning | textarea | ❌ | Befintlig |
| ☐ GDPR-samtycke | checkbox | ✅ | NY |

**Tjänst-dropdown (oförändrad):**
1. AI-agent / Assistent
2. AI-automatisering
3. Strategi & Rådgivning
4. Annat

**GDPR-checkbox (NY):**
- Text: "Jag godkänner att Eteya behandlar mina uppgifter enligt integritetspolicyn"
- Länk till: `/sv/integritetspolicy`
- Måste vara ikryssad för att skicka

### 2.3 Cal.com embed (höger kolumn)

**Komponent:** `@calcom/embed-react`

**Konfiguration:**
```tsx
<Cal
  calLink="eteya/strategimote"
  style={{ width: '100%', height: '100%' }}
  config={{
    name: formData.name,           // Prefill från formuläret
    email: formData.email,         // Prefill från formuläret
    "metadata[company]": formData.company,
    "metadata[service]": formData.service,
    "metadata[description]": formData.description,
    "metadata[roiData]": JSON.stringify(roiData),
    "metadata[source]": "roi-calculator",
    theme: "dark",
  }}
/>
```

**Prefill-logik:**
- När kunden skriver i namn-fältet → uppdatera `config.name` i realtid
- När kunden skriver i email-fältet → uppdatera `config.email` i realtid
- ROI-data skickas som metadata (inte synligt för kunden)

### 2.4 ROI-data — vad som sparas

**Slutresultat från kalkylatorn:**

```typescript
interface ROIData {
  employees: number;          // Antal anställda
  hourlyRate: number;         // Timlön (kr)
  adminHours: number;         // Admin-timmar/vecka
  annualSavings: number;      // Uppskattad besparing (kr/år)
  service: string;            // Vald tjänst
  source: 'roi-calculator';   // Källa
}
```

**Hur det samlas in:**
- ROI-kalkylatorns state exporteras vid klick på "Boka strategimöte"
- Data skickas som dolt fält i formuläret + som metadata i Cal.com
- Custom event `open-contact-modal` triggar modalen (redan implementerat)

### 2.5 Spam-skydd — 3 lager

**Lager 1: Cloudflare Turnstile**
- Invisible challenge (ingen CAPTCHA för användaren)
- Implementeras i API route (server-side verification)
- Site key + secret key från Cloudflare Dashboard

**Lager 2: Honeypot (redan implementerat)**
- Dolt fält `website` i formuläret
- Om ifyllt → blockera

**Lager 3: Rate limiting (server-side)**
- Max 3 bokningsförsök per IP per 24 timmar
- Max 10 API-anrop per minut från samma IP
- Implementeras i API route med in-memory counter (eller Redis i framtiden)

---

## 3. Backend

### 3.1 API Route — `/api/lead`

**Method:** `POST`

**Request body:**
```typescript
{
  name: string;
  email: string;
  company: string;
  service: string;
  description?: string;
  roiData: ROIData;
  turnstileToken: string;    // Cloudflare Turnstile
  website?: string;          // Honeypot (ska vara tom)
}
```

**Response:**
```typescript
// Success
{ success: true, message: "Tack! Vi återkommer inom 1 vardag." }

// Error
{ success: false, error: "Något gick fel. Försök igen." }
```

**Logik:**
1. Validera Turnstile token → om ogiltig, avvisa
2. Kolla honeypot → om ifyllt, avvisa
3. Rate limiting → om över gräns, avvisa med 429
4. Spara lead-data i Google Sheets
5. Returnera success

### 3.2 Cal.com Webhook — `/api/webhook/cal`

**Method:** `POST`

**Trigger:** Cal.com skickar webhook när bokning skapas (`BOOKING_CREATED`)

**Payload (från Cal.com):**
```json
{
  "triggerEvent": "BOOKING_CREATED",
  "payload": {
    "title": "Strategimöte",
    "attendees": [{ "name": "...", "email": "..." }],
    "startTime": "2026-04-21T14:00:00Z",
    "metadata": {
      "company": "...",
      "service": "...",
      "description": "...",
      "roiData": "{...}",
      "source": "roi-calculator"
    }
  }
}
```

**Logik:**
1. Verifiera webhook-signatur (Cal.com secret)
2. Extrahera lead-data + metadata
3. Spara bokningsdata i Google Sheets (samma rad som lead)
4. Trigga research-script med företagsnamn + ROI-data
5. Returnera 200 OK

### 3.3 Research Script

**Fil:** `scripts/research-lead.ts`

**Input:**
```typescript
interface ResearchInput {
  companyName: string;
  companyWebsite?: string;   // Om kunden angav
  roiData: ROIData;
  contactName: string;
  contactEmail: string;
  service: string;
  description?: string;
  bookingTime: string;        // Bokat tid
}
```

**Output:**
```typescript
interface ResearchOutput {
  company: {
    name: string;
    website: string;
    description: string;       // Kort beskrivning av verksamhet
    industry: string;          // Bransch
    employees: number;          // Från Allabolag
    revenue: number;            // Omsättning (kr) från Allabolag
    techStack: string[];       // Detekterade teknologier
  };
  industry: {
    sniCode: string;           // Från SCB
    averageRevenue: number;    // Bransch-genomsnitt
    employeeGrowth: string;    // Trend
  };
  competitors: {
    name: string;
    pricing: string;            // T.ex. "2 200 kr/h" eller "Från 5 000 kr/mån"
    service: string;           // Vad dom erbjuder
    source: string;            // URL till prisinformation
  }[];
  aiOpportunities: {
    title: string;              // T.ex. "Orderbekräftelse-automation"
    description: string;
    estimatedSavings: string;  // T.ex. "~15 h/vecka"
    priority: 'high' | 'medium' | 'low';
  }[];
  roiValidation: {
    claimed: number;            // ROI-kalkylatorns siffra
    realistic: number;          // Vår bedömning
    confidence: 'high' | 'medium' | 'low';
    notes: string;
  };
  recommendedFocus: string;    // 2-3 rader om vad mötet bör fokusera på
}
```

**Research-steg:**

1. **Företagets hemsida** → Scrapa startsida + om-sida
   - Extrahera: verksamhetsbeskrivning, bransch, kontaktuppgifter
   - Detektera: tech stack (CMS, e-handel, etc.)

2. **Allabolag** → Scrapa företagets profil
   - Extrahera: antal anställda, omsättning, result, bransch, SNI-kod
   - URL: `https://www.allabolag.se/{företagsnamn}`

3. **SCB API** → Bransch-statistik
   - Hämta: genomsnittlig omsättning/anställd för branschen
   - API: `https://api.scb.se/`

4. **Konkurrenspriser** → Hämta från `scripts/data/competitors.json`
   - Statisk databas med 9 svenska AI-konsulter + priser
   - Inkluderas direkt i PDF — ingen scraping vid varje lead
   - Uppdateras manuellt (1 gång/kvartal)

5. **AI-analys** → Sammanställning
   - Korsa Allabolag-data med ROI-kalkylatorns siffror
   - Föreslår 3 AI/automation-möjligheter baserat på bransch + storlek
   - Validera ROI-kalkylatorns siffra mot bransch-genomsnitt

### 3.4 PDF-generering

**Fil:** `scripts/generate-briefing.ts`

**Verktyg:** Puppeteer (headless Chrome)

**Design:** Premium dark mode — matchar Eteyas brand

**Innehåll (SV för svenska leads, EN för engelska):**

```
┌─────────────────────────────────────────────────┐
│  ████ ETEYA                                     │  ← Lime logga, dark header
│  STRATEGIMÖTE — BRIEFING                        │
│─────────────────────────────────────────────────│
│                                                 │
│  📅 Möte: 2026-04-21 kl 14:00                 │
│  🏢 Företag: Telestore Sverige AB              │
│  👤 Kontakt: Filip Thai | filip@telestore.se    │
│                                                 │
│  ─── ROI-PROGNOS ─────────────────────────────  │
│  ┌─────────────────────────────────────┐        │
│  │  Antal anställda: 8                 │        │  ← Dark card
│  │  Timlön: 350 kr                     │        │     med lime accents
│  │  Admin-timmar/vecka: 20             │        │
│  │  Uppskattad besparing:             │        │
│  │  ████ 390 000 kr/år                │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│  ─── FÖRETAGSANALYS ──────────────────────────  │
│  Bransch: E-handel (SNI 47910)                 │
│  Anställda: 8                                  │
│  Omsättning: ~5M kr                            │
│  Hemsida: telestore.se                          │
│  Verksamhet: E-handel av mobiltelefoner         │
│                                                 │
│  ─── KONKURRENSPRISER ────────────────────────  │
│  Satori ML: ~2 200 kr/h (timbank 44 000 kr)    │
│  Codon Consulting: paket från ~15 000 kr        │
│  Bransch-genomsnitt: 1 500-2 500 kr/h          │
│                                                 │
│  ─── AI-MÖJLIGHETER ──────────────────────────  │
│  1. 🤖 Orderbekräftelse → automatisera          │
│     Impact: ~15 h/vecka sparad                  │
│     Prioritet: Hög                              │
│                                                 │
│  2. 📧 Kundtjänst → AI-chatbot                  │
│     Impact: ~8 h/vecka sparad                   │
│     Prioritet: Hög                              │
│                                                 │
│  3. 📦 Lagerhantering → prediktiv AI             │
│     Impact: ~5 h/vecka sparad                   │
│     Prioritet: Medium                           │
│                                                 │
│  ─── REKOMMENDERAT FOKUS ────────────────────  │
│  Fokusera på orderautomatisering — störst       │
│  ROI baserat på kalkylatorn. E-handel = hög     │
│  volym repetitiva processer.                    │
│                                                 │
│  eteya.ai | kontakt@eteya.ai                   │  ← Lime footer
└─────────────────────────────────────────────────┘
```

### 3.5 Notiser

**Discord webhook → #mission-control:**

```
🟢 NY LEAD — Strategimöte

🏢 Företag: Telestore Sverige AB
👤 Kontakt: Filip Thai (filip@telestore.se)
📋 Tjänst: AI-automatisering
📅 Möte: 2026-04-21 kl 14:00
💰 ROI-prognos: 390 000 kr/år

📊 Briefing genererad → se PDF-bilaga
```

**Email → filip@eteya.ai:**
- Ämne: `Ny lead: Telestore Sverige AB — Strategimöte 2026-04-21`
- Body: Kort sammanfattning + PDF-bilaga
- Från: kontakt@eteya.ai

---

## 4. Cal.com Setup

### 4.1 Konto

- Skapa Cal.com-konto (free tier)
- Skapa event-typ: "Strategimöte" (30 min)
- Tillgängliga tider: Mån-Fre 09:00-17:00 CET
- Buffer: 15 min före, 15 min efter

### 4.2 Event-typ konfiguration

- **Namn:** Strategimöte
- **Längd:** 30 minuter
- **Plats:** Videolänk (Cal.com genererar automatiskt)
- **Custom fields (dolda):**
  - `company` (text)
  - `service` (text)
  - `roiData` (text — JSON)
  - `source` (text — "roi-calculator")

### 4.3 Webhook

- URL: `https://eteya.ai/api/webhook/cal`
- Event: `BOOKING_CREATED`
- Secret: Genereras vid setup

### 4.4 NPM-paket

```bash
npm install @calcom/embed-react
```

---

## 5. Implementation — Filstruktur

```
src/
├── app/
│   └── api/
│       ├── lead/
│       │   └── route.ts              # Lead API endpoint
│       └── webhook/
│           └── cal/
│               └── route.ts          # Cal.com webhook
├── components/
│   ├── ui/
│   │   ├── contact-card.tsx          # UPPDATERAD: bredare modal + Cal.com
│   │   └── contact-card.module.css    # UPPDATERAD: responsive grid
│   └── sections/
│       └── ROICalculatorClient.tsx    # UPPDATERAD: ROI-data export
scripts/
├── research-lead.ts                  # Research-script
├── generate-briefing.ts             # PDF-generering
└── notify-lead.ts                    # Discord + email-notiser
```

---

## 6. Implementation — Ordning

### Fas 1: Cal.com Setup (manuellt av Filip)
1. Skapa Cal.com-konto
2. Skapa event-typ "Strategimöte"
3. Konfigurera tillgänglighet
4. Skapa webhook secret
5. Skicka calLink + secret till Aline

### Fas 2: Frontend (Aline bygger)
1. Installera `@calcom/embed-react`
2. Uppdatera `ContactCard` — bredare modal + responsive grid
3. Lägga till Cal.com inline embed
4. Lägga till GDPR-checkbox
5. Prefill-logik (namn + email → Cal.com)
6. ROI-data export från kalkylatorn
7. Göra företag obligatorisk

### Fas 3: Backend (Aline bygger)
1. `/api/lead` route — Turnstile + honeypot + rate limiting + Google Sheets
2. `/api/webhook/cal` route — Cal.com webhook handler
3. Google Sheets integration

### Fas 4: Research + PDF (Aline bygger)
1. Research-script (hemsida + Allabolag + SCB + konkurrenspriser)
2. PDF-generering (Puppeteer)
3. Discord + email-notiser

### Fas 5: Testning + Lansering
1. End-to-end test
2. Testa med riktigt Cal.com-konto
3. Testa research-script med 3 företag
4. Testa PDF-generering
5. Testa notiser
6. Lansera!

---

## 7. Säkerhet

- **Turnstile:** Alla form-submissioner måste verifieras
- **Honeypot:** Dolt fält som botar fyller i
- **Rate limiting:** 3 bokningar/24h per IP, 10 API-anrop/min
- **Webhook secret:** Cal.com webhook signatur verifieras
- **GDPR:** Checkbox obligatorisk, integritetspolicy-länk
- **Data-minimering:** Vi sparar bara nödvändig data
- **HTTPS:** All data krypterad i transit

---

## 8. Öppna frågor

- [ ] Cal.com-konto skapat? (Filip)
- [ ] Cal.com calLink bekräftad? (t.ex. "eteya/strategimote")
- [ ] Webhook secret genererad?
- [ ] Email för notiser: filip@eteya.ai bekräftad?
- [ ] Google Sheets API credentials skapade?
- [ ] Cloudflare Turnstile site key + secret?