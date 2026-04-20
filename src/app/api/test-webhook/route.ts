import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name = 'Filip Test',
      email = 'filip@eteya.ai',
      company = 'Eteya AI',
      website = 'https://eteya.ai',
      service = 'AI-automatisering',
      bookingDate = new Date().toISOString(),
      roiData = null,
    } = body

    // Simulera Cal.com BOOKING_CREATED event
    const calPayload = {
      event: 'BOOKING_CREATED',
      triggerEvent: 'BOOKING_CREATED',
      payload: {
        responses: {
          name,
          email,
          company,
          service,
          notes: `Test-bokning från /api/test-webhook`,
        },
        metadata: {
          company,
          website,
          roiData,
        },
        title: service,
        description: 'Test-bokning för webhook-verifiering',
        startTime: bookingDate,
        start: bookingDate,
        attendees: [
          {
            name,
            email,
          },
        ],
      },
    }

    // Anropa vår egen webhook
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhook/cal`

    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cal-signature': 'test-skip-validation', // Will be skipped if no secret set
      },
      body: JSON.stringify(calPayload),
      signal: AbortSignal.timeout(60000),
    })

    const webhookResult = await webhookRes.json()

    if (!webhookRes.ok) {
      return NextResponse.json(
        { error: 'Webhook failed', details: webhookResult },
        { status: webhookRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Test webhook executed successfully',
      leadData: {
        name,
        email,
        company,
        service,
        bookingDate,
      },
      webhookResponse: webhookResult,
      note: 'PDF generation runs async — check Supabase Storage in ~30-60s',
    })
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test webhook endpoint',
    usage: 'POST with { name, email, company, website?, service, bookingDate?, roiData? }',
    example: {
      name: 'Filip Test',
      email: 'filip@eteya.ai',
      company: 'Eteya AI',
      website: 'https://eteya.ai',
      service: 'AI-automatisering',
      roiData: {
        annualSavings: 390000,
        totalHours: 20,
        fte: 0.5,
        roi: 156,
        payback: 3,
      },
    },
  })
}