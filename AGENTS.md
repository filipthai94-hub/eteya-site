<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Blog content rules

These rules apply to MDX articles in `/content/blog/{sv,en}/` and any UI text rendered inside the blog reading column (`.prose-blog`).

- **Aldrig emojis eller icons i artikeltext.** Inga ✓, ✦, 🚀, 💡, 📊 eller liknande i headings, lists, callouts eller löptext. Det ser oproffsigt ut och bryter editorial-känslan. Använd typografi (kursiv, fet, blockquote, mono) för betoning i stället.
- **Bullet ●** används som typografisk separator i UI-meta (date ● reading-time ● tag) — det är inte en emoji utan en unicode-glyph i samma stil som "·" och är OK där.
- **SVG-arrows** (`← BACK`, `→ NEXT STEP`) i UI-chrome (back-länk, CTA, LinkedIn-arrow) är affordances, inte dekoration — också OK. Men inte inne i artikeltexten.

# Blog frontmatter

Frontmatter-fält som styr rendering (i `BlogFrontmatter` typen):

- `featured: true` — markerar artikeln som "SENASTE" på listing-sidan
- `showCta: true` — visar "NÄSTA STEG" CTA-blocket i slutet av artikeln. **Default false** — CTA används bara på artiklar där det är ett naturligt nästa steg (case-studies, how-to-guider där boka-strategimöte gör mening). Skippas på opinion-pieces, news, etc.
