import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Most hosts (Vercel, Netlify, Cloudflare) already terminate TLS and never send
// plain HTTP through, but this middleware forces a redirect for hosts/proxies
// that do pass requests through with x-forwarded-proto=http (e.g. some VPS/Nginx setups).
export function middleware(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto");
  const isLocalhost = request.nextUrl.hostname === "localhost";

  if (proto === "http" && !isLocalhost) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
