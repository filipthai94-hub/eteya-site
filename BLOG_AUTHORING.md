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
| `—` (em dash) | Pauser, parentetiska klausuler |
| `→` (right arrow) | Workflow-beskrivningar: "order kommer in → valideras → läggs i ERP" |
| `×` (multiplication) | Beräkningar: "30 × 280 kr × 50 veckor" |
| `·` (middle dot) | Listor inom rad: "AI · Automation · Strategy" |
| `●` (bullet) | UI-meta separator (auto-tillagd, skriv inte i body) |

---

## Image guide

### Specs (gäller alla hero-bilder)

| Attribut | Värde |
|---|---|
| **Format** | WebP (verkligen WebP, inte PNG renamed) |
| **Aspect ratio** | 16:9 |
| **Min storlek** | 1600×900px |
| **Filstorlek** | < 250KB efter komprimering (snabb LCP) |
| **Color profile** | sRGB |
| **Filnamn** | `[artikel-slug]-hero.webp` |
| **Path** | `/public/images/blog/` |
| **Alt-text** | Beskrivande, max ~125 tecken, ej "image of..." |

### House style (matchar listingens visuella DNA)

Eteyas blog-bilder ska kännas som **ChainGPT-style cinematic editorial** kombinerat med Eteyas yellow signature. Mood:

- **Dark cinematic atmosphere** (close to bg #080808)
- **Volumetric/atmospheric lighting** med strong directional light
- **Lime/neon yellow accents** (#C8FF00) — som "tech-pulse" i scenen
- **Editorial composition** — inte stock-photo-cliché
- **Hyperrealistic men stylized** — inte fotorealism rakt av
- **Architectural/atmospheric depth** — rum, skuggor, djup

**Tänk**: Linear's blog hero crops + ChainGPT's neon-tech atmosphere + Apple's product photography refinement.

### Master prompt — Midjourney v6 / v6.1

Generic mall (byt ut `[SUBJECT]` per artikel):

```
[SUBJECT], cinematic dark atmosphere, volumetric lighting, accent of neon
lime green #C8FF00 light, ultra-detailed, atmospheric depth, editorial
photography composition, rim lighting, professional film grain, ARRI Alexa
shot, shallow depth of field, mood: confident, premium, restrained --ar 16:9
--style raw --v 6.1 --s 250
```

### Master prompt — Flux Pro (ComfyUI / via API)

```
[SUBJECT], cinematic editorial photography, dark atmosphere with deep blacks,
strong volumetric directional lighting, subtle neon lime green (#C8FF00)
accent lighting in the scene, ultra-detailed, professional film grain,
atmospheric depth, shallow depth of field, premium editorial mood, shot on
ARRI Alexa, restrained color palette dominated by blacks and greys with
selective lime accents
```
(Flux: aspect 16:9, steps 30-50, guidance 3.5)

### Per-artikeltyp prompt-variationer

#### 1. Case-study / business automation
```
[Modern Scandinavian office workspace, person at laptop, abstract digital
data overlay flowing through air, holographic interface elements, lime
green data streams in foreground], cinematic dark atmosphere, volumetric
lighting, accent neon lime #C8FF00, ultra-detailed, editorial composition,
ARRI Alexa shot --ar 16:9 --style raw --v 6.1
```

#### 2. How-to / technical guide
```
[Abstract macro-photography of circuit board details, glowing lime green
data pathways, deep depth of field, dark surrounding atmosphere], cinematic
volumetric lighting, neon #C8FF00 accents, editorial macro photography,
ultra-detailed, atmospheric --ar 16:9 --style raw --v 6.1
```

#### 3. Listicle / multiple workflows
```
[Architectural scene of dark futuristic data center corridor, multiple
glowing terminals, lime green ambient light, vanishing point composition,
hyperrealistic], cinematic atmosphere, volumetric god rays, neon #C8FF00
accents, editorial wide shot, ARRI Alexa --ar 16:9 --style raw --v 6.1
```

#### 4. Jämförelse / opinion
```
[Minimalist abstract composition of two contrasting geometric shapes, dark
background, single lime green light source creating shadows, premium product
photography], cinematic minimalism, dramatic lighting, neon #C8FF00 accent,
editorial, ultra-clean composition --ar 16:9 --style raw --v 6.1
```

#### 5. AI-agent / autonomous systems
```
[Abstract humanoid silhouette emerging from data streams, glowing lime green
neural network patterns, dark void background, hyperrealistic with stylized
elements], cinematic dark atmosphere, volumetric light, neon #C8FF00,
editorial sci-fi photography, ARRI Alexa --ar 16:9 --style raw --v 6.1 --s 350
```

### Post-processing checklist

Efter generation, innan filen läggs i `/public/images/blog/`:

1. **Crop till exakt 16:9** om det inte redan är det
2. **Resize till 1600x900** (om större)
3. **Konvertera till WebP** med kvalitet 80-85
   ```bash
   cwebp -q 85 input.png -o public/images/blog/slug-hero.webp
   ```
4. **Verifiera filstorlek < 250KB** (annars sänk kvalitet till 75)
5. **Visuell QA**: 
   - Lime-greena toner ska finnas men inte dominera
   - Mörka ytor får inte vara helt svarta (banding-risk i WebP)
   - Inga uppenbara AI-artefakter (extra fingrar, omöjlig anatomi, text-soppa)
6. **Lägg till till git** + uppdatera `heroImage` i frontmatter

### Stock-photo alternativ (om AI inte hinns med)

Om du måste använda stock istället:

- **Källa**: Unsplash (CC0), Pexels (CC0), eller licensierat (Stocksy, Shutterstock)
- **Kvalitet**: minst 1600x900, helst utan "stock-photo-känsla" (undvik handshake-meetings, generic-laptop-on-desk)
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

### Content

- [ ] Lead-paragraph (första `<p>`) fungerar som mini-summary
- [ ] H2/H3-hierarki är logisk (ingen H1, ingen hopp över H3 → H5)
- [ ] **Inga emojis eller decorativa icons** (kör `grep` om osäker)
- [ ] Länkar har beskrivande text, ej "click here"
- [ ] Konkreta siffror/case-data där relevant
- [ ] Avslutande paragraph leder naturligt till CTA (om `showCta: true`) eller stannar i innehållet

### Image

- [ ] Hero-bild genererad enligt house style + per-typ prompt
- [ ] **16:9 aspect, 1600x900+, WebP, < 250KB**
- [ ] Filnamn `[slug]-hero.webp` i `/public/images/blog/`
- [ ] `heroImageAlt` är beskrivande (ej "Hero image")

### Hreflang twin (om både SV + EN finns)

- [ ] SV-artikelns `relatedSlug` = EN-artikelns slug
- [ ] EN-artikelns `relatedSlug` = SV-artikelns slug
- [ ] Båda artiklarna delar samma `heroImage` (eller olika om det är medvetet)

### Verifiera lokalt

- [ ] `pnpm build` kör clean (exit 0)
- [ ] Öppna `http://localhost:3000/sv/blogg` — artikel syns i listan
- [ ] Öppna artikelsidan — verifiera:
  - Rätt title, lead, datum, författare
  - Hero-bild laddar (no broken-image-icon)
  - CTA "NÄSTA STEG" syns OM `showCta: true`, inte annars
  - Inga emoji-läckor i innehållet
- [ ] View-source — verifiera Schema.org Article JSON-LD finns med:
  - `"author": { "@type": "Person", "name": "..." }` (ej Org)
  - `"datePublished": "...T08:00:00+02:00"` (med tidszon)

### Deploy

- [ ] Pusha till `feature/blog` (eller egen branch)
- [ ] Vercel preview-deploy klar — granska länken
- [ ] Test live: sitemap.xml innehåller artikeln
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) visar Article utan errors
- [ ] Merge till `main` → live

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
