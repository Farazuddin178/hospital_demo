"use client";

import { useEffect, useState } from "react";

export const CONSENT_KEY = "cookie_consent";
export const CONSENT_EVENT = "cookie-consent-changed";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  function choose(value: "granted" | "denied") {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      // inset-x-3 (not -4) plus a capped max width keeps this clear of the
      // screen edges on the narrowest phones. The bottom offset adds the
      // device's safe-area inset on top of the base gap, so the buttons never
      // sit under an iPhone's home-indicator bar or an Android gesture pill.
      className="fixed inset-x-3 z-[60] mx-auto max-w-4xl rounded-2xl border border-[rgb(var(--hairline))] bg-surface/95 p-5 shadow-lift backdrop-blur sm:inset-x-4"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          We use cookies to analyze site traffic and improve your experience. Read our{" "}
          <a href="/privacy-policy" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-300">Privacy Policy</a>.
        </p>
        <div className="flex w-full shrink-0 gap-3 sm:w-auto">
          <button
            onClick={() => choose("denied")}
            className="btn-secondary flex-1 !px-4 !py-2 text-sm sm:flex-none"
          >
            Decline
          </button>
          <button
            onClick={() => choose("granted")}
            className="btn-primary flex-1 !px-4 !py-2 text-sm sm:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
