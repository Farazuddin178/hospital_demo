"use client";

import { useEffect, useState } from "react";

const THEME_EVENT = "theme-changed";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    // Two toggle buttons exist (desktop + mobile nav); keep both in sync.
    function onThemeChanged(e: Event) {
      setIsDark((e as CustomEvent<boolean>).detail);
    }
    window.addEventListener(THEME_EVENT, onThemeChanged);
    return () => window.removeEventListener(THEME_EVENT, onThemeChanged);
  }, []);

  function toggle() {
    // Read the live DOM instead of the closed-over `isDark` value so this never
    // desyncs from the actual applied theme, regardless of render timing.
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-300 text-ink transition duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700 dark:border-slate-600 dark:hover:border-brand-400"
    >
      <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
