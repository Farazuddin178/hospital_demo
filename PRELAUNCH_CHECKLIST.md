# Pre-Launch Checklist — Implementation Map

Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS. Run `npm install` then `npm run dev`.

## Legal & Compliance

**1. Privacy Policy page** — [src/app/privacy-policy/page.tsx](src/app/privacy-policy/page.tsx), linked in footer. Replace placeholder clauses with text reviewed by a lawyer before launch.

**2. Terms & Conditions page** — [src/app/terms-conditions/page.tsx](src/app/terms-conditions/page.tsx), linked in footer.

**3. Cookie consent banner** — [src/components/CookieConsent.tsx](src/components/CookieConsent.tsx). Blocks analytics until the user clicks Accept; choice stored in `localStorage` and broadcast via a custom event so [src/components/Analytics.tsx](src/components/Analytics.tsx) only loads Google Analytics after consent.

## Security

**4. Secrets kept off the frontend** — [.env.example](.env.example) documents the split: `NEXT_PUBLIC_*` vars (safe, public identifiers only, e.g. GA ID) vs. server-only vars (SMTP creds, reCAPTCHA secret) read only inside [src/app/api/contact/route.ts](src/app/api/contact/route.ts) / [src/app/api/book-appointment/route.ts](src/app/api/book-appointment/route.ts), which run exclusively on the server. Never prefix real secrets with `NEXT_PUBLIC_`. Add `.env.local` for local dev — already gitignored.

**5. Force HTTPS** — [src/middleware.ts](src/middleware.ts) redirects `http`→`https` at the edge for hosts that pass through plain HTTP. In production, also: enable "Force HTTPS"/HSTS at your host or CDN (Vercel/Netlify/Cloudflare do this by default), and keep the `Strict-Transport-Security` header set in [next.config.mjs](next.config.mjs).

**6. Robust spam protection** — Forms use a honeypot field (`company`, visually hidden, bots fill it) plus server-side rate limiting ([src/lib/rate-limit.ts](src/lib/rate-limit.ts): 5 submissions/IP/min) in both API routes. For higher-traffic production sites, add Google reCAPTCHA v3 or Cloudflare Turnstile (site key is public/`NEXT_PUBLIC_`, secret key stays server-side — placeholders already in `.env.example`) and verify the token server-side before accepting the submission.

## SEO & Discoverability

**7. Meta titles/descriptions for all pages** — Root template in [src/app/layout.tsx](src/app/layout.tsx) (`%s | Oxygen Hospital`); every page exports its own `metadata` (see [src/app/about/page.tsx](src/app/about/page.tsx), [src/app/specialties/[slug]/page.tsx](src/app/specialties/%5Bslug%5D/page.tsx) which generates unique metadata per specialty via `generateMetadata`).

**8. Social preview image** — [src/app/opengraph-image.tsx](src/app/opengraph-image.tsx) generates a 1200×630 OG image automatically at `/opengraph-image` for every route (no manual image asset needed); Twitter card type is set to `summary_large_image` in layout metadata.

**9. Favicon** — `src/app/favicon.ico` (from scaffold) auto-served at `/favicon.ico` and referenced in layout metadata `icons`. Replace with your real logo-based favicon (use [realfavicongenerator.net](https://realfavicongenerator.net) to produce all sizes/formats).

**10. Sitemap & robots.txt** — [src/app/sitemap.ts](src/app/sitemap.ts) and [src/app/robots.ts](src/app/robots.ts) generate `/sitemap.xml` and `/robots.txt` dynamically from the same specialties data used for navigation, so new pages are never missed. Submit the sitemap URL in Google Search Console after launch.

**11. Alt text on all images** — Enforced by `eslint-config-next`'s bundled `jsx-a11y/alt-text` rule (run `npm run lint`, already passing) plus `eslint-plugin-jsx-a11y` as an explicit dependency. All current `<Image>` usages have descriptive `alt` text (see hero image in [src/app/page.tsx](src/app/page.tsx)); enforce this in code review for new images.

**12. Analytics setup** — [src/components/Analytics.tsx](src/components/Analytics.tsx) loads Google Analytics 4 via `next/script`, gated on cookie consent, using `NEXT_PUBLIC_GA_ID` from `.env.local`. Create a GA4 property, add its Measurement ID, and verify events in GA's Realtime view after deploying.

## Performance & UX

**13. Compress all images** — All images render through `next/image` (see [src/app/page.tsx](src/app/page.tsx)), which auto-converts to AVIF/WebP, resizes per `sizes`, and lazy-loads by default (hero uses `priority` intentionally). Before uploading any new source photos, also run them through [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com) to shrink originals.

**14. Page load speed** — Static generation (SSG) for all content pages, route-level code splitting, and self-hosted fonts via `next/font/google` (no external font request, no layout shift) are built in. After deploying, run `npx lighthouse <url> --view` or check web.dev/measure and PageSpeed Insights; target LCP < 2.5s, CLS < 0.1.

**15. Color contrast (accessibility)** — Custom Tailwind palette in [tailwind.config.ts](tailwind.config.ts) documents verified contrast ratios (body text `#1f2937` on white ≈ 12.6:1; primary link/button `brand-700` ≈ 5.4:1; CTA `accent-600` white-on-red ≈ 5.9:1) — all exceed WCAG AA's 4.5:1. Visible focus rings added globally in [globals.css](src/app/globals.css). Re-check with the browser's Lighthouse accessibility audit or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) whenever colors change.

**16. Fully mobile-friendly** — Built mobile-first with Tailwind responsive utilities throughout (`sm:`/`lg:` breakpoints); nav collapses to a `<details>`-based mobile menu requiring no extra JS (see [src/components/Header.tsx](src/components/Header.tsx)). Test with Chrome DevTools device toolbar and Google's Mobile-Friendly Test after deploying.

**17. Custom 404 page** — [src/app/not-found.tsx](src/app/not-found.tsx) — on-brand messaging plus links back to Home and Contact instead of a generic error.

**18. Audit and fix broken links** — `next.config.mjs` includes a `redirects()` block for known legacy URLs (extend as needed). Before launch, crawl the deployed site with a link checker, e.g. `npx linkinator https://yourdomain.com --recurse` or Screaming Frog, and fix/redirect any 404s found.

**19. Form validation on all inputs** — [src/lib/schemas.ts](src/lib/schemas.ts) defines shared Zod schemas used by both the client forms ([src/components/ContactForm.tsx](src/components/ContactForm.tsx), [src/components/AppointmentForm.tsx](src/components/AppointmentForm.tsx) via `react-hook-form` + `@hookform/resolvers`, with inline `aria-invalid`/`role="alert"` errors) and the server API routes (source of truth — client validation is UX only, never trusted alone).

**20. One clear call to action** — "Book Appointment" is the single, consistently-styled primary CTA (solid `accent-600` button) repeated in the header, hero, "Why Choose Us" section, and every specialty page; all other links use a secondary/outline style so the primary action never competes for attention.

## Suggested pre-launch commands

```bash
npm run lint       # accessibility + code quality
npm run build      # verify production build, static generation, sitemap/robots output
npx lighthouse http://localhost:3000 --view   # after `npm run start`
npx linkinator http://localhost:3000 --recurse
```
