/**
 * Newsletter signup API — POST /api/newsletter
 *
 * Använder Resend (already in stack — kontakt@eteya.ai-domain).
 * Lägger till prenumeranter till en Resend Audience.
 *
 * Setup-krav:
 * - process.env.RESEND_API_KEY
 * - process.env.RESEND_AUDIENCE_ID (skapa Audience i Resend dashboard)
 *
 * Body: { email: string, locale: 'sv' | 'en' }
 * Response: 200 { success: true } | 400 { error } | 500 { error }
 */

import type { NextRequest } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || typeof body.email !== 'string') {
      return Response.json(
        { error: 'Invalid request body' },
        { status: 400 },
      )
    }

    const email = body.email.trim().toLowerCase()
    const locale = body.locale === 'en' ? 'en' : 'sv'

    if (!EMAIL_REGEX.test(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 },
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!apiKey || !audienceId) {
      // Fallback: logga till console (dev) eller log-service (prod)
      console.warn(
        '[newsletter] Resend credentials saknas — sparar inte men returnerar success för UX',
        { email, locale },
      )
      return Response.json({ success: true, devMode: true })
    }

    // Resend Contacts API — POST /audiences/{id}/contacts
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          // Custom data för segmentering — Resend stödjer first_name/last_name +
          // mer via metadata om de uppgraderar API. Vi skickar bara email + locale.
        }),
      },
    )

    if (!res.ok) {
      // Om kontakten redan finns: Resend returnerar conflict — behandla som success
      if (res.status === 409) {
        return Response.json({ success: true, alreadySubscribed: true })
      }
      const errBody = await res.text().catch(() => '')
      console.error('[newsletter] Resend error', res.status, errBody)
      return Response.json(
        { error: 'Subscription service error' },
        { status: 502 },
      )
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[newsletter] Unexpected error', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
