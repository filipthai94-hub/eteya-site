import { NextRequest, NextResponse } from 'next/server'

const submissions = new Map<string, number[]>()
const RATE_LIMIT = 3
const RATE_WINDOW = 60 * 60 * 1000

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, service, message, website, _ts } = body

    if (website) {
      return NextResponse.json({ ok: true })
    }

    if (_ts && Date.now() - _ts < 3000) {
      return NextResponse.json({ ok: true })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const now = Date.now()
    const userSubs = (submissions.get(ip) || []).filter((t) => now - t < RATE_WINDOW)

    if (userSubs.length >= RATE_LIMIT) {
      return NextResponse.json({ error: 'För många förfrågningar. Försök igen senare.' }, { status: 429 })
    }

    userSubs.push(now)
    submissions.set(ip, userSubs)

    if (!name?.trim() || !email?.trim() || !company?.trim() || !service?.trim()) {
      return NextResponse.json({ error: 'Vänligen fyll i alla obligatoriska fält.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ogiltig e-postadress.' }, { status: 400 })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(RESEND_API_KEY)

      await resend.emails.send({
        from: 'Eteya <noreply@eteya.ai>',
        to: ['kontakt@eteyaconsulting.se'],
        subject: `Ny förfrågan: ${name} — ${service}`,
        html: `
          <h2>Ny förfrågan från eteya.ai</h2>
          <p><strong>Namn:</strong> ${escapeHtml(name.trim())}</p>
          <p><strong>E-post:</strong> ${escapeHtml(email.trim())}</p>
          <p><strong>Företag:</strong> ${escapeHtml(company.trim())}</p>
          <p><strong>Tjänst:</strong> ${escapeHtml(service.trim())}</p>
          ${message ? `<p><strong>Meddelande:</strong> ${escapeHtml(message.trim())}</p>` : ''}
          <hr />
          <p style="color: #666; font-size: 12px;">Skickat via eteya.ai kontaktformulär</p>
        `,
      })
    } else {
      console.log('=== NEW CONTACT FORM SUBMISSION ===')
      console.log({ name, email, company, service, message })
      console.log('===================================')
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Något gick fel. Försök igen.' }, { status: 500 })
  }
}
