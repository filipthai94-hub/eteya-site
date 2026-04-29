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

### Sammanfattning vid artikelslut — best practice

**Pillar-artiklar (3000-5000 ord):** Inkludera kort `## Sammanfattning`
i slutet — 1 distillerande paragraf + en `**Att ta med sig:**`-bullet-list.
Detta optimerar för AI Overviews och Featured Snippets (Google extraherar
ofta sista sektion).

**Cluster-artiklar (1500-2500 ord):** Skippa Sammanfattning. Avsluta med
en bra avslutande paragraph som leder naturligt till CTA eller nästa läsning.

**Format för Sammanfattning (när den används):**

```markdown
## Sammanfattning

[1 paragraf — distillera artikelns kärnsiffror/påståenden, INTE recap]

[1 paragraf med "den största risken är X" eller motsvarande
forward-looking observation, INTE en lista över allt vi sagt]

**Att ta med sig:**

- Action-oriented bullet 1
- Action-oriented bullet 2
- Action-oriented bullet 3
```

**Anti-pattern**: 3-paragrafs-essä-konklusion som upprepar allt artikeln
redan sagt. Det dödar läsvärdet och ger ingen extra extraction-värde.

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

## FAQ-component (`<FAQ />`)

För artiklar med vanliga frågor, importera och använd `<FAQ />`-komponenten.
Komponenten **auto-genererar FAQPage Schema.org-data** (web-foundation §4.4
ger 22% citation-lift i AI Overviews) och visuellt **matchar homepage FAQ**
(numrerade items, plus-ikon, hover background-slide, accordion expand).

### Användning i MDX

```mdx
import FAQ from '@/components/blog/FAQ'

## Vanliga frågor

<FAQ items={[
  {
    question: "Hur lång tid tar implementation?",
    answer: "2-6 veckor från första möte till live."
  },
  {
    question: "Vad kostar det?",
    answer: "20 000 – 80 000 kr för en första agent."
  }
]} />
```

### KRITISKA regler

1. **Skriv `## Vanliga frågor` (eller motsvarande H2) i MDX:en INNAN
   `<FAQ />`.** Komponenten renderar ingen egen heading — det är medvetet
   så att rubriken följer artikelns prose-blog H2-styling.
2. **5-10 FAQ-items per artikel.** Färre än 5 ger för lite FAQPage-värde,
   fler än 10 dilluerar.
3. **Frågor i naturligt svenskt språk** — så som riktiga kunder skulle ställa
   dem, inte som SEO-termer.
4. **Svar i 1-3 meningar.** Längre än så hör inte hemma i FAQ — då ska det
   vara en H2-sektion i artikeln.
5. **Inga em-dashes** i answer-text (gäller hela artikeln, men extra noga
   här eftersom answers blir scrapeade till AI Overviews).
6. **Använd `<FAQ />` BARA EN GÅNG per artikel.** Skapa inte flera FAQ-block
   — det fragmenterar Schema.org-data.

### Designen — matchar homepage

FAQ-komponenten replikerar visuellt homepage `FAQClient.tsx`:
- Numrerade items (01, 02, ...) i mono-font
- Plus-ikon till höger som roterar 45° när öppen
- Border-bottom mellan items (rgba 0.1)
- Hover: mörk bakgrund slide-up animation (cubic-bezier easing)
- Active: bakgrund stannar synlig
- Tangentbord-stöd (focus-visible outline)
- Reduced-motion respekteras

Storlekar är minskade jämfört med homepage (som är full-bredd) för att
fitta i blog-läs-kolumnen (~720px).

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
