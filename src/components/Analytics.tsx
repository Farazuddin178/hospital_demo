"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, CONSENT_KEY } from "@/components/CookieConsent";

// GA measurement ID is a public identifier, not a secret — safe to expose via
// NEXT_PUBLIC_*. Real secrets (API keys, service credentials) must never use
// the NEXT_PUBLIC_ prefix; keep those in server-only env vars (see API routes).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(window.localStorage.getItem(CONSENT_KEY) === "granted");

    function onChange(e: Event) {
      setConsented((e as CustomEvent).detail === "granted");
    }
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
