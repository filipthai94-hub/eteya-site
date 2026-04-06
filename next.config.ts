import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig = {
  allowedDevOrigins: ['filip.tail607c86.ts.net', '100.84.47.62'],
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
    ],
  },
}

export default withNextIntl(nextConfig)
