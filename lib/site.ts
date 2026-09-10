import type { Locale } from "@/lib/i18n";

export const SITE_BRAND: Record<Locale, string> = {
  tr: "erguvenburak.zip",
  en: "erguvenburak.zip",
};

export function siteDocumentTitle(locale: Locale): string {
  return `Burak Ergüven — ${SITE_BRAND[locale]}`;
}
