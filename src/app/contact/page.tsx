import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { locations } from "@/lib/home-content";

const mainHospital = locations[0];

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Oxygen Multi Specialty Hospital for enquiries, feedback, or support. Address and phone number for the main hospital in Chandrayangutta, Hyderabad.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 lg:px-8">
      <span className="eyebrow">Get In Touch</span>
      <h1 className="mt-4 text-4xl sm:text-5xl">Contact Us</h1>
      {/* min-w-0 on both columns: without it, a grid track with no explicit
          template sizes itself to the widest child's min-content, so one long
          unbroken string can push the form past the screen edge on phones. */}
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div className="min-w-0">
          <h2 className="text-lg text-ink">Send Us a Message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="text-lg text-ink">Visit or Call Us</h2>
          {/* Email addresses go here once the domain is bought. */}
          <address className="card mt-4 break-words not-italic leading-relaxed text-ink-muted">
            <p className="font-display text-lg font-semibold text-ink">{mainHospital.name}</p>
            <p className="mt-3">{mainHospital.address}</p>
            <p className="mt-3">
              <a
                href={`tel:${mainHospital.phone.replace(/\s/g, "")}`}
                className="font-semibold text-brand-700 dark:text-brand-300"
              >
                {mainHospital.phone}
              </a>
            </p>
          </address>
        </div>
      </div>
    </div>
  );
}
