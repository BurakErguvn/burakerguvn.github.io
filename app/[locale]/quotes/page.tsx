import type { Metadata } from "next";
import { QuoteList } from "@/components/QuoteList";
import { getPostsFull } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = params.locale;
  const t = dict[locale];
  const descriptions: Record<Locale, string> = {
    tr: "Okurken düşen cümleler: kitap alıntıları.",
    en: "Sentences that stayed: extracts from books.",
  };
  return {
    title: t.quotes,
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/quotes/`,
      languages: {
        tr: `/tr/quotes/`,
        en: `/en/quotes/`,
      },
    },
  };
}

export default function QuotesPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const quotes = getPostsFull("quotes", locale);

  return (
    <div className="main-col">
      <header className="quote-index__header">
        <h1>{t.quotes}</h1>
      </header>
      <QuoteList quotes={quotes} locale={locale} />
    </div>
  );
}
