import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# Eteya AI — Fullständig Innehåll

## Hemsida

**Titel:** Eteya AI — AI som driver ditt företag

**Tagline:** Mindre manuellt. Mer tillväxt.

**Beskrivning:** Vi bygger AI-automation som faktiskt levererar resultat — inte bara låter bra på möten.

### Vårt Erbjudande

**AI Automation:**
- AI-agenter som hanterar kundservice, order och support
- Processautomation som eliminerar manuellt arbete
- Custom AI-lösningar skräddarsydda för er verksamhet

**Resultat vi levererar:**
- 70-90% mindre manuellt arbete
- 24/7 drift utan extra personal
- Skalbarhet utan att anställa

### Case Studies

**Telestore (E-handel):**
- Automatiserad orderhantering, kundkommunikation och lagerflöden
- Resultat: 85% mindre manuellt arbete

**Nordicrank (SEO-tech):**
- AI-driven rankningsoptimering
- Resultat: 3x snabbare content-produktion

**Sannegården (Restaurang):**
- AI-telefonist för beställningar
- Resultat: 24/7 bemanning utan extra kostnad

**SKG Stockholm (Storköksgrossist):**
- Personlig AI-assistent för VD:n — mail, kalender, uppföljningar
- Resultat: 12 timmar/vecka befriade, 85% av mail hanterade automatiskt

**TrainWithAlbert (Fitness):**
- AI-personal trainer och medlemskommunikation
- Resultat: 3x fler medlemmar hanterade per anställd

### Vanliga Frågor

**Hur lång tid tar det att implementera en AI-lösning?**
De flesta projekt går live inom 2–6 veckor. Vi börjar med en kort kartläggning för att förstå era behov och bygger sedan iterativt. Ni ser framsteg redan efter första veckan.

**Behöver vi teknisk kunskap internt?**
Nej. Vi hanterar hela den tekniska implementationen. Det enda vi behöver från er är kunskap om er verksamhet och tillgång till de system som ska integreras.

**Vad kostar en AI-agent eller automation?**
Varje projekt är unikt och priset beror på komplexitet och omfattning. Vi ger alltid en fast offert efter kartläggningen så att ni vet exakt vad det kostar innan vi börjar.

**Hur hanterar ni vår data och GDPR?**
Vi följer GDPR fullt ut. All data behandlas inom EU, vi signerar DPA vid behov och bygger med privacy by design. Era data används aldrig för att träna AI-modeller.

**Vilka verktyg och plattformar jobbar ni med?**
Vi är verktygsoberoende och väljer det som passar bäst. Vanliga verktyg inkluderar OpenAI, Anthropic, Make, n8n samt custom-byggen med Python, TypeScript och moderna AI-ramverk.

**Hur vet vi om AI passar vår verksamhet?**
Om ni har repetitiva processer, hanterar stora volymer data eller vill skala utan att anställa finns det troligen en AI-lösning som sparar tid och pengar. Boka ett kostnadsfritt samtal så gör vi en snabb bedömning.

**Erbjuder ni support efter leverans?**
Ja. Varje projekt inkluderar dokumentation och överlämning. Vi erbjuder även löpande support, optimering och vidareutveckling så att lösningen växer med er verksamhet.

---

## Om Oss

**Rubrik:** Människorna bakom Eteya

### Filip Thai — Grundare och CEO

Startade Eteya för att bevisa att AI faktiskt levererar, inte bara låter bra på möten.

### Agit Akalp — Medgrundare

Grundare av Telestore. Efter över 10 år som entreprenör vet han vad som funkar i verkligheten och vad som bara är Powerpoint.

---

## Kontakt

**Rubrik:** Kontakt

**E-post:** kontakt@eteya.ai

**LinkedIn:** https://www.linkedin.com/company/eteya-consulting-ab/

**Instagram:** https://www.instagram.com/eteyaconsultingab/

**Facebook:** https://www.facebook.com/profile.php?id=61573471850082

**X:** https://x.com/EteyaAI

---

## Integritetspolicy

Vi följer GDPR fullt ut. All data behandlas inom EU och era data används aldrig för att träna AI-modeller.

---

## Användarvillkor

Alla projekt inkluderar fast offert, tydlig leveransplan och dokumentation vid överlämning.

---

## Företagsinformation

- **Bolagsnamn:** Eteya Consulting AB
- **Adress:** Solhagsvägen 26A, 691 52 Karlskoga, Sverige
- **E-post:** kontakt@eteya.ai
- **Grundat:** November 2024
- **Grundare:** Filip Thai (CEO), Agit Akalp (Co-founder)
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
