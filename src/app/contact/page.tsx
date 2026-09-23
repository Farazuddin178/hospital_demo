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
      {/* min-w-0 on both columns: without it, a grid track with no explicit
          template sizes itself to the widest child's min-content, and the two
          long unbroken email addresses below were forcing that shared track
          wider than the viewport on phones — which then stretched the form
          next to it to match, well past the screen edge. */}
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div className="min-w-0">
          <h2 className="text-lg text-ink">Send Us a Message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="text-lg text-ink">Visit or Call Us</h2>
          <address className="card mt-4 space-y-3 break-words not-italic text-ink-muted">
            <p>Address: {siteConfig.address}</p>
            <p>Email: {siteConfig.emailAdmin}</p>
            <p>Email: {siteConfig.emailSupport}</p>
            <p>Phone: {siteConfig.phonePrimary} / {siteConfig.phoneSecondary}</p>
            <p>Timings: {siteConfig.hours}</p>
          </address>
        </div>
      </div>
    </div>
  );
}
