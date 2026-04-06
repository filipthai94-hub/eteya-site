# CASE STUDY TEMPLATE — Eteya AI Platform

## 📋 Struktur (enligt conversion optimization research)

```
1. HERO (Rubrik + tagline)
2. UTMANINGEN (4 problemkort)
3. LÖSNINGEN (4 punkter)
4. RESULTAT (3 stora siffror — bottom line up front!)
5. BESPARINGAR (detaljerad breakdown)
6. CITAT (social proof)
```

---

## 🎨 Design-specifikationer

### Hero-sektion
- **Höjd:** `80vh` (desktop), `50vh` (mobil)
- **Bakgrundsbild:** `1920×864px` (2.22:1 aspect ratio)
- **Bild-position:** `center bottom` (för dropp-effekter)
- **H1-storlek:** `clamp(3.5rem, 10vw, 9rem)`

### Alla sektioner
- **Padding:** `120px 62px` (desktop), `60px 24px` (mobil)
- **Mellanrum:** Enhetligt genom `.section` + `.inner` struktur
- **Rubriker:** `clamp(2.5rem, 6vw, 6.125rem)`, `font-weight: 500`

### Text-styling
- **H3 (kort-titlar):** `clamp(1rem, 1.2vw, 1.15rem)`, `color: #F5F5F5`
- **P (brödtext):** `clamp(0.85rem, 0.95vw, 0.95rem)`, `Geist font`, `color: rgba(255,255,255,0.5)`

---

## 📁 Filstruktur att skapa

```
projects/eteya/site/
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       └── kundcase/
│   │           └── [kundnamn]/
│   │               └── page.tsx              ← Kopiera från Telestore
│   ├── components/
│   │   └── pages/
│   │       ├── [Kundnamn]CaseStudy.tsx       ← Kopiera från Telestore
│   │       └── [Kundnamn]CaseStudy.module.css ← Kopiera från Telestore
│   └── messages/
│       ├── sv.json                           ← Lägg till nya translation keys
│       └── en.json                           ← Lägg till nya translation keys
└── public/
    └── images/
        └── hero-casestudy-[kundnamn]-bg.png  ← 1920×864px bakgrundsbild
```

---

## ✅ Checklista för ny case study

### 1. Förberedelser
- [ ] Skapa kundens namn som slug (t.ex. `passargad`, `55-nord`)
- [ ] Skapa bakgrundsbild i `1920×864px` (hero-sektion)
- [ ] Samla in data: problem, lösningar, resultat, besparingar, citat

### 2. Filskapande
- [ ] Kopiera `TelestoreCaseStudy.tsx` → `[Kundnamn]CaseStudy.tsx`
- [ ] Kopiera `TelestoreCaseStudy.module.css` → `[Kundnamn]CaseStudy.module.css`
- [ ] Kopiera `page.tsx` → ny kundmapp
- [ ] Uppdatera alla referenser till nya filnamn

### 3. Innehåll
- [ ] Ändra hero-rubrik och tagline
- [ ] Uppdatera 4 problemkort (UTMANINGEN)
- [ ] Uppdatera 4 lösningspunkter (LÖSNINGEN)
- [ ] Uppdatera 3 resultat-siffror (RESULTAT)
- [ ] Uppdatera 8 besparingskort (BESPARINGAR)
- [ ] Uppdatera citat med kundens namn/bild

### 4. Översättning (i18n)
- [ ] Lägg till svenska translation keys i `sv.json`
- [ ] Lägg till engelska translation keys i `en.json`
- [ ] Testa båda språken (`/sv/kundcase/[kund]` och `/en/case-studies/[kund]`)

### 5. SEO & Metadata
- [ ] Uppdatera `metadata.title` och `metadata.description`
- [ ] Lägg till canonical URL
- [ ] Uppdatera Open Graph image
- [ ] Lägg till schema.org structured data (CaseStudy)

### 6. Testing
- [ ] Desktop (1920×1080)
- [ ] Mobil (375×667 iPhone SE)
- [ ] Surfplatta (768×1024 iPad)
- [ ] Kontrollera laddningstid (< 2s)
- [ ] Validera bildstorlekar (< 500KB)

### 7. Deploy
- [ ] Commit: `feat: add [kundnamn] case study`
- [ ] Push till GitHub (`main` branch)
- [ ] Vercel auto-deployar till `https://site-six-mu-70.vercel.app`
- [ ] Verifiera live URL: `https://site-six-mu-70.vercel.app/sv/kundcase/[kundnamn]`
- [ ] Uppdatera MEMORY.md

---

## 🚀 Deploy till Vercel (produktion)

### Steg 1: Lokalt bygg-test
```bash
cd projects/eteya/site
npm run build
npm run start
# Testa lokalt på localhost:3000
```

### Steg 2: Git commit & push
```bash
git add .
git commit -m "feat: add [kundnamn] case study"
git push origin main
```

### Steg 3: Vercel deploy
- Gå till: https://vercel.com/dashboard
- Välj projekt: `eteya-platform`
- Auto-deploy sker automatiskt vid push
- Vänta tills status är "Ready"

### Steg 4: Verifiera production
- Testa live-URL: `https://dashboard-ecru-mu-37.vercel.app/sv/kundcase/[kundnamn]`
- Kontrollera mobilvy
- Kontrollera SEO (meta tags, OG image)

---

## 📊 Exempel: Telestore Case Study

**Slug:** `telestore`
**URL:** `/sv/kundcase/telestore`

**Hero:**
- Rubrik: "Telestore"
- Tagline: "Från manuellt kaos till 390 000 kr/år i besparing"
- Bild: `hero-casestudy-telestore-bg.png` (grön slime)

**Utmaningen (4 kort):**
1. Manuell listning (7.5 min/telefon)
2. Excel-kaos (2.5h/vecka)
3. Missade försäljningar
4. Ingen skalbarhet

**Lösningen (4 punkter):**
1. Listning & IMEI
2. Order & frakt
3. Kundservice & AI
4. Skalbarhet

**Resultat (3 siffror):**
- 390 000 kr/år
- 1 350 timmar/år
- 56 automationer

**Besparingar (8 kort):**
1. Telefon → sajt/Blocket: 9.4 h/vecka
2. PostNord fraktsedel: 2.8 h/vecka
3. Orderhantering: 4.5 h/vecka
4. AI prisförslag-mail: 3.1 h/vecka
5. Registrering: 1.3 h/vecka
6. Skrive-avtal: 1.4 h/vecka
7. Kundservice-mail: 1.9 h/vecka
8. Excel-felsökning: 1.3 h/vecka

**Citat:**
- Brindar Akalp, VD Telestore
- Bild: `brindar-akalp.jpg`

---

## 🎯 Nästa case studies att skapa

1. **Passargad** — Insamlingssystem
2. **55 Nord** — Second hand automation
3. **[Nästa kund]** — ???

---

*Skapad: 2026-04-06*
*Senast uppdaterad: 2026-04-06*
