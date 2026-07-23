import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { glob } from "glob";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import { locales, defaultLocale, type Locale } from "./i18n";

export type Collection = "posts" | "research";

/** Route segment -> content directory. */
export const collectionDir: Record<Collection, string> = {
  posts: "posts",
  research: "research",
};

/** Route segment shown in URL. */
export const collectionRoute: Record<Collection, string> = {
  posts: "writing",
  research: "research",
};

export interface Frontmatter {
  title: string;
  dek?: string;
  date: string; // YYYY-MM-DD
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
  /** absolute path to the source mdx file */
  filePath: string;
}

export interface Post extends PostMeta {
  raw: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

function localeFromFile(filePath: string): Locale | null {
  const base = path.basename(filePath, ".mdx");
  const m = base.match(/\.(tr|en)$/);
  if (!m) return null;
  return m[1] as Locale;
}

function collectionOf(filePath: string): Collection | null {
  const rel = path.relative(CONTENT_ROOT, filePath);
  const top = rel.split(path.sep)[0];
  if (top === "posts") return "posts";
  if (top === "research") return "research";
  return null;
}

function slugOf(filePath: string): string {
  const rel = path.relative(CONTENT_ROOT, filePath);
  const parts = rel.split(path.sep);
  // content/<collection>/<slug>/index.<locale>.mdx
  return parts.length >= 3 ? parts[1] : path.basename(parts[1], ".mdx");
}

/** All mdx files under content/, grouped by nothing — flat list. */
function allFiles(): string[] {
  return glob.sync("content/**/*.mdx", { cwd: process.cwd(), absolute: true });
}

function parseFile(filePath: string): PostMeta | null {
  const locale = localeFromFile(filePath);
  const collection = collectionOf(filePath);
  if (!locale || !collection) return null;
  const slug = slugOf(filePath);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const fm = data as Frontmatter;
  if (!fm.title) return null;
  const { minutes } = readingTime(raw);
  return {
    slug,
    locale,
    collection,
    title: fm.title,
    dek: fm.dek ?? "",
    date: fm.date ?? "",
    tags: fm.tags ?? [],
    draft: fm.draft ?? false,
    readingMinutes: Math.max(1, Math.round(minutes)),
    filePath,
  };
}

let cache: PostMeta[] | null = null;

function allMetas(): PostMeta[] {
  if (cache) return cache;
  cache = allFiles()
    .map(parseFile)
    .filter((m): m is PostMeta => m !== null);
  return cache;
}

export function getPostsByLocale(
  collection: Collection,
  locale: Locale
): PostMeta[] {
  return allMetas()
    .filter((m) => m.collection === collection && m.locale === locale && !m.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostsByLocale(locale: Locale): PostMeta[] {
  return allMetas()
    .filter((m) => m.locale === locale && !m.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(
  collection: Collection,
  slug: string,
  locale: Locale
): Post | null {
  const meta = allMetas().find(
    (m) => m.collection === collection && m.slug === slug && m.locale === locale
  );
  if (!meta) {
    // fall back to other locale if missing this one
    const fallback = allMetas().find(
      (m) => m.collection === collection && m.slug === slug
    );
    if (!fallback) return null;
    const raw = fs.readFileSync(fallback.filePath, "utf8");
    return { ...fallback, raw: matter(raw).content };
  }
  const raw = fs.readFileSync(meta.filePath, "utf8");
  return { ...meta, raw: matter(raw).content };
}

/** Slugs available for a collection (union across locales), for generateStaticParams. */
export function getSlugs(collection: Collection): string[] {
  const slugs = new Set<string>();
  for (const m of allMetas()) if (m.collection === collection) slugs.add(m.slug);
  return [...slugs];
}

/** Locales available for a given slug (for the language switcher). */
export function localesFor(
  collection: Collection,
  slug: string
): Locale[] {
  return locales.filter((l) =>
    allMetas().some(
      (m) => m.collection === collection && m.slug === slug && m.locale === l
    )
  );
}

export function getAllTags(locale: Locale): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const m of getPostsByLocaleAll(locale)) {
    for (const t of m.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

function getPostsByLocaleAll(locale: Locale): PostMeta[] {
  return allMetas().filter((m) => m.locale === locale && !m.draft);
}

export function getPostsByTag(locale: Locale, tag: string): PostMeta[] {
  return getAllPostsByLocale(locale)
    .filter((m) => m.tags.includes(tag))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function tagSlug(tag: string): string {
  const s = new GithubSlugger();
  return s.slug(tag);
}

export function getAllTagSlugs(locale: Locale): string[] {
  const set = new Set<string>();
  for (const m of getPostsByLocaleAll(locale)) for (const t of m.tags) set.add(tagSlug(t));
  return [...set];
}

export function getPostsByTagSlug(locale: Locale, slug: string): PostMeta[] {
  return getAllPostsByLocale(locale)
    .filter((m) => m.tags.some((t) => tagSlug(t) === slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
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

export { defaultLocale };
