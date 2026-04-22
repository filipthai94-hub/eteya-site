// Genererar FAQPage JSON-LD schema från en array av Q&A
// Används i FAQSection.tsx

interface FAQItem {
  question: string
  answer: string
}

export function createFaqSchema(items: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}