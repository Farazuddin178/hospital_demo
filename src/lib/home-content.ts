/**
 * Homepage & navigation content for the "calm clinical" redesign.
 *
 * Kept separate from site-data.ts so copy edits never touch a component, and so
 * the mega menu / homepage can grow without bloating the original config file.
 * Everything here is server-only (it imports Lucide icon components) — the hero
 * search deliberately reads from `search-index.ts` instead, which ships no icons.
 */
import {
  CalendarDays,
  Clock,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import { services, specialties, type NavItem } from "@/lib/site-data";
import type { SearchEntry } from "@/lib/search";

export const emergency = {
  // Chandrayangutta branch main line, per hospital letterhead.
  phone: "040-24443631",
  label: "24/7 Emergency",
  note: "If this is a medical emergency, call now or go to your nearest emergency room.",
};

/** Pull specialty display names straight from the source list so menus stay in sync. */
const bySlug = new Map(specialties.map((s) => [s.slug, s]));
const toNav = (slugs: string[]): NavItem[] =>
  slugs.flatMap((slug) => {
    const s = bySlug.get(slug);
    return s ? [{ label: s.name, href: `/specialties/${slug}` }] : [];
  });

export type MegaColumn = { heading: string; items: NavItem[] };
export type MegaFeature = { title: string; body: string; href: string; cta: string };
export type MegaMenu = {
  id: string;
  label: string;
  href: string;
  columns: MegaColumn[];
  feature: MegaFeature;
};

/* ---- Locations ---------------------------------------------------------- */

export type Location = {
  slug: string;
  /** Branch name exactly as the hospital supplied it. */
  name: string;
  /** Short qualifier shown as a badge beside the name, e.g. "Main Hospital". */
  tag?: string;
  area: string;
  address: string;
  phone: string;
  /** Confirmed facts about this branch, shown on the homepage card only. */
  highlights: string[];
};

// Both branches as supplied by the hospital (letterhead, and the website change
// list of October 2026). Do not add services, hours or wait times here unless
// the hospital has confirmed them.
export const locations: Location[] = [
  {
    slug: "chandrayangutta",
    name: "Oxygen Multi Specialty Hospital",
    tag: "Main Hospital",
    area: "Chandrayangutta",
    address: "Beside Ruman Hotel, Chandrayangutta, Hyderabad, Telangana",
    phone: "040-24443631",
    highlights: ["100 inpatient beds"],
  },
  {
    slug: "falaknuma",
    name: "Oxygen Multi Specialty Hospital",
    area: "Falaknuma",
    address: "Opposite Nabeel Function Hall, Shamsheer Gunj, Engine Bowli, Hyderabad, Telangana",
    phone: "+91 97001 73631",
    highlights: [],
  },
];

/* ---- Patient resources -------------------------------------------------- */

export const patientResourceColumns: MegaColumn[] = [
  {
    heading: "Plan your visit",
    items: [
      { label: "Request an appointment", href: "/book-appointment" },
      { label: "What to bring", href: "/patients#prepare" },
      { label: "Visiting hours and guidelines", href: "/patients#visiting" },
      { label: "Accessibility and interpreters", href: "/patients#access" },
    ],
  },
  {
    heading: "Billing & insurance",
    items: [
      { label: "Insurance we accept", href: "/patients#insurance" },
      { label: "Estimate your costs", href: "/patients#estimates" },
      { label: "Pay a bill", href: "/patients#billing" },
      { label: "Financial assistance", href: "/patients#assistance" },
    ],
  },
  {
    heading: "Records & results",
    items: [
      { label: "Patient portal", href: "/patients#portal" },
      { label: "Request medical records", href: "/patients#records" },
      { label: "Test results", href: "/patients#results" },
      { label: "Prescription refills", href: "/patients#refills" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Patient rights", href: "/patients#rights" },
      { label: "Share feedback", href: "/contact" },
      { label: "International patients", href: "/patients#international" },
      { label: "Privacy policy", href: "/privacy-policy" },
    ],
  },
];

/* ---- The three mega menus ---------------------------------------------- */

export const megaMenus: MegaMenu[] = [
  {
    id: "conditions",
    label: "Conditions & Treatments",
    href: "/specialties",
    columns: [
      {
        heading: "Heart, lungs & metabolic",
        items: toNav(["cardiology", "pulmonology", "diabetology", "dietetics"]),
      },
      {
        heading: "Brain, bones & movement",
        items: toNav(["neurology", "psychiatry", "orthopedics", "physiotherapy"]),
      },
      {
        heading: "Women, children & family",
        items: toNav(["gynecology-obstetrics", "pediatrics", "general-medicine", "dermatology"]),
      },
      {
        heading: "Surgery & critical care",
        items: toNav([
          "general-surgery",
          "trauma-care",
          "anesthesia-intensive-care",
          "gastroenterology",
          "ent",
        ]),
      },
    ],
    feature: {
      title: "Not sure where to start?",
      body: "Describe a symptom in the search bar and we will point you to the right specialty. Or call us, and someone will help you decide.",
      href: "/specialties",
      cta: "Browse all 17 specialties",
    },
  },
  {
    id: "patients",
    label: "Patients & Visitors",
    href: "/patients",
    columns: patientResourceColumns,
    feature: {
      title: "Your first visit, made simple",
      body: "Arrive 15 minutes early with a photo ID, your insurance card, and a list of current medications. That is genuinely all we need.",
      href: "/patients#prepare",
      cta: "Prepare for your visit",
    },
  },
  {
    id: "locations",
    label: "Locations",
    href: "/locations",
    columns: [
      {
        heading: "Hospitals",
        items: locations.map((l) => ({
          label: l.tag ? `${l.name} - ${l.tag}` : l.name,
          detail: l.area,
          href: `/locations#${l.slug}`,
        })),
      },
      {
        heading: "Getting here",
        items: [
          { label: "Addresses and directions", href: "/locations" },
          { label: "Emergency contacts", href: "/locations#emergency" },
          { label: "Contact us", href: "/contact" },
        ],
      },
    ],
    feature: {
      title: "Emergency care, around the clock",
      body: `Call ahead on ${emergency.phone} and the team will be ready for you when you arrive.`,
      href: "/locations#emergency",
      cta: "Emergency contacts",
    },
  },
];

/* ---- Homepage blocks ---------------------------------------------------- */

export type QuickAction = {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
};

export const quickActions: QuickAction[] = [
  {
    title: "Find a doctor",
    description: "Find the right specialist by condition or specialty.",
    href: "/specialties",
    Icon: Stethoscope,
  },
  {
    title: "Request an appointment",
    description: "Most requests are confirmed within one working day.",
    href: "/book-appointment",
    Icon: CalendarDays,
  },
  {
    title: "24/7 emergency care",
    description: `Call ahead on ${emergency.phone} and we will be ready for you.`,
    href: "/locations#emergency",
    Icon: Clock,
  },
  {
    title: "Billing and insurance",
    description: "Check coverage, estimate costs, or pay a bill online.",
    href: "/patients#billing",
    Icon: CreditCard,
  },
];

export const trustMarkers = [
  "NABH accredited",
  "NABL certified laboratory",
  "ISO 9001:2015",
  "Green OT certified",
];

// Only figures the hospital has supplied (bed count, branches) or that the site
// itself defines (the specialty list). No survey scores or headcounts until the
// hospital gives real ones.
export const stats = [
  { value: String(specialties.length), label: "Clinical specialties", detail: "Coordinated under one care plan" },
  { value: "100", label: "Inpatient beds", detail: "At the main hospital, Chandrayangutta" },
  { value: String(locations.length), label: "Hospital branches", detail: "Chandrayangutta and Falaknuma" },
  { value: "24/7", label: "Emergency line", detail: emergency.phone },
];

export const carePrinciples = [
  {
    title: "One team, one plan",
    body: "Your specialists share a single record and meet weekly, so you explain your history once, not at every door.",
    Icon: Users,
  },
  {
    title: "Time that is actually yours",
    body: "Consultations are scheduled at 20 minutes, not eight. Running late is the exception, and we tell you when it happens.",
    Icon: Clock,
  },
  {
    title: "Costs before care",
    body: "You get a written estimate before any planned procedure, with the insurance portion worked out in advance.",
    Icon: ShieldCheck,
  },
];

export const acceptedInsurers = [
  "Star Health",
  "HDFC ERGO",
  "ICICI Lombard",
  "Niva Bupa",
  "Aditya Birla Health",
  "CGHS & EHS",
];

/* ---- Search ------------------------------------------------------------- */

/**
 * Symptom-to-specialty map. This is what makes the hero search feel like it
 * understands the question: people type "chest pain", not "cardiology".
 * `keywords` are never displayed, only matched.
 */
const conditions: Array<{ label: string; slug: string; keywords: string[] }> = [
  { label: "Chest pain", slug: "cardiology", keywords: ["angina", "heart attack", "tightness"] },
  { label: "High blood pressure", slug: "cardiology", keywords: ["hypertension", "bp"] },
  { label: "Heart palpitations", slug: "cardiology", keywords: ["irregular heartbeat", "arrhythmia"] },
  { label: "Asthma", slug: "pulmonology", keywords: ["wheezing", "inhaler", "breathless"] },
  { label: "Persistent cough", slug: "pulmonology", keywords: ["copd", "breathlessness", "lungs"] },
  { label: "Type 2 diabetes", slug: "diabetology", keywords: ["sugar", "insulin", "hba1c"] },
  { label: "Weight management", slug: "dietetics", keywords: ["obesity", "nutrition", "diet plan"] },
  { label: "Migraine and headache", slug: "neurology", keywords: ["head pain", "aura"] },
  { label: "Stroke", slug: "neurology", keywords: ["paralysis", "slurred speech", "fast"] },
  { label: "Seizures and epilepsy", slug: "neurology", keywords: ["fits", "convulsion"] },
  { label: "Anxiety and depression", slug: "psychiatry", keywords: ["mental health", "panic", "mood"] },
  { label: "Sleep problems", slug: "psychiatry", keywords: ["insomnia", "cannot sleep"] },
  { label: "Back pain", slug: "orthopedics", keywords: ["spine", "slipped disc", "sciatica"] },
  { label: "Knee replacement", slug: "orthopedics", keywords: ["joint replacement", "arthroplasty"] },
  { label: "Arthritis", slug: "orthopedics", keywords: ["joint pain", "stiffness"] },
  { label: "Fractures", slug: "orthopedics", keywords: ["broken bone", "cast", "injury"] },
  { label: "Sports injury rehab", slug: "physiotherapy", keywords: ["ligament", "acl", "recovery"] },
  { label: "Pregnancy and maternity", slug: "gynecology-obstetrics", keywords: ["antenatal", "delivery", "prenatal"] },
  { label: "PCOS", slug: "gynecology-obstetrics", keywords: ["polycystic", "irregular periods"] },
  { label: "Fertility support", slug: "gynecology-obstetrics", keywords: ["infertility", "conceive"] },
  { label: "Fever in children", slug: "pediatrics", keywords: ["child fever", "baby temperature", "kids"] },
  { label: "Childhood vaccinations", slug: "pediatrics", keywords: ["immunisation", "immunization", "shots"] },
  { label: "Newborn care", slug: "pediatrics", keywords: ["baby", "infant", "feeding"] },
  { label: "Acid reflux", slug: "gastroenterology", keywords: ["heartburn", "gerd", "acidity"] },
  { label: "Gallstones", slug: "general-surgery", keywords: ["gallbladder", "cholecystectomy"] },
  { label: "Appendicitis", slug: "general-surgery", keywords: ["appendix", "stomach pain"] },
  { label: "Hernia repair", slug: "general-surgery", keywords: ["inguinal", "umbilical"] },
  { label: "Acne and eczema", slug: "dermatology", keywords: ["skin rash", "pimples", "itching"] },
  { label: "Hair loss", slug: "dermatology", keywords: ["baldness", "alopecia"] },
  { label: "Sinusitis", slug: "ent", keywords: ["blocked nose", "sinus"] },
  { label: "Hearing loss", slug: "ent", keywords: ["deafness", "ear", "tinnitus"] },
  { label: "Sore throat and tonsils", slug: "ent", keywords: ["tonsillitis", "throat pain"] },
  { label: "Road accident and trauma", slug: "trauma-care", keywords: ["emergency", "accident", "injury"] },
  { label: "Intensive care", slug: "anesthesia-intensive-care", keywords: ["icu", "critical care", "ventilator"] },
  { label: "General health check", slug: "general-medicine", keywords: ["checkup", "master health", "screening"] },
];

/**
 * Built on the server and handed to the hero search as a prop, so the client
 * bundle carries the matcher only and never imports the icon-laden content modules.
 */
export function buildSearchIndex(): SearchEntry[] {
  const specialtyName = (slug: string) => bySlug.get(slug)?.name ?? slug;

  const conditionEntries: SearchEntry[] = conditions.map((c) => ({
    label: c.label,
    hint: `Seen by ${specialtyName(c.slug)}`,
    href: `/specialties/${c.slug}`,
    category: "Condition",
    keywords: [...c.keywords, specialtyName(c.slug)],
  }));

  const specialtyEntries: SearchEntry[] = specialties.map((s) => ({
    label: s.name,
    hint: s.summary,
    href: `/specialties/${s.slug}`,
    category: "Specialty",
  }));

  const locationEntries: SearchEntry[] = locations.map((l) => ({
    label: `${l.name}, ${l.area}`,
    hint: l.address,
    href: `/locations#${l.slug}`,
    category: "Location",
    keywords: [l.area, l.tag ?? "", "hospital", "near me", "address", "directions"],
  }));

  const serviceEntries: SearchEntry[] = services.map((s) => ({
    label: s.name,
    hint: s.description,
    href: "/services",
    category: "Service",
  }));

  const pageEntries: SearchEntry[] = [
    {
      label: "Request an appointment",
      hint: "Book a consultation online",
      href: "/book-appointment",
      category: "Page",
      keywords: ["booking", "schedule", "appointment", "slot"],
    },
    {
      label: "Pay a bill",
      hint: "Billing, estimates, and insurance",
      href: "/patients#billing",
      category: "Page",
      keywords: ["payment", "invoice", "cost", "insurance", "cashless"],
    },
    {
      label: "Patient portal",
      hint: "Test results, records, and refills",
      href: "/patients#portal",
      category: "Page",
      keywords: ["login", "reports", "records", "results"],
    },
    {
      label: "Emergency care",
      hint: `Call ${emergency.phone}`,
      href: "/locations#emergency",
      category: "Page",
      keywords: ["er", "emergency", "urgent", "queue"],
    },
    {
      label: "Visiting hours",
      hint: "Ward timings and visitor guidelines",
      href: "/patients#visiting",
      category: "Page",
      keywords: ["visitor", "timings", "attendant"],
    },
    {
      label: "Contact us",
      hint: "Phone, address, and enquiry form",
      href: "/contact",
      category: "Page",
      keywords: ["phone", "email", "enquiry", "reach"],
    },
  ];

  return [
    ...conditionEntries,
    ...specialtyEntries,
    ...locationEntries,
    ...serviceEntries,
    ...pageEntries,
  ];
}

/** One-tap entries under the search bar, chosen to cover the most common journeys. */
export const searchSuggestions = [
  "Chest pain",
  "Fever in children",
  "Knee replacement",
  "Pregnancy and maternity",
  "Emergency care",
];
