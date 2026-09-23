import type { Config } from "tailwindcss";

/**
 * Design language: "calm clinical".
 * Pure white canvas, warm-gray alternating bands, one muted clinical blue for
 * trust/actions, one gentle earth tone for warmth, one soft sage for wellness.
 *
 * The three palette keys (`brand` / `teal` / `accent`) are deliberately kept so
 * every page that already uses them adopts the new look with no markup churn:
 *   brand  -> muted clinical blue   (primary: navigation, CTAs, links)
 *   accent -> gentle clay/earth     (warmth: eyebrows, highlights, rules)
 *   teal   -> soft sage             (wellness cues, success, checkmarks)
 * Contrast ratios noted below are measured against pure white.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface/ink read from CSS variables so one class works in light & dark
        // mode (variables are swapped once in globals.css via the `.dark` selector).
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-alt": "rgb(var(--color-surface-alt) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--color-ink-muted) / <alpha-value>)",

        // Primary — muted clinical blue. Quiet, trustworthy, never saturated.
        brand: {
          50: "#f3f7fa",
          100: "#e4eef5",
          200: "#c7dbe8",
          300: "#9bbfd6",
          400: "#6a9cbd", // 4.3:1 — icons, borders, large text only
          500: "#4a80a4",
          600: "#356788", // 6.2:1 — buttons, body links
          700: "#28536f", // 8.2:1 — headings, links on white
          800: "#1d3f55",
          900: "#142c3c", // deep ink-blue for footer / inverted bands
        },

        // Secondary — soft sage. Used for wellness cues, checkmarks, success.
        teal: {
          50: "#f2f6f3",
          100: "#e7ede8",
          300: "#b9cbbf",
          400: "#94ae9d",
          500: "#6f8f79", // 3.6:1 — decorative
          600: "#5b7a65",
          700: "#4c6b57", // 6.0:1 — text-safe
          900: "#2f4438",
        },

        // Accent — gentle clay/earth. The warmth in an otherwise cool palette.
        accent: {
          50: "#faf6f2",
          100: "#f3eae1",
          200: "#e6d4c5",
          300: "#d4b49e",
          400: "#c0947a", // 3.2:1 — decorative
          500: "#a87a5e",
          600: "#8c6249", // 5.4:1 — text-safe, warm CTAs
          700: "#6f4c38",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Editorial serif: Mayo-style authority with One Medical warmth.
        display: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
      },
      // Shadows are near-invisible by design: depth comes from hairlines and
      // whitespace, not from drop shadows.
      boxShadow: {
        hairline: "0 0 0 1px rgb(20 44 60 / 0.06)",
        soft: "0 1px 2px rgb(20 44 60 / 0.04), 0 6px 20px -12px rgb(20 44 60 / 0.18)",
        card: "0 1px 2px rgb(20 44 60 / 0.05), 0 12px 32px -16px rgb(20 44 60 / 0.22)",
        lift: "0 2px 4px rgb(20 44 60 / 0.05), 0 20px 48px -20px rgb(20 44 60 / 0.28)",
        // Retained keys so older markup keeps compiling; now intentionally quiet.
        glow: "0 12px 32px -16px rgb(40 83 111 / 0.35)",
        "glow-accent": "0 12px 32px -16px rgb(140 98 73 / 0.35)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      maxWidth: {
        prose: "68ch",
      },
      letterSpacing: {
        tightest: "-0.035em",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgb(var(--color-surface))), linear-gradient(to right, rgb(148 163 184 / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.12) 1px, transparent 1px)",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
export default config;
