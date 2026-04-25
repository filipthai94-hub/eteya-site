# ROI Briefing v2 Audit

## Kort audit av v1

- Website-analysen läste bara en sida och byggde AI-case via enkel keywordmatchning. Det gav för generiska förslag när startsidan innehöll tydliga verksamhetssignaler.
- Apiverket-sökningen tog första träffen istället för bästa match. Det riskerade `orgnr okänt`, SNI `0000` och falska nollor för anställda/omsättning.
- HTML-briefingen blandade AI-leverantörer med kundens “konkurrenter”, vilket kunde se ut som direkt konkurrensanalys även när det bara var Eteya-positionering.
- Saknad data renderades som `0 kr` / `0 anställda`, vilket såg verifierat ut trots låg confidence.

## V2-mål

1. Djupare website-analys: startsida + relevanta interna sidor, max 5 totalt.
2. Bättre företagsmatchning: kandidater från bolagsnamn, domän, title, h1 och body text; scorea Apiverket-träffar och välj bästa.
3. Visa saknad/osäker data som `Ej verifierat`, aldrig som falsk nolla.
4. Deterministisk sales intelligence som ger bransch-/verksamhetsmatchade AI-case, mötesfrågor, pitchvinkel, quick wins och data gaps.
5. HTML-briefing som hjälper säljaren öppna mötet och validera hypoteser, inte bara visa rådata.

## Datakällor

- Cal.com webhook: kontakt, bokningstid, service, metadata för website/GDPR/ROI.
- ROI-kalkylator metadata: annualSavings, totalHours, ROI, payback, processdata när den finns.
- Kundens website: title, meta description, h1/h2, body text, kontakt-/bokningssignaler, erbjudanden/tjänster, target audience och käll-URL:er.
- Apiverket: bolagsmatch, orgnr, SNI, adress, anställda, omsättning, styrelse, branschstatistik.
- Lokal competitors.json: AI-leverantörer för Eteya-positionering, inte kundens direkta konkurrenter.

## Risker och mitigation

- **Fel bolag från Apiverket:** scoread matchning + confidence/warnings + fallback utan falska orgnr.
- **Website scraping misslyckas:** timeouts, begränsat antal sidor, warnings i briefing, låg confidence.
- **PII i loggar:** e-post maskas och research-loggar summerar status snarare än rå payload.
- **Överdriven precision:** saknad data visas som `Ej verifierat`; ROI-noter uppmanar till validering i mötet.
- **Prod-risk:** ändringen är preview-first; ingen Cal.com-konfig, Supabase schema, Vercel env eller deploy ändras.

## Testplan

### Kulturaktiebolaget

Förväntat:

- Website-signaler ska identifiera kultur/artister/arrangörer/bokning snarare än generisk konsult/recruitment.
- AI-case ska inkludera inkommande bokningsförfrågningar, kvalificering av arrangörer, offert/förslag, artistmatchning, uppföljning/no-show och CRM/lead nurturing.
- Om Apiverket inte ger säker träff ska orgnr/SNI/anställda/omsättning visas som `Ej verifierat`, inte `0000` eller `0`.
- Briefing ska ha tydliga mötesfrågor om arrangörsförfrågningar, matchning, offertmallar, uppföljning och system/data.

### Telestore

Förväntat:

- Website-signaler ska identifiera e-handel/telefoner/produkter/retur/support om dessa finns på webben.
- AI-case ska inkludera retur-/reklamationsflöde, produktfrågor, värdering/inköp, orderstatus, supporttriage och produktbeskrivningar.
- Briefing ska skilja mellan marknadspositionering mot AI-leverantörer och Telestores faktiska kundmarknad.
- ROI-data ska visas från kalkylatorn men med valideringsfrågor kring volym, automationsgrad och implementation.

## Verifiering före merge

- `npx tsc --noEmit --pretty false`
- `npm run build` om previewmiljön tillåter det.
- `git diff --name-only` ska endast visa scope-filerna i denna audit.
