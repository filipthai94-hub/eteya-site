# ROI Briefing v2: Allabolag financial enrichment

## Syfte

Lägger till en defensiv ekonomiberikning i ROI-briefingen så säljaren kan se senaste verifierade bokslut/nyckeltal bredvid bolagsinfo och ROI-prognos.

## Källa och robots-policy

- Källa: publika bolagssidor på `https://www.allabolag.se/foretag/...` eller organisationsnummer-redirect på `https://www.allabolag.se/{orgnr}`.
- Vi använder inte Allabolags `/api/*`-endpoints. De är uttryckligen disallowed i robots och ligger utanför scope.
- Implementation gör enstaka, preview-orienterade sidfetches med vanlig browser User-Agent, timeout och redirects. Ingen mass-scraping eller loop över stora kandidatlistor.

## Matchningsstrategi

1. Om `knownUrl` skickas in används den, men bara om den är en `allabolag.se`-URL och inte `/api/*`.
2. Om organisationsnummer finns används `https://www.allabolag.se/{orgnr}`. Allabolag redirectar normalt till rätt bolagssida.
3. Om orgnr saknas görs max en enkel webbsidesökning via `/what/{bolagsnamn}` för att hitta en företagslänk.
4. Data accepteras endast om orgnr på sidan matchar input-orgnr, både `559127-9889` och `5591279889` stöds.
5. Saknas orgnr-match returnerar enrichment `not_available`; siffror används inte.

## Parsing

`src/lib/financial-enrichment.ts` letar efter Allabolags synliga HTML för:

- Bokslutsår
- Omsättning
- Resultat efter finansnetto
- Årets resultat
- Antal anställda

Belopp med svensk formatering parsas defensivt:

- `1 234`, `1 234`, `−123`, `-123`
- `tkr` / `Belopp i 1000` normaliseras till SEK (`valueSek`) men originalvärdet behålls i `raw`
- `Mkr` normaliseras till SEK när det är tydligt

## Confidence

- `high`: orgnr matchar och minst bokslutsår + omsättning har parsats utan varningar.
- `medium`: orgnr matchar men datan är partiell eller enrichment har varningar.
- `low`: orgnr matchar men nästan inget kunde parsas, eller orgnr saknas i sökfall.
- `not_available`: ingen säker källa, WAF/challenge, fetch-fel, orgnr mismatch eller tomt resultat.

## Fallback och felhantering

Allabolag kan ibland returnera 0 bytes, tom HTML eller AWS WAF/challenge. Enrichment får därför aldrig bryta briefing-generationen. Vid fel returneras `not_available` med `warnings`, och HTML-briefingen visar “Ej verifierat” i stället för att fylla i `0` eller fabricera värden.

## HTML-output

`src/lib/generate-pro-briefing-html.ts` visar en ny sektion **Senaste ekonomi** efter företagsinformation och före ROI-prognosen. Den visar värden, källa, confidence och varningar. Finns Allabolag-källa länkas den.

## Testplan

- Typecheck: `npx tsc --noEmit --pretty false`
- Build om rimligt: `npm run build`
- Smoke-test enrichment med Telestore:
  - orgnr: `559127-9889`
  - känd sida: `https://www.allabolag.se/foretag/telestore-sverige-ab/-/mobiltelefoner/2KGWJ69I5YGDD`
  - förväntat: orgnr matchar, bokslutsår 2024, omsättning/resultat/anställda parsas när Allabolag inte WAF:ar.
- Smoke-test enrichment med Kulturaktiebolaget Det Blir Kul:
  - orgnr enligt Allabolag-sökresultat: `559151-9904`
  - förväntat: korrekt orgnr-match krävs; annars `not_available`.

## Begränsningar

- HTML-strukturen hos Allabolag kan ändras. Parsern är regex-baserad och ska ses som robust v1, inte ett avtalat API.
- Enrichment bör användas som briefing-stöd, inte som bokföringskälla i juridisk/finansiell mening.
- Om sök via namn ger flera träffar utan orgnr ska siffror inte användas automatiskt.
