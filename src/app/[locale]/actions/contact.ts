'use server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  website: z.string().max(0),
})

export async function sendContactEmail(_prevState: unknown, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { error: 'Ogiltiga uppgifter. Kontrollera formuläret.' }
  if (result.data.website) return { success: true }

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
        <p><strong>Meddelande:</strong></p>
        <p>${result.data.message.replace(/\n/g, '<br/>')}</p>
      `,
    })
    return { success: true }
  } catch {
    return { error: 'Kunde inte skicka meddelandet. Försök igen.' }
  }
}
