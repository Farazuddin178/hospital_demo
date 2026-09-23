import Link from "next/link";
import { siteConfig } from "@/lib/site-data";
import { emergency, megaMenus } from "@/lib/home-content";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Navigation is built on native <details>/<summary>.
 *
 * That buys correct keyboard and screen-reader behaviour for free, renders
 * fully on the server, and works before (or without) hydration. The `name`
 * attribute makes the browser close sibling menus on its own where the
 * exclusive-accordion behaviour is supported; the small script at the bottom
 * covers Escape, outside clicks, and older browsers.
 */

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 ease-calm group-open:rotate-180"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${siteConfig.name} home`}>
      <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-white">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="h-5 w-5">
          <path d="M4.5 22.5h23" />
          <path d="M8.5 22.5a7.5 7.5 0 0 1 15 0" />
          <path d="M16 9V5.5M9.6 11.6 7.2 9.2M22.4 11.6l2.4-2.4" />
        </svg>
      </span>
      <span className="font-display text-[1.3rem] font-semibold leading-none tracking-tight text-ink">
        {siteConfig.name}
      </span>
    </Link>
  );
}

export default function Header() {
  return (
    <header
      data-site-nav
      className="sticky top-0 z-50 border-b border-[rgb(var(--hairline))] bg-surface/90 backdrop-blur-md"
    >
      {/* Utility strip: the two things people arrive in a hurry for. */}
      <div className="hidden border-b border-[rgb(var(--hairline))] lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[0.8125rem] lg:px-8">
          <p className="flex items-center gap-2 text-ink-muted">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-600" />
            </span>
            <span className="font-medium text-ink">{emergency.label}</span>
            <a href={`tel:${emergency.phone.replace(/\s/g, "")}`} className="link-quiet font-semibold">
              {emergency.phone}
            </a>
          </p>
          <nav aria-label="Utility" className="flex items-center gap-7 text-ink-muted">
            <Link href="/patients#portal" className="transition-colors hover:text-brand-700">
              Patient portal
            </Link>
            <Link href="/specialties" className="transition-colors hover:text-brand-700">
              Find a doctor
            </Link>
            <Link href="/about" className="transition-colors hover:text-brand-700">
              About us
            </Link>
            <Link href="/contact" className="transition-colors hover:text-brand-700">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5 lg:px-8">
        <Logo />

        {/* ---- Desktop mega menu ------------------------------------------ */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {megaMenus.map((menu) => (
            <details key={menu.id} name="site-nav" className="group" data-nav-menu>
              <summary
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 font-medium text-ink transition-colors duration-200 hover:bg-brand-50 group-open:bg-brand-50 dark:hover:bg-white/5 dark:group-open:bg-white/5"
                aria-label={`${menu.label} menu`}
              >
                {menu.label}
                <Chevron />
              </summary>

              {/* Anchored to the header, so the panel spans the full viewport width. */}
              <div className="absolute inset-x-0 top-full border-b border-[rgb(var(--hairline))] bg-surface shadow-lift">
                <div className="mx-auto grid max-w-7xl grid-cols-12 gap-x-10 gap-y-8 px-8 py-10">
                  <div className="col-span-9 grid grid-cols-4 gap-x-8 gap-y-8">
                    {menu.columns.map((column) => (
                      <div key={column.heading}>
                        {/* Deliberately not a heading. The nav sits above the page's
                            <h1> in the DOM, so real headings here would put a dozen
                            entries ahead of it in the screen-reader outline. The
                            grouping is conveyed with aria-labelledby instead. */}
                        <p
                          id={`${menu.id}-${column.heading.replace(/\W+/g, "-").toLowerCase()}`}
                          className="font-display text-[0.9375rem] font-semibold text-ink"
                        >
                          {column.heading}
                        </p>
                        <ul
                          aria-labelledby={`${menu.id}-${column.heading.replace(/\W+/g, "-").toLowerCase()}`}
                          className="mt-3.5 space-y-1"
                        >
                          {column.items.map((item) => (
                            <li key={item.href + item.label}>
                              <Link
                                href={item.href}
                                className="-mx-2 block rounded-lg px-2 py-1.5 text-[0.9375rem] text-ink-muted transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-3 rounded-2xl bg-accent-50 p-6 dark:bg-white/[0.04]">
                    <p className="font-display text-lg font-semibold text-ink">{menu.feature.title}</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{menu.feature.body}</p>
                    <Link href={menu.feature.href} className="link-arrow mt-5 text-sm">
                      {menu.feature.cta}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </details>
          ))}

          <Link
            href="/services"
            className="rounded-full px-4 py-2 font-medium text-ink transition-colors duration-200 hover:bg-brand-50 dark:hover:bg-white/5"
          >
            Services
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link href="/book-appointment" className="btn-primary !px-6 !py-2.5">
            Request Appointment
          </Link>
        </div>

        {/* ---- Mobile ------------------------------------------------------ */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/book-appointment" className="btn-primary !px-4 !py-2.5 text-sm">
            Appointment
          </Link>
          <details name="site-nav" className="group" data-nav-menu>
            <summary
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[rgb(var(--hairline))] text-ink"
              aria-label="Open navigation menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" className="group-open:hidden" />
                <path d="m6 6 12 12M18 6 6 18" className="hidden group-open:block" />
              </svg>
            </summary>

            <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-[rgb(var(--hairline))] bg-surface px-6 pb-8 pt-4 shadow-lift">
              <nav aria-label="Mobile primary" className="flex flex-col">
                {megaMenus.map((menu) => (
                  <details key={menu.id} className="group/sub border-b border-[rgb(var(--hairline))] py-1">
                    <summary className="flex cursor-pointer items-center justify-between py-3 font-medium text-ink">
                      {menu.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 text-ink-muted transition-transform duration-300 group-open/sub:rotate-180" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <div className="pb-3">
                      {menu.columns.map((column) => (
                        <div key={column.heading} className="mt-3">
                          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                            {column.heading}
                          </p>
                          <ul className="mt-2 space-y-0.5">
                            {column.items.map((item) => (
                              <li key={item.href + item.label}>
                                <Link href={item.href} className="block py-1.5 text-[0.9375rem] text-ink-muted">
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}

                <Link href="/services" className="border-b border-[rgb(var(--hairline))] py-4 font-medium text-ink">
                  Services
                </Link>
                <Link href="/specialties" className="border-b border-[rgb(var(--hairline))] py-4 font-medium text-ink">
                  Find a doctor
                </Link>
                <Link href="/contact" className="border-b border-[rgb(var(--hairline))] py-4 font-medium text-ink">
                  Contact
                </Link>

                <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-accent-50 p-4 dark:bg-white/[0.04]">
                  <div>
                    <p className="text-sm font-semibold text-ink">{emergency.label}</p>
                    <a href={`tel:${emergency.phone.replace(/\s/g, "")}`} className="text-sm text-ink-muted">
                      {emergency.phone}
                    </a>
                  </div>
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </details>
        </div>
      </div>

      {/*
        ~700 bytes of progressive enhancement. The menus already open, close, and
        respond to the keyboard without it; this only adds the three behaviours
        HTML has no opinion about: Escape, outside clicks, and closing after a
        client-side navigation.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var h=document.querySelector('[data-site-nav]');if(!h)return;
function all(){return h.querySelectorAll('details[data-nav-menu]')}
function close(except){all().forEach(function(d){if(d!==except)d.open=false})}
h.addEventListener('toggle',function(e){var t=e.target;if(t.matches&&t.matches('details[data-nav-menu]')&&t.open)close(t)},true);
h.addEventListener('click',function(e){if(e.target.closest('a'))close(null)});
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;all().forEach(function(d){if(d.open){d.open=false;var s=d.querySelector('summary');if(s)s.focus()}})});
document.addEventListener('mousedown',function(e){if(!h.contains(e.target))close(null)})})();`,
        }}
      />
    </header>
  );
}
