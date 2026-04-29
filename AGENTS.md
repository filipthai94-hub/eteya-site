<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Blog authoring

**Source of truth: [`BLOG_AUTHORING.md`](./BLOG_AUTHORING.md)** vid repo-roten.

För skapande av nya blog-artiklar ALLTID:
1. Läs `BLOG_AUTHORING.md` först (uppdateras kontinuerligt)
2. Använd `content/blog/_TEMPLATE.mdx` som startpunkt
3. Följ workflow-checklistan punkt-för-punkt

Kort sammanfattning av hårda regler (full kontext finns i guiden):

- **Aldrig emojis eller icons i artikeltext.** Inga ✓, ✦, 🚀, 💡, 📊 eller liknande i headings, lists, callouts eller löptext. Det ser oproffsigt ut och bryter editorial-känslan. Använd typografi (kursiv, fet, blockquote, mono) för betoning i stället.
- **Bullet ●** används som typografisk separator i UI-meta (date ● reading-time ● tag) — det är inte en emoji utan en unicode-glyph i samma stil som "·" och är OK där.
- **SVG-arrows** (`← BACK`, `→ NEXT STEP`) i UI-chrome (back-länk, CTA, LinkedIn-arrow) är affordances, inte dekoration — också OK. Men inte inne i artikeltexten.
- **Hero-bilder** ska vara cinematic editorial i ChainGPT-stil med subtle yellow #C8FF00 accents — inte generic stock. AI-prompt-mall finns i guiden. Specs: 16:9, 1600x900+, WebP, < 250KB.

Frontmatter-flaggor som styr rendering (full lista i guiden):

- `featured: true` — markerar artikeln som "SENASTE" på listing-sidan (max 1 åt gången per locale)
- `showCta: true` — visar "NÄSTA STEG" CTA-blocket. **Default false** — bara på case-studies + how-to-guider där boka-strategimöte gör mening. Skippas på opinion/jämförelse/news.
- `relatedSlug` — slug för andra-språkets version, för hreflang. Sätts på BÅDA SV+EN-versionerna.
