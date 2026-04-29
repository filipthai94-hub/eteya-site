import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog/posts'

/**
 * llms.txt — AIO/agent-readable site index per llmstxt.org-standard.
 * Per web-foundation v4.0 §8.1: emerging standard 2025-2026 för LLM-discovery.
 *
 * Automatiskt genererad blog-sektion via getAllPosts().
 * För längre version med full content, se /llms-full.txt
 */
export async function GET() {
  const [svPosts, enPosts] = await Promise.all([
    getAllPosts('sv'),
    getAllPosts('en'),
  ])

  const blogSvLines = svPosts.length > 0
    ? svPosts
        .map((p) => `- [${p.title}](https://eteya.ai/sv/blogg/${p.slug}): ${p.description}`)
        .join('\n')
    : '_Inga artiklar publicerade än._'

  const blogEnLines = enPosts.length > 0
    ? enPosts
        .map((p) => `- [${p.title}](https://eteya.ai/en/blog/${p.slug}): ${p.description}`)
        .join('\n')
    : '_No articles published yet._'

  const content = `# Eteya

> Eteya är AI-konsulter som bygger automationer som faktiskt levererar resultat. Vi startade bolaget i november 2024 för att bevisa att AI inte bara låter bra på möten.

## Om oss
- [Om Eteya](https://eteya.ai/sv/om-oss): Teamet, vår story, varför vi startade
- [Filip Thai](https://eteya.ai/sv/om-oss/filip): Grundare & VD, AI-konsult
- [Agit Akalp](https://eteya.ai/sv/om-oss/agit): Partner, AI-konsult
- [Kontakt](https://eteya.ai/sv/kontakt): Kontaktuppgifter

## Tjänster
- [AI Automation](https://eteya.ai/sv): AI-agenter, processautomation, custom AI-lösningar
- [AI-besparingskalkylator](https://eteya.ai/sv/ai-besparing): Räkna ut din potentiella besparing

## Kundcase
- [Telestore](https://eteya.ai/sv/kundcase/telestore): E-handel — 56 automationer sparar 390 000 kr/år
- [NordicRank](https://eteya.ai/sv/kundcase/nordicrank): Operations — 18 AI-automationer sparar 13.4h/vecka
- [Sannegården Pizzeria](https://eteya.ai/sv/kundcase/sannegarden): Restaurang — AI-telefonist
- [SKG Stockholm](https://eteya.ai/sv/kundcase/skg-stockholm): Grossist — AI-assistent för VD sparar 12h/vecka
- [TrainWithAlbert](https://eteya.ai/sv/kundcase/trainwithalbert): Fitness — 45% återbokning + 3x bokningar

## Blogg / Insikter (svenska)
- [Bloggöversikt](https://eteya.ai/sv/blogg): Alla artiklar
- [RSS-feed](https://eteya.ai/rss.xml): Prenumerera på nya artiklar

${blogSvLines}

## Blog / Insights (English)
- [Blog overview](https://eteya.ai/en/blog): All articles

${blogEnLines}

## Policyer / Policies
- [Integritetspolicy](https://eteya.ai/sv/privacy-policy)
- [Användarvillkor](https://eteya.ai/sv/terms)
- [Privacy policy](https://eteya.ai/en/privacy-policy)
- [Terms](https://eteya.ai/en/terms)

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
