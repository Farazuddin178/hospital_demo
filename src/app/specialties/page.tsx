import type { Metadata } from "next";
import Link from "next/link";
import { specialties } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Our Specialties",
  description:
    "Browse our 17 medical specialties, from cardiology to pediatrics, each staffed by experienced consultants.",
};

export default function SpecialtiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
      <span className="eyebrow">17 Disciplines</span>
      <h1 className="mt-4 text-4xl sm:text-5xl">Our Specialties</h1>
      <p className="mt-4 max-w-3xl text-lg text-ink-muted">
        Comprehensive, specialist-led care across every major discipline.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specialties.map((s) => (
          <Link key={s.slug} href={`/specialties/${s.slug}`} className="card card-hover">
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-teal-50 text-brand-700 dark:from-brand-500/10 dark:to-teal-500/10 dark:text-brand-300"
              aria-hidden="true"
            >
              <s.Icon className="h-6 w-6" />
            </span>
            <h2 className="mt-3 font-semibold text-ink">{s.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">{s.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
