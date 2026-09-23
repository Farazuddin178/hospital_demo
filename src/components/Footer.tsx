import Link from "next/link";
import { siteConfig, specialties } from "@/lib/site-data";
import { emergency, locations, patientResourceColumns, trustMarkers } from "@/lib/home-content";

/** The eight specialties people search for most; the rest live on /specialties. */
const footerSpecialties = [
  "cardiology",
  "neurology",
  "orthopedics",
  "pediatrics",
  "gynecology-obstetrics",
  "general-surgery",
  "pulmonology",
  "dermatology",
]
  .map((slug) => specialties.find((s) => s.slug === slug))
  .filter((s): s is (typeof specialties)[number] => Boolean(s));

const visitLinks = patientResourceColumns[0].items;

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-brand-100 transition duration-300 ease-calm hover:border-white/50 hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink-band text-brand-100">
      {/* Emergency line stays visible at the end of every page. */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-300" />
            </span>
            <span className="font-semibold text-white">{emergency.label}</span>
            <span className="text-brand-200">{emergency.note}</span>
          </p>
          <a
            href={`tel:${emergency.phone.replace(/\s/g, "")}`}
            className="shrink-0 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition duration-300 ease-calm hover:bg-white/20"
          >
            {emergency.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 px-6 py-16 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className="col-span-2 lg:col-span-4">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="h-5 w-5">
                <path d="M4.5 22.5h23" />
                <path d="M8.5 22.5a7.5 7.5 0 0 1 15 0" />
                <path d="M16 9V5.5M9.6 11.6 7.2 9.2M22.4 11.6l2.4-2.4" />
              </svg>
            </span>
            <span className="font-display text-xl font-semibold text-white">{siteConfig.name}</span>
          </div>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">
            Multi-specialty care across four Hyderabad campuses, built so that the experience
            is as considered as the medicine.
          </p>

          <div className="mt-6 flex gap-3">
            <Social href={siteConfig.social.facebook} label="Oxygen Hospital on Facebook">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.9.25-1.5 1.53-1.5H16.5V4.3c-.27-.04-1.2-.11-2.28-.11-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08Z" />
              </svg>
            </Social>
            <Social href={siteConfig.social.instagram} label="Oxygen Hospital on Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </Social>
            <Social href={siteConfig.social.youtube} label="Oxygen Hospital on YouTube">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15V9l5.2 3Z" />
              </svg>
            </Social>
          </div>
        </div>

        <nav aria-labelledby="footer-conditions" className="lg:col-span-2">
          <p id="footer-conditions" className="text-sm font-semibold text-white">
            Conditions
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerSpecialties.map((s) => (
              <li key={s.slug}>
                <Link href={`/specialties/${s.slug}`} className="text-brand-200 transition-colors hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/specialties" className="font-medium text-white underline underline-offset-4">
                All 17 specialties
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-patients" className="lg:col-span-2">
          <p id="footer-patients" className="text-sm font-semibold text-white">
            Patients
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {visitLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-brand-200 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/patients#billing" className="text-brand-200 transition-colors hover:text-white">
                Billing and insurance
              </Link>
            </li>
            <li>
              <Link href="/patients#portal" className="text-brand-200 transition-colors hover:text-white">
                Patient portal
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-locations" className="lg:col-span-2">
          <p id="footer-locations" className="text-sm font-semibold text-white">
            Locations
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link href={`/locations#${l.slug}`} className="text-brand-200 transition-colors hover:text-white">
                  {l.area}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/locations#wait-times" className="text-brand-200 transition-colors hover:text-white">
                Wait times
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-brand-200 transition-colors hover:text-white">
                Services
              </Link>
            </li>
          </ul>
        </nav>

        <div className="col-span-2 lg:col-span-2">
          <p className="text-sm font-semibold text-white">Contact</p>
          <address className="mt-4 space-y-2.5 text-sm not-italic text-brand-200">
            <p>{siteConfig.address}</p>
            <p>
              <a href={`tel:${siteConfig.phonePrimary.replace(/\s/g, "")}`} className="transition-colors hover:text-white">
                {siteConfig.phonePrimary}
              </a>
            </p>
            <p>
              <a href={`mailto:${siteConfig.emailAdmin}`} className="break-all transition-colors hover:text-white">
                {siteConfig.emailAdmin}
              </a>
            </p>
            <p>{siteConfig.hours}</p>
          </address>
          <Link
            href="/book-appointment"
            className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-800 transition duration-300 ease-calm hover:bg-brand-50"
          >
            Request Appointment
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 lg:px-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-brand-300">
            {trustMarkers.map((marker) => (
              <li key={marker}>{marker}</li>
            ))}
          </ul>
          <div className="flex flex-col items-start justify-between gap-3 text-xs text-brand-300 sm:flex-row sm:items-center">
            <p>
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="transition-colors hover:text-white">
                Terms &amp; Conditions
              </Link>
              <Link href="/contact" className="transition-colors hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
