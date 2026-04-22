# Säkerhetsaudit — Eteya AI (eteya.ai)

> Datum: 2026-04-22
> Utfört av: Aline (OpenClaw agent)
> Syfte: Skydda mot penetrationstest av IT-civilingenjörsstudenter

---

## 📊 Sammanfattning

| Komponent | Risk (före) | Risk (efter) | Åtgärd |
|-----------|-------------|--------------|--------|
| Cloudflare Security Level | 🟡 Medium | ✅ **HIGH** | Höjd till HIGH |
| SSRF (scrape-lead) | 🔴 **Critical** | 🟢 **Låg** | URL-validering implementerad |
| Input-validering | 🟡 Medium | 🟢 **Låg** | Sanering på alla inputs |
| Next.js version | 🟡 Medium | 🟢 **Låg** | 16.2.4 (senaste) |
| Rate limiting | 🟡 Medium | 🟢 **Låg** | Finns redan, förstärkt |

---

## 🔴 Kritiska hot (prioritet 1)

### 1. SSRF — Server-Side Request Forgery
**Risk:** 🔴 Critical → 🟢 Låg

**Beskrivning:**
Attackers kan skicka interna URL:er via API-endpoints, vilket ger åtkomst till:
- AWS metadata (`169.254.169.254`)
- Interna nätverk (`10.0.0.0/8`, `192.168.0.0/16`)
- Lokal filesystem (`file:///`)

**Skydd implementerat:**
```typescript
// src/lib/security/index.ts
export function isValidExternalUrl(url: string): boolean {
  // Blockerar:
  // - localhost, 127.0.0.1
  // - 10.x.x.x, 172.16-31.x.x, 192.168.x.x
  // - file:// protokoll
  // - AWS metadata endpoints
}
```

**Verifiering:**
```bash
curl -X POST https://eteya.ai/api/scrape-lead \
  -H "x-api-key: INTERNAL_KEY" \
  -d '{"website": "http://169.254.169.254/"}'
# Expected: {"error": "Invalid website URL"}
```

---

## 🟡 Höga hot (prioritet 2)

### 2. Next.js CVE-2025-29927
**Risk:** 🔴 Critical (Middleware Bypass)

**Status:** ✅ **Åtgärdat** — Next.js uppgraderad till 16.2.4

**Beskrivning:**
Middleware authorization bypass som tillät obehörig åtkomst till skyddade routes.

**Verifiering:**
```bash
npm list next
# next@16.2.4 ✓ (patched)
```

### 3. Next.js CVE-2025-57822
**Risk:** 🔴 Critical (SSRF i Middleware)

**Status:** ✅ **Åtgärdat** — Next.js uppgraderad till 16.2.4

---

## 🟢 Låga hot (accepterad risk)

### 4. XSS (Cross-Site Scripting)
**Risk:** 🟡 Medium → 🟢 Låg

**Skydd:**
- ✅ CSP-headers i next.config.ts
- ✅ HTML-escaping i email-mallar
- ✅ Next.js inbyggt XSS-skydd

### 5. CSRF (Cross-Site Request Forgery)
**Risk:** 🟡 Medium → 🟢 Låg

**Skydd:**
- ✅ POST-endpoints kräver API-nyckel
- ✅ SameSite cookies (via Cloudflare)
- ✅ CORS restriktioner

### 6. DDoS / Rate Limiting
**Risk:** 🟡 Medium → 🟢 Låg

**Skydd:**
- ✅ Cloudflare DDoS Protection (alltid aktiv)
- ✅ Security Level = HIGH
- ✅ API rate limits:
  - `/api/contact`: 3/h per IP
  - `/api/lead-capture`: 5/h per IP
  - `/api/webhook/cal`: 5/min per IP

---

## 🛡️ Implementerade åtgärder

### A. Cloudflare-konfiguration

```
Security Level: HIGH
DDoS Protection: Alltid aktiv
SSL/TLS: Full (Strict)
DNSSEC: Aktiverat
```

**Gratisplan-begränsningar:**
- ❌ Firewall Rules via API (ej tillgängligt)
- ❌ WAF Managed Rules (kräver betalplan)
- ✅ Security Level (tillgängligt)
- ✅ DDoS Protection (alltid aktiv)

### B. Kodsäkerhet

| Fil | Åtgärd |
|-----|--------|
| `src/lib/security/index.ts` | **NY** — Security utilities |
| `src/app/api/scrape-lead/route.ts` | SSRF-skydd + input-sanering |
| `next.config.ts` | CSP-headers + säkerhetsheaders |

### C. Security Utilities

```typescript
// Tillgängliga funktioner:
isValidExternalUrl(url)     // SSRF-skydd
sanitizeString(input)         // Input-rengöring
sanitizeEmail(email)        // Email-validering
sanitizeCompanyName(name)   // Företagsnamn-rengöring
isValidEmail(email)         // Email-format-check
isHoneypotFilled(body)      // Bot-detektering
validateApiKey(req, envKey) // API-nyckel-validering
RateLimiter                 // Rate limiting class
getSecurityHeaders()        // Säkerhetsheaders
```

---

## 🔧 Incident-responsplan

### Om attack upptäcks:

1. **Omedelbart:** Kolla Cloudflare Analytics för misstänkt trafik
2. **Inom 5 min:** Öka Security Level till "Under Attack"
3. **Inom 15 min:** Granska server-logs för attackvektor
4. **Inom 30 min:** Implementera tillfällig blockering av attackerande IP
5. **Inom 1h:** Dokumentera attack och uppdatera säkerhetsåtgärder

### Kontakt:
- **Filip Thai:** filip@telestore.se
- **Aline (OpenClaw):** #mission-control

---

## 📋 Verifieringschecklista

- [x] Cloudflare Security Level = HIGH
- [x] Next.js uppdaterad till senaste version
- [x] SSRF-skydd i scrape-lead
- [x] Input-sanering på alla API-endpoints
- [x] Rate limiting på alla publika endpoints
- [x] Honeypot-fält i formulär
- [x] API-nyckel-auth på interna endpoints
- [x] Security headers (CSP, HSTS, etc.)
- [x] Dokumentation skapad

---

## 🎯 Rekommendationer (framtid)

### Kortsiktigt (inom 1 vecka):
1. **Penetrationstest:** Kör OWASP ZAP eller Burp Suite mot sajten
2. **Loggövervakning:** Sätt upp alerts för misstänkt trafik
3. **Backup:** Verifiera att Vercel-deployments kan återställas

### Medellångsiktigt (inom 1 månad):
1. **WAF övervägning:** Uppgradera Cloudflare till Pro för WAF-regler
2. **Automatiska uppdateringar:** Sätt upp Dependabot för npm
3. **Säkerhetsschema:** Veckovisa säkerhetsgranskningar

### Långsiktigt:
1. **Bug bounty:** Överväg att sätta upp responsible disclosure
2. **Säkerhetsrevision:** Årlig extern pentest

---

*Senast uppdaterad: 2026-04-22 12:30 UTC*
*Nästa revision: 2026-04-29*
