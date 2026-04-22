// Security utilities for Eteya API routes

// SSRF Protection: Block internal/private IP ranges
const BLOCKED_HOSTS = [
  // Private ranges
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  // Cloud metadata endpoints
  '169.254.169.254',
  // Internal kubernetes
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
]

const BLOCKED_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^fc00:/i,
  /^fe80:/i,
  /^::/,
]

// Allowed protocols only
const ALLOWED_PROTOCOLS = ['http:', 'https:']

export function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    
    // Only allow http/https
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return false
    }
    
    const hostname = parsed.hostname.toLowerCase()
    
    // Block exact matches
    if (BLOCKED_HOSTS.includes(hostname)) {
      return false
    }
    
    // Block patterns
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(hostname)) {
        return false
      }
    }
    
    return true
  } catch {
    return false
  }
}

// Rate limiter with persistent storage
interface RateLimitRecord {
  count: number
  resetTime: number
}

export class RateLimiter {
  private store: Map<string, RateLimitRecord>
  private maxRequests: number
  private windowMs: number
  
  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.store = new Map()
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }
  
  check(ip: string): boolean {
    const now = Date.now()
    const record = this.store.get(ip)
    
    if (!record || now > record.resetTime) {
      this.store.set(ip, { count: 1, resetTime: now + this.windowMs })
      return true
    }
    
    if (record.count >= this.maxRequests) {
      return false
    }
    
    record.count++
    return true
  }
  
  // Clean old entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [ip, record] of this.store) {
      if (now > record.resetTime) {
        this.store.delete(ip)
      }
    }
  }
}

// Input sanitization
export function sanitizeString(input: string): string {
  return input
    .trim()
    .slice(0, 500) // Max 500 chars
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control chars
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 254)
}

export function sanitizeCompanyName(name: string): string {
  return name
    .trim()
    .slice(0, 200)
    .replace(/[<>\"]/g, '') // Remove HTML chars
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Honeypot check
export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  // Check honeypot fields that should be empty
  const honeypotFields = ['website', '_gotcha', 'honeypot']
  return honeypotFields.some(field => {
    const value = body[field]
    return value !== undefined && value !== '' && value !== null
  })
}

// API key validation
export function validateApiKey(req: Request, envKey: string | undefined): boolean {
  const apiKey = req.headers.get('x-api-key')
  return !!(apiKey && envKey && apiKey === envKey)
}

// Payload size limit
export const MAX_PAYLOAD_SIZE = 10 * 1024 // 10KB

// Security headers helper
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}