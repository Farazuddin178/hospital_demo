import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { specialties } from "@/lib/site-data";

type Props = { params: { slug: string } };

// Pre-renders every specialty page at build time (SSG) — fast, cacheable, SEO-friendly.
export function generateStaticParams() {
  return specialties.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const specialty = specialties.find((s) => s.slug === params.slug);
  if (!specialty) return {};
  return {
    title: specialty.name,
    description: specialty.description.slice(0, 155),
  };
}

export default function SpecialtyPage({ params }: Props) {
  const specialty = specialties.find((s) => s.slug === params.slug);
  if (!specialty) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
      <Link href="/specialties" className="link-underline text-sm font-medium">
        ← All Specialties
      </Link>
      <div className="mt-5 flex items-center gap-4">
        <span
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-teal-500 text-white shadow-glow"
          aria-hidden="true"
        >
          <specialty.Icon className="h-8 w-8" />
        </span>
        <h1 className="text-3xl sm:text-4xl">{specialty.name}</h1>
      </div>
      <p className="mt-6 text-lg text-ink-muted">{specialty.description}</p>
      <Link href="/book-appointment" className="btn-primary mt-8">
        Book an Appointment
      </Link>
    </div>
  );
}
