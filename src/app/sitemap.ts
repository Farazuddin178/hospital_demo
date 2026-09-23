import type { MetadataRoute } from "next";
import { siteConfig, specialties } from "@/lib/site-data";

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
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const specialtyRoutes = specialties.map((s) => ({
    url: `${siteConfig.url}/specialties/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...specialtyRoutes];
}
