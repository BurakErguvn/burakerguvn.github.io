import Link from "next/link";
import { Mdx } from "@/components/mdx/Mdx";
import {
  type Post,
  collectionRoute,
  quoteAttribution,
} from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export function QuoteList({
  quotes,
  locale,
}: {
  quotes: Post[];
  locale: Locale;
}) {
  const t = dict[locale];
  if (quotes.length === 0) {
    return <p className="eyebrow">{t.noQuotes}</p>;
  }

  return (
    <ol className="commonplace">
      {quotes.map((q) => (
        <li key={`${q.collection}-${q.slug}`}>
          <figure className="commonplace__item">
            <blockquote className="commonplace__quote">
              <Mdx source={q.raw} />
            </blockquote>
            <figcaption className="commonplace__cite">
              <Link href={`/${locale}/${collectionRoute.quotes}/${q.slug}/`}>
                ― {quoteAttribution(q)}
              </Link>
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
