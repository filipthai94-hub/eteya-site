# DEPLOY PLAN — Telestore Case Study till Production

## 📍 Nuvarande status

- ✅ Sida klar lokalt (`http://100.84.47.62:3000/sv/kundcase/telestore`)
- ✅ Template sparad
- ✅ Alla filer finns i workspace
- ⏳ Saknar: SEO metadata, canonical URLs, structured data
- ⏳ Saknar: Deploy till Vercel

## 🎯 Production Info

- **Vercel Projekt:** `site` (prj_aLZMLV0YrylL3SlwfFaDf5PN4s3i)
- **Production URL:** `https://site-six-mu-70.vercel.app/sv`
- **Lokal sökväg:** `/home/openclaw/.openclaw/workspace/projects/eteya/site/`
- **Deploy method:** Git push till `main` → auto-deploy

---

## 🚀 Steg-för-steg deploy plan

### STEG 1: Förberedelse (lokalt)

#### 1.1 Verifiera nuvarande kod
```bash
cd /home/openclaw/.openclaw/workspace/projects/eteya/site
git status
# Kontrollera att alla ändringar är commitade
```

#### 1.2 Bygg-test lokalt
```bash
npm run build
npm run start
# Besök http://localhost:3000/sv/kundcase/telestore
# Kontrollera att allt laddar korrekt
```

**Kriterier för godkännande:**
- [ ] Inga build errors
- [ ] Inga console warnings
- [ ] Bild laddas (< 500KB)
- [ ] Mobilvy fungerar
- [ ] Desktop vy fungerar

---

### STEG 2: SEO & Metadata (KRITISKT!)

Enligt **web-foundation skillen** måste vi ha:

#### 2.1 Uppdatera `page.tsx` med korrekt metadata

Lägg till i `src/app/[locale]/kundcase/telestore/page.tsx`:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params
  const isSwedish = locale === 'sv'
  
  return {
    title: 'Telestore Case Study — 390 000 kr/år i besparing med AI | Eteya',
    description: 'Se hur Eteya hjälpte Telestore spara 390 000 kr per år genom 56 automationer. Från manuellt kaos till fullskalig AI-drift på 3 veckor.',
    canonical: isSwedish 
      ? 'https://dashboard-ecru-mu-37.vercel.app/sv/kundcase/telestore'
      : 'https://dashboard-ecru-mu-37.vercel.app/en/case-studies/telestore',
    alternates: {
      languages: {
        sv: '/sv/kundcase/telestore',
        en: '/en/case-studies/telestore',
      },
    },
    openGraph: {
      title: 'Telestore Case Study — 390 000 kr/år i besparing',
      description: 'Från manuellt kaos till fullskalig AI-drift på 3 veckor',
      images: ['/images/og-telestore-case.jpg'], // Skapa denna! 1200×630px
      type: 'article',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Telestore Case Study — 390 000 kr/år',
      description: 'Se hur Eteya hjälpte Telestore spara 390 000 kr per år',
      images: ['/images/og-telestore-case.jpg'],
    },
  }
}
```

#### 2.2 Lägg till Schema.org structured data

I `page.tsx`, lägg till JSON-LD:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CaseStudy',
  'name': 'Telestore Automation Case Study',
  'description': 'Hur Eteya hjälpte Telestore spara 390 000 kr per år genom AI-automation',
  'url': 'https://dashboard-ecru-mu-37.vercel.app/sv/kundcase/telestore',
  'about': {
    '@type': 'Organization',
    'name': 'Telestore',
    'url': 'https://telestore.se',
  },
  'provider': {
    '@type': 'Organization',
    'name': 'Eteya AI Platform',
    'url': 'https://eteya.ai',
  },
  'significantLink': {
    '@type': 'WebPage',
    'url': 'https://eteya.ai/sv/ai-besparing',
    'name': 'Eteya AI Besparing',
  },
  'mainEntity': {
    '@type': 'ItemList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': '390 000 kr årlig besparing',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': '1 350 timmar sparad tid per år',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': '56 implementerade automationer',
      },
    ],
  },
}
```

Rendera i component:
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

#### 2.3 Skapa OG image (social sharing)

Skapa bild i `public/images/og-telestore-case.jpg`:
- **Storlek:** 1200×630px (Facebook/Twitter standard)
- **Innehåll:** "Telestore Case Study" + "390 000 kr/år" + Eteya logo
- **Verktyg:** Canva, Figma, eller generera med AI

---

### STEG 3: Git commit & push

```bash
cd /home/openclaw/.openclaw/workspace/projects/eteya/site

# Lägg till alla nya filer
git add .

# Commit med korrekt message
git commit -m "feat: add Telestore case study with SEO optimization

- Add Telestore case study page (/sv/kundcase/telestore)
- Add English version (/en/case-studies/telestore)
- Add structured data (Schema.org CaseStudy)
- Add Open Graph images for social sharing
- Add canonical URLs and hreflang tags
- Optimize images for web (WebP, <500KB)
- Mobile responsive design

Resolves: #[issue number if applicable]"

# Push till GitHub
git push origin main
```

---

### STEG 4: Vercel deploy

#### 4.1 Auto-deploy
Vercel deployar automatiskt vid push till `main` branch.

Gå till: https://vercel.com/dashboard

**Förväntad flöde:**
1. Push detekteras (~10 sekunder)
2. Build startar (~2-5 minuter)
3. Deploy slutförd
4. Preview URL tillgänglig
5. Production URL uppdaterad

#### 4.2 Övervaka deploy
I Vercel dashboard:
- Kolla "Build Logs" för errors
- Vänta tills status är **"Ready"**
- Klicka på "Visit" för att öppna live-sidan

---

### STEG 5: Post-deploy verifiering

#### 5.1 Functionality test
- [ ] Öppna `https://dashboard-ecru-mu-37.vercel.app/sv/kundcase/telestore`
- [ ] Testa mobilvy (Chrome DevTools → Device Toolbar)
- [ ] Testa desktop (1920×1080)
- [ ] Testa surfplatta (768×1024)
- [ ] Kontrollera att bilden laddas snabbt
- [ ] Kontrollera att alla sektioner syns

#### 5.2 SEO test
- [ ] View page source → kontrollera `<title>` och `<meta description>`
- [ ] View page source → kontrollera JSON-LD structured data
- [ ] Testa på https://metatags.io/ (OG tags)
- [ ] Testa på https://search.google.com/test/rich-results (Schema.org)

#### 5.3 Performance test
- [ ] https://pagespeed.web.dev/ (målsättning: 90+)
- [ ] https://gtmetrix.com/ (målsättning: A grade)
- [ ] Kontrollera Largest Contentful Paint (< 2.5s)
- [ ] Kontrollera Cumulative Layout Shift (< 0.1)

#### 5.4 Social sharing test
- [ ] https://developers.facebook.com/tools/debug/ (Facebook OG)
- [ ] https://cards-dev.twitter.com/validator (Twitter Cards)
- [ ] LinkedIn Post Inspector

---

### STEG 6: Analytics & Tracking (valfritt)

Om ni har Google Analytics eller liknande:

```typescript
// I page.tsx useEffect
useEffect(() => {
  if (typeof window !== 'undefined') {
    // Track page view
    window.gtag?.('event', 'page_view', {
      page_title: 'Telestore Case Study',
      page_path: '/sv/kundcase/telestore',
    })
  }
}, [])
```

---

## ⚠️ Risker & mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Build fail | Hög | Testa lokalt med `npm run build` först |
| Bilder laddas långsamt | Medium | Optimera till WebP, max 500KB |
| SEO saknas | Hög | Följ checklistan ovan noggrant |
| Mobilvy trasig | Medium | Testa i Chrome DevTools innan deploy |
| Canonical URL fel | Medium | Dubbelkolla URLs i metadata |

---

## 📋 Pre-flight checklista

Innan deploy, säkerställ:

- [ ] `npm run build` körde utan errors
- [ ] Alla bilder är optimerade (< 500KB)
- [ ] Meta title & description är skrivna
- [ ] Canonical URLs är korrekta
- [ ] OG image är skapad (1200×630px)
- [ ] Structured data (JSON-LD) är tillagd
- [ ] Mobilvy är testad
- [ ] Desktop vy är testad
- [ ] Båda språken (SV/EN) fungerar
- [ ] Inga console errors i DevTools

---

## 🎯 Rollback-plan (om något går fel)

Om deploy misslyckas eller sidan har problem:

```bash
# 1. Hitta föregående working commit
git log --oneline -5

# 2. Reverta till föregående version
git revert HEAD

# 3. Pusha revert
git push origin main

# 4. Vercel auto-deployar den gamla versionen
```

Alternativt i Vercel Dashboard:
- Gå till "Deployments"
- Hitta föregående successful deployment
- Klicka "Promote to Production"

---

## 📞 Kontakt & ansvar

- **Utvecklare:** Aline (AI Agent)
- **Godkännande:** Filip
- **Deploy window:** Valfri tid (ingen downtime risk)
- **Rollback time:** < 5 minuter

---

*Skapad: 2026-04-06*
*Status: Ready for execution*
