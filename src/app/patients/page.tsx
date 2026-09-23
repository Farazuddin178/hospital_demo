import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import Photo from "@/components/Photo";
import { siteConfig } from "@/lib/site-data";
import { acceptedInsurers, emergency } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Patients & Visitors",
  description:
    "What to bring, visiting hours, accessibility support, insurance and billing, medical records, and patient rights at Sunrise Hospitals.",
  alternates: { canonical: "/patients" },
};

/**
 * Anchor ids here are the contract with the "Patients & Visitors" mega menu in
 * home-content.ts. Renaming one without updating the other leaves a dead link.
 */
type Section = {
  id: string;
  group: string;
  title: string;
  body: string;
  points?: string[];
  cta?: { label: string; href: string };
};

const sections: Section[] = [
  {
    id: "prepare",
    group: "Plan your visit",
    title: "What to bring",
    body: "Arrive 15 minutes before your slot so registration does not eat into your consultation time.",
    points: [
      "A photo ID (Aadhaar, passport, or driving licence)",
      "Your insurance card or corporate health card",
      "A list of current medications, including doses",
      "Any previous scans, reports, or discharge summaries",
      "Your referral letter, if a doctor sent you to us",
    ],
    cta: { label: "Request an appointment", href: "/book-appointment" },
  },
  {
    id: "visiting",
    group: "Plan your visit",
    title: "Visiting hours and guidelines",
    body: "General wards welcome visitors from 11:00am to 12:30pm and 5:00pm to 7:30pm. Intensive care runs a single 30-minute window at 6:00pm.",
    points: [
      "Two visitors per patient at a time in general wards",
      "One attendant may stay overnight in private rooms",
      "Children under 12 are not permitted in critical care areas",
      "Please do not visit if you have a fever, cough, or cold",
    ],
  },
  {
    id: "access",
    group: "Plan your visit",
    title: "Accessibility and interpreters",
    body: "Every campus is step-free from the car park to the ward. Tell us what you need when you book and it will be arranged before you arrive.",
    points: [
      "Wheelchairs and porter assistance at every entrance",
      "Interpreters for Telugu, Hindi, Urdu, Tamil, and Kannada",
      "Sign-language support with 48 hours of notice",
      "Quiet waiting areas for patients who need lower stimulation",
    ],
  },
  {
    id: "insurance",
    group: "Billing & insurance",
    title: "Insurance we accept",
    body: "We work cashless with most major insurers and with CGHS and EHS. If yours is not listed, call us and we will confirm before you travel.",
  },
  {
    id: "estimates",
    group: "Billing & insurance",
    title: "Estimate your costs",
    body: "Any planned procedure comes with a written estimate before you consent to it, split into the insurer portion and your own. If the final bill will exceed the estimate, we tell you while there is still a decision to make.",
  },
  {
    id: "billing",
    group: "Billing & insurance",
    title: "Pay a bill",
    body: "Bills can be settled at any campus billing desk, by bank transfer, or online through the patient portal. Itemised invoices are issued the same day and emailed on request.",
    cta: { label: "Contact the billing team", href: "/contact" },
  },
  {
    id: "assistance",
    group: "Billing & insurance",
    title: "Financial assistance",
    body: "A means-tested assistance scheme covers part or all of treatment costs for patients who need it. Applications are handled confidentially by the medical social work team, and having applied never affects your clinical care.",
  },
  {
    id: "portal",
    group: "Records & results",
    title: "Patient portal",
    body: "The portal holds your appointments, test results, prescriptions, and discharge summaries in one place. Registration happens at your first visit, using the mobile number on your file.",
  },
  {
    id: "records",
    group: "Records & results",
    title: "Request medical records",
    body: "You can request a copy of your own records, or authorise someone else to collect them, at any campus records desk. Standard requests are fulfilled within three working days.",
  },
  {
    id: "results",
    group: "Records & results",
    title: "Test results",
    body: "Laboratory results reach the portal as soon as they are verified, usually within 24 hours. Imaging takes longer because a radiologist reads every study. Abnormal results are always phoned through rather than left for you to find.",
  },
  {
    id: "refills",
    group: "Records & results",
    title: "Prescription refills",
    body: "Request a repeat through the portal or by calling your treating department. Allow two working days for refills that need a doctor to review them.",
  },
  {
    id: "rights",
    group: "Support",
    title: "Patient rights",
    body: "You have the right to an explanation you understand, to a second opinion, to refuse any treatment, to see your own records, and to complain without it affecting your care. Grievances are acknowledged within 48 hours.",
    cta: { label: "Share feedback", href: "/contact" },
  },
  {
    id: "international",
    group: "Support",
    title: "International patients",
    body: "A dedicated coordinator handles visa letters, airport transfers, accommodation near the campus, and treatment estimates in your currency before you travel.",
    cta: { label: "Talk to the international desk", href: "/contact" },
  },
];

const groups = [...new Set(sections.map((s) => s.group))];

export default function PatientsPage() {
  return (
    <>
      <section className="bg-hero-gradient">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 lg:px-8 lg:pb-20 lg:pt-20">
          <span className="eyebrow">Patients &amp; visitors</span>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            Everything you need before you walk through the door.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">
            Practical answers to the questions people actually call us about. If yours is not
            here, our care team will answer it on the phone in under a minute.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/book-appointment" className="btn-primary">
              Request Appointment
            </Link>
            <a href={`tel:${siteConfig.phonePrimary.replace(/\s/g, "")}`} className="btn-secondary">
              Call {siteConfig.phonePrimary}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-20">
        {/* On-page contents. Sticky on large screens, a plain list on small ones. */}
        <nav aria-labelledby="contents" className="lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <h2 id="contents" className="text-sm font-semibold text-ink">
              On this page
            </h2>
            {groups.map((group) => (
              <div key={group} className="mt-5">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-600">
                  {group}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {sections
                    .filter((s) => s.group === group)
                    .map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`} className="text-sm text-ink-muted transition-colors hover:text-brand-700">
                          {s.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="lg:col-span-9">
          <div className="space-y-14">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {section.group}
                </p>
                <h2 className="mt-2 font-display text-2xl text-ink">{section.title}</h2>
                <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">{section.body}</p>

                {section.points && (
                  <ul className="mt-5 space-y-2.5">
                    {section.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-ink-muted">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {section.id === "insurance" && (
                  <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {acceptedInsurers.map((insurer) => (
                      <li
                        key={insurer}
                        className="rounded-xl border border-[rgb(var(--hairline))] px-4 py-3 text-sm font-medium text-ink"
                      >
                        {insurer}
                      </li>
                    ))}
                  </ul>
                )}

                {section.cta && (
                  <Link href={section.cta.href} className="link-arrow mt-5">
                    {section.cta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </section>
            ))}
          </div>

          <div className="mt-16 overflow-hidden rounded-3xl border border-[rgb(var(--hairline))]">
            <Photo name="article-team" sizes="(min-width: 1024px) 66vw, 100vw" className="h-56 w-full object-cover" />
            <div className="bg-surface-alt px-8 py-8">
              <h2 className="font-display text-xl text-ink">Still not sure?</h2>
              <p className="mt-2 max-w-prose leading-relaxed text-ink-muted">
                Call the care team and describe the situation in your own words. They will tell
                you whether you need an appointment, urgent care, or the emergency department.
              </p>
              <p className="mt-4 text-sm text-ink-muted">
                {emergency.label}:{" "}
                <a href={`tel:${emergency.phone.replace(/\s/g, "")}`} className="link-quiet font-semibold">
                  {emergency.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
