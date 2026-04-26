import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# Eteya

> Eteya är AI-konsulter som bygger automationer som faktiskt levererar resultat. Vi startade bolaget i november 2024 för att bevisa att AI inte bara låter bra på möten.

## Om oss
- [Om Eteya](https://eteya.ai/sv/om-oss): Teamet, vår story, varför vi startade
- [Kontakt](https://eteya.ai/sv/kontakt): Kontaktuppgifter

## Tjänster
- [AI Automation](https://eteya.ai/sv): AI-agenter, processautomation, custom AI-lösningar

## Case Studies
- [Telestore](https://eteya.ai/sv/kundcase/telestore): E-handel — automatiserad orderhantering
- [Nordicrank](https://eteya.ai/sv/kundcase/nordicrank): Operations & Automation — Excel-automation och orderhantering
- [Sannegården](https://eteya.ai/sv/kundcase/sannegarden): Restaurang — AI-beställningar
- [SKG Stockholm](https://eteya.ai/sv/kundcase/skg-stockholm): Grossist & Distribution — personlig AI-assistent för VD
- [TrainWithAlbert](https://eteya.ai/sv/kundcase/trainwithalbert): Fitness — AI-personal trainer

## Policyer
- [Integritetspolicy](https://eteya.ai/sv/integritetspolicy)
- [Användarvillkor](https://eteya.ai/sv/villkor)

## Kontakt
- **E-post:** kontakt@eteya.ai
- **LinkedIn:** https://www.linkedin.com/company/eteya-consulting-ab/
- **Instagram:** https://www.instagram.com/eteyaconsultingab/
- **Facebook:** https://www.facebook.com/profile.php?id=61573471850082
- **X:** https://x.com/EteyaAI

## Företagsinformation
- **Bolagsnamn:** Eteya Consulting AB
- **Organisationsnummer:** SE559552739001
- **Adress:** Solhagsvägen 26A, 691 52 Karlskoga, Sverige
- **Grundat:** November 2024
- **Grundare:** Filip Thai (CEO & Founder)
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
