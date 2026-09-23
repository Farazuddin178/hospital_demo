import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import { siteConfig } from "@/lib/site-data";
import "./globals.css";

// Both faces are self-hosted and subset by next/font, so there is no request to
// a font CDN and no flash of invisible text. Two families is the ceiling:
// Inter carries every pixel of UI, the serif is display-only.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const displaySerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Runs before hydration to set the light/dark class synchronously, avoiding a
// flash of the wrong theme when a returning visitor has picked dark mode.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

// metadataBase + title template mean every page only needs to set its own
// `title`/`description`; OG/Twitter tags inherit sensible defaults automatically.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Multi-specialty hospital offering emergency, inpatient, and outpatient care with 24/7 support in Hyderabad.",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d141a" },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hospital",
  name: siteConfig.name,
  url: siteConfig.url,
  telephone: siteConfig.phonePrimary,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${displaySerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-surface font-sans text-ink antialiased">
        {/* Keyboard users can jump straight past the nav to the page content */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieConsent />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
