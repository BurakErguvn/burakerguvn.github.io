import type { Locale } from "./i18n";

export type Collection = "posts" | "research" | "notes";

/** Route segment -> content directory. */
export const collectionDir: Record<Collection, string> = {
  posts: "posts",
  research: "research",
  notes: "notes",
};

/** Route segment shown in URL. */
export const collectionRoute: Record<Collection, string> = {
  posts: "writing",
  research: "research",
  notes: "notes",
};

export interface Frontmatter {
  title: string;
  dek?: string;
  date: string;
  tags?: string[];
  draft?: boolean;
}

export interface PostMeta {
  slug: string;
  locale: Locale;
  collection: Collection;
  title: string;
  dek: string;
  date: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  filePath: string;
}

export interface Post extends PostMeta {
  raw: string;
}

export function formatDate(date: string, locale: Locale): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
