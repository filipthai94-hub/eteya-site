# 🎨 Eteya Mockups & Komponentbibliotek

Filips verktygslåda — färdiga delar att plocka från vid bygge av sidor.

## Struktur

```
mockups/
├── sections/        ← Hela sektioner (hero, services, CTA...)
├── components/      ← Återanvändbara delar (knappar, kort, nav...)
└── pages/           ← Hela sidor (sammansatta av sektioner)
```

## Namnkonvention

Varje fil = standalone HTML. Namn beskriver exakt vad den är:

```
eteya-hero-gradient.html        ← Hero med gradient-bakgrund
eteya-services-grid-hover.html  ← Services med hover-effekter
eteya-btn-primary-glow.html     ← Primärknapp med glow
eteya-nav-sticky-blur.html      ← Sticky nav med backdrop-blur
eteya-card-service-flip.html    ← Servicekort med flip-animation
```

**Prefix:** `eteya-` på allt → lätt att söka och skilja från andra projekt.

## Spikade komponenter

### Sections
| Fil | Beskrivning | Spikat |
|-----|-------------|--------|
| `sections/hero/eteya-hero-video-gradient.html` | Hero med loopande video, gradient-fade, ETEYA letter-reveal | ✅ |
| `sections/marquee/eteya-marquee-banner.html` | Scrollande text-banner (AI AGENTS / AUTOMATION / AI PRODUCTS) | ✅ |
| `sections/services/eteya-services-accordion-hover.html` | Accordion med hover-bubbla, pilrotation, counter-lines | ✅ |
| `sections/process/eteya-process-3step-parallax.html` | 3-stegs process (Kartläggning/Produktion/Expansion) med matrix rain + parallax | ✅ |

### Components
| Fil | Beskrivning | Spikat |
|-----|-------------|--------|
| `components/buttons/eteya-btn-sets-comparison.html` | Alla 4 knapp-sets (A-D) + Hybrid — fullständig jämförelse | 📚 Referens |
| `components/buttons/eteya-btn-hybrid-final.html` | **HYBRID — Glow Border + Glass Body** — Primary, Secondary, Ghost, Small, Disabled. GPU-optimerad. | ✅ |

## Eteya Build Protocol (FÖLJ ALLTID)

Varje sektion/komponent = Nivå 3-task. Hoppa ALDRIG över steg.

1. **Brief** — Filip säger vad + visar referens/URL
2. **Mockup** — Bygg standalone HTML, iterera tills Filip säger "spikat ✅"
3. **Spara** — Mockup → rätt mapp i detta bibliotek
4. **Implementeringsplan** — INNAN du rör `src/`:
   - Exakt vilka filer som ändras/skapas
   - Hur CSS översätts (Tailwind/styled/inline)
   - i18n-nycklar som behövs (sv + en)
   - Beroenden (GSAP, bilder, fonter)
   - Filip godkänner planen
5. **Implementera** — Översätt till Next.js-komponent i `src/`
6. **Verifiera** — Web-foundation SEO-checklista + visuell jämförelse mot mockup
7. **Deploy** — Push → preview-URL → Filip godkänner → merge
