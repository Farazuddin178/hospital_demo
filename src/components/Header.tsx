"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-data";
import { emergency, megaMenus } from "@/lib/home-content";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Navigation used to be built on native <details>/<summary> for zero-JS,
 * server-rendered menus. That worked for a mouse, but real-device testing
 * turned up a serious, reproducible bug: a touch tap on <summary> fires a
 * normal 'click' event without the browser's native "toggle the details"
 * activation actually running, and separately, this app's own React tree
 * would revert the `open` attribute shortly after any workaround set it by
 * hand. Both are the same root problem — nothing outside React can safely
 * own a piece of DOM state that lives inside a hydrated React tree. So the
 * open/closed state below is real React state, and React is the only thing
 * that ever touches it. Keyboard and screen-reader behaviour (Escape,
 * aria-expanded, focus return) is now implemented explicitly rather than
 * inherited from <details>, since that markup is gone.
 */

type MenuId = string | null;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 ease-calm ${open ? "rotate-180" : ""}`}
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
    // min-w-0 lets the name below actually truncate instead of forcing the
    // sticky header wider than the viewport on narrow phones; only the mark
    // (the icon) is pinned with shrink-0, since that one must stay full size.
    <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={`${siteConfig.name} home`}>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-700 text-white sm:h-10 sm:w-10"
      >
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="h-4 w-4 sm:h-5 sm:w-5">
          <path d="M4.5 22.5h23" />
          <path d="M8.5 22.5a7.5 7.5 0 0 1 15 0" />
          <path d="M16 9V5.5M9.6 11.6 7.2 9.2M22.4 11.6l2.4-2.4" />
        </svg>
      </span>
      <span className="truncate font-display text-base font-semibold leading-none tracking-tight text-ink sm:text-[1.3rem]">
        {siteConfig.name}
      </span>
    </Link>
  );
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Which desktop mega menu is open (by id), or null. A single value instead
  // of one boolean per menu makes the "only one open at a time" behaviour
  // automatic rather than something to coordinate.
  const [openDesktopMenu, setOpenDesktopMenu] = useState<MenuId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<MenuId>(null);

  const anyOpen = openDesktopMenu !== null || mobileOpen;

  function closeAll() {
    setOpenDesktopMenu(null);
    setMobileOpen(false);
    setOpenMobileSub(null);
  }

  // Close on navigation — covers link clicks, back/forward, and anything else
  // that changes the route without going through a click handler below.
  useEffect(() => {
    closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Escape closes whatever is open and returns focus to its trigger.
  useEffect(() => {
    if (!anyOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const activeTriggerSelector = openDesktopMenu
        ? `[data-menu-trigger="${openDesktopMenu}"]`
        : '[data-menu-trigger="mobile"]';
      closeAll();
      headerRef.current?.querySelector<HTMLButtonElement>(activeTriggerSelector)?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [anyOpen, openDesktopMenu]);

  // Outside click/tap closes everything. pointerdown (not click) so it fires
  // ahead of any click-through and matches native menu-dismissal behaviour.
  useEffect(() => {
    if (!anyOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closeAll();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anyOpen]);

  return (
    <header
      ref={headerRef}
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

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-3.5 lg:px-8">
        <Logo />

        {/* ---- Desktop mega menu ------------------------------------------ */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {megaMenus.map((menu) => {
            const isOpen = openDesktopMenu === menu.id;
            return (
              // Deliberately NOT `relative`: the panel below uses `inset-x-0` to
              // span the full viewport width, which means its containing block
              // has to stay the sticky <header>, not this button wrapper.
              <div key={menu.id}>
                <button
                  type="button"
                  data-menu-trigger={menu.id}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-label={`${menu.label} menu`}
                  onClick={() => setOpenDesktopMenu(isOpen ? null : menu.id)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 font-medium text-ink transition-colors duration-200 hover:bg-brand-50 dark:hover:bg-white/5 ${isOpen ? "bg-brand-50 dark:bg-white/5" : ""}`}
                >
                  {menu.label}
                  <Chevron open={isOpen} />
                </button>

                {isOpen && (
                  // Anchored to the header, so the panel spans the full viewport width.
                  <div className="absolute inset-x-0 top-full border-b border-[rgb(var(--hairline))] bg-surface shadow-lift">
                    <div className="mx-auto grid max-w-7xl grid-cols-12 gap-x-10 gap-y-8 px-8 py-10">
                      <div className="col-span-9 grid grid-cols-4 gap-x-8 gap-y-8">
                        {menu.columns.map((column) => {
                          const labelId = `${menu.id}-${column.heading.replace(/\W+/g, "-").toLowerCase()}`;
                          return (
                            <div key={column.heading}>
                              {/* Deliberately not a heading. The nav sits above the
                                  page's <h1> in the DOM, so real headings here would
                                  put a dozen entries ahead of it in the screen-reader
                                  outline. The grouping is conveyed with
                                  aria-labelledby instead. */}
                              <p id={labelId} className="font-display text-[0.9375rem] font-semibold text-ink">
                                {column.heading}
                              </p>
                              <ul aria-labelledby={labelId} className="mt-3.5 space-y-1">
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
                          );
                        })}
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
                )}
              </div>
            );
          })}

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

        {/* ---- Mobile ------------------------------------------------------
            shrink-0 on this whole group: the logo above is the one allowed to
            truncate, not this. "Book" (not "Book Appointment") plus a fixed-size
            hamburger reliably fits next to the logo down to a 320px viewport. */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Link href="/book-appointment" className="btn-primary !px-4 !py-2 text-sm whitespace-nowrap">
            Book
          </Link>
          {/* Also not `relative`, for the same reason as the desktop menus: the
              dropdown spans the full viewport width via the sticky <header>. */}
          <div>
            <button
              type="button"
              data-menu-trigger="mobile"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-[rgb(var(--hairline))] text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                {mobileOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>

            {mobileOpen && (
              <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-[rgb(var(--hairline))] bg-surface px-6 pb-8 pt-4 shadow-lift">
                <nav aria-label="Mobile primary" className="flex flex-col">
                  {megaMenus.map((menu) => {
                    const subOpen = openMobileSub === menu.id;
                    return (
                      <div key={menu.id} className="border-b border-[rgb(var(--hairline))] py-1">
                        <button
                          type="button"
                          aria-expanded={subOpen}
                          onClick={() => setOpenMobileSub(subOpen ? null : menu.id)}
                          className="flex w-full cursor-pointer items-center justify-between py-3 font-medium text-ink"
                        >
                          {menu.label}
                          <Chevron open={subOpen} />
                        </button>
                        {subOpen && (
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
                        )}
                      </div>
                    );
                  })}

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
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
