import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot field filled in => silently pretend success so bots don't learn they were caught.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  // Secrets (SMTP credentials, CRM API keys, etc.) are read from server-only env vars here —
  // they are never bundled into client JS because this file only ever runs on the server
  // and none of these vars use the NEXT_PUBLIC_ prefix.
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_TO_EMAIL) {
    // TODO: send email via nodemailer/SES/SendGrid using the above server-only credentials.
  } else {
    console.log("[contact] new message (email not configured):", parsed.data);
  }

  return NextResponse.json({ ok: true });
}
