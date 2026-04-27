/**
 * BlogListingHero — massiv hero för /blogg listing-page.
 *
 * Använder dedikerade .blog-hero* CSS-klasser från globals.css.
 */

interface BlogListingHeroProps {
  kicker: string
  title: string
  description: string
}

export default function BlogListingHero({
  kicker,
  title,
  description,
}: BlogListingHeroProps) {
  return (
    <header className="blog-hero">
      <div className="blog-hero-inner">
        <span className="blog-hero-kicker">{kicker}</span>
        <h1 className="blog-hero-title">{title}</h1>
        <p className="blog-hero-desc">{description}</p>
      </div>
    </header>
  )
}
