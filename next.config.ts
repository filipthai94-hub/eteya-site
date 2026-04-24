import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
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
    ]
  },
  async headers() {
    return [
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

export default withNextIntl(nextConfig)
