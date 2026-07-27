import { cv } from "@/lib/cv";
import {
  type Post,
  type Collection,
  collectionRoute,
} from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export const SITE_URL = "https://burakerguvn.github.io";
export const OG_IMAGE = `${SITE_URL}/og.png`;

function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function personJsonLd() {
  const sameAs = [
    cv.links.github,
    cv.links.linkedin,
    cv.links.scholar,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: cv.name,
    url: SITE_URL,
    email: cv.email || undefined,
    image: cv.avatar ? absoluteUrl(cv.avatar) : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    jobTitle: cv.title?.tr || cv.title?.en || undefined,
  };
}

export function websiteJsonLd(locale: Locale) {
  const descriptions: Record<Locale, string> = {
    tr: "Kişisel teknik blog ve araştırma defteri: Veri Bilimi, ML/DL, Kuantum Hata Düzeltme ve Kuantum ML üzerine matematiksel ve algoritmik derinlikte yazılar.",
    en: "A personal technical blog and research notebook on data science, machine learning, quantum error correction and quantum ML — with mathematical and algorithmic depth.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Burak Ergüven",
    alternateName: "Blog",
    url: `${SITE_URL}/${locale}/`,
    description: descriptions[locale],
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    author: {
      "@type": "Person",
      name: cv.name,
      url: SITE_URL,
    },
  };
}

export function blogPostingJsonLd(post: Post, locale: Locale) {
  const route = collectionRoute[post.collection];
  const url = `${SITE_URL}/${locale}/${route}/${post.slug}/`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.dek || undefined,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: [OG_IMAGE],
    author: {
      "@type": "Person",
      name: cv.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: cv.name,
      url: SITE_URL,
    },
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

/** Home > Collection > Title breadcrumbs for an article. */
export function articleBreadcrumbs(post: Post, locale: Locale) {
  const t = dict[locale];
  const route = collectionRoute[post.collection];
  const collectionName: Record<Collection, string> = {
    posts: t.writing,
    research: t.research,
    notes: t.notes,
  };

  return breadcrumbJsonLd([
    { name: "Burak Ergüven", url: `/${locale}/` },
    { name: collectionName[post.collection], url: `/${locale}/${route}/` },
    {
      name: post.title,
      url: `/${locale}/${route}/${post.slug}/`,
    },
  ]);
}

/** Serialize a JSON-LD object for a <script type="application/ld+json"> tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data);
}
