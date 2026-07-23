export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
};

export const localeShort: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** UI dictionary for chrome strings. */
export const dict = {
  tr: {
    writing: "Yazılar",
    research: "Araştırma",
    notes: "Notlar",
    about: "Özgeçmiş",
    tags: "Etiketler",
    toc: "Bu sayfada",
    readingTime: (m: number) => `${m} dk okuma`,
    backToIndex: "Yazılara dön",
    backToResearch: "Araştırmaya dön",
    backToNotes: "Notlara dön",
    noPosts: "Henüz yazı yok.",
    posts: "yazı",
    published: "Yayınlandı",
    lang: "Dil",
  },
  en: {
    writing: "Writing",
    research: "Research",
    notes: "Notes",
    about: "CV",
    tags: "Tags",
    toc: "On this page",
    readingTime: (m: number) => `${m} min read`,
    backToIndex: "Back to writing",
    backToResearch: "Back to research",
    backToNotes: "Back to notes",
    noPosts: "No posts yet.",
    posts: "posts",
    published: "Published",
    lang: "Language",
  },
} as const;

export type DictKey = keyof (typeof dict)["tr"];
