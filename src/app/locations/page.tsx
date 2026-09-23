import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car, Check, Clock, MapPin, Phone } from "lucide-react";

import Photo from "@/components/Photo";
import { emergency, locations } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Four Sunrise Hospitals campuses across Hyderabad, with addresses, opening hours, emergency cover, live wait times, parking, and directions.",
  alternates: { canonical: "/locations" },
};

const tel = (value: string) => `tel:${value.replace(/\s/g, "")}`;
const mapsHref = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function LocationsPage() {
  const emergencySites = locations.filter((l) => l.hasEmergency);

  return (
    <>
      <section className="bg-hero-gradient">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 lg:px-8 lg:pb-20 lg:pt-20">
          <span className="eyebrow">Locations</span>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            Four campuses, one record that follows you between them.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">
            Wherever you are seen, your history, scans, and medication list are already there.
            Two campuses run a 24/7 emergency department.
          </p>
        </div>
      </section>

      {/* ---- Wait times ---------------------------------------------------- */}
      <section id="wait-times" className="scroll-mt-32 border-b border-[rgb(var(--hairline))] bg-surface py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-ink">Current wait times</h2>
              <p className="mt-2 max-w-prose text-ink-muted">
                Published rather than estimated, and refreshed every 15 minutes. Patients with
                life-threatening conditions are always seen first, so a posted wait is a median,
                not a promise.
              </p>
            </div>
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <Clock className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
              Updated a few minutes ago
            </p>
          </div>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[rgb(var(--hairline))] bg-[rgb(var(--hairline))] sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => (
              <li key={location.slug} className="bg-surface p-6">
                <p className="text-sm font-medium text-ink">{location.area}</p>
                <p className="mt-2 font-display text-3xl font-semibold text-brand-700 dark:text-brand-300">
                  {location.waitMinutes === null ? "By appt" : `${location.waitMinutes} min`}
                </p>
                <p className="mt-1.5 text-sm text-ink-muted">
                  {location.hasEmergency ? "Emergency department" : location.kind}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-prose text-sm leading-relaxed text-ink-muted">
            {emergency.note}{" "}
            <a href={tel(emergency.phone)} className="link-quiet font-semibold">
              {emergency.phone}
            </a>
          </p>
        </div>
      </section>

      {/* ---- Campuses ------------------------------------------------------ */}
      <section className="bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16 px-6 lg:px-8">
          {locations.map((location, i) => (
            <article
              key={location.slug}
              id={location.slug}
              className="scroll-mt-32 grid items-start gap-10 lg:grid-cols-12 lg:gap-14"
            >
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <Photo
                  name="campus"
                  alt={`${location.name} in ${location.area}`}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="aspect-[3/2] w-full rounded-3xl object-cover"
                />
              </div>

              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl text-ink">{location.name}</h2>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-white/5">
                    {location.kind}
                  </span>
                  {location.hasEmergency && (
                    <span className="rounded-full bg-accent-100 px-2.5 py-1 text-xs font-semibold text-accent-700">
                      24/7 emergency
                    </span>
                  )}
                </div>

                <address className="mt-4 space-y-2.5 text-ink-muted not-italic">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                    {location.address}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                    {location.hours}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                    <a href={tel(location.phone)} className="link-quiet">
                      {location.phone}
                    </a>
                  </p>
                </address>

                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
                  {location.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-4">
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

      {/* ---- Directions & parking ------------------------------------------ */}
      <section id="directions" className="scroll-mt-32 bg-surface-alt py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <span className="eyebrow">Getting here</span>
          <h2 className="section-title">Parking and directions</h2>
          <p className="section-lede">
            Every campus has covered parking and a drop-off bay at the main entrance. Parking is
            free for the first three hours with a validated ticket from any reception desk.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-[rgb(var(--hairline))] bg-surface p-6">
              <Car className="h-6 w-6 text-brand-600" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg text-ink">By car</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">
                Follow signs for Outpatients. The drop-off bay sits directly outside the main
                entrance, with porter assistance available at all hours.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--hairline))] bg-surface p-6">
              <MapPin className="h-6 w-6 text-brand-600" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg text-ink">By metro and bus</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">
                The Banjara Hills and Gachibowli campuses are both within a ten-minute auto ride
                of the nearest metro station. Ask reception for a return auto.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--hairline))] bg-surface p-6">
              <Phone className="h-6 w-6 text-brand-600" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg text-ink">Ambulance</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">
                Our ambulances run from the {emergencySites.map((l) => l.area).join(" and ")}{" "}
                campuses. Call {emergency.phone} and give the operator your location.
              </p>
            </div>
          </div>

          <Link href="/contact" className="link-arrow mt-10">
            Ask us anything about getting here
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
