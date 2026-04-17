import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# Eteya AI

> Eteya är AI-konsulter som bygger automationer som faktiskt levererar resultat. Vi startade bolaget i november 2024 för att bevisa att AI inte bara låter bra på möten.

## Om oss
- [Om Eteya](https://eteya.ai/sv/om-oss): Teamet, vår story, varför vi startade
- [Kontakt](https://eteya.ai/sv/kontakt): Kontaktuppgifter

## Tjänster
- [AI Automation](https://eteya.ai/sv): AI-agenter, processautomation, custom AI-lösningar

## Case Studies
- [Telestore](https://eteya.ai/sv/kundcase/telestore): E-handel — automatiserad orderhantering
- [Nordicrank](https://eteya.ai/sv/kundcase/nordicrank): SEO-tech — AI-driven rankningsoptimering
- [Sannegården](https://eteya.ai/sv/kundcase/sannegarden): Restaurang — AI-beställningar
- [MB Flytt](https://eteya.ai/sv/kundcase/mbflytt): Flyttfirma — automatiserad bokning
- [TrainWithAlbert](https://eteya.ai/sv/kundcase/trainwithalbert): Fitness — AI-personal trainer

## Policyer
- [Integritetspolicy](https://eteya.ai/sv/integritetspolicy)
- [Användarvillkor](https://eteya.ai/sv/villkor)

## Kontakt
- **E-post:** kontakt@eteya.ai
- **LinkedIn:** https://www.linkedin.com/company/eteya
- **Twitter:** https://twitter.com/eteya

## Företagsinformation
- **Bolagsnamn:** Eteya Consulting AB
- **Organisationsnummer:** [Hitta på bolagsverket.se]
- **Adress:** Solhagsvägen 26A, 691 52 Karlskoga, Sverige
- **Grundat:** November 2024
- **Grundare:** Filip Thai (CEO), Agit Akalp (Co-founder)
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
