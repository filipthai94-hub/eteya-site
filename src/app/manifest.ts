import { MetadataRoute } from 'next'

type IconPurpose = 'any' | 'maskable' | 'monochrome'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Eteya — AI som driver ditt företag',
    short_name: 'Eteya',
    description: 'Mindre manuellt. Mer tillväxt. Vi bygger AI-automation som faktiskt levererar resultat.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#C8FF00',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any' as IconPurpose,
      },
      {
        src: '/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any' as IconPurpose,
      },
    ],
    categories: ['business', 'productivity', 'technology'],
    lang: 'sv-SE',
    dir: 'ltr',
  }
}
