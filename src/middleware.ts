import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all routes except static files and internal routes
  matcher: [
    '/',
    '/(sv|en)/:path*',
    '/((?!_next|_vercel|.*\\..*|api|llms.txt|llms-full.txt).*)'
  ]
}
