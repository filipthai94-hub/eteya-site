/**
 * Test Cal.com Webhook Locally
 * 
 * Simulerar ett Cal.com BOOKING_CREATED event
 * Kör samma kod som production webhook
 * 
 * Användning:
 *   node test-webhook-local.mjs
 */

import { readFile } from 'fs/promises'

// Mock Cal.com payload (exakt vad som skickas från Cal.com)
const mockCalPayload = {
  triggerEvent: 'BOOKING_CREATED',
  payload: {
    title: 'Strategimöte',
    description: 'Test av ROI booking',
    startTime: new Date().toISOString(),
    attendees: [{ name: 'Filip Thai', email: 'filip@telestore.se' }],
    responses: {
      name: 'Filip Thai',
      email: 'filip@telestore.se',
      company: 'Telestore',
      service: 'AI-automatisering',
      notes: 'Test av ROI booking',
    },
    metadata: {
      company: 'Telestore',
      service: 'AI-automatisering',
      source: 'roi-calculator',
      annualSavings: '390000',
      totalHours: '20',
      roi: '156',
      payback: '3',
      hourlyRate: '350',
      year1: '390000',
      year2: '780000',
      year3: '1170000',
    },
  },
}

console.log('🧪 Testing Cal.com webhook locally...\n')
console.log('📦 Mock payload:')
console.log(JSON.stringify(mockCalPayload, null, 2))
console.log('\n')

// Load env vars
const envLocal = await readFile('.env.local', 'utf-8')
envLocal.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    process.env[key.trim()] = value.trim()
  }
})

console.log('✅ Env vars loaded\n')

// Import webhook route
const { POST } = await import('./src/app/api/webhook/cal/route.ts')

// Create mock NextRequest
const mockRequest = {
  text: async () => JSON.stringify(mockCalPayload),
  headers: {
    get: (name: string) => {
      if (name === 'x-cal-signature') return 'test-skip-validation'
      return null
    },
  },
} as any

try {
  console.log('🚀 Calling webhook...\n')
  const response = await POST(mockRequest)
  const json = await response.json()
  
  console.log('✅ Webhook response:', json)
  console.log('\n⏳ Vänta 30-60 sekunder på att PDF genereras...\n')
  console.log('Kolla sedan:')
  console.log('  1. Email till kontakt@eteya.ai')
  console.log('  2. Discord #mission-control')
  console.log('  3. Supabase → eteya_leads → briefing_pdf_url\n')
} catch (error) {
  console.error('❌ Webhook failed:', error)
}
