import type { Metadata } from "next";
import { PostList } from "@/components/PostList";
import { getPostsByLocale, collectionRoute } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = params.locale;
  const t = dict[locale];
  const descriptions: Record<Locale, string> = {
    tr: "Veri bilimi, makine öğrenmesi ve kuantum üzerine yazılar.",
    en: "Writing on data science, machine learning and quantum topics.",
  };
  return {
    title: t.writing,
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/writing/`,
      languages: {
        tr: `/tr/writing/`,
        en: `/en/writing/`,
      },
    },
  };
}

export default function WritingPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const posts = getPostsByLocale("posts", locale);
  return (
    <div className="main-col">
      <h1>{dict[locale].writing}</h1>
      <PostList posts={posts} locale={locale} route={collectionRoute.posts} />
    </div>
  );
}
