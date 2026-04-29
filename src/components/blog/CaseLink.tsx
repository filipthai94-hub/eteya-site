/**
 * CaseLink — MDX-komponent för utbound-länkar från blog-artiklar till
 * stora destinations (case-studies, deep-content-pages).
 *
 * Använder samma `ButtonSwap`-komponent som homepage CTA:er:
 * - Text-swap stagger animation (ord flyttar uppåt, clone kommer underifrån)
 * - Arrow rotate -45° → 0° vid hover
 * - Underline-animation (scaleX 0→1 från left)
 * - Uppercase + display-font (Barlow Condensed)
 *
 * Brand DNA: identisk visual-pattern som "LÄS HELA CASET" på startsidan
 * — så blogg känns som en naturlig del av sidan, inte ett separat hörn.
 *
 * Användning i MDX:
 *
 *   import CaseLink from '@/components/blog/CaseLink'
 *
 *   <CaseLink href="/sv/kundcase/sannegarden" label="Läs hela Sannergården-caset" />
 *
 * När använda:
 * - Länk till case-study från en blog-artikel
 * - Länk till djupare guide/pillar från en cluster-artikel
 * - Länk till verktyg (t.ex. ROI-calculator) som är ett naturligt nästa steg
 *
 * NÄR INTE använda:
 * - Inline reference-länkar i prosatext (använd vanlig markdown-link)
 * - Externa länkar (öppna inte ButtonSwap-stil för external — använd vanlig)
 * - Mer än 1-2 per artikel (förlorar visuell tyngd om för många)
 */

import ButtonSwap from '@/components/ui/ButtonSwap'

interface CaseLinkProps {
  /** Destination path, t.ex. "/sv/kundcase/sannegarden" */
  href: string
  /** Knapptext, t.ex. "Läs hela Sannergården-caset" */
  label: string
}

export default function CaseLink({ href, label }: CaseLinkProps) {
  return (
    <div className="blog-case-link">
      <ButtonSwap
        href={href}
        label={label}
        variant="white"
        size="lg"
        arrow
      />
    </div>
  )
}
