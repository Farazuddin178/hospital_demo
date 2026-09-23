import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with our hospital for enquiries, feedback, or support. Find our address, phone numbers, and email.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 lg:px-8">
      <span className="eyebrow">Get In Touch</span>
      <h1 className="mt-4 text-4xl sm:text-5xl">Contact Us</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-lg text-ink">Send Us a Message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
        <div>
          <h2 className="text-lg text-ink">Visit or Call Us</h2>
          <address className="card mt-4 space-y-3 not-italic text-ink-muted">
            <p>Address: {siteConfig.address}</p>
            <p>Email: {siteConfig.emailAdmin} | {siteConfig.emailSupport}</p>
            <p>Phone: {siteConfig.phonePrimary} | {siteConfig.phoneSecondary}</p>
            <p>Timings: {siteConfig.hours}</p>
          </address>
        </div>
      </div>
    </div>
  );
}
