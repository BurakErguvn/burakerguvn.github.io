import type { Metadata } from "next";
import { DitherHero } from "@/components/DitherHero";
import { PostList } from "@/components/PostList";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getAllPostsByLocale, collectionRoute } from "@/lib/content";
import { dict, locales, type Locale } from "@/lib/i18n";
import { OG_IMAGE, SITE_URL } from "@/lib/jsonld";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = params.locale;
  const descriptions: Record<Locale, string> = {
    tr: "Veri bilimi, makine öğrenmesi ve kuantum hata düzeltme üzerine matematiksel ve algoritmik derinlikte bir araştırma defteri.",
    en: "A research notebook on data science, machine learning and quantum error correction — with mathematical and algorithmic depth.",
  };
  const titles: Record<Locale, string> = {
    tr: "düşünen makineler",
    en: "thinking machines",
  };

  return {
    title: { absolute: `Burak Ergüven — ${titles[locale]}` },
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/`,
      languages: { tr: `/tr/`, en: `/en/` },
    },
    openGraph: {
      type: "website",
      title: `Burak Ergüven — ${titles[locale]}`,
      description: descriptions[locale],
      url: `${SITE_URL}/${locale}/`,
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Burak Ergüven — ${titles[locale]}`,
      description: descriptions[locale],
      images: [OG_IMAGE],
    },
  };
}

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const posts = getAllPostsByLocale(locale).slice(0, 6);
  const hero = {
    tr: {
      title: "düşünen makineler",
      accent: "makineler",
      dek: "Veri bilimi, makine öğrenmesi ve kuantum hata düzeltme üzerine matematiksel ve algoritmik derinlikte bir araştırma defteri.",
    },
    en: {
      title: "thinking machines",
      accent: "machines",
      dek: "A research notebook on data science, machine learning and quantum error correction — with mathematical and algorithmic depth.",
    },
  }[locale];

  const langHrefs: Partial<Record<Locale, string>> = {};
  for (const l of locales) langHrefs[l] = `/${l}/`;

  return (
    <div className="main-col">
      <DitherHero
        title={hero.title}
        accent={hero.accent}
        dek={hero.dek}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        <LanguageSwitcher
          current={locale}
          available={[...locales]}
          hrefs={langHrefs}
        />
      </div>
      <h2 className="eyebrow" style={{ marginBottom: "1rem" }}>
        {t.published}
      </h2>
      <PostList posts={posts} locale={locale} route={collectionRoute.posts} />
    </div>
  );
}
