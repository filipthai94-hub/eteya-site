// Genererar SpeakableSpecification för voice search
// Används på hemsidan (Hero-sektionen)

interface SpeakableConfig {
  cssSelector: string[] // t.ex. ['.hero-headline', '.hero-summary']
}

export function createSpeakableSchema(config: SpeakableConfig): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: config.cssSelector,
    },
  }
}