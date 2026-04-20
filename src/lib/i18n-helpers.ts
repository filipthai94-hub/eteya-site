import { routing } from '@/i18n/routing'

/**
 * Get localized path based on current locale
 * Usage: getPath('/om-oss', 'sv') → '/sv/om-oss'
 *        getPath('/om-oss', 'en') → '/en/about'
 */
export function getPath(path: string, locale: string): string {
  const pathnames = routing.pathnames
  
  // Find matching pathname config
  for (const [internalPath, config] of Object.entries(pathnames)) {
    if (typeof config === 'object' && config !== null) {
      // Localized path
      if (config[locale as keyof typeof config] === path || internalPath === path) {
        const localizedPath = config[locale as keyof typeof config] as string
        return `/${locale}${localizedPath}`
      }
    } else if (config === path || internalPath === path) {
      // Non-localized path
      return `/${locale}${config}`
    }
  }
  
  // Fallback: return path as-is with locale prefix
  return `/${locale}${path}`
}

/**
 * Get current locale from pathname
 */
export function getLocaleFromPathname(pathname: string | null): string {
  if (!pathname) return routing.defaultLocale
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return routing.defaultLocale
  const firstSegment = segments[0]
  if (routing.locales.includes(firstSegment as any)) {
    return firstSegment
  }
  return routing.defaultLocale
}
