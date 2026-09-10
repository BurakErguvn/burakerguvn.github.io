import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { glob } from "glob";
import readingTime from "reading-time";

/**
 * Dump content metadata (+ raw MDX) for the OS Finder.
 * Compiled MDX for article windows is still rendered via RSC on the slug routes.
 */

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "public", "api");

const LOCALES = ["tr", "en"];
const COLLECTIONS = ["posts", "research", "notes"];
const ROUTES = { posts: "writing", research: "research", notes: "notes" };

function localeFromFile(filePath) {
  const base = path.basename(filePath, ".mdx");
  const m = base.match(/\.(tr|en)$/);
  return m ? m[1] : null;
}

function collectionOf(filePath) {
  const rel = path.relative(CONTENT_ROOT, filePath);
  const top = rel.split(path.sep)[0];
  return COLLECTIONS.includes(top) ? top : null;
}

function slugOf(filePath) {
  const rel = path.relative(CONTENT_ROOT, filePath);
  const parts = rel.split(path.sep);
  return parts.length >= 3 ? parts[1] : path.basename(parts[1], ".mdx");
}

function parseFile(filePath) {
  const locale = localeFromFile(filePath);
  const collection = collectionOf(filePath);
  if (!locale || !collection) return null;
  const rawFile = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(rawFile);
  if (!data.title) return null;
  const { minutes } = readingTime(rawFile);
  const meta = {
    slug: slugOf(filePath),
    locale,
    collection,
    title: data.title,
    dek: data.dek ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    draft: data.draft ?? false,
    readingMinutes: Math.max(1, Math.round(minutes)),
    route: ROUTES[collection],
  };
  if (meta.draft) return null;
  return { meta, raw: content };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

const files = glob.sync("content/**/*.mdx", { cwd: ROOT, absolute: true });
const posts = files.map(parseFile).filter(Boolean);

ensureDir(OUT_DIR);

for (const locale of LOCALES) {
  const index = posts
    .filter((p) => p.meta.locale === locale)
    .map((p) => p.meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  fs.writeFileSync(
    path.join(OUT_DIR, `index.${locale}.json`),
    JSON.stringify(index, null, 2)
  );
}

for (const post of posts) {
  const dir = path.join(OUT_DIR, "content", post.meta.collection);
  ensureDir(dir);
  const dest = path.join(
    dir,
    `${post.meta.slug}.${post.meta.locale}.json`
  );
  fs.writeFileSync(dest, JSON.stringify({ meta: post.meta, raw: post.raw }));
}

console.log(
  `build-content: ${posts.length} entries → public/api/`
);
