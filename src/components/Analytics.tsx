// Optional analytics snippet behind a simple consent flag in localStorage
"use client";
import {useEffect, useState} from 'react';

export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const [consent, setConsent] = useState(false);
  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        setConsent(false);
        return;
      }
      
      // Access localStorage object first - this is what throws SecurityError
      const storage = window.localStorage;
      const consentValue = storage.getItem('analytics_consent');
      setConsent(consentValue === 'true');
    } catch (e) {
      // localStorage blocked - default to false
      setConsent(false);
    }
  }, []);
  if (!consent) return null;
  if (plausibleDomain) {
    return (
      <script
        defer
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
      />
    );
  }
  if (umamiId) {
    return (
      <script
        async
        src="https://analytics.umami.is/script.js"
        data-website-id={umamiId}
      />
    );
  }
  return null;
}

