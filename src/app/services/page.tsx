import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Photo, { type PhotoName } from "@/components/Photo";
import { services, siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our emergency, outpatient, and inpatient care services, available 24/7 with advanced medical facilities.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      <span className="eyebrow">What we offer</span>
      <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
        Care delivered across every stage of a patient journey.
      </h1>
      <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">
        Three service lines cover the whole path through {siteConfig.name}, from the ambulance
        bay to the follow-up call after you go home.
      </p>

      <ul className="mt-14 grid gap-8 sm:grid-cols-3">
        {services.map((s) => (
          <li key={s.name} className="overflow-hidden rounded-3xl border border-[rgb(var(--hairline))]">
            <Photo
              name={s.image as PhotoName}
              alt={`${s.name} at ${siteConfig.name}`}
              sizes="(min-width: 640px) 32vw, 90vw"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="p-7">
              <span
                aria-hidden="true"
                className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-white/5"
              >
                <s.Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <h2 className="mt-5 font-display text-xl text-ink">{s.name}</h2>
              <p className="mt-2.5 leading-relaxed text-ink-muted">{s.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex flex-col gap-6 rounded-3xl bg-surface-alt px-8 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <div>
          <h2 className="font-display text-2xl text-ink">Not sure which you need?</h2>
          <p className="mt-2 max-w-xl leading-relaxed text-ink-muted">
            Search a symptom on the homepage, or ask our care team and they will route you.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/book-appointment" className="btn-primary !px-6 !py-3">
            Request Appointment
          </Link>
          <Link href="/specialties" className="btn-secondary !px-6 !py-3">
            All specialties
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
