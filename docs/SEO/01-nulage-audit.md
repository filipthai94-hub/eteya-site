# SEO + GEO Foundation — Nulägesanalys

**Datum:** 2026-04-15
**Status:** 🟡 DELVIS IMPLEMENTERAT
**Utförd av:** Aline

---

## 📊 SAMMANFATTNING

| Kategori | Status | Prioritet |
|----------|--------|-----------|
| **robots.ts** | ✅ Finns men saknar AI-bots | HÖG |
| **sitemap.ts** | ✅ Finns men ofullständig | HÖG |
| **manifest.ts** | ❌ Saknas | MEDIUM |
| **Favicon + Icons** | ✅ Finns | OK |
| **Metadata per sida** | 🟡 Delvis | HÖG |
| **JSON-LD** | 🟡 Delvis (bara BreadcrumbList) | HÖG |
| **llms.txt** | ❌ Saknas | MEDIUM |
| **Säkerhetsheaders** | ❌ Okänt (next.config.ts finns) | HÖG |

---

## 1. TECHNICAL FOUNDATION

### 1.1 robots.ts

**Plats:** `src/app/robots.ts`
**Status:** ✅ FINNS men OFULLSTÄNDIG

**Nuvarande innehåll:**
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://eteya.ai/sitemap.xml',
  }
}
```

**❌ SAKNAS:**
- AI-search crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
- `host`-property
- `disallow` för admin/api

**ÅTGÄRD:** Uppdatera med AI-bots + host

---

### 1.2 sitemap.ts

**Plats:** `src/app/sitemap.ts`
**Status:** ✅ FINNS men OFULLSTÄNDIG

**Nuvarande sidor i sitemap:**
- `/` (hemsida)
- `/en` (engelsk hem)
- `/sv/ai-besparing`
- `/en/ai-savings`
- `/sv/kundcase`
- `/en/case-studies`
- `/sv/kundcase/telestore`
- `/en/case-studies/telestore`

**❌ SAKNAS I SITEMAP:**
- `/sv/om-oss` + `/en/about`
- `/sv/kontakt` + `/en/contact`
- `/sv/kundcase/nordicrank`
- `/sv/kundcase/sannegarden`
- `/sv/kundcase/mbflytt`
- `/sv/kundcase/trainwithalbert`
- `/sv/roi-test` (om den ska indexeras)
- `/sv/integritetspolicy` + `/sv/villkor`
- `/en/privacy-policy` + `/en/terms`

**ÅTGÄRD:** Lägg till alla saknade sidor

---

### 1.3 manifest.ts

**Plats:** `src/app/manifest.ts`
**Status:** ❌ SAKNAS

**ÅTGÄRD:** Skapa för PWA-support

---

### 1.4 Favicon + Icons

**Plats:** `src/app/`
**Status:** ✅ FINNS

- ✅ `favicon.ico` (25931 bytes)
- ✅ `icon.png` (801 bytes)
- ✅ `apple-icon.png` (6179 bytes)
- ✅ `opengraph-image.tsx` (dynamisk OG)

**ÅTGÄRD:** Ingen — fungerar

---

## 2. METADATA PER SIDA

### 2.1 Hemsida (`/[locale]/page.tsx`)

**Status:** ❌ SAKNAS HELT

**Nuvarande:**
```typescript
export default function Home() { ... }
// Ingen metadata-export
```

**ÅTGÄRD:** Lägg till `generateMetadata` med:
- title (50-60 tecken)
- description (150-160 tecken)
- canonical
- openGraph (bild 1200×630)
- twitter card

---

### 2.2 Om Oss (`/[locale]/om-oss/page.tsx`)

**Status:** ✅ FINNS — BRA

**Nuvarande:**
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about.meta' })
  
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '...',
      languages: { sv: '...', en: '...' }
    },
    openGraph: { ... }
  }
}
```

**✅ BRA:**
- Title + description från i18n
- Canonical satt
- Languages (sv/en)
- Open Graph

**❌ SAKNAS:**
- Twitter card
- OG-bild specificerad (bara default)

**ÅTGÄRD:** Lägg till Twitter card + specificera OG-bild

---

### 2.3 Kontakt (`/[locale]/kontakt/page.tsx`)

**Status:** ✅ FINNS — BRA

**Nuvarande:**
- ✅ Title + description från i18n
- ✅ Canonical
- ✅ Languages
- ✅ Open Graph
- ✅ Twitter card

**❌ SAKNAS:**
- OG-bild specificerad

**ÅTGÄRD:** Specificera OG-bild

---

### 2.4 ROI Test (`/[locale]/roi-test/page.tsx`)

**Status:** ✅ FINNS — men NOINDEX

**Nuvarande:**
```typescript
export const metadata = {
  title: 'ROI-kalkylator — Test',
  robots: { index: false, follow: false },
}
```

**✅ RÄTT:** `noindex` är korrekt (detta är ett verktyg, inte content-sida)

**ÅTGÄRD:** Ingen — korrekt konfigurerad

---

### 2.5 Case Studies (`/[locale]/kundcase/[slug]/page.tsx`)

**Status:** ❌ OKÄNT — måste granskas

**SIDOR SOM FINNS:**
- `/sv/kundcase/telestore`
- `/sv/kundcase/nordicrank`
- `/sv/kundcase/sannegarden`
- `/sv/kundcase/mbflytt`
- `/sv/kundcase/trainwithalbert`

**ÅTGÄRD:** Granska varje sida manuellt

---

### 2.6 Policies

**Status:** ❌ OKÄNT — måste granskas

**SIDOR SOM FINNS:**
- `/sv/integritetspolicy`
- `/sv/villkor`
- `/en/privacy-policy`
- `/en/terms`

**ÅTGÄRD:** Granska varje sida manuellt

---

## 3. JSON-LD / STRUKTURERAD DATA

### 3.1 Nuvarande implementation

**Status:** 🟡 DELVIS

**Hittat:**
- ✅ `BreadcrumbList` finns i `om-oss/page.tsx` (inline)
- ✅ Ingen separat JsonLd-komponent

**❌ SAKNAS:**
- Organization schema (ska finnas på ALLA sidor)
- WebSite schema (hemsida)
- Person schema (team-medlemmar)
- LocalBusiness schema (kontakt)
- Article schema (case studies)
- FAQPage schema (FAQ-sektioner)

**ÅTGÄRD:**
1. Skapa `src/components/JsonLd.tsx` wrapper-komponent
2. Lägg till Organization på ALLA sidor
3. Lägg till WebSite på hemsidan
4. Lägg till Person för team-medlemmar (om-oss)
5. Lägg till FAQPage för FAQ-sektioner

---

## 4. GEO — AI-SEARCH OPTIMERING

### 4.1 llms.txt

**Status:** ❌ SAKNAS HELT

**ÅTGÄRD:** Skapa `src/app/llms.txt/route.ts`

---

### 4.2 AI-crawlers i robots.txt

**Status:** ❌ SAKNAS

**Nuvarande robots.ts har INTE:**
- GPTBot (OpenAI training)
- OAI-SearchBot (ChatGPT search)
- ClaudeBot (Anthropic)
- PerplexityBot
- Google-Extended (Gemini)
- Applebot-Extended (Apple Intelligence)

**ÅTGÄRD:** Uppdatera robots.ts med AI-bots

---

### 4.3 Inverted Pyramid Content

**Status:** ❌ OKÄNT — måste granskas manuellt

**ÅTGÄRD:** Granska varje sida:
- Kommer svaret i första meningen?
- Finns bullets/tabeller?
- Finns FAQ-sektioner?

---

## 5. SÄKERHETSHEADERS

**Status:** ❌ OKÄNT

**next.config.ts finns men har INGA headers:**

```typescript
const nextConfig = {
  allowedDevOrigins: ['filip.tail607c86.ts.net', '100.84.47.62'],
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
    ],
  },
}
```

**❌ SAKNAS:**
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Content-Security-Policy

**ÅTGÄRD:** Lägg till `async headers()` i next.config.ts

---

## 6. CORE WEB VITALS

**Status:** ❌ OKÄNT — måste testas

**ÅTGÄRD:**
1. Kör PageSpeed Insights på:
   - https://eteya.ai
   - https://eteya.ai/sv/om-oss
   - https://eteya.ai/sv/kontakt
2. Dokumentera LCP, INP, CLS
3. Åtgärda om något är rött

---

## 7. PRIORITERAD ÅTGÄRDSLISTA

### PRIORITY 1 — HÖG IMPACT (Gör först)

1. **Uppdatera robots.ts** med AI-bots (30 min)
2. **Uppdatera sitemap.ts** med alla sidor (30 min)
3. **Lägg till metadata på hemsidan** (30 min)
4. **Skapa JsonLd-komponent** + Organization på alla sidor (1h)
5. **Lägg till säkerhetsheaders** i next.config.ts (30 min)

**Totalt:** ~3 timmar

### PRIORITY 2 — MEDIUM IMPACT

6. **Skapa manifest.ts** (15 min)
7. **Lägg till Twitter card + OG-bilder** på alla sidor (1h)
8. **Skapa llms.txt** (30 min)
9. **Lägg till WebSite schema** på hemsidan (15 min)
10. **Lägg till Person schema** på om-oss (30 min)

**Totalt:** ~2.5 timmar

### PRIORITY 3 — VERIFIERING

11. **Granska case-study sidor** (1h)
12. **Granska policy-sidor** (30 min)
13. **Kör PageSpeed Insights** (30 min)
14. **Validera JSON-LD** på validator.schema.org (30 min)
15. **Testa AI-citation** i ChatGPT/Perplexity (15 min)

**Totalt:** ~3 timmar

---

## 8. NÄSTA STEG

**För att köra vidare — välj en approach:**

**A:** Köra **Priority 1** nu (3 timmar) — högsta impact
**B:** Köra **allt** i en session (8-10 timmar)
**C:** Köra **fas för fas** — börja med robots.ts, pausa efter varje

---

## 9. FILÖVERSIKT — VAD SOM KOMMER ÄNDRAS

```
src/app/
├── robots.ts ✏️ (uppdateras)
├── sitemap.ts ✏️ (uppdateras)
├── manifest.ts ✨ (ny)
├── llms.txt/
│   └── route.ts ✨ (ny)
├── [locale]/
│   ├── page.tsx ✏️ (metadata)
│   ├── kundcase/
│   │   └── [slug]/page.tsx ✏️ (metadata + JSON-LD)
│   └── ...
src/components/
└── JsonLd.tsx ✨ (ny)
next.config.ts ✏️ (headers)
```

**✏️ = Uppdateras**
**✨ = Ny fil**

---

**Dokumentation uppdaterad:** 2026-04-15 20:55 UTC
**Nästa fas:** Väntar på beslut från Filip
