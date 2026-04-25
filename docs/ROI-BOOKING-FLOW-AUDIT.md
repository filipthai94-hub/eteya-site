# ROI Booking Flow Audit — “Boka strategimöte” från ROI-modalen

> Datum: 2026-04-25 16:55 CEST  
> Scope: audit-only, inga kodändringar, ingen deploy, ingen riktig Cal.com-bokning  
> Status: **FAIL — flödet är inte produktionssäkert i nuvarande skick**

## Sammanfattning

Det finns en tydlig intended architecture för ROI → modal → Cal.com → webhook → Supabase/Discord/email/briefing, men audit visar en blockerande frontend-bugg och flera backend-/datamappningsproblem som gör att en riktig bokning riskerar att antingen inte kunna starta, eller generera felaktig lead-/briefingdata.

Viktigaste fyndet: på `/sv` syns CTA:n **“BOKA ETT STRATEGIMÖTE”**, men klick öppnar inte ROI-modalen i headless browser-test. DOM-click registreras på rätt knapp, men `ContactCard` mountas inte.

## Verifierade filer

- `src/components/sections/ROICalculatorClient.tsx`
- `src/components/ui/contact-card.tsx`
- `src/components/ui/ButtonStripe.tsx`
- `src/app/api/webhook/cal/route.ts`
- `src/lib/website-analyzer.ts`
- `src/i18n/messages/sv.json`
- `src/i18n/messages/en.json`
- `docs/ROI-BOOKING-SPEC.md`
- `docs/ROI-CALCULATOR-STATUS.md`

## Intended flow

1. Besökare använder ROI-kalkylatorn på startsidan `/sv`.
2. CTA `Boka ett strategimöte` i `ROICalculatorClient.tsx` ska köra `handleOpenContact()`.
3. `ContactCard` öppnas som portal med `roiData`.
4. Steg 1 samlar namn, email, företag/hemsida, service och GDPR.
5. Steg 2 laddar Cal.com embed via `@calcom/embed-react`.
6. Cal.com får `name`, `email` och metadata: `source`, `website`, `service`, ROI-värden.
7. Cal.com skickar `BOOKING_CREATED` webhook till `/api/webhook/cal`.
8. Webhooken ska verifiera signatur, extrahera metadata, spara lead, skicka Discord/email och generera briefing.

Cal.com-dokumentation verifierar att React embed kan skicka metadata med formatet `metadata[myKey]`, och att webhooken ska innehålla värdena i `payload.metadata`. Cal.com webhook-dokumentation verifierar wrapperformatet `{ triggerEvent, payload }` och signaturheader `x-cal-signature-256`.

## Testresultat

### Browser audit

- Testad URL: `http://127.0.0.1:3000/sv`
- CTA hittades: **PASS**
- Klick event registrerades på CTA-knappen: **PASS**
- Modal öppnades: **FAIL**
- `ContactCard`/inputfält mountades: **FAIL**
- Cal.com iframe laddades: **BLOCKED av modal-fail**

Evidence från Playwright:

```json
{
  "clicks": [
    {
      "tag": "SPAN",
      "text": "BOKA ETT STRATEGIMÖTE",
      "path": [
        "SPAN:ButtonStripe-module__text",
        "BUTTON:ButtonStripe-module__btn ButtonStripe-module__fullWidth",
        "DIV:ROICalculatorClient-module__ctaArea",
        "ASIDE:ROICalculatorClient-module__results"
      ]
    }
  ],
  "modal": false,
  "html": false
}
```

Notis: `/sv/ai-besparing` är metodologisidan, inte ROI-kalkylatorn. Där finns ingen ROI-modal-CTA.

### Build/lint

- `npm run build`: **PASS**
- `npm run lint`: **FAIL** — 130 problem, 65 errors + 65 warnings. Felen är repo-breda och inte enbart ROI-flödet, men blockerar en ren kvalitetsgate.

## Findings

### BLOCKER — CTA öppnar inte ROI-modal

**Filer:**
- `src/components/sections/ROICalculatorClient.tsx:427-428`
- `src/components/sections/ROICalculatorClient.tsx:671-725`
- `src/components/ui/ButtonStripe.tsx:42-64`

**Problem:**
CTA:n renderas och klicket registreras i DOM, men `isModalMounted` verkar inte bli `true` i browser-testet. `ContactCard` mountas inte och inga inputfält dyker upp.

**Effekt:**
Besökaren kan inte boka strategimöte från ROI-kalkylatorn.

**Rekommenderad fix:**
Debugga click chain i `ROICalculatorClient`/`ButtonStripe` i browser. Lägg temporär verifiering runt `handleOpenContact`, kontrollera om React synthetic event körs, och skriv ett Playwright-test som kräver att `ContactCard` syns efter CTA-click.

---

### HIGH — Företag/hemsida är markerat required men valideras inte

**Fil:** `src/components/ui/contact-card.tsx:58-59`, `264-269`

**Problem:**
Fältet “Företag eller hemsida” har `required` och `*`, men `isStep1Valid` kontrollerar bara namn + email + GDPR.

**Effekt:**
Användaren kan gå vidare utan företag/hemsida. Då skickas ingen `metadata[website]`, webhooken får tom `company`, Apiverket-query blir tom och lead/briefing blir dålig eller fel.

**Rekommenderad fix:**
Lägg `formData.website.trim().length > 0` i `isStep1Valid` eller ta bort required/asterisk om det faktiskt ska vara valfritt.

---

### HIGH — Email valideras inte i praktiken

**Fil:** `src/components/ui/contact-card.tsx:58-59`, `251-260`

**Problem:**
Inputfältet har `type="email"`, men flödet använder en vanlig knapp och egen state-validering. `isStep1Valid` kräver bara icke-tom email, inte giltig email.

**Effekt:**
Felaktig email kan skickas till Cal.com config och vidare till webhook/lead.

**Rekommenderad fix:**
Validera med `input.checkValidity()` eller enkel email-regex/Zod innan steg 2.

---

### HIGH — Service skickas från frontend men ignoreras i webhook

**Filer:**
- `src/components/ui/contact-card.tsx:133`
- `src/app/api/webhook/cal/route.ts:481-486`

**Problem:**
Frontend skickar `metadata[service]`, men webhooken sätter `service = payload.title`. Cal.com `payload.title` är normalt mötestiteln, inte vald tjänst.

**Effekt:**
Lead får fel service. Discord/email/briefing visar sannolikt “Strategy Session between ...” i stället för `ai-agent`, `ai-automatisering`, `strategi` eller `annat`.

**Rekommenderad fix:**
Läs `payload.metadata.service` först, fallback till `eventTitle`/`title` endast om metadata saknas.

---

### HIGH — ROI-data mappas till fel nycklar i briefingpipeline

**Filer:**
- `src/components/ui/contact-card.tsx:137-155`
- `src/app/api/webhook/cal/route.ts:509-520`
- `src/app/api/webhook/cal/route.ts:276-344`

**Problem:**
Webhooken bygger ROI-data med nycklar som `annualSavings`, `totalHours`, `roi`, `payback`, men briefingdelen läser senare `besparingKr`, `sparatTimmar`, `roiProcent`, `paybackManader`.

**Effekt:**
ROI i generated briefing riskerar bli `undefined`/`NaN` eller 0 trots att ROI-metadata fanns.

**Rekommenderad fix:**
Normalisera ROI-formatet direkt efter webhook-extraktion. Antingen ändra briefingpipeline till `annualSavings`-formatet eller skapa explicit adapter:

- `besparingKr = annualSavings`
- `sparatTimmar = totalHours`
- `roiProcent = roi`
- `paybackManader = payback`

---

### HIGH — Webhook har publik test-bypass för signatur

**Fil:** `src/app/api/webhook/cal/route.ts:429-443`

**Problem:**
Om request-headern är `x-cal-signature(-256): test-skip-validation` hoppas signaturvalideringen över.

**Effekt:**
En extern aktör kan potentiellt posta falska `BOOKING_CREATED` events om endpointen är publik, vilket kan skapa leads, Discord-notiser, email och research/briefing-körningar.

**Rekommenderad fix:**
Ta bort bypass helt, eller tillåt endast i `NODE_ENV !== 'production'` plus separat intern testflagga.

---

### HIGH — Webhook väntar på hela research/HTML-pipelinen innan 200 OK

**Fil:** `src/app/api/webhook/cal/route.ts:557-570`

**Problem:**
Webhooken `await`ar `runResearchAndGenerateHTML`, som kan göra Apiverket-anrop, website-analyzer fetch, Supabase Storage upload och email.

**Effekt:**
Cal.com kan timeouta eller retrya webhooken. Användaren kan ha bokat korrekt men downstream blir instabilt/dubbelkört.

**Rekommenderad fix:**
Svara 200 snabbt efter validering + minimal persistens. Kör research/briefing asynkront via queue/background job eller non-blocking task med idempotens.

---

### MEDIUM — Website-analyzer får URL utan protokoll

**Filer:**
- `src/app/api/webhook/cal/route.ts:493-500`, `562-567`
- `src/lib/website-analyzer.ts:142-151`

**Problem:**
Om användaren skriver `telestore.se`, webhooken sätter `website = "telestore.se"`. `analyzeWebsite` kör `fetch(url)`, vilket normalt kräver `https://` eller `http://`.

**Effekt:**
Website analysis misslyckas för vanliga domäninmatningar.

**Rekommenderad fix:**
Normalisera website: trim, lower-case domain, prepend `https://` om protokoll saknas.

---

### MEDIUM — URL med `https://` identifieras som företagsnamn, inte website

**Fil:** `src/app/api/webhook/cal/route.ts:476-507`

**Problem:**
`isWebsite()` returnerar `false` om strängen börjar med `https://`, trots att det är en website.

**Effekt:**
`https://telestore.se` blir company string, website blir tom, Apiverket-sökning blir sämre och website analysis körs inte.

**Rekommenderad fix:**
Byt `isWebsite` till riktig URL/domain-parser.

---

### MEDIUM — GDPR accepteras inte som metadata men sätts alltid true i DB

**Filer:**
- `src/components/ui/contact-card.tsx:292-310`
- `src/app/api/webhook/cal/route.ts:51-61`

**Problem:**
GDPR-gate finns i frontend, men skickas inte som Cal metadata. Backend sätter alltid `gdpr_accepted: true` när webhooken tas emot.

**Effekt:**
Om booking skapas via annan väg eller payload simuleras får DB felaktigt samtycke.

**Rekommenderad fix:**
Skicka `metadata[gdprAccepted]`, `metadata[gdprAcceptedAt]`, `metadata[sourceUrl]` och validera i webhooken.

---

### MEDIUM — PII loggas i webhook

**Fil:** `src/app/api/webhook/cal/route.ts:447-450`, `539-540`

**Problem:**
Webhooken loggar payload och lead-data med namn/email/företag.

**Effekt:**
Onödig PII-exponering i serverloggar.

**Rekommenderad fix:**
Maska email/namn i logs, och logga event-id/booking-id/status i stället.

---

### MEDIUM — Lead update matchar på company, inte booking-id

**Fil:** `src/app/api/webhook/cal/route.ts:365-374`

**Problem:**
Briefing URL patchas via `company=eq.${data.company}`.

**Effekt:**
Flera leads med samma company kan uppdateras fel. Tom company kan uppdatera flera felaktiga poster om tabellen tillåter det.

**Rekommenderad fix:**
Spara `bookingId`/`uid` från Cal.com och uppdatera raden via unik lead-id eller booking-id.

---

### LOW — Signaturjämförelse är inte timing-safe

**Fil:** `src/app/api/webhook/cal/route.ts:23-25`

**Problem:**
HMAC jämförs med `expected === signature`.

**Effekt:**
Teoretisk timing-risk.

**Rekommenderad fix:**
Använd `crypto.timingSafeEqual` med längdkontroll.

---

### LOW — Rate limit går att spoofa och är in-memory

**Fil:** `src/app/api/webhook/cal/route.ts:4-18`, `392-397`

**Problem:**
Rate limit baseras på `x-forwarded-for`, är in-memory och saknar proxy-trust-strategi.

**Effekt:**
Svag skyddseffekt i serverless/proxy-miljö.

**Rekommenderad fix:**
För webhook: prioritera signatur/idempotens. För publika endpoints: använd edge/KV/Redis eller provider-level rate limiting.

## Rekommenderad fixordning

1. **Fix CTA/modal öppning** och lägg Playwright-test för modal open.
2. **Fix frontend-validering**: company/website + email + service om den ska vara required.
3. **Fix webhook data mapping**: service från metadata, ROI adapter, website normalisering.
4. **Ta bort production test-bypass** för webhook-signatur.
5. **Gör webhook snabb + idempotent**: spara minimal lead och kör research async.
6. **Hårda privacy-/auditfält**: GDPR metadata, booking uid, source URL, masked logs.
7. **Städa lint-gate** eller skapa scoped lint command för kritiska filer.

## Föreslagen nästa task: fixfas

Om vi går vidare bör scope vara begränsat till:

- `src/components/sections/ROICalculatorClient.tsx`
- `src/components/ui/contact-card.tsx`
- `src/app/api/webhook/cal/route.ts`
- `src/lib/website-analyzer.ts` eller ny liten URL-normalizer
- eventuellt `tests/` eller Playwright-smoketest om teststruktur finns

Inga deploy- eller env-ändringar behövs för första fixfasen.
