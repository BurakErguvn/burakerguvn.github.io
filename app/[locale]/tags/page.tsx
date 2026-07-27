import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, tagSlug } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = params.locale;
  const t = dict[locale];
  const descriptions: Record<Locale, string> = {
    tr: "Yazı ve araştırma etiketleri.",
    en: "Tags for writing and research.",
  };
  return {
    title: t.tags,
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/tags/`,
      languages: {
        tr: `/tr/tags/`,
        en: `/en/tags/`,
      },
    },
  };
}

export default function TagsPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const tags = getAllTags(locale);
  return (
    <div className="main-col">
      <h1>{t.tags}</h1>
      {tags.length === 0 ? (
        <p className="eyebrow">{t.noTags}</p>
      ) : (
        <ul className="post-list">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link href={`/${locale}/tags/${tagSlug(tag)}/`}>
                <h3>{tag}</h3>
              </Link>
              <div className="post-list__meta">
                {count} {t.posts}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
