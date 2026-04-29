# Blog Authoring — Eteya

Komplett guide för att skapa en blog-artikel korrekt, från frontmatter till
deploy. Den här filen är "source of truth" för allt blog-arbete.

> **Alla nya artiklar SKA följa den här guiden.** Hoppa inte över checklist-stegen
> nedan — varje steg adresserar en bug vi tidigare hittat (emoji-läckage, fel
> Schema.org, brutet hreflang, missade CTA, fel image-aspect, etc.).

---

## Quick start

```bash
# 1. Kopiera template
cp content/blog/_TEMPLATE.mdx content/blog/sv/min-nya-artikel.mdx

# 2. Skriv artikeln (se "Frontmatter spec" + "Content rules" nedan)

# 3. Skapa hero-bild (se "Image guide" — använd AI-prompt-mall)
# Spara som /public/images/blog/min-nya-artikel-hero.webp

# 4. Verifiera lokalt
pnpm build
pnpm start
# → http://localhost:3000/sv/blogg/min-nya-artikel

# 5. Pusha till feature/blog för Vercel preview
git checkout feature/blog
git add . && git commit && git push
```

---

## Frontmatter spec

Varje `.mdx` börjar med YAML-frontmatter mellan `---`-rader:

```yaml
---
title: "Artikelns titel — max ~110 tecken"
description: "Lead/standfirst text. Visas under titeln + i meta description + Schema.org. ~150-160 tecken för Google SERP."
publishedDate: "2026-04-27"
modifiedDate: "2026-04-27"
author: "filip"
tags: ["AI-agenter", "Automation"]
heroImage: "/images/blog/artikel-slug-hero.webp"
heroImageAlt: "Beskrivande alt-text för hero-bilden — ej decorativ"
featured: false
showCta: false
relatedSlug: ""
---
```

### Required fält

| Fält | Typ | Beskrivning |
|---|---|---|
| `title` | string | Visas som h1 + Schema headline + meta title. **Max ~110 tecken** (Google trunkerar). |
| `description` | string | Lead-paragraph + meta description + OG. **150-160 tecken** för optimal SERP-snippet. |
| `publishedDate` | ISO-date | `"YYYY-MM-DD"` — sätts till publiceringsdagen. Konverteras till ISO 8601 m. tidszon i schema. |
| `author` | `"filip"` \| `"agit"` | Måste vara exakt en av dessa två. Lägg till nya författare i `src/lib/blog/format.ts` + `BlogAuthor` typ. |
| `tags` | string[] | 2-5 tags. Använd befintliga taggar när möjligt — se `getAllTags()`. Slugifieras automatiskt för URL. |
| `heroImage` | path | Path till `/public/images/blog/[slug]-hero.webp`. Måste finnas innan deploy. |
| `heroImageAlt` | string | Beskrivande alt-text. **Ej "Hero image"** — beskriv vad som faktiskt visas. |

### Optional fält

| Fält | Default | När sätta? |
|---|---|---|
| `modifiedDate` | = publishedDate | Sätt när artikeln uppdaterats efter publicering. ISO-date `YYYY-MM-DD`. |
| `featured` | `false` | Sätt **`true` på max EN artikel åt gången per locale** — visas som "SENASTE" hero på listing. |
| `showCta` | `false` | Sätt `true` på case-studies + how-to-guider där "boka strategimöte" är ett naturligt nästa steg. **Skippa på opinion/jämförelse/news.** |
| `relatedSlug` | — | Slug för andra-språkets version (för hreflang). T.ex. SV-artikelns frontmatter har `relatedSlug: "ai-receptionist-restaurants"` och EN har `relatedSlug: "ai-telefonist-restaurang"`. |
| `slug` | filename | Override URL-slug om filnamnet inte ska matcha URL. Sällan behövd. |

### Frontmatter-cheatsheet per artikeltyp

| Artikeltyp | featured | showCta | Typiskt exempel |
|---|---|---|---|
| **Case-study** (kundresultat) | maybe | **true** | "AI-telefonist för restauranger — så funkar det" |
| **How-to / guide** (instruktioner) | maybe | **true** | "AI-assistent för VD: så frigör du 12 timmar" |
| **Listicle** (5 saker / X tips) | seldom | **true** | "5 process-automationer som sparar tid" |
| **Jämförelse / opinion** | seldom | **false** | "Make vs n8n — vilket välja?" |
| **News / annonsering** | maybe | **false** | "Eteya har lanserat ny tjänst X" |
| **Trend / industry** | seldom | **false** | "AI-agenter 2026 — vart är vi på väg?" |

### KRITISK regel — `featured: true` är "exclusive"

**Endast EN artikel åt gången får ha `featured: true` per locale.**
Den artikeln visas som "SENASTE" hero-block på listing-sidan.

Eftersom `getFeaturedPost()` i `src/lib/blog/posts.ts` hittar **första
artikeln med `featured: true`** (sorterat newest-first), så låser sig
SENASTE-slotten till en gammal artikel om man glömmer unsetta den.

**När du skapar en ny artikel som ska bli SENASTE:**
1. Sätt `featured: true` på den nya artikeln
2. **OBLIGATORISKT**: Hitta tidigare `featured: true`-artikel i samma
   locale och **sätt `featured: false`** på den
3. Verifiera att exakt en artikel per locale har `featured: true`:
   ```bash
   grep -c "featured: true" content/blog/sv/*.mdx | grep ":1$" | wc -l  # = 1
   grep -c "featured: true" content/blog/en/*.mdx | grep ":1$" | wc -l  # = 0 eller 1
   ```

Skill:en `create-eteya-blog-article` ska automatiskt göra steg 2 vid
artikel-skapande.

---

## Content rules

### Hårda regler (bryt inte)

1. **ALDRIG emojis i artikeltext.** Inga ✓, ✗, ✅, ❌, ✦, 🚀, 💡, 📊, 🎯, ⭐, ⚡, 🔥, etc. i headings, lists, callouts, eller löptext. Bryter editorial-känslan, ser oproffsigt ut. Använd typografi (kursiv, fet, blockquote, mono code) för betoning.
2. **Inga decorativa SVG-icons i body.** SVG-arrows finns redan i UI-chrome (CTA, back-link, LinkedIn). Inga andra icons i body-text.
3. **H1 finns BARA i frontmatter.** Använd `## h2` och `### h3` i body. Aldrig `# h1` i body — bryter SEO/a11y.
4. **Inga "click here" / "read more" / "läs mer"-länkar.** Beskrivande länktext: `[så funkar det i praktiken](url)` istället för `[läs mer](url)`.

### Mjuka regler (best practice)

5. **Lead-paragraph först.** Första `<p>` efter frontmatter blir automatiskt större (lead/standfirst). Skriv den så att den fungerar som mini-summary.
6. **Bullets/numbered lists för konkreta uppräkningar** — siffror, steg, exempel. Inte för flytande prosa.
7. **Blockquote (`> text`)** för pull-quotes från kunder, citat eller framhållna nyckelmeningar. Inte överanvänt — max 1-2 per artikel.
8. **Inline `code` för tekniska termer** (klassnamn, kommandon, filnamn). Inte för betoning.
9. **Bold för KORT viktigt nyckelord** ("**90% snabbare**"). Inte hela meningar.
10. **Ton**: konkret, mätbar, svenskspråkig direkt. Eteyas röst = "konsult som har gjort det och kan visa siffrorna".

### Tillåtna typografiska Unicode-tecken

Dessa är OK eftersom de är typografiska operatorer, INTE emojis/dekoration:

| Tecken | Användning |
|---|---|
| `—` (tankstreck) | **STRIKT**: bara klassiskt korrekt svensk grammatik. Se "Tankstreck-regler" nedan. |
| `→` (right arrow) | Workflow-beskrivningar: "order kommer in → valideras → läggs i ERP" |
| `×` (multiplication) | Beräkningar: "30 × 280 kr × 50 veckor" |
| `·` (middle dot) | Listor inom rad: "AI · Automation · Strategy" |
| `●` (bullet) | UI-meta separator (auto-tillagd, skriv inte i body) |

### Tankstreck-regler (KRITISK — överanvändning är typisk AI-tell)

**Tankstreck (—) får ENDAST användas där svensk grammatik faktiskt kräver det.**
Överanvändning är ett klassiskt tecken på AI-genererad text och bryter
trovärdigheten direkt.

**Korrekt svensk användning (sparsamt):**

| Användning | Exempel |
|---|---|
| Kontrasterande paus för betoning | "Den största risken är inte tekniken — det är att försöka för mycket" |
| Avslutande paus efter "X — inte Y" | "Vi väljer en process att börja med — inte tio" |
| Parentetisk inskott (där komma blir otydligt) | "Han kom — som vanligt — försenad" |

**INKORREKT användning (anglicism — SKRIV ALDRIG SÅ):**

| Felaktigt mönster | Skriv så här istället |
|---|---|
| "**Term** — definition" | "**Term:** definition" eller bryt till ny mening |
| "...sentence — extra info" | "...sentence. Extra info." eller använd komma |
| "List intro — items" | "List intro: items" |
| "Action — consequence" | "Action. Consequence." |
| "Trade-off — tre saker" | "Trade-off: tre saker" |

**Tumregel:** Om du kan ersätta `—` med `:`, `.` eller `,` och meningen
fortfarande fungerar — gör det. Tankstreck ska sparas för verklig
betoning, inte som universell connector.

**Max 2-3 tankstreck per artikel** (1500-3500 ord). Mer än så är ett
varningstecken — gå tillbaka och konvertera de svagaste till `:`/`,`/`.`.

### Sammanfattning vid artikelslut — SKIP

**Skriv INTE en `## Sammanfattning`-sektion i slutet av artiklar.**

Tidigare iteration trodde detta optimerade för AI Overview-extraction.
Verkligheten: en slutsammanfattning som upprepar artikelns innehåll ger
inget nytt värde till läsaren och dödar läsvärdet. Det blir filler för
filler-skull.

Avsluta artiklarna naturligt — sista sektionen ska "klinga ut" mot CTA
eller mot FAQ:n om sådan finns. Om en artikel verkligen behöver en
forward-looking observation, lägg in den **inom** sista sektionens prosa,
inte som egen "Sammanfattning"-rubrik.

**Anti-pattern (gör inte):**
- `## Sammanfattning` med recap av allt artikeln redan sagt
- "Att ta med sig"-bullets som upprepar sektionernas innehåll
- "Slutsats"-rubrik som inte säger något nytt

---

## Image guide

Hero-bilder genereras genom en **två-stegs-process**: ChatGPT/DALL-E
genererar en bas-bild (bara visuellt subject, ingen text), sedan
applicerar `scripts/generate-hero.py` Eteyas text-overlay programmatiskt
(title + kicker + ETEYA-brand). Detta garanterar konsistent typografi
och brand-placering över alla artiklar — bara subjektet varierar.

### Specs (final hero, efter overlay)

| Attribut | Värde |
|---|---|
| **Format** | WebP (skriptet hanterar konvertering) |
| **Aspect ratio** | 16:9 |
| **Storlek** | 1600×900 (skriptet resizear) |
| **Filstorlek** | < 250KB (skriptet auto-justerar quality) |
| **Filnamn** | `[artikel-slug]-hero.webp` |
| **Path** | `/public/images/blog/` |
| **Alt-text** | Beskrivande, ej "Hero image" |

### House style — locked aesthetic

Allt UTOM subjektet är låst. Detta säkerställer ChainGPT-nivå
konsistens över hela bloggen:

| Locked (samma alltid) | Variabelt (per artikel) |
|---|---|
| 90% deep matte black + lime #C8FF00 accent | Subjektets **form** |
| 3D render Octane/C4D-look (NEVER photography) | Subjektets **arrangement** |
| Single dramatic light från upper-left | Vad subjektet **antyder** |
| Glossy crystal/obsidian-material | (allt annat låst via STYLE LOCK-block) |
| Volumetric haze + suspended particles | |
| Right-weighted composition (text på vänster) | |
| 16:9 aspect | |

### Steg 1 — Generera bas-bild i ChatGPT

**STYLE LOCK** (kopieras IDENTISKT i varje prompt — inga ändringar):

```
A 3D rendered abstract digital artwork in the style of Octane Render
and Cinema 4D. This is NOT a photograph and must not look photographic.

Materials and surfaces: dark glossy obsidian-like cut crystal with
hyperrealistic faceted surfaces, subtle soft reflections, premium
refined finish like polished volcanic glass.

Color palette: 90% deep matte black background with subtle dark grey
shadows. The ONLY accent color is neon lime green at exactly hex
#C8FF00, used sparingly only on highlight edges, as subtle internal
glow within the crystals, and as single thin light streaks in the
atmosphere. The lime green must never dominate or wash the image.

Lighting: A single strong directional light source from the upper-left,
creating dramatic chiaroscuro shadows. Volumetric atmospheric haze
fills the dark space, with suspended dust particles visible drifting
through the light beam.

Composition: Right-weighted composition — leave the LEFT side darker
and more open for text overlay placement. Subjects positioned on
right half of frame, with deep negative space on the left.
Shallow depth of field. Cinematic atmospheric depth.

Mood: Confident, premium, contemplative, restrained. Editorial
photography quality at the level of high-end product photography.

Aspect ratio: 16:9 widescreen, suitable for blog hero image.

DO NOT INCLUDE: people, faces, hands, body parts, offices, desks,
laptops, computers, screens, phones, realistic photography, photographic
subjects, multiple competing colors, bright backgrounds, warm tones,
blue accents, purple accents, red accents, text of any kind,
typography, watermarks, logos, neural networks, robots, brains,
holograms, glowing networks, AI clichés, particle clouds, energy fields.

—

SUBJECT: [tänk om artikelns tema enligt arketypen nedan]
```

### Subject-thinking — 6 arketyper

**Stilen är låst, men subjektet måste alltid tänka om artikelns tema.**
Identifiera vilken av dessa 6 arketyper artikeln tillhör, och anpassa
SUBJECT-blocket därefter:

#### 1. Single focus / portrait — en sak gör en sak
*(Executive assistant, single-purpose tool, individual subject)*

```
SUBJECT: A single tall vertical crystalline form rising in dark space,
made of dark glossy obsidian with multiple faceted surfaces. A subtle
lime green light pulses from within its core, radiating outward through
its facets. The crystal is positioned slightly right of center, with
deep negative space on the left side of the frame.
```

**Exempel-artikel**: "AI-assistent för VD: så frigör du 12 timmar i veckan"

#### 2. System / network / workflow — flera delar fungerar tillsammans
*(Multiple workflows, connected processes, orchestration)*

```
SUBJECT: Multiple geometric crystalline forms suspended in dark space,
positioned on the right half of the frame, connected to each other
through thin lime green light strands that flow between them. Each
crystal has dark glossy obsidian-like faceted surfaces. The system
appears organized and intentional, suggesting connected components
working together.
```

**Exempel-artikel**: "5 process-automationer som sparar tid omedelbart"

#### 3. Comparison / vs — två val ställs mot varandra
*(Versus articles, choices, alternatives)*

```
SUBJECT: Two distinct crystalline forms suspended side-by-side in dark
space on the right half of the frame, positioned to imply comparison
or choice. The LEFT crystal is angular and rigidly faceted with sharp
geometric edges. The RIGHT crystal is smoother and more rounded with
flowing curves. Both made of dark glossy obsidian-like material, lit
by the same single light source from upper-left, casting parallel
shadows. Subtle lime green internal glow visible within both.
```

**Exempel-artikel**: "OpenAI vs Anthropic 2026 — vilken passar svenska SMB?"

#### 4. Trend / emerging / future — något bildas eller utvecklas
*(Where are we going, evolution, emergence)*

```
SUBJECT: Multiple smaller geometric crystalline forms emerging from
suspended darkness on the right half of the frame, growing and
connecting to each other through subtle thin lime green light strands.
Some are fully crystallized with sharp angular faceted surfaces, while
others are still in mid-formation with half-faceted edges. The
composition has a slight forward-leaning direction, suggesting motion
and emergence. Captured at a specific moment in their evolution,
frozen mid-becoming.
```

**Exempel-artikel**: "AI-agenter 2026 — vart är vi på väg?"

#### 5. Transformation / change — något övergår från en form till en annan
*(Before → after, conversion, breakthrough)*

```
SUBJECT: A liquid metallic black flow positioned on the right half of
the frame, transitioning into solid crystalline form mid-motion. The
left side of the form is still flowing mercury-like, while the right
side is fully crystallized into sharp dark glossy facets. Subtle lime
green light bleeds along the transition zone where liquid becomes
solid. Captured frozen mid-transformation.
```

**Exempel-artikel**: "AI-agent för e-handel: 56 automationer på 3 veckor"

#### 6. Communication / connection — utbyte mellan parter
*(Customer service, voice, conversation, signal)*

```
SUBJECT: A single tall crystalline form positioned on the right half
of the frame, with multiple internal lime green light pulses radiating
outward through its faceted surfaces in concentric ripples. Subtle
suspended particles in the atmosphere catch the radiating light,
suggesting communication waves emanating from one central source.
Dark obsidian material with hyperrealistic micro-textures.
```

**Exempel-artikel**: "AI-telefonist för restauranger — så funkar det i praktiken"

### Steg 2 — Spara bas-bild

1. Generera bilden i ChatGPT med STYLE LOCK + SUBJECT
2. Iterera om nödvändigt: *"More dramatic shadows"*, *"More subtle lime"*, *"Make crystals more angular"*
3. **Spara som `image.png` i `~/Downloads/`** (overskriv tidigare — det är OK)

### Steg 3 — Kör overlay-skriptet

```bash
python3 scripts/generate-hero.py \
    --base ~/Downloads/image.png \
    --slug [artikel-slug] \
    --title "[Hela artikel-titeln]" \
    --kicker "ARTIKEL · [ARKETYP-LABEL]"
```

**Kicker-konvention** (uppercase, mono):
- `ARTIKEL · TREND` — för trend/opinion
- `ARTIKEL · CASE-STUDIE` — för case-studies
- `ARTIKEL · GUIDE` — för how-to
- `ARTIKEL · JÄMFÖRELSE` — för comparison
- `ARTIKEL · LISTA` — för listicle
- `ARTIKEL · NYHET` — för news

Skriptet:
- Crop:ar till 16:9, resizear till 1600×900
- Lägger på translucent text-box vänster halva med 1px lime-border + subtle glow
- Mono kicker överst i boxen (JetBrains Mono)
- Title i Barlow Condensed weight 500 (Eteya signature)
- "ETEYA®" wordmark bottom-left
- Sparar som WebP < 250KB till `/public/images/blog/[slug]-hero.webp`

### Skriptet kräver (en gång)

- **Pillow** (Python image lib) — installerat via system Python
- **Fonts** — `scripts/fonts/BarlowCondensed-Medium.ttf` + `JetBrainsMono-Regular.ttf` (committed i repo)

### Stock-photo fallback (sista utväg)

Om AI-generation inte är möjligt — använd stock som BAS-bild men kör
fortfarande genom overlay-skriptet för konsistent text/brand. Specs:

- 16:9, ≥ 1600×900
- Helst dark/atmospheric (annars syns text-overlay dåligt)
- Inga människor/kontor (clashar med vår editorial DNA)
- Källa: Unsplash (CC0) eller licensierat
- **License-dokumentering**: Nämn källan i en kommentar i frontmatter:
  ```yaml
  # heroImage source: Unsplash @photographername (CC0)
  heroImage: "/images/blog/foo-hero.webp"
  ```
- **Post-process** ändå genom WebP-konvertering + crop till 16:9

---

## Workflow checklist (varje ny artikel)

### Pre-flight (innan första `git add`)

- [ ] Kopierat `_TEMPLATE.mdx` till `content/blog/sv/[slug].mdx`
- [ ] Slug är URL-friendly (lowercase, dashes, no special chars)
- [ ] Alla **required frontmatter-fält** är ifyllda
- [ ] `description` är 150-160 tecken (kolla i editor)
- [ ] `publishedDate` är dagens datum eller framtida
- [ ] `tags` är 2-5 stycken, använder befintliga när möjligt
- [ ] `author` är `"filip"` eller `"agit"`
- [ ] `featured`/`showCta`/`relatedSlug` är medvetet satta enligt cheatsheet
- [ ] Om `featured: true` — **gammal featured-artikel är unsetad** (max 1 per locale)

### Content

- [ ] Lead-paragraph (första `<p>`) fungerar som mini-summary
- [ ] H2/H3-hierarki är logisk (ingen H1, ingen hopp över H3 → H5)
- [ ] **Inga emojis eller decorativa icons** (kör `grep` om osäker)
- [ ] Länkar har beskrivande text, ej "click here"
- [ ] Konkreta siffror/case-data där relevant
- [ ] Avslutande paragraph leder naturligt till CTA (om `showCta: true`) eller stannar i innehållet

### Image

- [ ] **Bas-bild** genererad i ChatGPT med STYLE LOCK + arketyp-specifik SUBJECT
- [ ] Bas-bilden har **inga människor, ingen text, inget AI-cliché**
- [ ] Bas-bilden är **right-weighted** (subject höger, plats för overlay vänster)
- [ ] Bas-bild sparad som `~/Downloads/image.png`
- [ ] Kört `python3 scripts/generate-hero.py --base ~/Downloads/image.png --slug [slug] --title "..." --kicker "ARTIKEL · [LABEL]"`
- [ ] Slutfilen finns i `/public/images/blog/[slug]-hero.webp` (< 250KB)
- [ ] `heroImageAlt` i frontmatter är beskrivande (ej "Hero image")

### Hreflang twin (om både SV + EN finns)

- [ ] SV-artikelns `relatedSlug` = EN-artikelns slug
- [ ] EN-artikelns `relatedSlug` = SV-artikelns slug
- [ ] Båda artiklarna delar samma `heroImage` (eller olika om det är medvetet)

### Verifiera lokalt

- [ ] `pnpm build` (eller `next build`) kör clean (exit 0)
- [ ] `next dev` startad — öppna listing-URL och verifiera:
  - Artikeln syns i grid eller som SENASTE (om featured)
  - Hero-image renderar med text-overlay + ETEYA brand
  - CTA "NÄSTA STEG" syns OM `showCta: true`, inte annars
- [ ] Öppna artikelsidan — verifiera:
  - Rätt title, lead, datum, författare
  - Hero-bild laddar (no broken-image-icon)
  - Inga emoji-läckor i innehållet
- [ ] View-source — verifiera Schema.org Article JSON-LD finns med:
  - `"author": { "@type": "Person", "name": "..." }` (ej Org)
  - `"datePublished": "...T08:00:00+02:00"` (med tidszon)
- [ ] Om `featured: true` på den nya artikeln — verifiera att SENASTE
  visar den (gammal featured är unsetad)

### Deploy

- [ ] Pusha till `feature/blog` (eller egen branch)
- [ ] Vercel preview-deploy klar — granska länken
- [ ] Test live: sitemap.xml innehåller artikeln
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) visar Article utan errors
- [ ] Merge till `main` → live

---

## CTA-mall — `<BlogCTABlock>` (SPIKAT 2026-04-29 — research-based)

Reglerna nedan är **forskade från primära källor** (Nielsen Norman Group,
HubSpot, CXL, Unbounce, Backlinko, Crazy Egg) och är **source of truth**
för all inline mid-article CTA på Eteya-bloggen.

### Varför inline-CTA + footer-CTA?

~60-70% av läsare når aldrig footern (B2B long-form bounce-mönster).
Inline-CTA fångar dem vid peak-interest mid-artikel. Footer fångar
"fully convinced"-läsare som läst hela artikeln. **Olika user-states,
båda värda att fånga.** Båda öppnar samma kontakt-modal via
`useContactModal`-hook = identisk UX.

Differentiering:
- **Inline** = topic-bunden, subtilare card med tonad accent
- **Footer** = bred fångare, prominent cirkulär knapp
- Olika knapp-text ("Boka 30-min ROI-samtal" vs "Hör av dig")

### Den LÅSTA designmallen

```
┌─────────────────────────────────────────────┐
│ [KICKER]   FÖR 30+ SVENSKA SMB              │  ← mono uppercase, 11-12px,
│                                             │     lime-grön, letter-spaced
│                                             │     (auktoritets-data, INTE
│                                             │     generic "NÄSTA STEG")
│                                             │
│ [HEADLINE] Räkna på AI-ROI för din          │  ← Barlow display, 24-30px,
│            verksamhet                       │     statement (ej fråga),
│                                             │     5-7 ord, possessivt
│                                             │
│ [BODY]     30-minuters samtal där vi går    │  ← Geist body, 15-16px,
│            igenom era processer och visar   │     1-2 meningar, max 25 ord,
│            konkret var AI sparar tid och    │     EN konkretisering
│            pengar.                          │     (tid/leverabel/utfall)
│                                             │
│ ╔═══════════════════════════════════════╗   │
│ ║   BOKA 30-MIN ROI-SAMTAL              ║   │  ← ButtonStripe primary
│ ╚═══════════════════════════════════════╝   │     fullWidth size="lg",
│                                             │     4-stripe-fill animation
│                                             │     vid hover (samma som ROI)
│                                             │
│        Kostnadsfritt · Inga avtal           │  ← Barlow Condensed uppercase,
│           · Svar inom 24h                   │     center-aligned, muted
└─────────────────────────────────────────────┘
       ↑ linear-gradient bg #111→#0d, white-low border @ 8%,
         multi-layer shadow (4 lager djup), 16px radius
```

### REGEL 1 — Position och frekvens

- Lägg `<BlogCTABlock>` **efter ~50-60% scroll**, vid en logisk
  problem→lösning-pivot (NN/G + Webless A/B-data)
- **EN inline-CTA** i artiklar under 1500 ord
- **MAX två** i artiklar 2000+ ord (fler = diluering)
- Renderas automatiskt om `showCta: true` i frontmatter
- **MÅSTE ligga inuti `.blog-article-body-section`** (max-width 720px)
  i `[slug]/page.tsx` — annars flödar card:en till hela viewporten

### REGEL 2 — Visuell hierarki (matchar ROI-modal-DNA)

CTA-card använder **samma design-DNA som ROI-calculator-modalen** för
visuell konsekvens på sidan:

- **Bakgrund:** `linear-gradient(180deg, #111111 0%, #0d0d0d 100%)`
  (samma som `.ctaArea` i `ROICalculatorClient.module.css`)
- **Border:** `1px solid rgba(255, 255, 255, 0.08)` — white-low-opacity,
  INTE lime tinted (subtilare, matchar ROI-language)
- **Multi-layer shadow** för djup:
  ```
  0 1px 2px rgba(0,0,0,0.3),
  0 4px 8px rgba(0,0,0,0.25),
  0 16px 32px rgba(0,0,0,0.35),
  0 32px 64px rgba(0,0,0,0.4)
  ```
- **Border-radius:** 16px (matchar ROI)
- **Padding:** 32px mobile / 40px desktop (`2rem 1.75rem` → `2.5rem`)
- **Margin:** `3rem 0` mobile, `4rem 0` desktop (visuellt break från body)
- **align-items: stretch** för full-width button

### REGEL 3 — Headline (5-7 ord, statement, possessivt)

- **Statement, INTE fråga** ("Räkna på AI-ROI" — ej "Vill du räkna...?")
- **5-7 ord, max 8** (CTR sjunker dramatiskt över 8 ord — NN/G)
- **Possessivt pronomen** ("din verksamhet", "ditt företag") — ContentVerve
  A/B-test: "my" → +90% CTR
- **Speglar artikelns ämne** — generic headlines konverterar 161% sämre
  (Veeam case-study)

### REGEL 4 — Body (1-2 meningar, max 25 ord)

**SKA inkludera EN konkretisering:**
- Tidsåtgång ("30-minuters samtal")
- ELLER specifik leverabel ("ROI-rapport", "automation-skiss")
- ELLER vad som händer härnäst ("kartläggning av era processer")

**SKA INTE inkludera:**
- Generiska säljsignaler ("låt oss prata", "kontakta oss för mer info")
- Vagt språk ("vi kan hjälpa dig")
- Garantier ("100% nöjd-kund")
- Multiple meningar med flera olika erbjudanden

### REGEL 5 — Knapp (ButtonStripe primary fullWidth)

**Mallen:** "Boka 30-min ROI-samtal" (full-width inom card)

- **Komponent:** `<ButtonStripe variant="primary" size="lg" fullWidth>` —
  samma som ROI-calculator-modalens primary CTA
- **Animation:** 4 lime-stripes glider in från top/höger/vänster/botten vid
  hover, text byter från vit → svart, multi-layer shadow ger lift-effekt
- **Imperativ + specifik leverabel** (ej "Get Started", ej "Kontakta oss")
- **Ingen explicit höger-pil** — ButtonStripe har sin egen visuella
  signature istället (4-stripe fill)
- **Full-width inom card** (`fullWidth` prop) — fungerar som "the moment"
  i CTA-blocket, INTE en sub-text-länk

### REGEL 6 — Trust-rad (3 element max)

**Mallen:** "Kostnadsfritt · Inga avtal · Svar inom 24h"

- **3 element MAX**, prick-separator (·)
- **Specifika siffror** över vaga uttryck ("30+ kunder" > "många kunder")
- **Risk-reducerare** som sänker upplevd commitment ("kostnadsfritt",
  "inga avtal", "svar inom X tid")
- **Font:** Barlow Condensed uppercase, 0.75rem, letter-spacing 0.1em
  (matchar ROI-modal `.trustRow`)
- **Placeras direkt under knappen**, **center-aligned**, muted color
  (rgba 0.38)

### REGEL 7 — Per-artikel anpassning (3 variabler)

**Knapp-text + trust-rad förblir IDENTISK över alla artiklar** för
konsekvens. Bara dessa 3 ändras per artikel:

| Variabel | Default (translations) | När override:a |
|---|---|---|
| `kicker` | "FÖR 30+ SVENSKA SMB" | När artikeln pekar på ett specifikt case ("CASE: SANNERGÅRDEN") |
| `headline` | "Räkna på AI-ROI för din verksamhet" | Ändra för att spegla artikelns specifika problem |
| `body` | Generic ROI-samtal-text | Ändra för att konkretisera leverabeln för just det ämnet |

**Override via props i `[slug]/page.tsx`:**

```tsx
<BlogCTABlock
  locale={blogLocale}
  kicker="CASE: SANNERGÅRDEN"
  headline="Vad skulle motsvarande siffror se ut för er?"
  body="Sannergården sparade 420 000 kr/år. 30-min samtal = vi räknar på er."
/>
```

### REGEL 8 — Anti-patterns (FÖRBJUDET)

- **Frågor i headline** ("Vill du veta mer?") → mental friction, sänker CTR
- **Falsk urgency** ("Sista chansen!", "Begränsat antal platser") → trust
  dyker 41% inom 2-3 interaktioner när läsare upptäcker manipulation
- **Stock-photos eller produktbilder** i CTA-block → signalerar "annons" =
  banner-blindness
- **Multiple knappar** i samma block (single-CTA konverterar 1.6x bättre)
- **Generic "NÄSTA STEG"-kicker** istället för data-anchor
- **Full-width-knapp** på desktop → ser banner-lik ut
- **"Get Started"** eller "Kontakta oss" → NN/G research: dödar conversion

### REGEL 9 — Modal vs redirect (locked: modal)

- **Modal är default** via `useContactModal`-hook (samma som footer-CTA)
- **Aldrig redirect till `/kontakt`** från en blog-CTA — friktion av
  page-load + URL-byte tappar ~30-50% av intent
- ContactCard-formuläret har **3 fält max** initialt (HubSpot 2024:
  varje extra fält sänker conversion 4.1%)

### Källor (research 2026-04-29)

- [Nielsen Norman: Banner Blindness Revisited](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/)
- [Nielsen Norman: "Get Started" Stops Users](https://www.nngroup.com/articles/get-started/)
- [Nielsen Norman: Fitts's Law for Buttons](https://www.nngroup.com/videos/fittss-law-links-buttons/)
- [HubSpot: Anchor Text CTA Study](https://blog.hubspot.com/marketing/blog-anchor-text-call-to-action-study)
- [HubSpot: Pop-Up Forms Analysis](https://blog.hubspot.com/marketing/pop-up-forms-analysis)
- [HubSpot: Secondary CTAs](https://blog.hubspot.com/marketing/everything-marketers-should-know-secondary-calls-to-action)
- [Backlinko: 785% Conversion Lift Study](https://backlinko.com/increase-conversions)
- [Unbounce: CTA Buttons That Convert](https://unbounce.com/conversion-rate-optimization/cta-buttons-that-convert/)
- [CXL: Mastering the Call to Action](https://cxl.com/blog/call-to-action/)
- [CXL: Microcopy](https://cxl.com/blog/microcopy/)
- [CXL: Visual Cues / Directional](https://cxl.com/blog/visual-cues/)
- [Crazy Egg: High-Converting CTA Buttons](https://www.crazyegg.com/blog/high-converting-cta-buttons/)
- [Steel Croissant: B2B Blog CTA Optimization](https://www.steelcroissant.com/blog/cta-optimization-for-b2b-blogs-effective-strategies-improving-conversion-rates-and-seo-friendly-calls-to-action)
- [VentureHarbour: Form Length Studies](https://ventureharbour.com/how-form-length-impacts-conversion-rates/)
- [WiserNotify: 12 CTA Mistakes](https://wisernotify.com/blog/avoid-call-to-action-mistakes/)

---

## Author bio-mall — `<BlogAuthorBio />` (SPIKAT 2026-04-29)

Author-bio:n är en **förtroendebro**. Det är där en läsare som just läst
artikeln avgör om personen bakom är värd att lyssna på. Generic
template-bios fungerar inte. Vår mall:

### Den LÅSTA designen

```
┌────────────────────────────────────────────────────────────┐
│  [FÖRFATTARE]                                              │
│                                                            │
│  ┌────────┐   Filip Thai                                   │
│  │  📷    │   GRUNDARE & VD                                │
│  │ (lime  │                                                │
│  │  ring) │   AI-konsult med fokus på automation och       │
│  └────────┘   AI-agenter för svenska SMB. Bygger lösningar │
│               som faktiskt levererar mätbar besparing.     │
│                                                            │
│  ▎ "Mer AI-projekt dör i kick-off-mötet än i koden."       │
│                                                            │
│  [LINKEDIN →]                                              │
└────────────────────────────────────────────────────────────┘
       ↑ samma card-DNA som CTA + ROI-modal
```

### REGEL 1 — Card-DNA (matchar CTA + ROI-modal)

Author-section använder **samma design-tokens** som CTA-card + ROI-modal:
- Background: `linear-gradient(180deg, #111111 0%, #0d0d0d 100%)`
- Border: `1px solid rgba(255, 255, 255, 0.08)` (white-low)
- Multi-layer shadow (4 lager djup, identiskt med CTA)
- Border-radius: 16px

Detta så hela artikel-sidan känns som **ETT system**, inte 4 olika sektioner.

### REGEL 2 — Foto: 110px med subtle lime-ring

- **Storlek:** 110px desktop / 90px mobil (var tidigare 80px)
- **Lime-ring:** `box-shadow: 0 0 0 1px rgba(200, 255, 0, 0.25)` default
- **Hover:** ring intensifieras till 60% opacity + glow + scale 1.02
- **Cirkulärt** (border-radius 9999px), object-fit cover
- Klickbart — länkar till `/om-oss/[author]`

### REGEL 3 — Signatur-citat (KRITISK regel)

**Varje författare MÅSTE ha ett signatur-citat.** En generic bio utan
citat är vad som gör författar-sektionen klichig. Citatet är skillnaden
mellan "konsult #847" och "killen som verkligen förstår SMB".

**Vad som gör ett citat icke-klichigt:**
1. **Specifikt** — sätter en konkret bild i huvudet (inte abstrakta värderingar)
2. **Earned** — låter som något personen lärt sig den hårda vägen
3. **Counter-intuitivt** — utmanar en common assumption
4. **Lite självkritiskt** — ödmjukhet skär igenom marknadsspråk
5. **Bara DEN författaren kan säga det** — inte 1000 andra konsulter

**Anti-patterns (FÖRBJUDET):**
- "Vi sätter kunden först" / "Vi bygger framtidens X" / generic värderingar
- "AI ska spara timmar inte sälja hype" — anti-hype är självt en kliché 2026
- Allt som låter som det kan stå på 1000 konsultsidor

**Format:**
- 1 mening, max ~12 ord
- Italic, Barlow display-font, ~17-20px
- 2px lime-border-left för visuell betoning
- Curly quotes ("…") med subtle lime-coloring
- Placeras MELLAN bio och LinkedIn

**Aktuella citat (uppdatera när nya författare läggs till):**

| Författare | Citat (SV) |
|---|---|
| Filip Thai | *"Mer AI-projekt dör i kick-off-mötet än i koden."* |
| Agit Akalp | *"Den dyraste integrationen är den ingen vågar röra om sex månader."* |

### REGEL 4 — Endast EN connect-path (LinkedIn)

**Lägg ALDRIG till "Boka samtal" eller motsvarande CTA i author-bio:n.**
Sidan har redan:
- Inline `<BlogCTABlock>` (boka via modal)
- `<FooterCTAClient>` (boka via cirkulär knapp)

En tredje "boka samtal"-knapp i author-bio:n = **överlapp som dödar
attention**. Single-CTA-research vi gjorde tidigare visar 1.6x bättre
konvertering med fokuserad path.

LinkedIn-länken är medvetet en ANNAN typ av action: "lär dig mer om
personen", inte "boka möte". Den fångar läsare som inte är redo att
prata än men vill veta vem Filip är.

### REGEL 5 — Lägga till ny författare

När en ny författare läggs till:
1. Lägg till entry i `BlogAuthor` typen (`src/lib/blog/types.ts`)
2. Lägg till case i `getAuthorName/Role/Image/Path` (`src/lib/blog/format.ts`)
3. Lägg till bild i `/public/images/team/[author].webp`
4. Skapa profil-sida i `/src/app/[locale]/om-oss/[author]/page.tsx`
5. **Lägg till bio i `AUTHOR_BIOS`** (BlogAuthorBio.tsx)
6. **Lägg till signatur-citat i `AUTHOR_QUOTES`** (BlogAuthorBio.tsx)
   — Se REGEL 3 för vad som är icke-klichigt
7. Lägg till LinkedIn-URL i `AUTHOR_LINKEDIN`

---

## Modal-arkitektur (kontakt-modal — DELAD av CTA-platser)

Både inline `<BlogCTABlock>` (i artiklar) och `<FooterCTAClient>` (på
alla sidor) öppnar **samma kontakt-modal** för identisk UX. Arkitekturen
är extraherad till återanvändbara delar — om du vill ändra något i
modalen, ändra på rätt nivå.

### De 3 lagren

```
┌──────────────────────────────────────────────────────────┐
│ 1. useContactModal-hook                                  │
│    src/hooks/useContactModal.ts                          │
│                                                          │
│    State + open/close + GSAP-animations + focus-trap     │
│    + ESC-key + scroll-lock + reduced-motion + restore    │
│    focus till trigger-element                            │
└──────────────────────────────────────────────────────────┘
                          ↓ används av
┌──────────────────────────────────────────────────────────┐
│ 2. ContactModal-komponent                                │
│    src/components/ui/ContactModal.tsx                    │
│                                                          │
│    "Dumb" portal + overlay + ContactCard inuti.          │
│    Tar emot refs/state från useContactModal-hook.        │
│    Click utanför panel stänger modalen.                  │
└──────────────────────────────────────────────────────────┘
                          ↓ renderar
┌──────────────────────────────────────────────────────────┐
│ 3. ContactCard-komponent                                 │
│    src/components/ui/contact-card.tsx                    │
│                                                          │
│    Själva formuläret (namn, email, etc) som användaren   │
│    fyller i. Existerar oberoende — kan användas inline   │
│    också (t.ex. på /kontakt-sidan).                      │
└──────────────────────────────────────────────────────────┘
```

### CSS-platser

Modal-styling (`.contact-modal-overlay`, `.contact-modal-panel`) ligger
i `src/app/globals.css` — INTE inuti någon komponent-fil. Detta så att
båda `BlogCTABlock` och `FooterCTAClient` använder identiska styles.

Kontaktformulärets styling ligger i `src/components/ui/contact-card.module.css`
(CSS Modules — scoped till ContactCard).

### Hur du använder modalen från en ny komponent

```tsx
'use client'

import { useCallback } from 'react'
import ContactModal from '@/components/ui/ContactModal'
import { useContactModal } from '@/hooks/useContactModal'

export default function MyComponent() {
  const modal = useContactModal()

  const handleClick = useCallback(() => {
    modal.openModal()  // hook auto-detekterar trigger via document.activeElement
  }, [modal])

  return (
    <>
      <button onClick={handleClick}>Öppna modal</button>
      <ContactModal
        isMounted={modal.isMounted}
        onClose={modal.closeModal}
        overlayRef={modal.overlayRef}
        panelRef={modal.panelRef}
      />
    </>
  )
}
```

### Vad du ändrar var (för framtida ändringar)

| Ändring | Fil |
|---|---|
| Modal animations (open/close) | `src/hooks/useContactModal.ts` (GSAP timelines) |
| Modal storlek/border/blur | `src/app/globals.css` `.contact-modal-overlay` + `.contact-modal-panel` |
| Formulärets fält (namn, email, etc) | `src/components/ui/contact-card.tsx` |
| Formulärets styling | `src/components/ui/contact-card.module.css` |
| CTA-card (inline i artiklar) | `src/components/blog/BlogCTABlock.tsx` + `.blog-cta-*` i globals.css |
| Footer-CTA (cirkulär knapp på alla sidor) | `src/components/sections/FooterCTAClient.tsx` |

---

## CaseLink-component (`<CaseLink />`)

För utbound-länkar från en artikel till en stor destination (case-study,
djupare guide, ROI-calculator) — använd `<CaseLink />` istället för en
inline markdown-länk. Den replikerar **homepage CTA-stilen** ("LÄS HELA
CASET") så blogg-CTA:er behåller samma brand-DNA som resten av sidan.

### Användning i MDX

```mdx
import CaseLink from '@/components/blog/CaseLink'

<CaseLink href="/sv/kundcase/sannegarden" label="Läs hela Sannergården-caset" />
```

### När använda CaseLink

| Situation | Använd? |
|---|---|
| Länk till case-study från en blog-artikel | **Ja** |
| Länk till pillar från en cluster-artikel | **Ja** |
| Länk till verktyg (ROI-calculator, etc) som naturligt nästa steg | **Ja** |
| Inline reference-länk i prosatext | Nej — använd vanlig markdown `[text](url)` |
| Länkar till andra blog-artiklar | Nej (oftast) — använd inline-länk |
| Externa länkar | Nej — använd inline-länk |

### Designen

CaseLink wraps `<ButtonSwap>` (samma komponent som homepage CTA:er) med:
- `variant="white"` — vit text på mörk bakgrund
- `size="lg"` — stor (56px höjd, 18px font)
- `arrow={true}` — pil som roterar -45° → 0° vid hover
- Stagger text-swap-animation (orden flyttar uppåt, clone glider in underifrån)
- Underline-animation (scaleX 0→1 från left)

Centrerad i läs-kolumnen med 2.5rem margin top + 3rem bottom — så den
fungerar som en visuell pause-point i artikeln.

### KRITISKA regler

1. **Max 1-2 `<CaseLink />` per artikel.** Mer än så förlorar visuell tyngd
   och känns som spam.
2. **`label` ska vara beskrivande** — "Läs hela Sannergården-caset" är bra,
   "Klicka här" är förbjudet.
3. **`href` ska vara relativ** (`/sv/kundcase/...`), inte absolut URL.
4. **Använd inte CaseLink för inline-länkar.** En CaseLink ska "äga" sin
   plats — den är en pause i läsningen, inte en parentes.

---

## FAQ-component (`<FAQ />`) — SPIKAT 2026-04-29

Reglerna nedan är **forskade från primära källor** (Google Search docs,
Schema.org, MOZ, Search Engine Journal, Ahrefs, Stackmatix, Frase) och är
**source of truth** för all FAQ på Eteya-bloggen. Uppdatera dem inte utan
ny research.

### Varför ha FAQ alls? (FAQ rich results visas inte längre för B2B)

Google ändrade FAQ rich-result-policyn 2023: FAQ-stjärnor i SERP visas
**bara för government + health-sites**. Eteya får INGA rich results.

**MEN** — FAQ-formaterad content med FAQPage-schema får ändå:
- **20-40% högre citation-rate i AI Overviews** vs paragraph-only content
- **2.5x högre chans** att citeras i ChatGPT, Perplexity, Gemini
- Bättre semantic SEO (Question/Answer-struktur är NLP-vänlig)

Vi kör FAQ för **AI/LLM-citering**, inte för Google-stjärnor.

### Användning i MDX

```mdx
import FAQ from '@/components/blog/FAQ'

## Vanliga frågor

<FAQ items={[
  {
    question: "Hur lång tid tar implementationen?",
    answer: "Typiskt 2-6 veckor från första möte till live i drift. Vecka 1 går till discovery och prioritering, vecka 2-3 till design och utveckling, vecka 4 till pilot på 10-20% av volymen, och vecka 5-6 till full rollout. Tidplanen beror främst på antal integrationer mot befintliga system."
  }
]} />
```

### REGEL 1 — Antal items: 5-10 per artikel

- **5-10 frågor** är sweet spot för pillar-artiklar (3000+ ord)
- **3-7 frågor** för standardartiklar (1500-2500 ord)
- **3-5 frågor** för korta artiklar (<1500 ord)
- **Skala med substans, inte ordcount.** 0 FAQ är bättre än 5 dåliga.
- Om du inte har minst 3 genuina PAA-frågor → skip FAQ helt

### REGEL 2 — Frågorna ska komma från riktig research

I prioritetsordning:

1. **Google "People Also Ask" (PAA)** — sök ditt target keyword i Google,
   noter PAA-boxen. Detta är de RIKTIGA frågorna folk söker på.
2. **AlsoAsked.com** — visualiserar PAA som graf, hittar follow-up-frågor
3. **AnswerThePublic** — autocomplete-data från Google + Bing + ChatGPT
4. **Quora, Reddit, Facebook-grupper** för B2B-segmentet
5. **Google Search Console** — filtrera "queries containing question words"

**Skapa inte påhittade frågor** baserade på vad du tror folk frågar.
Använd faktisk SERP-data.

### REGEL 3 — Frågans format

- **Naturligt språk** (så som folk faktiskt frågar), inte keyword-stuffat
- **Max 15 ord / ~80 tecken** per fråga (längre = lägre AI-extraction-rate)
- Mix av fråge-typer baserat på buyer-intent:

| Frågetyp | Intent | Exempel |
|---|---|---|
| "Vad är X?" | Lägst (top-funnel) | "Vad är en AI-agent?" |
| "Hur fungerar X?" | Mid | "Hur fungerar AI-agenter i praktiken?" |
| "Varför X?" | Hög (B2B business case) | "Varför ska SMB använda AI-agenter?" |
| "När ska man X?" | Hög (köp-intent) | "När passar AI-agent och när inte?" |
| "Vad kostar X?" | Hög (köp-intent) | "Vad kostar AI-agenter?" |
| "X vs Y" | Hög (köp-intent) | "AI-agent vs RPA — vilket välja?" |

### REGEL 4 — Anti-cannibalization (kritisk)

**FAQ får ALDRIG duplicera body-content ordagrant.** Google + AI-modeller
straffar redundans.

**Test:** Om FAQ-svaret kan klippas in i body utan friction = duplicate.
Om det adresserar **scenario, beslut eller jämförelse** body inte täcker
= additivt.

FAQ ska besvara **adjacent questions**:
- Edge cases body inte täcker
- Objection handling (lock-in, säkerhet, ansvar)
- Beslutssituationer ("är detta rätt för oss?")
- Process-detaljer ("vad händer om X?")
- Jämförelser ("hur skiljer sig detta från Y?")

**Exempel — INTE OK (dupliceras med body):**
> Q: "Hur fungerar AI-agenter?"
> A: [samma förklaring som "Hur fungerar AI-agenter i praktiken?"-sektionen]

**OK (adresserar edge case):**
> Q: "Vad händer om AI-agenten inte vet svaret?"
> A: [eskaleringslogik som inte finns i body]

### REGEL 5 — Svarets längd: 40-60 ord, inverted pyramid

- **40-60 ord per svar** — under 30 = för tunt, över 80 = utspätt
- **Mening 1 = direkt svar** (sammanfattning/definition). AI-modeller
  extraherar oftast denna mening ordagrant.
- **Mening 2-4 = utveckling** (exempel, villkor, kontext)
- **Inkludera specifika siffror/årtal/data** — AI-modeller citerar hellre
  konkreta tal än vaga generaliseringar
- Self-contained: inga "se ovan", inga "som vi nämnde tidigare"

**HTML i svar är tillåtet** (Google accepterar):
- `<p>`, `<br>`, `<b>`, `<strong>`, `<i>`, `<em>`
- `<ul>`, `<ol>`, `<li>` (bara om innehållet är listbart)
- `<h1>`-`<h6>`, `<a>`, `<div>`

Använd bullets BARA om innehållet är genuint listbart (steg, kriterier,
exempel). Narrativ förklaring i bullets = sämre AI-extraction.

### REGEL 6 — Inga em-dashes, inga säljpitches

- **Inga em-dashes** i FAQ-svar (gäller hela artikeln, men extra noga
  här eftersom svaren blir scrapeade till AI Overviews ordagrant)
- **Aldrig säljpitch som svar** ("Eteya hjälper dig med..."). Google
  förbjuder explicit promotional FAQ-schema.

### REGEL 7 — Position: slutet av artikeln

- FAQ ska vara **sist eller näst sist** (efter conclusion, före author-bio)
- Som **egen H2-sektion** ("Vanliga frågor"), inte integrerad i body
- Schema kräver att synlig content matchar markup (Google policy)

### REGEL 8 — Tekniska implementations-regler

- **Skriv `## Vanliga frågor` H2 i MDX:en INNAN `<FAQ />`** —
  komponenten renderar ingen egen heading
- **`<FAQ />` används BARA EN GÅNG per artikel** (fragmenterar annars
  Schema.org-data)
- **Komponenten sätter `inLanguage: "sv-SE"`** automatiskt baserat på
  `locale`-prop (default 'sv')
- Schema-output: `FAQPage` → `mainEntity` → `Question` → `acceptedAnswer`

### REGEL 9 — När INTE ha FAQ

Skip FAQ helt när:

- Artikeln är **personlig opinion / case-study / story** (inte
  question-driven)
- Frågorna skulle vara **paddade fluff** ("Är X viktigt?" "Ja.")
- Body redan **uttömmande täcker** ämnet linjärt
- Du har **mindre än 3 genuina PAA-frågor** från SERP-research
- Samma frågor återkommer på multipla artiklar → fixa body istället
  (signaler på dålig structure)

**0 FAQ är bättre än 5 dåliga.**

### Checklist innan publish

- [ ] 5-10 frågor (eller skip FAQ helt om <3)
- [ ] Frågorna kommer från PAA / AlsoAsked / Quora / Reddit-research
- [ ] Max 15 ord per fråga
- [ ] Mix av frågetyper (Vad/Hur/Varför/När/Kostnad/vs)
- [ ] Inget svar duplicerar body ordagrant
- [ ] Varje svar 40-60 ord, inverted pyramid (mening 1 = direkt svar)
- [ ] Specifika siffror/data inkluderade där relevant
- [ ] Inga em-dashes, inga säljpitches
- [ ] FAQ ligger sist i artikeln (före author-bio)
- [ ] `## Vanliga frågor` H2 finns i MDX:en innan `<FAQ />`
- [ ] Bara EN `<FAQ />` per artikel

### Designen — matchar homepage

FAQ-komponenten replikerar visuellt homepage `FAQClient.tsx`:
- Numrerade items (01, 02, ...) i mono-font
- Plus-ikon till höger som roterar 45° när öppen
- Border-bottom mellan items, hover background-slide-animation
- Tangentbord-stöd, reduced-motion respekteras

### Källor (research 2026-04-29)

- [Google FAQPage docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Google FAQ-changes 2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Stackmatix: Optimizing FAQ Schema for AI Overviews](https://www.stackmatix.com/blog/optimizing-faq-schema-google-ai-overviews)
- [Frase: FAQ Schemas for AI Search](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)
- [Saigon Digital: FAQ Schema 2026](https://saigon.digital/blog/faq-schema/)
- [Ahrefs: FAQ Pages for SEO](https://ahrefs.com/blog/faq-pages-seo/)
- [Profound: AI Platform Citation Patterns](https://www.tryprofound.com/blog/ai-platform-citation-patterns)
- [GDS Blog: Why we don't have FAQs](https://gds.blog.gov.uk/2013/07/25/faqs-why-we-dont-have-them/)

---

## Topic clusters — obligatorisk arkitektur 2026

Per **web-foundation v4.0 §5.1**: scattered posts utan klusterstruktur lämnar
30% organisk trafik på bordet och 3.2x färre AI-citeringar (Perplexity, ChatGPT,
Copilot). Eteyas blog ska byggas som **pillar + cluster**:

### Modell

```
/sv/blogg/ai-agenter                       ← PILLAR (3000-5000 ord)
├── /sv/blogg/ai-agenter/komma-igang        ← CLUSTER (1500-2500 ord)
├── /sv/blogg/ai-agenter/case-studies       ← CLUSTER
├── /sv/blogg/ai-agenter/jamfor-leverantorer ← CLUSTER
├── /sv/blogg/ai-agenter/integration-erp    ← CLUSTER
└── /sv/blogg/ai-agenter/kostnad-roi        ← CLUSTER
```

### Pillar-sida (bredd-täckning av hela ämnet)
- 3000-5000 ord
- ToC högst upp med interna länkar till varje cluster-sida
- 8-12 interna länkar TILL cluster-sidor
- Semantiska H2/H3 som matchar cluster-namnen
- Uppdateras kvartalsvis när nya cluster-artiklar publiceras

### Cluster-sida (djup på EN vinkel)
- 1500-2500 ord
- Länk BACK till pillar i lead-paragraph + slutsats
- 2-5 korslänkar till syskon-cluster
- Unique angle — ingen överlappande content med pillar
- Fokus på en specifik long-tail-fråga

### Eteyas föreslagna klustreringar

**Pillar 1: AI-agenter för svenska SMB**
- Komma igång (vilka processer, var börja)
- Case-studies från svenska företag
- Jämför leverantörer (Anthropic vs OpenAI vs custom)
- Integration mot ERP/CRM/lager
- Kostnad och ROI (hur räkna)
- Vanliga misstag (anti-pattern)

**Pillar 2: Process-automation**
- 5-10 mest värdefulla workflows
- Make vs n8n vs custom (jämförelse)
- Excel-elimination patterns
- Lead-routing (web → CRM)
- Onboarding-automation
- Faktura/ekonomiautomation

**Pillar 3: AI-telefonist/röst**
- Hur AI-telefonist fungerar
- Restaurang case-study deep-dive
- B2B-användning (säljkvalificering)
- Setup-guide (Twilio + LLM)
- Vad AI inte ska göra (eskalering till människa)

### Internal linking-pattern

Per **web-foundation v4.0 §5.4**:
- **Pillar → Cluster**: 8-12 länkar (i ToC + i kontextuell text)
- **Cluster → Pillar**: 1-2 länkar (lead + slutsats)
- **Cluster → Sibling cluster**: 2-5 länkar (kontextuella)
- **Anchor text**: beskrivande, ej "klicka här" eller "läs mer"

### Schema-implications

Cluster-sidor använder samma `BlogPosting` schema som pillar. Skillnaden:
- Pillar: `articleSection: "AI-agenter"` (= cluster-namn = pillar-titel)
- Cluster: `articleSection: "AI-agenter"` (samma — signalerar de tillhör samma cluster)

### Timeline-förväntan
- Long-tail keywords: 6-12 veckor till första organiska träffar
- Medium-konkurrens: 3-6 månader
- Hög konkurrens: 6-12+ månader

---

## Tag-konventioner

Använd **befintliga tags** när möjligt — färre tags = bättre tag-pages med fler artiklar per tag.

### Befintliga tags (april 2026)

**SV-tags:**
- `AI-agenter`
- `Automation`
- `Process`
- `E-handel`
- `AI-telefonist`
- `Restaurang-automation`
- `Kundtjänst-automation`
- `Executive automation`

**EN-tags:**
- `AI agents`
- `Automation`
- `Restaurant automation`
- `Customer service automation`
- `AI receptionist`

### Lägg till ny tag

1. Skriv den i artikelns `tags`-fält — slugifieras automatiskt
2. Build pre-renderar tag-page automatiskt (`/sv/blogg/tag/[slug]`)
3. Sitemap.ts genererar tag-URL automatiskt
4. **OBS**: Tags är case-sensitive för display-name. "AI-agenter" och "AI-Agenter" blir olika tags. Var konsistent.

---

## Författar-konventioner

Bara `filip` och `agit` är giltiga `author`-värden. Lägga till ny författare:

1. Lägg till `'foo'` i `BlogAuthor` typen i `src/lib/blog/types.ts`
2. Lägg till case för `'foo'` i `getAuthorName/Role/Image/Path` i `src/lib/blog/format.ts`
3. Lägg till bild i `/public/images/team/foo.webp` (cirkulär crop, 200x200+)
4. Skapa `/src/app/[locale]/om-oss/foo/page.tsx` (eller motsvarande)
5. Uppdatera `AUTHOR_LINKEDIN` + `AUTHOR_BIO_SHORT` i `src/app/[locale]/blogg/[slug]/page.tsx`
6. Uppdatera sitemap.ts `authors`-array

---

## Schema.org & SEO

Detta händer **automatiskt** när du skapar en artikel — ingenting du behöver göra manuellt:

- **Article schema** byggs från frontmatter via `createArticleSchema()`
- **Author** blir Person-schema (Filip eller Agit) med name + url + LinkedIn
- **Publisher** är alltid Eteya (Org)
- **Datum** konverteras till ISO 8601 med tidszon `+02:00`
- **BreadcrumbList** schema för SEO-breadcrumb
- **mainEntityOfPage** länkar Article → WebPage
- **Sitemap** lägger till artikeln med hreflang-alternates (om relatedSlug)
- **RSS** inkluderar artikeln automatiskt
- **Meta tags** (OG, Twitter) genereras från frontmatter

Verifiera efter deploy:
- [Google Rich Results Test](https://search.google.com/test/rich-results) — paste live-URL
- [Schema Markup Validator](https://validator.schema.org/) — paste live-URL

---

## Vanliga misstag (lessons learned)

| Misstag | Konsekvens | Fix |
|---|---|---|
| Emoji ✅/❌ i H3 | Bryter editorial-känsla, oproffsig look | Ta bort, använd typografi för betoning |
| `showCta: true` på opinion-artikel | "Säljig" känsla, inte naturligt nästa steg | Skippa CTA på jämförelse/opinion |
| Glömt `relatedSlug` på SV/EN-par | Brutet hreflang, Google indexerar fel | Sätt på BÅDA artiklarna |
| Hero-bild som JPG (renamed till .webp) | Stor filstorlek, slö LCP | Konvertera ordentligt med `cwebp` |
| Hero-bild i fel aspect (4:3, 3:2) | Crop-buggar i listing-cards | Verifiera 16:9 innan upload |
| Author-bild saknas | Schema.org Person utan image, sämre SEO | Lägg till `/public/images/team/` |
| Datum i framtid | Artikel visas men "future-dated" känsla | Använd dagens datum eller bakåt |
| Nya tags utan att kolla befintliga | Fragmenterade tag-pages | Använd befintliga tags först |

---

## Frågor / oklart?

Den här guiden + `_TEMPLATE.mdx` ska räcka för att skapa en artikel korrekt.
Om något är oklart — uppdatera den här filen, så vet vi alla nästa gång.

Senaste audit-rapport: se `/Users/filip/.claude/plans/jag-har-gjort-allting-prancy-hopcroft.md`.
