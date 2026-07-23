import type { MetadataRoute } from "next";
import {
  getAllPostsByLocale,
  getPostsByLocale,
  collectionRoute,
  type Collection,
} from "@/lib/content";
import { locales } from "@/lib/i18n";

const BASE = "https://burakerguvn.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const l of locales) {
    entries.push({ url: `${BASE}/${l}/`, changeFrequency: "weekly", priority: 1 });
    for (const c of ["posts", "research", "notes"] as Collection[]) {
      entries.push({
        url: `${BASE}/${l}/${collectionRoute[c]}/`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
      for (const p of getPostsByLocale(c, l)) {
        entries.push({
          url: `${BASE}/${l}/${collectionRoute[c]}/${p.slug}/`,
          lastModified: p.date ? new Date(p.date) : undefined,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
    for (const sec of ["about", "tags"]) {
      entries.push({ url: `${BASE}/${l}/${sec}/`, changeFrequency: "monthly", priority: 0.4 });
    }
  }

  // keep getAllPostsByLocale referenced for future cross-collection use
  void getAllPostsByLocale;

  return entries;
}
