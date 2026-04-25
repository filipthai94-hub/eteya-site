import type { EnrichedCompany } from './company-enrichment'
import type { WebsiteAnalysis } from './website-analyzer'

export type SalesPriority = 'high' | 'medium' | 'low'

export type SalesIntelligence = {
  companySummary: string
  meetingOpening: string
  likelyBottlenecks: string[]
  aiUseCases: Array<{
    title: string
    description: string
    whyItMatches: string
    estimatedImpact: string
    priority: SalesPriority
  }>
  meetingQuestions: string[]
  pitchAngle: string
  quickWins: string[]
  dataGaps: string[]
  confidenceNotes: string[]
  marketContext: string
  sources: string[]
}

type BuildInput = {
  websiteAnalysis?: WebsiteAnalysis | null
  roiData?: Record<string, unknown> | null
  company: EnrichedCompany
  service?: string | null
}

function textBlob(input: BuildInput): string {
  return [
    input.company.name,
    input.company.industry,
    input.company.description,
    input.service,
    input.websiteAnalysis?.title,
    input.websiteAnalysis?.description,
    input.websiteAnalysis?.industry,
    input.websiteAnalysis?.keywords?.join(' '),
    input.websiteAnalysis?.offers?.join(' '),
    input.websiteAnalysis?.services?.join(' '),
    input.websiteAnalysis?.bodyText?.slice(0, 4000),
  ].filter(Boolean).join(' ').toLowerCase()
}

function hasAny(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword))
}

function getNumber(value: unknown): number | null {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

function inferScenario(input: BuildInput): 'culture-booking' | 'ecommerce-electronics' | 'service-support' | 'generic' {
  const text = textBlob(input)
  if (hasAny(text, ['artist', 'artister', 'kultur', 'arrangör', 'arrangorer', 'evenemang', 'scen', 'föreställning', 'konsert'])) return 'culture-booking'
  if (hasAny(text, ['webshop', 'e-handel', 'telefon', 'mobil', 'iphone', 'retur', 'reklamation', 'produkt', 'order', 'begagnad'])) return 'ecommerce-electronics'
  if (hasAny(text, ['support', 'kundtjänst', 'faq', 'ärende', 'kontakt'])) return 'service-support'
  return 'generic'
}

function scenarioUseCases(scenario: ReturnType<typeof inferScenario>): SalesIntelligence['aiUseCases'] {
  if (scenario === 'culture-booking') {
    return [
      {
        title: 'Kvalificering av arrangörsförfrågningar',
        description: 'AI fångar budget, datum, publik, plats och målbild innan teamet lägger tid på dialogen.',
        whyItMatches: 'Webbsignaler kring artister/kultur/bokning pekar på inkommande förfrågningar med mycket handpåläggning.',
        estimatedImpact: 'Kortare ledtid från förfrågan till relevant förslag.',
        priority: 'high',
      },
      {
        title: 'Artist- och formatmatchning',
        description: 'Rekommendera artister/upplägg baserat på arrangör, målgrupp, budget och historiska val.',
        whyItMatches: 'Kulturverksamheter behöver ofta översätta diffusa behov till rätt artist eller produktion.',
        estimatedImpact: 'Mer träffsäkra förslag och mindre intern koordinering.',
        priority: 'high',
      },
      {
        title: 'Offert- och förslagsutkast',
        description: 'Skapa första version av pitch/offert med rätt ton, villkor och nästa steg.',
        whyItMatches: 'Boknings- och arrangörsdialoger kräver ofta återanvändbara men anpassade underlag.',
        estimatedImpact: 'Sparar timmar per vecka i sälj/admin och höjer svarstakten.',
        priority: 'high',
      },
      {
        title: 'Uppföljning, no-show och CRM-nurturing',
        description: 'Automatisera påminnelser, nästa-bästa-åtgärd och återaktivering av tidigare arrangörer.',
        whyItMatches: 'Lead nurturing är särskilt värdefullt när säsonger, program och budgetcykler styr köpen.',
        estimatedImpact: 'Fler affärer ur befintliga kontakter utan mer manuell uppföljning.',
        priority: 'medium',
      },
    ]
  }

  if (scenario === 'ecommerce-electronics') {
    return [
      {
        title: 'Retur- och reklamationsautomation',
        description: 'AI triagerar ärenden, samlar order-/produktdata och föreslår beslut eller nästa fråga.',
        whyItMatches: 'E-handel/telefonprodukter får ofta repetitiva retur-, garanti- och skickfrågor.',
        estimatedImpact: 'Mindre manuell supporttid och snabbare kundbesked.',
        priority: 'high',
      },
      {
        title: 'Produktfrågor och köpguide',
        description: 'AI svarar på kompatibilitet, skick, leverans, garanti och jämförelser mellan produkter.',
        whyItMatches: 'Produktkataloger med teknikvaror skapar många pre-sales-frågor som kan standardiseras.',
        estimatedImpact: 'Högre konvertering och lägre supporttryck.',
        priority: 'high',
      },
      {
        title: 'Värdering/inköp av begagnade enheter',
        description: 'Skapa strukturerat flöde för att samla skick, modell, defekter och föreslå värderingsintervall.',
        whyItMatches: 'Telefon-/elektronikhandel har tydliga variabler som lämpar sig för regelstyrd AI-assistans.',
        estimatedImpact: 'Snabbare inköpsbeslut och jämnare bedömningar.',
        priority: 'medium',
      },
      {
        title: 'Orderstatus och supporttriage',
        description: 'Koppla order-/fraktdata till AI som ger status, prioriterar ärenden och skapar svarsförslag.',
        whyItMatches: 'Orderstatus och leveransfrågor är typiska högvolymsfrågor i e-handel.',
        estimatedImpact: 'Färre manuella tickets och snabbare svarstid.',
        priority: 'high',
      },
      {
        title: 'Produktbeskrivningar i skala',
        description: 'Generera SEO- och kundanpassade texter från strukturerad produktdata.',
        whyItMatches: 'Teknikprodukter behöver tydliga specifikationer, skickbeskrivningar och jämförelser.',
        estimatedImpact: 'Snabbare publicering och bättre informationskvalitet.',
        priority: 'medium',
      },
    ]
  }

  if (scenario === 'service-support') {
    return [
      {
        title: 'AI-triage av inkommande ärenden',
        description: 'Klassificera frågor, skapa svarsförslag och eskalera bara ärenden som behöver människa.',
        whyItMatches: 'Webben visar support-/kontaktorienterade signaler.',
        estimatedImpact: 'Lägre svarstid och mindre repetitiv handläggning.',
        priority: 'high',
      },
      {
        title: 'Kunskapsbas och intern assistent',
        description: 'Gör policys, FAQ och tjänsteinformation sökbar och användbar i kunddialogen.',
        whyItMatches: 'När kontakt/FAQ är centralt finns ofta återkommande svar att automatisera.',
        estimatedImpact: 'Jämnare kvalitet i svar och snabbare onboarding.',
        priority: 'medium',
      },
      {
        title: 'Offert- och uppföljningsstöd',
        description: 'Skapa skräddarsydda säljunderlag och påminnelser efter möten/förfrågningar.',
        whyItMatches: 'Tjänstebolag tappar ofta fart mellan första kontakt och tydligt nästa steg.',
        estimatedImpact: 'Högre hit-rate utan tyngre admin.',
        priority: 'medium',
      },
    ]
  }

  return [
    {
      title: 'Discovery av manuella flöden',
      description: 'Kartlägg återkommande mail, formulär, dokument och uppföljningar som AI kan förbereda.',
      whyItMatches: 'Bolags-/webbdata räcker inte för en smal case-matchning, så mötet bör hitta volymflöden först.',
      estimatedImpact: 'Identifierar 1-2 säkra piloter utan att överlova.',
      priority: 'high',
    },
    {
      title: 'AI-assistent för intern koordinering',
      description: 'Samla mötesanteckningar, uppgifter, kundunderlag och nästa steg på ett ställe.',
      whyItMatches: 'Generellt relevant när team lägger tid på informationssökning och handoffs.',
      estimatedImpact: 'Mindre administrativ friktion i vardagen.',
      priority: 'medium',
    },
    {
      title: 'Svarsförslag för kunddialog',
      description: 'Skapa kvalitetssäkrade utkast till mail, support- och säljdialog.',
      whyItMatches: 'Nästan alla leadflöden har repetitiv kommunikation där människa kan godkänna AI-utkast.',
      estimatedImpact: 'Snabbare svar utan att tappa kontroll.',
      priority: 'medium',
    },
  ]
}

function bottlenecksForScenario(scenario: ReturnType<typeof inferScenario>): string[] {
  if (scenario === 'culture-booking') return ['Inkommande förfrågningar kan vara ofullständiga och kräva många följdfrågor.', 'Matchning mellan arrangör, budget, målgrupp och artist/upplägg riskerar att bli personberoende.', 'Offert/förslag och uppföljning kan fastna när teamet prioriterar pågående produktioner.']
  if (scenario === 'ecommerce-electronics') return ['Returer, reklamationer och garantiärenden kan skapa repetitiv supportbelastning.', 'Produktfrågor kräver ofta detaljer om skick, kompatibilitet, leverans och villkor.', 'Orderstatus och ärendeprioritering kan bli flaskhalsar när volymen ökar.']
  if (scenario === 'service-support') return ['Många inkommande frågor behöver sorteras innan rätt person kan agera.', 'Kunskap ligger ofta utspridd i webbsidor, dokument och personers erfarenhet.', 'Uppföljning efter kontakt/offert kan bli ojämn.']
  return ['Det är ännu oklart vilka flöden som har högst volym och bäst automationsgrad.', 'Manuella handoffs mellan sälj, leverans och admin kan vara dolda tidsläckor.', 'Dataunderlag behöver verifieras innan ROI-case låses.']
}

function questionsForScenario(scenario: ReturnType<typeof inferScenario>, roiData?: Record<string, unknown> | null): string[] {
  const savings = getNumber(roiData?.annualSavings ?? roiData?.besparingKr)
  const roiQuestion = savings ? `ROI-kalkylen visar cirka ${Math.round(savings).toLocaleString('sv-SE')} kr/år i potential — vilka antaganden känns mest respektive minst säkra?` : 'Vilket manuellt flöde tar mest tid varje vecka och går att mäta utan tung implementation?'

  if (scenario === 'culture-booking') return [roiQuestion, 'Hur kommer en typisk arrangörsförfrågan in idag, och vilken information saknas oftast?', 'Hur matchar ni arrangörens behov mot artist/upplägg/budget idag?', 'Vilka delar av offert/förslag återanvänds, och vilka måste alltid skräddarsys?', 'Hur följer ni upp leads som inte bokar direkt eller återkommer säsongsvis?', 'Vilka system innehåller kundhistorik, artistdata och tidigare offerter?']
  if (scenario === 'ecommerce-electronics') return [roiQuestion, 'Hur stor andel av supporten gäller orderstatus, produktfrågor, retur eller reklamation?', 'Vilken data finns strukturerad kring produkt, skick, garanti, lager och order?', 'Hur ser flödet ut från kundens returfråga till beslut/återbetalning/ersättning?', 'Vilka frågor vill ni absolut att en människa godkänner innan svar skickas?', 'Vad skulle vara en trygg första pilot: supporttriage, produktfrågor eller produkttexter?']
  return [roiQuestion, 'Vilka 3 ärendetyper eller uppgifter återkommer oftast?', 'Var finns sanningen idag — CRM, mail, dokument, webshop, ekonomisystem eller personers minne?', 'Vilken del av flödet vore mest värdefull att automatisera först utan att ändra hela arbetssättet?', 'Vilka risker måste hanteras: GDPR, tonläge, felaktiga svar eller systemåtkomst?', 'Hur mäter vi en pilot på 30 dagar?']
}

export function buildSalesIntelligence(input: BuildInput): SalesIntelligence {
  const scenario = inferScenario(input)
  const website = input.websiteAnalysis
  const company = input.company
  const roiSavings = getNumber(input.roiData?.annualSavings ?? input.roiData?.besparingKr)
  const hours = getNumber(input.roiData?.totalHours ?? input.roiData?.sparatTimmar)

  const services = website?.services?.slice(0, 3).join(', ')
  const summaryParts = [
    `${company.name} verkar utifrån tillgängliga signaler vara ett ${website?.industry || company.industry || 'företag med ännu ej verifierad bransch'}.`,
    website?.description ? `Webben beskriver verksamheten som: ${website.description}` : company.description ? `Bolagsbeskrivning/SNI: ${company.description}.` : null,
    services ? `Synliga tjänste-/erbjudandesignaler: ${services}.` : null,
  ].filter(Boolean)

  const dataGaps = [
    !company.verified ? 'Bolaget är inte säkert verifierat mot Apiverket; orgnr och juridiskt namn bör dubbelkollas.' : null,
    company.employees === null ? 'Antal anställda saknas/är ej verifierat.' : null,
    company.revenue === null ? 'Omsättning saknas/är ej verifierad.' : null,
    !website || website.confidence === 'low' ? 'Website-analysen har låg täckning; bekräfta verksamhetsmodell i mötet.' : null,
    ...(website?.warnings || []),
  ].filter((item): item is string => Boolean(item))

  const confidenceNotes = [
    `Företagsdata: ${company.confidence} confidence${company.verified ? ' via Apiverket' : ' (fallback)'}.`,
    website ? `Website-analys: ${website.confidence} confidence över ${website.sourceUrls.length} källa/källor.` : 'Ingen website-analys tillgänglig.',
    roiSavings ? `ROI-signal finns (${Math.round(roiSavings).toLocaleString('sv-SE')} kr/år${hours ? `, ${hours} h` : ''}).` : 'ROI-data saknas eller är 0; använd mötet för att kvantifiera.',
  ]

  const marketContext = scenario === 'ecommerce-electronics'
    ? 'Eteya bör positioneras mot konkret effektivisering i support, order och produktdata — inte som en generell AI-konsult. Konkurrensen är breda AI-/automationsleverantörer; differentiera med snabb pilot nära befintliga flöden.'
    : scenario === 'culture-booking'
      ? 'Eteya bör positioneras som ett praktiskt sälj-/bokningsstöd som bevarar den mänskliga relationen men tar bort repetitiv kvalificering, förslag och uppföljning. Jämför mot generiska AI-konsulter, inte mot kundens kulturkonkurrenter.'
      : 'Eteya bör positioneras som en pragmatisk AI-partner för pilot till produktion. Marknaden består främst av generiska AI-konsulter och automationsplattformar; vinn på snabb verksamhetsförståelse och mätbar ROI.'

  return {
    companySummary: summaryParts.join(' '),
    meetingOpening: `Jag har tittat på ${company.name}${website?.url ? ` och signalerna från ${website.url}` : ''}. Min hypotes är att största värdet finns i ${scenarioUseCases(scenario)[0]?.title.toLowerCase()}; stämmer det med hur ni jobbar idag?`,
    likelyBottlenecks: bottlenecksForScenario(scenario),
    aiUseCases: scenarioUseCases(scenario).slice(0, 5),
    meetingQuestions: questionsForScenario(scenario, input.roiData),
    pitchAngle: scenarioUseCases(scenario)[0]?.whyItMatches || 'Börja med ett smalt, mätbart pilotflöde och bygg vidare när datan bekräftar värdet.',
    quickWins: scenario === 'culture-booking'
      ? ['Skapa formulär/checklista för arrangörsförfrågan.', 'Bygg mall för AI-genererat offert-/förslagsutkast.', 'Sätt upp enkel uppföljningssekvens för obesvarade leads.']
      : scenario === 'ecommerce-electronics'
        ? ['Samla topp 20 produkt-/returfrågor till en AI-kunskapsbas.', 'Tagga supportärenden i 2 veckor för att mäta volym per kategori.', 'Testa AI-utkast för orderstatus/retur/reklamation med mänskligt godkännande.']
        : ['Välj ett återkommande inbox-/formulärflöde.', 'Mät volym och tidsåtgång i 2 veckor.', 'Bygg AI-utkast med mänskligt godkännande som första pilot.'],
    dataGaps,
    confidenceNotes,
    marketContext,
    sources: website?.sourceUrls || [],
  }
}
