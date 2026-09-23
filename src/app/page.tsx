import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Phone, Quote } from "lucide-react";

import HeroSearch from "@/components/HeroSearch";
import Photo, { type PhotoName } from "@/components/Photo";
import { siteConfig, specialties } from "@/lib/site-data";
import {
  acceptedInsurers,
  articles,
  buildSearchIndex,
  carePrinciples,
  emergency,
  featuredProviders,
  locations,
  quickActions,
  searchSuggestions,
  stats,
  testimonial,
  trustMarkers,
} from "@/lib/home-content";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description:
    "Search a symptom, specialty, doctor, or location and get to the right care in one step. Four Hyderabad campuses, 17 specialties, 24/7 emergency cover.",
  alternates: { canonical: "/" },
};

const tel = (value: string) => `tel:${value.replace(/\s/g, "")}`;
const mapsHref = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function HomePage() {
  // Built once on the server; the client receives plain data, never the content modules.
  const index = buildSearchIndex();

  return (
    <>
      {/* ================= Hero ================================================
          Deliberately image-free. The largest element is the headline, so the
          page reaches its Largest Contentful Paint on the first frame with no
          image, font, or network round trip in the way. */}
      <section className="bg-hero-gradient">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 text-center sm:pt-20 lg:px-8 lg:pb-32 lg:pt-24">
          <p className="flex items-center justify-center">
            <span className="eyebrow">Four campuses across Hyderabad</span>
          </p>

          <h1 className="mx-auto mt-6 max-w-4xl text-balance font-display text-[2.5rem] font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            Start with a question.
            <br className="hidden sm:block" />{" "}
            <span className="text-brand-700 dark:text-brand-300">We will take it from there.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-muted">
            Search a symptom, a specialty, a doctor, or a location. You will land on the
            right team in one step, not five.
          </p>

          <div className="mt-10">
            <HeroSearch index={index} suggestions={searchSuggestions} />
          </div>

          <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-muted">
            {trustMarkers.map((marker) => (
              <li key={marker} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal-700" aria-hidden="true" />
                {marker}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= Photography band ================================== */}
      <section>
        <Photo
          name="care-band"
          sizes="100vw"
          className="h-[38vh] min-h-[260px] w-full object-cover sm:h-[46vh] lg:h-[540px]"
        />
      </section>

      {/* ================= Quick actions =====================================
          Lifted over the photograph on large screens; stacked normally on small. */}
      <section aria-labelledby="quick-actions" className="relative z-10 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 id="quick-actions" className="sr-only">
            Common tasks
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-[rgb(var(--hairline))] bg-[rgb(var(--hairline))] sm:grid-cols-2 lg:-mt-24 lg:grid-cols-4 lg:shadow-lift">
            {quickActions.map(({ title, description, href, Icon }) => (
              <li key={title} className="bg-surface">
                <Link
                  href={href}
                  className="group flex h-full flex-col gap-3 p-7 transition-colors duration-300 ease-calm hover:bg-brand-50/60 dark:hover:bg-white/5"
                >
                  <Icon className="h-6 w-6 text-brand-600" strokeWidth={1.6} aria-hidden="true" />
                  <span className="font-display text-lg font-semibold text-ink">{title}</span>
                  <span className="text-sm leading-relaxed text-ink-muted">{description}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-brand-700">
                    Go
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 ease-calm group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= Stats ============================================= */}
      <section aria-label="Oxygen Hospital at a glance" className="bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={i > 0 ? "lg:border-l lg:border-[rgb(var(--hairline))] lg:pl-10" : undefined}
              >
                <dd className="font-display text-4xl font-semibold tracking-tight text-brand-700 dark:text-brand-300">
                  {stat.value}
                </dd>
                <dt className="mt-2 font-medium text-ink">{stat.label}</dt>
                <p className="mt-1 text-sm text-ink-muted">{stat.detail}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= How care works here =============================== */}
      <section className="defer-paint bg-surface-alt py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-5">
            <Photo
              name="care-model"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="w-full rounded-3xl object-cover"
            />
          </div>

          <div className="lg:col-span-7">
            <span className="eyebrow">How care works here</span>
            <h2 className="section-title">
              The medicine is expert. The experience should be humane too.
            </h2>
            <p className="section-lede">
              Most of what frustrates people about hospitals is not clinical. It is repeating
              your history four times, waiting without being told why, and finding out what it
              costs afterwards. We fixed those three first.
            </p>

            <ul className="mt-10 space-y-8">
              {carePrinciples.map(({ title, body, Icon }) => (
                <li key={title} className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-brand-700 shadow-hairline dark:bg-white/10"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-ink">{title}</h3>
                    <p className="mt-1.5 max-w-prose leading-relaxed text-ink-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/about" className="link-arrow mt-10">
              More about how we work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Specialties ======================================= */}
      <section id="care" className="defer-paint bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Conditions &amp; treatments</span>
              <h2 className="section-title">Care for every stage of life</h2>
              <p className="section-lede">
                Seventeen specialties, one shared record. If you are not sure which one you
                need, search a symptom instead and we will route you.
              </p>
            </div>
            <Link href="/specialties" className="link-arrow shrink-0">
              All specialties
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[rgb(var(--hairline))] bg-[rgb(var(--hairline))] sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map(({ slug, name, summary, Icon }) => (
              <li key={slug} className="bg-surface">
                <Link
                  href={`/specialties/${slug}`}
                  className="group flex h-full items-start gap-4 p-6 transition-colors duration-300 ease-calm hover:bg-brand-50/60 dark:hover:bg-white/5"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-100 dark:bg-white/5"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-ink">{name}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                      {summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= Care team ========================================= */}
      <section id="providers" className="defer-paint bg-surface-alt py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Your care team</span>
              <h2 className="section-title">The people you will actually meet</h2>
              <p className="section-lede">
                Every consultant here sees patients weekly. Languages are listed because being
                understood is part of the treatment.
              </p>
            </div>
            <Link href="/specialties" className="link-arrow shrink-0">
              Browse all 240+ doctors
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProviders.map((provider) => (
              <li key={provider.name}>
                <Link href={`/specialties/${provider.specialtySlug}`} className="group block">
                  <Photo
                    name={provider.image as PhotoName}
                    alt={`Portrait of ${provider.name}, ${provider.role}`}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 88vw"
                    className="aspect-square w-full rounded-2xl object-cover transition duration-500 ease-calm group-hover:brightness-105"
                  />
                  <h3 className="mt-5 font-display text-lg text-ink">{provider.name}</h3>
                  <p className="mt-1 text-sm font-medium text-brand-700 dark:text-brand-300">
                    {provider.role}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">Speaks {provider.languages}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= Locations ========================================= */}
      <section id="locations" className="defer-paint bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Locations</span>
              <h2 className="section-title">Find care near you</h2>
              <p className="section-lede">
                Four campuses across Hyderabad. Two run a 24/7 emergency department, and wait
                times are published rather than guessed at.
              </p>
            </div>
            <Link href="/locations" className="link-arrow shrink-0">
              All locations and directions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-12 grid gap-6 lg:grid-cols-2">
            {locations.map((location) => (
              <li
                key={location.slug}
                className="flex flex-col gap-5 rounded-3xl border border-[rgb(var(--hairline))] p-7 transition duration-300 ease-calm hover:border-brand-300 hover:shadow-soft sm:flex-row sm:items-start"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl text-ink">{location.name}</h3>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-white/5">
                      {location.kind}
                    </span>
                  </div>

                  <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                    {location.address}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-muted">
                    {location.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <a href={tel(location.phone)} className="link-arrow">
                      <Phone className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
                      {location.phone}
                    </a>
                    <a
                      href={mapsHref(`${location.name}, ${location.address}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-quiet"
                    >
                      Get directions
                    </a>
                  </div>
                </div>

                <div className="shrink-0 rounded-2xl bg-surface-alt px-5 py-4 text-center sm:w-36">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    {location.hasEmergency ? "Emergency wait" : "Walk-in wait"}
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-semibold text-ink">
                    {location.waitMinutes === null ? "By appt" : `${location.waitMinutes} min`}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-ink-muted">{location.hours}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= Patient story ===================================== */}
      <section className="defer-paint bg-surface-alt py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <figure className="lg:col-span-7 lg:order-2">
            <Quote className="h-9 w-9 text-accent-300" strokeWidth={1.4} aria-hidden="true" />
            <blockquote className="mt-6 font-display text-2xl leading-[1.45] text-ink sm:text-[1.75rem]">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-7 text-ink-muted">
              <span className="font-semibold text-ink">{testimonial.name}</span>
              <span className="mx-2 text-[rgb(var(--hairline))]">/</span>
              {testimonial.detail}
            </figcaption>
          </figure>

          <div className="lg:col-span-5 lg:order-1">
            <Photo
              name="patient-story"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= Health library ==================================== */}
      <section className="defer-paint bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Health library</span>
              <h2 className="section-title">Written by the people who treat it</h2>
              <p className="section-lede">
                Plain-language guidance from our own consultants. No jargon, no hedging, and
                no advice we would not give in the room.
              </p>
            </div>
          </div>

          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {articles.map((article) => (
              <li key={article.title}>
                <Link href={article.href} className="group block">
                  <Photo
                    name={article.image as PhotoName}
                    alt=""
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="aspect-[3/2] w-full rounded-2xl object-cover"
                  />
                  <p className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent-600">
                    {article.category}
                    <span className="text-[rgb(var(--hairline))]" aria-hidden="true">
                      /
                    </span>
                    <span className="font-normal normal-case tracking-normal text-ink-muted">
                      {article.readingTime}
                    </span>
                  </p>
                  <h3 className="mt-2.5 font-display text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-brand-700">
                    {article.title}
                  </h3>
                  <p className="mt-2.5 leading-relaxed text-ink-muted">{article.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= Insurance ========================================= */}
      <section id="billing" className="defer-paint bg-surface pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-8 rounded-3xl bg-surface-alt px-8 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <div>
              <h2 className="font-display text-2xl text-ink">Cashless cover with most major insurers</h2>
              <p className="mt-2.5 max-w-xl leading-relaxed text-ink-muted">
                We will confirm your coverage before your visit and give you a written estimate
                for anything planned.
              </p>
              <Link href="/patients#insurance" className="link-arrow mt-5">
                Check your insurance
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-ink-muted sm:grid-cols-3">
              {acceptedInsurers.map((insurer) => (
                <li key={insurer}>{insurer}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= Closing CTA ======================================= */}
      <section className="defer-paint bg-ink-band">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Ready when you need us, and honest about the wait when you do.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
            Request an appointment online and we will confirm within one working day.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-brand-800 shadow-soft transition duration-300 ease-calm hover:bg-brand-50"
            >
              Request Appointment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={tel(emergency.phone)} className="btn-ghost-inverse">
              <Phone className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              {emergency.label} · {emergency.phone}
            </a>
          </div>

          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-brand-200">
            {emergency.note}
          </p>
        </div>
      </section>
    </>
  );
}
