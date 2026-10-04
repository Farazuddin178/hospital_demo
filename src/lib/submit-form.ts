import { siteConfig } from "@/lib/site-data";

/**
 * Where the contact and appointment forms send their data. next.config.mjs
 * defaults this to "/api":
 *
 * - Server build (`npm run build`): the API routes in src/app/api.
 * - Static build on GoDaddy (`npm run build:static`): the PHP mailer in
 *   public/api, which emails the submission to the hospital.
 *
 * Point NEXT_PUBLIC_API_URL at a separate backend once one exists.
 */
export const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";

/** Digits only, with the country code, as wa.me expects. */
const whatsAppNumber = siteConfig.appointmentsPhone.replace(/\D/g, "");

/**
 * A WhatsApp chat with the hospital, pre-filled with the visitor's request.
 * Offered only when sending fails, so a request is never simply lost.
 */
export function whatsAppUrl(text: string) {
  return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(text)}`;
}

export async function submitForm(endpoint: "contact" | "book-appointment", data: Record<string, unknown>) {
  const res = await fetch(`${apiBase}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
}
