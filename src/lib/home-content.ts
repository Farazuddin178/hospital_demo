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
  phone: "+91 9100-100911",
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
  name: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  kind: "Hospital" | "Clinic" | "Urgent care";
  hasEmergency: boolean;
  waitMinutes: number | null;
  highlights: string[];
};

export const locations: Location[] = [
  {
    slug: "banjara-hills",
    name: "Oxygen Main Campus",
    area: "Banjara Hills",
    address: "8-4-120/4, Example Road, Banjara Hills, Hyderabad 500034",
    phone: "+91 9100-100812",
    hours: "Open 24 hours",
    kind: "Hospital",
    hasEmergency: true,
    waitMinutes: 12,
    highlights: ["Level I trauma centre", "Cardiac catheterisation lab", "420 inpatient beds"],
  },
  {
    slug: "gachibowli",
    name: "Oxygen Gachibowli",
    area: "Gachibowli",
    address: "Plot 41, Financial District Road, Gachibowli, Hyderabad 500032",
    phone: "+91 9100-500812",
    hours: "Mon to Sat, 7:00am to 9:00pm",
    kind: "Hospital",
    hasEmergency: true,
    waitMinutes: 25,
    highlights: ["Day surgery", "Maternity and newborn care", "Outpatient imaging"],
  },
  {
    slug: "secunderabad",
    name: "Oxygen Secunderabad",
    area: "Secunderabad",
    address: "12-A, Sarojini Devi Road, Secunderabad, Hyderabad 500003",
    phone: "+91 9100-500813",
    hours: "Daily, 8:00am to 10:00pm",
    kind: "Urgent care",
    hasEmergency: false,
    waitMinutes: 9,
    highlights: ["Walk-in urgent care", "Lab and diagnostics", "Physiotherapy"],
  },
  {
    slug: "kukatpally",
    name: "Oxygen Kukatpally Clinic",
    area: "Kukatpally",
    address: "Road No. 4, KPHB Colony, Kukatpally, Hyderabad 500072",
    phone: "+91 9100-500814",
    hours: "Mon to Sat, 9:00am to 7:00pm",
    kind: "Clinic",
    hasEmergency: false,
    waitMinutes: null,
    highlights: ["Family medicine", "Paediatrics", "Vaccination clinic"],
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
        items: locations
          .filter((l) => l.kind === "Hospital")
          .map((l) => ({ label: `${l.name}, ${l.area}`, href: `/locations#${l.slug}` })),
      },
      {
        heading: "Clinics & urgent care",
        items: locations
          .filter((l) => l.kind !== "Hospital")
          .map((l) => ({ label: `${l.name}, ${l.area}`, href: `/locations#${l.slug}` })),
      },
      {
        heading: "Getting here",
        items: [
          { label: "Parking and directions", href: "/locations#directions" },
          { label: "Emergency room wait times", href: "/locations#wait-times" },
          { label: "All locations", href: "/locations" },
          { label: "Contact us", href: "/contact" },
        ],
      },
    ],
    feature: {
      title: "Emergency care, around the clock",
      body: "Two of our campuses run a 24/7 emergency department. Current wait times are published on every location page.",
      href: "/locations#wait-times",
      cta: "Check wait times",
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
    description: "Search 240+ specialists by name, condition, or language.",
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
    title: "Urgent care wait times",
    description: "Live waits across all four Hyderabad locations.",
    href: "/locations#wait-times",
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

export const stats = [
  { value: "17", label: "Clinical specialties", detail: "Coordinated under one care plan" },
  { value: "240+", label: "Doctors and specialists", detail: "Across four Hyderabad campuses" },
  { value: "12 min", label: "Median emergency wait", detail: "Main campus, this month" },
  { value: "96%", label: "Would recommend us", detail: "From 4,100 post-visit surveys" },
];

export type Provider = {
  name: string;
  role: string;
  specialtySlug: string;
  languages: string;
  image: string;
};

export const featuredProviders: Provider[] = [
  {
    name: "Dr. Asha Varma",
    role: "Interventional Cardiologist",
    specialtySlug: "cardiology",
    languages: "English, Telugu, Hindi",
    image: "provider-cardio",
  },
  {
    name: "Dr. Imran Qureshi",
    role: "Consultant Paediatrician",
    specialtySlug: "pediatrics",
    languages: "English, Urdu, Hindi",
    image: "provider-peds",
  },
  {
    name: "Dr. Leela Nair",
    role: "Orthopaedic Surgeon",
    specialtySlug: "orthopedics",
    languages: "English, Malayalam, Tamil",
    image: "provider-ortho",
  },
  {
    name: "Dr. Rohit Deshpande",
    role: "Consultant Neurologist",
    specialtySlug: "neurology",
    languages: "English, Marathi, Hindi",
    image: "provider-neuro",
  },
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

export const testimonial = {
  quote:
    "I came in at 2am with chest pain and was in the cath lab within forty minutes. What stayed with me was smaller than that. Someone stood with my mother in the waiting room and explained every step, in Telugu, until she understood it.",
  name: "Sandeep R.",
  detail: "Cardiac patient, Banjara Hills campus",
  image: "patient-story",
};

export type Article = {
  title: string;
  category: string;
  readingTime: string;
  excerpt: string;
  href: string;
  image: string;
};

export const articles: Article[] = [
  {
    title: "When chest pain is an emergency, and when it is not",
    category: "Heart health",
    readingTime: "4 min read",
    excerpt:
      "Four signs that mean call an ambulance now, and the far more common causes that can safely wait for a morning appointment.",
    href: "/specialties/cardiology",
    image: "article-emergency",
  },
  {
    title: "Recovering well after a joint replacement",
    category: "Orthopaedics",
    readingTime: "6 min read",
    excerpt:
      "What the first six weeks actually look like, how much walking is too much, and the milestones worth tracking.",
    href: "/specialties/orthopedics",
    image: "article-recovery",
  },
  {
    title: "Questions worth asking at your next appointment",
    category: "Patient guides",
    readingTime: "3 min read",
    excerpt:
      "A short list that consistently leads to better consultations, gathered from patients and doctors on our own wards.",
    href: "/patients#prepare",
    image: "article-team",
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

  const doctorEntries: SearchEntry[] = featuredProviders.map((p) => ({
    label: p.name,
    hint: `${p.role} · ${p.languages}`,
    href: `/specialties/${p.specialtySlug}`,
    category: "Doctor",
    keywords: [specialtyName(p.specialtySlug), p.languages, "doctor", "consultant"],
  }));

  const locationEntries: SearchEntry[] = locations.map((l) => ({
    label: l.name,
    hint: `${l.kind} · ${l.area} · ${l.hours}`,
    href: `/locations#${l.slug}`,
    category: "Location",
    keywords: [l.area, l.kind, "near me", "address", "directions"],
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
      label: "Emergency room wait times",
      hint: "Live waits across all campuses",
      href: "/locations#wait-times",
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
      hint: "Phone, email, and enquiry form",
      href: "/contact",
      category: "Page",
      keywords: ["phone", "email", "enquiry", "reach"],
    },
  ];

  return [
    ...conditionEntries,
    ...specialtyEntries,
    ...doctorEntries,
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
  "Emergency room wait times",
];
