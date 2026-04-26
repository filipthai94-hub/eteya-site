/**
 * Google Consent Mode v2 — default state initializer.
 *
 * MUST run BEFORE GA4 loads. We use `strategy="beforeInteractive"` to ensure
 * this script is in <head> and executes before any tracking scripts.
 *
 * Default state for EEA/UK/CH = denied (user must opt-in via cookie banner).
 * Default state for non-EEA = granted (still respects user choice if banner shown).
 *
 * Mandatory since Google Consent Mode v2 enforcement (March 2024).
 *
 * Source: https://developers.google.com/tag-platform/security/guides/consent
 */

import Script from 'next/script'

export function ConsentDefault() {
  return (
    <Script id="gtag-consent-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;

        // Default consent state for EEA + UK + CH = denied (user must opt-in)
        gtag('consent', 'default', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'analytics_storage': 'denied',
          'functionality_storage': 'granted',
          'security_storage': 'granted',
          'wait_for_update': 500,
          'region': ['AT','BE','BG','CH','CY','CZ','DE','DK','EE','ES','FI','FR','GB','GR','HR','HU','IE','IS','IT','LI','LT','LU','LV','MT','NL','NO','PL','PT','RO','SE','SI','SK']
        });

        // Default consent state outside EEA = granted (US, etc.)
        gtag('consent', 'default', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'analytics_storage': 'granted',
          'functionality_storage': 'granted',
          'security_storage': 'granted'
        });

        // Privacy hardening: redact ad data + pass URL data without storage
        gtag('set', 'ads_data_redaction', true);
        gtag('set', 'url_passthrough', true);
      `}
    </Script>
  )
}
