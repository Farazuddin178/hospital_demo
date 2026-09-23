import type { Metadata } from "next";
import { values } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about our hospital's vision, mission, values, and the skilled team dedicated to providing exceptional patient care.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 lg:px-8">
      <span className="eyebrow">About Us</span>
      <h1 className="mt-4 text-4xl sm:text-5xl">About Us</h1>
      <p className="mt-4 max-w-3xl text-lg text-ink-muted">
        Providing world-class healthcare with a patient-first philosophy, advanced
        medical technology, and a highly skilled, compassionate team.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="card card-hover">
          <h2 className="text-xl text-brand-700 dark:text-brand-300">Our Vision</h2>
          <p className="mt-2 text-ink-muted">
            To be a leading healthcare provider, committed to delivering exceptional
            patient care and medical excellence.
          </p>
        </div>
        <div className="card card-hover">
          <h2 className="text-xl text-brand-700 dark:text-brand-300">Our Mission</h2>
          <p className="mt-2 text-ink-muted">
            To provide comprehensive and compassionate healthcare services, utilizing
            advanced medical technology and a highly skilled team.
          </p>
        </div>
      </div>

      <hr className="divider-gradient my-16" />

      <span className="eyebrow">What Drives Us</span>
      <h2 className="mt-4 text-3xl sm:text-4xl">Our Values</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {values.map((v) => (
          <div key={v.name} className="card card-hover">
            <h3 className="font-semibold text-ink">{v.name}</h3>
            <p className="mt-2 text-sm text-ink-muted">{v.description}</p>
          </div>
        ))}
      </div>

      <hr className="divider-gradient my-16" />

      <span className="eyebrow">Our People</span>
      <h2 className="mt-4 text-3xl sm:text-4xl">Our Team</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {[
          { title: "Highly Skilled Doctors and Surgeons", body: "Our team of experienced medical professionals is dedicated to providing top-quality care." },
          { title: "Dedicated Nursing Staff", body: "Our compassionate nurses are committed to patient comfort and well-being." },
          { title: "Expert Support Staff", body: "Our skilled support staff ensures the smooth operation of our hospital." },
        ].map((t) => (
          <div key={t.title} className="card card-hover">
            <h3 className="font-semibold text-ink">{t.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
