import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import Photo from "@/components/Photo";
import { siteConfig } from "@/lib/site-data";
import { emergency, locations } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Oxygen Multi Specialty Hospital branches at Chandrayangutta and Falaknuma, Hyderabad. Addresses, phone numbers, and directions.",
  alternates: { canonical: "/locations" },
};

const tel = (value: string) => `tel:${value.replace(/\s/g, "")}`;
const mapsHref = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function LocationsPage() {
  return (
    <>
      {/* The page opens straight on the branches, so the heading is for screen
          readers and search engines only. */}
      <h1 className="sr-only">{siteConfig.hospitalName} locations</h1>

      {/* ---- Branches ------------------------------------------------------ */}
      <section className="bg-surface pb-16 pt-12 lg:pb-20 lg:pt-16">
        <div className="mx-auto max-w-7xl space-y-14 px-6 lg:space-y-16 lg:px-8">
          {locations.map((location, i) => (
            <article
              key={location.slug}
              id={location.slug}
              className="scroll-mt-28 grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
            >
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <Photo
                  name="campus"
                  alt=""
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="aspect-[3/2] w-full rounded-3xl object-cover"
                />
              </div>

              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h2 className="font-display text-2xl text-ink sm:text-[1.75rem]">{location.name}</h2>
                  {location.tag && (
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-white/5 dark:text-brand-200">
                      {location.tag}
                    </span>
                  )}
                </div>

                <address className="mt-5 space-y-3 not-italic text-ink-muted">
                  <p className="flex items-start gap-2.5 leading-relaxed">
                    <MapPin className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                    {location.address}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                    <a href={tel(location.phone)} className="link-quiet font-medium">
                      {location.phone}
                    </a>
                  </p>
                </address>

                <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
                  <Link href="/book-appointment" className="btn-primary !px-6 !py-3">
                    Request Appointment
                  </Link>
                  <a
                    href={mapsHref(`${location.name}, ${location.address}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !px-6 !py-3"
                  >
                    Get directions
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---- Emergency contacts -------------------------------------------- */}
      <section id="emergency" className="scroll-mt-28 bg-surface-alt py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-display text-2xl text-ink">Emergency contacts</h2>
          <p className="mt-2 max-w-prose text-ink-muted">
            Call the branch nearest to you before you set out, so the team is ready when you
            arrive.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {locations.map((location) => (
              <li
                key={location.slug}
                className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-hairline sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-ink">{location.area}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{location.tag ?? location.name}</p>
                </div>
                <a href={tel(location.phone)} className="btn-primary !px-5 !py-3 whitespace-nowrap">
                  <Phone className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  {location.phone}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-prose text-sm leading-relaxed text-ink-muted">{emergency.note}</p>
        </div>
      </section>
    </>
  );
}
