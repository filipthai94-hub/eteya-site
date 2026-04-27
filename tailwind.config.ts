import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Inkludera content-mappen så att Tailwind ser MDX-blog-artiklar
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'et-bg': '#080808',
        'et-surface': '#111111',
        'et-muted': '#1A1A1A',
        'et-primary': '#F5F5F5',
        'et-secondary': '#9B9B9B',
        'et-accent': '#6EE7B7',
        'et-accent-dim': '#064E3B',
        'et-border': '#222222',
        // Eteya brand-yellow (matchar --accent från globals.css + Cal.com brand)
        'eteya-yellow': '#C8FF00',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}

export default config
