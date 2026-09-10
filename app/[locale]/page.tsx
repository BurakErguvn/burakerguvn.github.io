import type { Metadata } from "next";
import { PostList } from "@/components/PostList";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EntropyDivider } from "@/components/EntropyDivider";
import { getAllPostsByLocale, collectionRoute } from "@/lib/content";
import { dict, locales, type Locale } from "@/lib/i18n";
import { OG_IMAGE, SITE_URL } from "@/lib/jsonld";
import { SITE_BRAND, siteDocumentTitle } from "@/lib/site";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = params.locale;
  const title = siteDocumentTitle(locale);
  const descriptions: Record<Locale, string> = {
    tr: "Veri bilimi, makine öğrenmesi ve kuantum hata düzeltme üzerine matematiksel ve algoritmik derinlikte bir araştırma defteri.",
    en: "A research notebook on data science, machine learning and quantum error correction — with mathematical and algorithmic depth.",
  };

  return {
    title: { absolute: title },
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/`,
      languages: { tr: `/tr/`, en: `/en/` },
    },
    openGraph: {
      type: "website",
      siteName: "Burak Ergüven",
      title,
      description: descriptions[locale],
      url: `${SITE_URL}/${locale}/`,
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

function titleWithAccent(title: string, accent: string) {
  const lower = title.toLocaleLowerCase("tr");
  const needle = accent.toLocaleLowerCase("tr");
  const i = lower.lastIndexOf(needle);
  if (i === -1) return title;
  return (
    <>
      {title.slice(0, i)}
      <span className="hero__accent">{title.slice(i, i + accent.length)}</span>
      {title.slice(i + accent.length)}
    </>
  );
}

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const posts = getAllPostsByLocale(locale).slice(0, 6);
  const hero = {
    tr: {
      title: SITE_BRAND.tr,
      accent: "makineler",
      quote:
        "Bir zamanlar, insanlar düşünme işini makinelere devretmiş, böylece özgürleşmeyi umut etmişlerdi; ama bu, makinelere sahip başka insanların onları köleleştirmesine yol açtı sadece.",
      cite: "Frank Herbert, Dune",
    },
    en: {
      title: SITE_BRAND.en,
      accent: "machines",
      quote:
        "Once, men turned their thinking over to machines in the hope that this would set them free. But that only permitted other men with machines to enslave them.",
      cite: "Frank Herbert, Dune",
    },
  }[locale];

  const langHrefs: Partial<Record<Locale, string>> = {};
  for (const l of locales) langHrefs[l] = `/${l}/`;

  return (
    <div className="main-col">
      <section className="hero">
        <h1 className="hero__title">{titleWithAccent(hero.title, hero.accent)}</h1>
        <div className="hero__ornament" aria-hidden="true">
          ⁂
        </div>
        <blockquote className="hero__dek">
          <p>{hero.quote}</p>
          <footer>
            <cite>― {hero.cite}</cite>
          </footer>
        </blockquote>
        <EntropyDivider />
      </section>
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
