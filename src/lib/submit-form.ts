import { siteConfig } from "@/lib/site-data";

/**
 * Where the contact and appointment forms send their data.
 *
 * - Server build (`npm run build`, e.g. Render): the API routes in src/app/api,
 *   at "/api". next.config.mjs sets this default.
 * - Static build (`npm run build:static`, e.g. GoDaddy): there is no server, so
 *   this is empty unless NEXT_PUBLIC_API_URL points at a backend. While it is
 *   empty, the request opens in WhatsApp, pre-filled, addressed to the
 *   hospital's appointments number, and the visitor presses send.
 */
export const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

export const usesWhatsApp = apiBase === "";

/** Digits only, with the country code, as wa.me expects. */
const whatsAppNumber = siteConfig.appointmentsPhone.replace(/\D/g, "");

export type SubmitResult = "sent" | "whatsapp";

export async function submitForm(
  endpoint: "contact" | "book-appointment",
  data: Record<string, unknown>,
  whatsAppText: string
): Promise<SubmitResult> {
  if (usesWhatsApp) {
    const url = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppText)}`;
    // A new tab keeps the form page open behind it. If the browser blocks the
    // tab, go there directly instead; on phones this opens the WhatsApp app.
    // ("noopener" is not passed as a feature: it makes window.open return null
    // even on success, which would trigger the fallback as well.)
    const tab = window.open(url, "_blank");
    if (tab) tab.opener = null;
    else window.location.href = url;
    return "whatsapp";
  }

  const res = await fetch(`${apiBase}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Request failed");
  return "sent";
}
