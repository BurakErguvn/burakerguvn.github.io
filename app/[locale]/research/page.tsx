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
    tr: "Araştırma notları: kuantum hata düzeltme, makine öğrenmesi ve matematiksel derinlikte çalışmalar.",
    en: "Research notes on quantum error correction, machine learning and mathematical depth.",
  };
  return {
    title: t.research,
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/research/`,
      languages: {
        tr: `/tr/research/`,
        en: `/en/research/`,
      },
    },
  };
}

export default function ResearchPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const posts = getPostsByLocale("research", locale);
  return (
    <div className="main-col">
      <h1>{t.research}</h1>
      <PostList
        posts={posts}
        locale={locale}
        route={collectionRoute.research}
        emptyLabel={t.noResearch}
      />
    </div>
  );
}
