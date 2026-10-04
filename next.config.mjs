/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// Two build targets from one codebase:
//
//   npm run build          Node server (Render, or any future backend host).
//                          API routes, middleware and response headers all run.
//   npm run build:static   Plain HTML/CSS/JS in ./out for GoDaddy shared hosting.
//                          No server, so the API routes and middleware are left
//                          out of the build (not deleted) and public/.htaccess
//                          applies the headers and redirects instead.
//
// Server-only files are named *.server.ts (src/middleware.server.ts and
// src/app/api/**/route.server.ts). Only the server build lists "server.ts" in
// pageExtensions, so only the server build turns them into routes.
const isStatic =
  process.env.STATIC_EXPORT === "1" || process.env.npm_lifecycle_event === "build:static";

// Content-Security-Policy and other hardening headers applied to every response.
// Keep in sync with any third-party scripts (analytics, maps, forms) added later.
// 'unsafe-eval' is required in dev only — Next.js Fast Refresh/webpack eval devtool
// use eval() to run modules. Production builds don't need it and stay strict.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://www.google-analytics.com ${isDev ? "ws://localhost:* ws://127.0.0.1:*" : ""};
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
`;

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy.replace(/\n/g, "") },
  // Forces browsers to only ever connect over HTTPS for the next 2 years, including subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

// Static hosting cannot run these; public/.htaccess carries the same rules.
const serverOnly = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Photography is content-addressed by width in the filename, so a change
        // means a new name. Safe to cache for a year and never revalidate.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Example legacy-URL redirects; add real ones discovered during the broken-link audit.
      { source: "/appointment", destination: "/book-appointment", permanent: true },
    ];
  },
};

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't leak framework/version info
  // Lets a production build run without fighting a dev server for the .next lock.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // No `images` block: every photo is a pre-encoded WebP in /public/images,
  // served from our own origin. Nothing goes through the image optimizer, so
  // there is no `sharp` dependency and no third-party image host to connect to.
  pageExtensions: isStatic ? ["tsx", "ts"] : ["tsx", "ts", "server.ts"],
  env: {
    // Forms post here (see src/lib/submit-form.ts). On the server build that is
    // the API routes; on GoDaddy it is the PHP mailer in public/api, reached
    // through the rewrite rules in public/.htaccess.
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
    NEXT_PUBLIC_STATIC_EXPORT: isStatic ? "1" : "",
  },
  ...(isStatic
    ? {
        output: "export",
        // Writes /locations/index.html rather than /locations.html, so any
        // static host serves clean URLs without rewrite rules.
        trailingSlash: true,
      }
    : serverOnly),
};

export default nextConfig;
