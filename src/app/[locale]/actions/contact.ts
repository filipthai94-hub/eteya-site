'use server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(200).optional(),
  service: z.string().optional(),
  message: z.string().min(10).max(2000),
  website: z.string().max(0),
  'cf-turnstile-response': z.string().min(1, 'Spam-skydd krävs'),
})

export async function sendContactEmail(_prevState: unknown, formData: FormData) {
  const rawData = Object.fromEntries(formData)
  console.log(' Rådata från formulär:', rawData)
  
  const result = schema.safeParse(rawData)
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    console.log('❌ Valideringsfel:', fieldErrors)
    
    // Bygg detaljerat felmeddelande
    const errors: string[] = []
    if (fieldErrors.name) errors.push('Namn är ogiltigt')
    if (fieldErrors.email) errors.push('Email är ogiltigt')
    if (fieldErrors.message) errors.push('Meddelandet är för kort (minst 10 tecken)')
    if (fieldErrors['cf-turnstile-response']) errors.push('Spam-skydd saknas eller är ogiltigt')
    if (fieldErrors.website) errors.push('Website fältet får inte fyllas i')
    
    console.log('❌ Detaljerade fel:', errors)
    
    if (fieldErrors['cf-turnstile-response']?.[0]) {
      return { error: 'Spam-skydd misslyckades. Försök igen.' }
    }
    return { error: `Ogiltiga uppgifter: ${errors.join(', ')}` }
  }
  if (result.data.website) return { success: true }

  // Verify Turnstile token with Cloudflare
  const turnstileToken = result.data['cf-turnstile-response']
  const turnstileVerification = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    }
  )
  const turnstileResult = await turnstileVerification.json()
  
  if (!turnstileResult.success) {
    return { error: 'Spam-skydd misslyckades. Försök igen.' }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'noreply@eteya.ai',
      to: 'filip@eteya.ai',
      subject: `Ny förfrågan från ${result.data.name}`,
      html: `
        <p><strong>Namn:</strong> ${result.data.name}</p>
        <p><strong>Email:</strong> ${result.data.email}</p>
        ${result.data.company ? `<p><strong>Företag:</strong> ${result.data.company}</p>` : ''}
        ${result.data.service ? `<p><strong>Tjänst:</strong> ${result.data.service}</p>` : ''}
        <p><strong>Meddelande:</strong></p>
        <p>${result.data.message.replace(/\n/g, '<br/>')}</p>
      `,
    })
    return { success: true }
  } catch {
    return { error: 'Kunde inte skicka meddelandet. Försök igen.' }
  }
}
