import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8 prose prose-slate dark:prose-invert prose-headings:font-display prose-a:text-brand-700 dark:prose-a:text-brand-300">
      <span className="eyebrow not-prose">Legal</span>
      <h1 className="mt-4">Privacy Policy</h1>
      <p className="text-sm text-ink-muted">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly (such as your name, email,
        phone number, and message content when you use our contact or appointment
        forms), and information collected automatically (such as pages visited and
        approximate location) via analytics cookies once you consent to them.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use this information to respond to enquiries, schedule appointments,
        improve our services, and, where you have consented, to analyze site
        traffic and usage patterns.
      </p>

      <h2>3. Cookies</h2>
      <p>
        We use essential cookies required for the site to function, and optional
        analytics cookies that are only set after you accept our cookie banner.
        You can withdraw consent at any time by clearing your browser&apos;s site data.
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        We do not sell your personal information. We may share it with service
        providers (e.g., email delivery, analytics) strictly to operate the site,
        under contractual confidentiality obligations.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We use industry-standard safeguards, including encrypted (HTTPS)
        connections and access controls, to protect your information.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal
        data by contacting us at {siteConfig.emailAdmin}.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        Questions about this policy can be sent to {siteConfig.emailAdmin} or {siteConfig.address}.
      </p>
    </div>
  );
}
