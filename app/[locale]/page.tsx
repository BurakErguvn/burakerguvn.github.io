import { EntropyHero } from "@/components/EntropyHero";
import { PostList } from "@/components/PostList";
import { getAllPostsByLocale, collectionRoute } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const posts = getAllPostsByLocale(locale).slice(0, 6);

  const hero = {
    tr: {
      title: "Belirsizlikten sinyale.",
      accent: "sinyale.",
      dek: "Veri bilimi, makine öğrenmesi ve kuantum hata düzeltme üzerine matematiksel ve algoritmik derinlikte bir araştırma defteri.",
    },
    en: {
      title: "From uncertainty to signal.",
      accent: "signal.",
      dek: "A research notebook on data science, machine learning and quantum error correction — with mathematical and algorithmic depth.",
    },
  }[locale];

  return (
    <div className="main-col">
      <EntropyHero
        title={hero.title}
        accent={hero.accent}
        dek={hero.dek}
      />
      <h2 className="eyebrow" style={{ marginBottom: "1rem" }}>
        {t.published}
      </h2>
      <PostList posts={posts} locale={locale} route={collectionRoute.posts} />
    </div>
  );
}
