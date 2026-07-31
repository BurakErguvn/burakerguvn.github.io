import type { Locale } from "@/lib/i18n";

/** Visible brand / hero title per locale. */
export const SITE_BRAND: Record<Locale, string> = {
  tr: "düşünen makineler",
  en: "thinking machines",
};

/** Preferred document / SERP title: name + brand. */
export function siteDocumentTitle(locale: Locale): string {
  return `Burak Ergüven — ${SITE_BRAND[locale]}`;
}
