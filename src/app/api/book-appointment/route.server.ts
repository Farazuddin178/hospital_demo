import { NextRequest, NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/schemas";
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
  const parsed = appointmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS, APPOINTMENTS_TO_EMAIL } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS && APPOINTMENTS_TO_EMAIL) {
    // TODO: send email/notify booking system using the server-only credentials above.
  } else {
    console.log("[book-appointment] new request (email not configured):", parsed.data);
  }

  return NextResponse.json({ ok: true });
}
