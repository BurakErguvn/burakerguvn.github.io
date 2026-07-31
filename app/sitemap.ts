import type { MetadataRoute } from "next";
import {
  getPostsByLocale,
  getAllTagSlugs,
  collectionRoute,
  type Collection,
} from "@/lib/content";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

const BASE = "https://burakerguvn.github.io";

/** Date-only lastmod (YYYY-MM-DD) — preferred by sitemap validators. */
function lastmod(date?: string): string | undefined {
  if (!date) return undefined;
  return date.slice(0, 10);
}

/** hreflang map for a path after the locale segment, e.g. `/writing/slug/`. */
function languageAlternates(pathAfterLocale: string): Record<string, string> {
  const path = pathAfterLocale.startsWith("/")
    ? pathAfterLocale
    : `/${pathAfterLocale}`;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${BASE}/${locale}${path}`;
  }
  languages["x-default"] = `${BASE}/${defaultLocale}${path}`;
  return languages;
}

function entry(
  locale: Locale,
  pathAfterLocale: string,
  opts: {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: string;
    /** Set false for locale-specific paths (e.g. tag slugs) that are not translations. */
    hreflang?: boolean;
  }
): MetadataRoute.Sitemap[number] {
  const path = pathAfterLocale === "/" ? "/" : pathAfterLocale;
  const item: MetadataRoute.Sitemap[number] = {
    url: `${BASE}/${locale}${path === "/" ? "/" : path}`,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  };
  if (opts.hreflang !== false) {
    item.alternates = { languages: languageAlternates(path) };
  }
  return item;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push(
      entry(locale, "/", { changeFrequency: "weekly", priority: 1 })
    );
    entries.push(
      entry(locale, "/writing/", { changeFrequency: "weekly", priority: 0.7 })
    );
    entries.push(
      entry(locale, "/research/", { changeFrequency: "weekly", priority: 0.7 })
    );
    entries.push(
      entry(locale, "/notes/", { changeFrequency: "weekly", priority: 0.7 })
    );
    entries.push(
      entry(locale, "/about/", { changeFrequency: "monthly", priority: 0.5 })
    );
    entries.push(
      entry(locale, "/tags/", { changeFrequency: "weekly", priority: 0.4 })
    );

    for (const collection of ["posts", "research", "notes"] as Collection[]) {
      const route = collectionRoute[collection];
      for (const post of getPostsByLocale(collection, locale)) {
        entries.push(
          entry(locale, `/${route}/${post.slug}/`, {
            changeFrequency: "monthly",
            priority: 0.8,
            lastModified: lastmod(post.date),
          })
        );
      }
    }

    for (const tag of getAllTagSlugs(locale)) {
      entries.push(
        entry(locale, `/tags/${tag}/`, {
          changeFrequency: "weekly",
          priority: 0.3,
          hreflang: false,
        })
      );
    }
  }

  return entries;
}
