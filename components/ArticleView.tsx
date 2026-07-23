import Link from "next/link";
import { Mdx } from "@/components/mdx/Mdx";
import { RightRail } from "@/components/RightRail";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EntropyDivider } from "@/components/EntropyDivider";
import {
  type Post,
  type Collection,
  collectionRoute,
  localesFor,
  formatDate,
  tagSlug,
} from "@/lib/content";
import { buildToc } from "@/lib/toc";
import { dict, locales, type Locale } from "@/lib/i18n";

export function ArticleView({
  post,
  locale,
}: {
  post: Post;
  locale: Locale;
}) {
  const t = dict[locale];
  const route = collectionRoute[post.collection];
  const toc = buildToc(post.raw);
  const available = localesFor(post.collection, post.slug);

  const hrefs: Partial<Record<Locale, string>> = {};
  for (const l of locales) {
    hrefs[l] = `/${l}/${route}/${post.slug}/`;
  }

  return (
    <>
      <div className="main-col">
        <article className="prose">
          <header className="article-header">
            <p className="eyebrow">{post.collection === "research" ? t.research : t.writing}</p>
            <h1>{post.title}</h1>
            {post.dek ? <p className="article-header__dek">{post.dek}</p> : null}
            <div className="article-meta">
              <span>{formatDate(post.date, locale)}</span>
              <span>·</span>
              <span>{t.readingTime(post.readingMinutes)}</span>
              {post.tags.map((tag) => (
                <Link key={tag} className="tag" href={`/${locale}/tags/${tagSlug(tag)}/`}>
                  {tag}
                </Link>
              ))}
              <LanguageSwitcher current={locale} available={available} hrefs={hrefs} />
            </div>
          </header>

          <Mdx source={post.raw} />

          <EntropyDivider />
          <Link href={`/${locale}/${route}/`} className="eyebrow">
            ← {t.backToIndex}
          </Link>
        </article>
      </div>
      <RightRail items={toc} locale={locale} />
    </>
  );
}

export function collectionLabel(c: Collection, locale: Locale) {
  return c === "research" ? dict[locale].research : dict[locale].writing;
}
