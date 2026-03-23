import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
