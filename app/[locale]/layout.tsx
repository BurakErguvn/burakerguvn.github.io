import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LangSync } from "@/components/LangSync";
import { OsProvider } from "@/components/os/WindowManager";
import { OsChrome } from "@/components/os/OsChrome";
import { locales, isLocale, type Locale } from "@/lib/i18n";
import { getPostsByLocale } from "@/lib/content";
import {
  websiteJsonLd,
  personJsonLd,
  jsonLdScript,
  OG_IMAGE,
  SITE_URL,
} from "@/lib/jsonld";
import { SITE_BRAND, siteDocumentTitle } from "@/lib/site";
import type { Catalog } from "@/lib/os/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const title = siteDocumentTitle(locale);
  const ogLocale = locale === "tr" ? "tr_TR" : "en_US";
  const descriptions: Record<Locale, string> = {
    tr: "Kişisel teknik blog ve araştırma defteri: Veri Bilimi, ML/DL, Kuantum Hata Düzeltme ve Kuantum ML üzerine matematiksel ve algoritmik derinlikte yazılar.",
    en: "A personal technical blog and research notebook on data science, machine learning, quantum error correction and quantum ML — with mathematical and algorithmic depth.",
  };

  return {
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        tr: `/tr/`,
        en: `/en/`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Burak Ergüven",
      locale: ogLocale,
      url: `${SITE_URL}/${locale}/`,
      title,
      description: descriptions[locale],
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_BRAND[locale] }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptions[locale],
      images: [OG_IMAGE],
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const catalog: Catalog = {
    posts: getPostsByLocale("posts", locale),
    research: getPostsByLocale("research", locale),
    notes: getPostsByLocale("notes", locale),
  };
  const jsonLd = [websiteJsonLd(locale), personJsonLd()];

  return (
    <OsProvider locale={locale} catalog={catalog}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <LangSync />
      <OsChrome />
      {children}
    </OsProvider>
  );
}
