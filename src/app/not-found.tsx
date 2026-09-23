import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center">
      <p className="text-gradient text-7xl font-display font-extrabold">404</p>
      <h1 className="mt-4 text-3xl sm:text-4xl">We can&apos;t find that page</h1>
      <p className="mt-4 text-ink-muted">
        The page you&apos;re looking for may have been moved or no longer exists. If you need urgent
        medical help, please call our 24/7 emergency line.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/contact" className="btn-secondary">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
