import Link from "next/link";
import { siteConfig, specialties } from "@/lib/site-data";
import { locations, patientResourceColumns, trustMarkers } from "@/lib/home-content";

const mainHospital = locations[0];

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

export default function Footer() {
  return (
    <footer className="bg-ink-band text-brand-100">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 px-6 py-16 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className="col-span-2 lg:col-span-4">
          <div className="flex items-center gap-3">
            {/* The shield's white interior keeps the logo legible on this dark band;
                the area outside the shield is transparent, so no white box shows. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.logo}
              alt=""
              width={151}
              height={176}
              loading="lazy"
              decoding="async"
              className="h-14 w-auto shrink-0"
            />
            <span>
              <span className="block font-display text-xl font-semibold text-white">{siteConfig.name}</span>
              <span className="mt-1 block text-xs text-brand-200">{siteConfig.legalName}</span>
            </span>
          </div>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">
            <strong className="font-semibold text-white">{siteConfig.hospitalName}</strong> delivers
            quality multi-specialty healthcare across its two Hyderabad branches, combining expert
            care with modern medical facilities.
          </p>

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

        <nav aria-labelledby="footer-patients" className="lg:col-span-3">
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

        <div className="col-span-2 lg:col-span-3">
          <p className="text-sm font-semibold text-white">Contact</p>
          <address className="mt-4 text-sm not-italic leading-relaxed text-brand-200">
            <span className="block font-semibold text-white">{mainHospital.name}</span>
            <span className="mt-1 block">{mainHospital.address}</span>
            <a
              href={`tel:${mainHospital.phone.replace(/[\s-]/g, "")}`}
              className="mt-1 inline-block transition-colors hover:text-white"
            >
              {mainHospital.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="mt-1 block transition-colors hover:text-white">
              {siteConfig.email}
            </a>
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
              &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
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
