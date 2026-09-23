/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

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

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't leak framework/version info
  // Lets a production build run without fighting a dev server for the .next lock.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // No `images` block: every photo is a pre-encoded WebP in /public/images,
  // served from our own origin. Nothing goes through the image optimizer, so
  // there is no `sharp` dependency and no third-party image host to connect to.
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

export default nextConfig;
