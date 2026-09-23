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
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-4xl rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-card backdrop-blur dark:border-slate-700/60 dark:bg-slate-800/95"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          We use cookies to analyze site traffic and improve your experience. Read our{" "}
          <a href="/privacy-policy" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-300">Privacy Policy</a>.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => choose("denied")}
            className="btn-secondary !px-4 !py-2 text-sm"
          >
            Decline
          </button>
          <button
            onClick={() => choose("granted")}
            className="btn-primary !px-4 !py-2 text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
