import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function verifyCalSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  return expected === signature
}

async function saveToSupabase(data: {
  name: string
  email: string
  company: string
  service: string
  description: string
  roiData: string | null
  bookingDate: string
}) {
  const { ETEYA_SUPABASE_URL, ETEYA_SUPABASE_SERVICE_ROLE_KEY } = process.env
  if (!ETEYA_SUPABASE_URL || !ETEYA_SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase env vars missing, skipping save')
    return
  }

  await fetch(`${ETEYA_SUPABASE_URL}/rest/v1/eteya_leads`, {
    method: 'POST',
    headers: {
      apikey: ETEYA_SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${ETEYA_SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      company: data.company || null,
      service: data.service || null,
      description: data.description || null,
      roi_data: data.roiData ? JSON.parse(data.roiData) : null,
      booking_date: data.bookingDate,
      source: 'cal-webhook',
      gdpr_accepted: true,
    }),
  })
}

async function notifyDiscord(data: {
  company: string
  service: string
  bookingDate: string
}) {
  const { DISCORD_WEBHOOK_URL } = process.env
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('DISCORD_WEBHOOK_URL missing, skipping notification')
    return
  }

  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `🟢 Ny lead: ${data.company} — ${data.service} | Bokat: ${data.bookingDate}`,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    // Verify Cal.com webhook signature
    const signature = req.headers.get('x-cal-signature')
    const secret = process.env.CAL_WEBHOOK_SECRET

    if (secret && signature) {
      if (!verifyCalSignature(rawBody, signature, secret)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } else if (secret && !signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }
    // If no CAL_WEBHOOK_SECRET, skip validation (dev-mode)

    const body = JSON.parse(rawBody)

    // Only handle BOOKING_CREATED
    if (body.event !== 'BOOKING_CREATED' && body.triggerEvent !== 'BOOKING_CREATED') {
      return NextResponse.json({ ok: true, message: 'Event not handled' })
    }

    const payload = body.payload ?? body

    // Extract data
    const name = payload?.responses?.name ?? payload?.attendees?.[0]?.name ?? payload?.title ?? ''
    const email = payload?.responses?.email ?? payload?.attendees?.[0]?.email ?? ''
    const company = payload?.metadata?.company ?? payload?.responses?.company ?? ''
    const service = payload?.title ?? ''
    const description = payload?.description ?? payload?.responses?.notes ?? ''
    const roiData = payload?.metadata?.roiData ?? null
    const bookingDate = payload?.startTime ?? payload?.start ?? new Date().toISOString()

    const formattedDate = new Date(bookingDate).toLocaleDateString('sv-SE', {
      dateStyle: 'long',
    })

    const leadData = {
      name,
      email,
      company,
      service,
      description,
      roiData: roiData ? (typeof roiData === 'string' ? roiData : JSON.stringify(roiData)) : null,
      bookingDate: formattedDate,
    }

    // Save to Supabase + notify Discord in parallel
    await Promise.allSettled([
      saveToSupabase(leadData),
      notifyDiscord(leadData),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Cal webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}