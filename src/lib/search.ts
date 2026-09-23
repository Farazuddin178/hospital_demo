/**
 * Search types + matcher for the hero search bar.
 *
 * This module deliberately imports nothing. The homepage builds the index on the
 * server and passes it down as a prop, so the client bundle gets the ~2 KB
 * matcher and none of the icon components that the content modules pull in.
 */

export type SearchCategory = "Condition" | "Specialty" | "Doctor" | "Location" | "Service" | "Page";

export type SearchEntry = {
  /** What is shown as the result title. */
  label: string;
  /** Secondary line: specialty, area, or a short description. */
  hint: string;
  href: string;
  category: SearchCategory;
  /** Extra terms people actually type. Never shown, only matched. */
  keywords?: string[];
};

export type SearchGroup = { category: SearchCategory; entries: SearchEntry[] };

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    // NFD splits an accented letter into base + combining mark; \p{M} drops the
    // mark so "pediatrics" still matches "pédiatrics" as one word.
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Rank one entry against one search token.
 * Higher is better; 0 means "no match at all" and disqualifies the entry.
 */
function scoreToken(entry: SearchEntry, token: string): number {
  const label = normalize(entry.label);
  if (label === token) return 100;
  if (label.startsWith(token)) return 70;
  // Word-boundary hit inside the label, e.g. "pain" in "chest pain".
  if (label.split(" ").some((word) => word.startsWith(token))) return 55;
  if (label.includes(token)) return 40;

  if (entry.keywords) {
    for (const keyword of entry.keywords) {
      const k = normalize(keyword);
      if (k === token) return 50;
      if (k.startsWith(token)) return 35;
      if (k.includes(token)) return 20;
    }
  }

  if (normalize(entry.hint).includes(token)) return 12;
  return 0;
}

/** Categories surface in this order so clinical answers outrank site pages. */
const CATEGORY_ORDER: SearchCategory[] = [
  "Condition",
  "Specialty",
  "Doctor",
  "Location",
  "Service",
  "Page",
];

/**
 * Match a free-text query against the index.
 * Every token must hit something (AND semantics), which keeps two-word queries
 * like "child fever" from returning everything that merely mentions "child".
 */
export function searchIndex(index: SearchEntry[], rawQuery: string, limit = 8): SearchEntry[] {
  const query = normalize(rawQuery);
  if (query.length < 2) return [];
  const tokens = query.split(" ");

  const scored: Array<{ entry: SearchEntry; score: number }> = [];
  for (const entry of index) {
    let total = 0;
    let matchedAll = true;
    for (const token of tokens) {
      const score = scoreToken(entry, token);
      if (score === 0) {
        matchedAll = false;
        break;
      }
      total += score;
    }
    if (matchedAll) {
      // Nudge clinical results above generic site pages at equal relevance.
      total += (CATEGORY_ORDER.length - CATEGORY_ORDER.indexOf(entry.category)) * 2;
      scored.push({ entry, score: total });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.label.localeCompare(b.entry.label))
    .slice(0, limit)
    .map((s) => s.entry);
}

/** Bucket flat results into labelled groups, preserving relevance order. */
export function groupResults(results: SearchEntry[]): SearchGroup[] {
  const groups = new Map<SearchCategory, SearchEntry[]>();
  for (const entry of results) {
    const bucket = groups.get(entry.category);
    if (bucket) bucket.push(entry);
    else groups.set(entry.category, [entry]);
  }
  return [...groups.entries()]
    .sort((a, b) => CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]))
    .map(([category, entries]) => ({ category, entries }));
}
