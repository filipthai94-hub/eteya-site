'use client'

const ROW1_LOGOS = [
  { src: '/images/logos/join-1.svg', alt: 'Client logo' },
  { src: '/images/logos/join-2.svg', alt: 'Client logo' },
  { src: '/images/logos/join-3.svg', alt: 'Client logo' },
  { src: '/images/logos/join-4.svg', alt: 'Client logo' },
]

const ROW2_LOGOS = [
  { src: '/images/logos/join-5.svg', alt: 'Client logo' },
  { src: '/images/logos/join-9.svg', alt: 'Client logo' },
  { src: '/images/logos/join-12.svg', alt: 'Client logo' },
]

const CSS = `
  /* ═══ JOIN THE BEST SECTION ═══ */
  .join-section {
    margin-top: 200px;
    background: transparent;
  }

  .join-container {
    padding: 0 12px;
  }

  .join-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: 64px;
    font-weight: 400;
    line-height: 64px;
    letter-spacing: normal;
    text-transform: uppercase;
    color: #fff;
    padding-left: 56px;
    margin: 0;
  }

  /* ═══ MARQUEE ═══ */
  .join-marquee-wrap {
    margin-top: 80px;
    overflow: hidden;
  }

  .join-marquee-line {
    display: flex;
    width: max-content;
    height: 260px;
  }

  .join-marquee-strip {
    display: flex;
    gap: 0;
    flex-shrink: 0;
  }

  /* Row 1: scroll left */
  .join-marquee-line--row1 .join-marquee-strip {
    animation: join-marquee-left 60s linear infinite;
  }

  /* Row 2: scroll right */
  .join-marquee-line--row2 .join-marquee-strip {
    animation: join-marquee-right 50s linear infinite;
  }

  @keyframes join-marquee-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @keyframes join-marquee-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }

  /* ═══ CIRCLE ITEM ═══ */
  .join-item {
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgb(15, 15, 15);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    flex-shrink: 0;
  }

  .join-item img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  /* ═══ MOBILE ═══ */
  @media (max-width: 768px) {
    .join-section { margin-top: 100px; }
    .join-heading { font-size: 36px; line-height: 36px; padding-left: 16px; }
    .join-marquee-wrap { margin-top: 48px; }
    .join-marquee-line { height: 160px; }
    .join-item { width: 160px; height: 160px; padding: 14px; }
  }
`

function MarqueeStrip({ logos, repeats = 4 }: { logos: typeof ROW1_LOGOS; repeats?: number }) {
  const items = Array.from({ length: repeats }, () => logos).flat()
  return (
    <div className="join-marquee-strip">
      {items.map((logo, i) => (
        <div key={i} className="join-item">
          <img src={logo.src} alt={logo.alt} loading="lazy" />
        </div>
      ))}
    </div>
  )
}

export default function JoinTheBestClient() {
  return (
    <section className="join-section">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="join-container">
        <h2 className="join-heading">Join the Best</h2>
      </div>

      <div className="join-marquee-wrap">
        {/* Row 1: scrolls LEFT */}
        <div className="join-marquee-line join-marquee-line--row1">
          <MarqueeStrip logos={ROW1_LOGOS} repeats={4} />
        </div>

        {/* Row 2: scrolls RIGHT */}
        <div className="join-marquee-line join-marquee-line--row2">
          <MarqueeStrip logos={ROW2_LOGOS} repeats={4} />
        </div>
      </div>
    </section>
  )
}
