import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withMDX = createMDX({
  // Plugin-konfiguration via strängar (Turbopack-kompatibelt — JS-funktioner
  // kan inte passas till Rust-baserad bundler).
  options: {
    remarkPlugins: [
      'remark-frontmatter',  // strippa YAML-frontmatter från content
      'remark-gfm',           // GitHub Flavored Markdown (tables, strikethrough)
    ],
    rehypePlugins: [
      'rehype-slug',  // ID på H2/H3 → enables anchor links + TOC
      ['rehype-autolink-headings', { behavior: 'wrap' }],  // klickbara headings
    ],
  },
})

const nextConfig: NextConfig = {
  // Tillåt .md/.mdx som sid-filer i App Router
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  allowedDevOrigins: ['filip.tail607c86.ts.net', '100.84.47.62'],
  images: {
    // Serve AVIF + WebP automatically to supporting browsers when
    // images are loaded via next/image. PNG stays on disk as source +
    // fallback for ancient browsers. AVIF first (~50% smaller than
    // JPEG), WebP second (~25-35% smaller), original as last resort.
    formats: ['image/avif', 'image/webp'],
    // Cacha optimerade bilder i 31 dagar (2 678 400 sekunder) på CDN-edgen.
    // Default är 60 sekunder, vilket får Vercel att re-optimera varje bild
    // varje minut → onödig kostnad + långsam första visning för nya besökare.
    // Våra bilder är versionshashade via /public, så lång TTL är säker —
    // en ny bild får nytt filnamn och undviker stale-cache helt.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/sv/kundcase/mbflytt',
        destination: '/sv',
        permanent: true,
      },
      {
        source: '/en/case-studies/mbflytt',
        destination: '/en',
        permanent: true,
      },
      // Browsers/crawlers begär ibland legacy icon-paths som inte finns på disk.
      // Tidigare returnerades 500 (Pingdom-errors) — nu 308 redirect till
      // existerande filer i /public/.
      {
        source: '/apple-touch-icon-precomposed.png',
        destination: '/apple-touch-icon.png',
        permanent: true,
      },
      {
        source: '/icon-192.png',
        destination: '/favicon-192x192.png',
        permanent: true,
      },
      {
        source: '/icon-512.png',
        destination: '/favicon-512x512.png',
        permanent: true,
      },
      {
        source: '/android-chrome-192x192.png',
        destination: '/favicon-192x192.png',
        permanent: true,
      },
      {
        source: '/manifest.json',
        destination: '/site.webmanifest',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      // ── Cache-Control för static assets i /public/images/* ──
      // Vercel default är `max-age=0, must-revalidate` (CDN cachar, browser inte).
      // Override till 1 års immutable cache så återbesökare inte revaliderar bilder.
      // Säkert eftersom: (1) bilder ändras sällan, (2) vid uppdateringar byter vi
      // filnamn (versionering), (3) Next.js Image-optimerade URLs cachas separat.
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Samma för /public/fonts/* om några ligger där (säkerhetsnet — next/font
      // self-hostar redan i /_next/static/media/* med immutable cache automatiskt)
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Videos i /public/videos/* — samma logik som images: filnamn ändras
      // vid uppdateringar (versionshashade), så lång immutable TTL är säker.
      // Annars hamnar de i Vercel-default `max-age=0, must-revalidate` →
      // browser revaliderar varje uppspelning för återbesökare.
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ── Säkerhets-headers för alla URLs ──
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://app.cal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.resend.com https://*.supabase.co https://app.cal.com; frame-src https://challenges.cloudflare.com https://app.cal.com;",
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },
}

// Kedja MDX → next-intl → nextConfig. MDX yttre wrapper hanterar pageExtensions
// + .mdx-loader, next-intl hanterar i18n-routing.
export default withMDX(withNextIntl(nextConfig))
