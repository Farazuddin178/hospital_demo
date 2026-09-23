import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions governing use of our website and services.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8 prose prose-slate dark:prose-invert prose-headings:font-display prose-a:text-brand-700 dark:prose-a:text-brand-300">
      <span className="eyebrow not-prose">Legal</span>
      <h1 className="mt-4">Terms &amp; Conditions</h1>
      <p className="text-sm text-ink-muted">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing this website, you agree to be bound by these terms and
        conditions and our Privacy Policy.
      </p>

      <h2>2. Use of the Website</h2>
      <p>
        This site is provided for informational purposes about our services. It
        does not constitute medical advice, diagnosis, or treatment; always
        consult a qualified physician for medical concerns.
      </p>

      <h2>3. Appointment Requests</h2>
      <p>
        Submitting an appointment request does not guarantee a confirmed booking
        until you receive confirmation from our staff.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        All content on this site, including text, images, and logos, is owned by
        or licensed to {siteConfig.name} and may not be reproduced without permission.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        We are not liable for any damages arising from your use of, or inability
        to use, this website.
      </p>

      <h2>6. Changes to These Terms</h2>
      <p>
        We may update these terms periodically. Continued use of the site after
        changes constitutes acceptance of the revised terms.
      </p>

      <h2>7. Contact Us</h2>
      <p>Questions about these terms can be sent to {siteConfig.emailAdmin}.</p>
    </div>
  );
}
