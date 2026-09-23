"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { groupResults, searchIndex, type SearchEntry } from "@/lib/search";

type HeroSearchProps = {
  /** Built on the server so no content module reaches the client bundle. */
  index: SearchEntry[];
  suggestions: string[];
};

/* Inline SVGs rather than an icon package: three paths beat ~4 KB of imports
   in the one component that actually ships JavaScript. */
function MagnifierIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* Light fills in light mode; in dark mode the same hue at low alpha, so the chips
   stay legible instead of punching bright holes in a dark panel. */
const CATEGORY_TINT: Record<string, string> = {
  Condition: "bg-accent-100 text-accent-700 dark:bg-accent-400/15 dark:text-accent-300",
  Specialty: "bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300",
  Doctor: "bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300",
  Location: "bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300",
  Service: "bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300",
  Page: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
};

export default function HeroSearch({ index, suggestions }: HeroSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const optionId = (i: number) => `${listboxId}-opt-${i}`;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Matching is synchronous over ~60 in-memory entries, so there is nothing to
  // debounce and no request to wait on: results land in the same frame as the keystroke.
  const results = useMemo(() => searchIndex(index, query, 8), [index, query]);
  const groups = useMemo(() => groupResults(results), [results]);

  // Flat order must mirror the rendered order for arrow-key navigation to line up.
  const flat = useMemo(() => groups.flatMap((g) => g.entries), [groups]);

  const showPanel = open && query.trim().length >= 2;

  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
  }, []);

  const go = useCallback(
    (entry: SearchEntry) => {
      close();
      setQuery("");
      router.push(entry.href);
    },
    [close, router]
  );

  useEffect(() => setActive(-1), [query]);

  // Dismiss on outside click and on Escape from anywhere in the document.
  useEffect(() => {
    if (!showPanel) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [showPanel, close]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showPanel || flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? flat.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      go(flat[active]);
    } else if (e.key === "Tab") {
      close();
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Enter with nothing highlighted takes the best match, which is what people expect.
    if (flat.length > 0) go(flat[active >= 0 ? active : 0]);
  }

  let renderIndex = -1;

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-2xl">
      <form onSubmit={onSubmit} role="search" className="relative">
        <label htmlFor={`${listboxId}-input`} className="sr-only">
          Search conditions, specialties, doctors, and locations
        </label>

        <div className="group relative flex items-center rounded-full border border-[rgb(var(--hairline))] bg-white shadow-card transition duration-300 ease-calm focus-within:border-brand-400 focus-within:shadow-lift dark:bg-white/[0.06]">
          <MagnifierIcon className="pointer-events-none absolute left-5 h-5 w-5 text-brand-600 sm:left-6" />
          <input
            ref={inputRef}
            id={`${listboxId}-input`}
            type="search"
            value={query}
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Search a symptom, specialty, doctor, or location"
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? optionId(active) : undefined}
            className="w-full appearance-none rounded-full border-0 bg-transparent py-4 pl-[3.25rem] pr-3 text-base text-ink placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:py-5 sm:pl-16 sm:text-lg [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="submit"
            className="mr-2 hidden shrink-0 items-center gap-2 rounded-full bg-brand-700 px-6 py-3 font-semibold text-white transition duration-300 ease-calm hover:bg-brand-800 sm:inline-flex"
          >
            Search
            <ArrowIcon className="h-4 w-4" />
          </button>
          <button
            type="submit"
            aria-label="Search"
            className="mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800 sm:hidden"
          >
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Result count for screen readers; the visual list is the sighted equivalent. */}
      <p className="sr-only" role="status" aria-live="polite">
        {showPanel ? `${flat.length} result${flat.length === 1 ? "" : "s"} for ${query}` : ""}
      </p>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 overflow-hidden rounded-3xl border border-[rgb(var(--hairline))] bg-white text-left shadow-lift dark:bg-[rgb(var(--color-surface-alt))]">
          {flat.length === 0 ? (
            <div className="px-6 py-7">
              <p className="font-medium text-ink">No match for &ldquo;{query}&rdquo;</p>
              <p className="mt-1.5 text-sm text-ink-muted">
                Try a symptom such as &ldquo;chest pain&rdquo;, or{" "}
                <a href="/contact" className="link-quiet">
                  ask our care team
                </a>{" "}
                and someone will point you the right way.
              </p>
            </div>
          ) : (
            <ul id={listboxId} role="listbox" aria-label="Search results" className="max-h-[22rem] overflow-y-auto py-2">
              {groups.map((group) => (
                <li key={group.category} role="presentation">
                  <p
                    className="px-5 pb-1 pt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted"
                    id={`${listboxId}-${group.category}`}
                  >
                    {group.category}
                  </p>
                  <ul role="group" aria-labelledby={`${listboxId}-${group.category}`}>
                    {group.entries.map((entry) => {
                      renderIndex += 1;
                      const i = renderIndex;
                      const isActive = i === active;
                      return (
                        <li
                          key={`${entry.category}-${entry.href}-${entry.label}`}
                          id={optionId(i)}
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActive(i)}
                          // onMouseDown, not onClick: it fires before the input's
                          // blur, so the panel never closes out from under the tap.
                          onMouseDown={(e) => {
                            e.preventDefault();
                            go(entry);
                          }}
                          className={`flex cursor-pointer items-center gap-3 px-5 py-2.5 transition-colors duration-150 ${
                            isActive ? "bg-brand-50 dark:bg-white/5" : ""
                          }`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-ink">{entry.label}</span>
                            <span className="block truncate text-sm text-ink-muted">{entry.hint}</span>
                          </span>
                          <span
                            className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold sm:block ${
                              CATEGORY_TINT[entry.category] ?? "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {entry.category}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Suggestion chips double as a discoverability aid and a zero-typing path in. */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-sm text-ink-muted">Common searches</span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQuery(s);
              setOpen(true);
              inputRef.current?.focus();
            }}
            className="rounded-full border border-[rgb(var(--hairline))] bg-white/70 px-3.5 py-1.5 text-sm text-ink-muted transition duration-300 ease-calm hover:border-brand-300 hover:bg-white hover:text-brand-700 dark:bg-white/5"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
