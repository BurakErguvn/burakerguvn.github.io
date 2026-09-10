import Link from "next/link";
import { Mdx } from "@/components/mdx/Mdx";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EntropyDivider } from "@/components/EntropyDivider";
import {
  type Post,
  collectionRoute,
  localesFor,
  quoteAttribution,
} from "@/lib/content";
import { dict, locales, type Locale } from "@/lib/i18n";
import { articleBreadcrumbs, jsonLdScript } from "@/lib/jsonld";

export function QuoteView({
  post,
  locale,
}: {
  post: Post;
  locale: Locale;
}) {
  const t = dict[locale];
  const route = collectionRoute.quotes;
  const available = localesFor(post.collection, post.slug);
  const hrefs: Partial<Record<Locale, string>> = {};
  for (const l of locales) {
    hrefs[l] = `/${l}/${route}/${post.slug}/`;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleBreadcrumbs(post, locale)) }}
      />
      <div className="main-col">
        <article className="quote-page">
          <p className="eyebrow">{t.quotes}</p>
          <blockquote className="quote-page__body">
            <Mdx source={post.raw} />
          </blockquote>
          <p className="quote-page__cite">― {quoteAttribution(post)}</p>
          <div className="quote-page__meta">
            <LanguageSwitcher current={locale} available={available} hrefs={hrefs} />
          </div>
          <EntropyDivider />
          <Link href={`/${locale}/${route}/`} className="eyebrow">
            ← {t.backToQuotes}
          </Link>
        </article>
      </div>
    </>
  );
}
