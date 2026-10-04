import type { MetadataRoute } from "next";
import { siteConfig, specialties } from "@/lib/site-data";

// The static build serves every page from a folder (/about/), so list the
// final URL rather than one the server has to redirect.
const slash = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" ? "/" : "";
const pageUrl = (path: string) => (path === "" ? `${siteConfig.url}/` : `${siteConfig.url}${path}${slash}`);

// Auto-generated at build/request time — stays in sync with the specialties
// data automatically, so no page is ever forgotten when new content is added.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/contact",
    "/book-appointment",
    "/specialties",
    "/patients",
    "/locations",
    "/privacy-policy",
    "/terms-conditions",
  ].map((path) => ({
    url: pageUrl(path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const specialtyRoutes = specialties.map((s) => ({
    url: pageUrl(`/specialties/${s.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...specialtyRoutes];
}
