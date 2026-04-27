/**
 * BlogListingHero — kompakt ChainGPT-stil hero.
 * Bara title + 1-line subtitle. Ingen kicker, generös men inte massivt.
 */

interface BlogListingHeroProps {
  title: string
  description: string
}

export default function BlogListingHero({
  title,
  description,
}: BlogListingHeroProps) {
  return (
    <header className="blog-hero">
      <div className="blog-hero-inner">
        <h1 className="blog-hero-title">{title}</h1>
        <p className="blog-hero-desc">{description}</p>
      </div>
    </header>
  )
}
