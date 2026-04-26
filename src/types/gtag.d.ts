/**
 * Global type declarations for Google Tag Manager / gtag.
 *
 * `gtag` is loaded by `@next/third-parties/google` <GoogleAnalytics />
 * but defined globally so consent-storage.ts can call `window.gtag(...)`.
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export {}
