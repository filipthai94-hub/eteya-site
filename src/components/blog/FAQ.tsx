/**
 * FAQ — MDX-component för blog-artiklar med vanliga frågor.
 *
 * Auto-genererar FAQPage Schema.org strukturerad data — per web-foundation
 * v4.0 §4.4: "FAQPage = AEO/GEO-driver med 22% median citation-lift".
 *
 * Användning i MDX:
 *
 *   import FAQ from '@/components/blog/FAQ'
 *
 *   <FAQ items={[
 *     { question: "Hur lång tid tar implementation?", answer: "2-6 veckor typiskt." },
 *     { question: "Vad kostar det?", answer: "Beror på omfattning..." },
 *   ]} />
 *
 * Eller via mdx-components.tsx-mappning för enklare syntax.
 *
 * Renderar:
 *   - Visuell accordion-list med Q&A
 *   - <script type="application/ld+json"> med FAQPage-schema
 */

import { JsonLd, createFaqSchema, type FaqItem } from '@/components/JsonLd'

interface FAQProps {
  items: FaqItem[]
  /** Heading text — default "Vanliga frågor" / "Frequently asked questions" */
  heading?: string
  /** Locale för default heading-text */
  locale?: 'sv' | 'en'
}

export default function FAQ({
  items,
  heading,
  locale = 'sv',
}: FAQProps) {
  if (!items || items.length === 0) return null

  const defaultHeading = locale === 'sv' ? 'Vanliga frågor' : 'Frequently asked questions'
  const finalHeading = heading ?? defaultHeading

  return (
    <section className="blog-faq" aria-labelledby="faq-heading">
      {/* FAQPage Schema.org structured data */}
      <JsonLd data={createFaqSchema(items)} />

      <h2 id="faq-heading" className="blog-faq-heading">
        {finalHeading}
      </h2>

      <dl className="blog-faq-list">
        {items.map((item, idx) => (
          <div key={idx} className="blog-faq-item">
            <dt className="blog-faq-question">{item.question}</dt>
            <dd className="blog-faq-answer">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
